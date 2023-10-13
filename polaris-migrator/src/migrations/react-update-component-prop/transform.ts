import type {
  API,
  FileInfo,
  JSXAttribute,
  JSXOpeningElement,
  Options,
} from 'jscodeshift';

import {insertCommentBefore, insertJSXComment} from '../../utilities/jsx';
import {POLARIS_MIGRATOR_COMMENT} from '../../utilities/constants';
import {
  getImportSpecifierName,
  hasImportDeclaration,
  hasImportSpecifier,
  normalizeImportSourcePaths,
} from '../../utilities/imports';

interface ReplacementOptions {
  fromPropType?: 'string' | 'boolean';
  fromProp: string;
  toProp?: string;
  fromValue?: string;
  toValue?: string;
}

export interface ReplacementMaps {
  [componentName: string]: ReplacementOptions[];
}

export interface MigrationOptions extends Options, Partial<ReplacementOptions> {
  relative?: boolean;
  componentName?: string;
  replacementMaps?: ReplacementMaps;
}

export default function transformer(
  file: FileInfo,
  {jscodeshift: j}: API,
  options: MigrationOptions,
) {
  if (
    options.replacementMaps &&
    (options.componentName ||
      options.fromPropType ||
      options.fromProp ||
      options.toProp ||
      options.fromValue ||
      options.toValue)
  ) {
    throw new Error(
      'Cannot provide both `replacementMaps` and `componentName`, `fromPropType`, `fromProp`, `toProp`, `fromValue`, or `toValue`',
    );
  }

  let replacementMaps: ReplacementMaps | undefined;

  if (options.replacementMaps) {
    replacementMaps = options.replacementMaps;
  } else {
    if (!options.componentName || !options.fromProp) {
      throw new Error('Missing required options: componentName, fromProp');
    }

    replacementMaps = {
      [options.componentName]: [
        {
          fromPropType: options.fromPropType,
          fromProp: options.fromProp,
          toProp: options.toProp,
          fromValue: options.fromValue,
          toValue: options.toValue,
        },
      ],
    };
  }

  if (!replacementMaps) return;

  const source = j(file.source);

  if (
    !options.relative &&
    !hasImportDeclaration(j, source, '@shopify/polaris')
  ) {
    return;
  }

  interface LocalElementConfig {
    componentNames: string[];
    replacementOptions: ReplacementOptions[];
  }

  const localElementConfigs = Object.fromEntries(
    Object.entries(replacementMaps)
      .map((replacementMapEntry): null | [string, LocalElementConfig] => {
        const [componentName, replacementOptions] = replacementMapEntry;

        const componentNames = componentName.split('.');
        const targetComponentName = componentNames[0];

        const sourcePaths = normalizeImportSourcePaths(j, source, {
          relative: options.relative,
          from: targetComponentName,
          to: targetComponentName,
        });

        if (
          !sourcePaths ||
          !hasImportSpecifier(j, source, targetComponentName, sourcePaths.from)
        ) {
          return null;
        }

        const localElementName =
          getImportSpecifierName(
            j,
            source,
            targetComponentName,
            sourcePaths.from,
          ) || targetComponentName;

        componentNames[0] = localElementName;

        return [
          localElementName,
          {
            componentNames,
            replacementOptions,
          },
        ];
      })
      .filter(Boolean) as [string, LocalElementConfig][],
  );

  source.find(j.JSXElement).forEach((element) => {
    const elementNames = getElementNames(element.node.openingElement.name);

    const localElementConfig = localElementConfigs[elementNames[0]];

    if (!localElementConfig) return;

    const {componentNames, replacementOptions} = localElementConfig;

    if (
      elementNames.length !== componentNames.length ||
      !componentNames.every((name, index) => name === elementNames[index])
    ) {
      return;
    }

    const allAttributes = element.node.openingElement.attributes ?? [];

    if (
      // Early exit on spread operators
      allAttributes.some((attribute) => attribute.type !== 'JSXAttribute')
    ) {
      insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
      return;
    }

    for (const replacementOption of replacementOptions) {
      const {
        fromPropType = 'string',
        fromProp,
        toProp,
        fromValue,
        toValue,
      } = replacementOption;
      const jsxAttributes = allAttributes as JSXAttribute[];

      const fromPropAttribute = jsxAttributes.find(
        (attribute) => attribute.name.name === fromProp,
      );

      if (
        fromPropAttribute &&
        (fromPropType === 'boolean'
          ? fromPropAttribute.value !== null
          : fromPropAttribute.value?.type !== 'StringLiteral')
      ) {
        insertJSXComment(j, element, POLARIS_MIGRATOR_COMMENT);
        return;
      }

      jsxAttributes.forEach((jsxAttribute) => {
        if (
          !(
            jsxAttribute.type === 'JSXAttribute' &&
            jsxAttribute.name.name === fromProp
          )
        ) {
          return jsxAttribute;
        }

        const attributeValueValue =
          jsxAttribute.value?.type === 'StringLiteral'
            ? jsxAttribute.value.value
            : null;

        if (
          toProp &&
          toProp !== fromProp &&
          (!fromValue || fromValue === attributeValueValue)
        ) {
          jsxAttribute.name.name = toProp;
        }

        if (fromValue && fromValue !== attributeValueValue) return jsxAttribute;

        jsxAttribute.value = toValue
          ? j.stringLiteral(toValue)
          : jsxAttribute.value;
      });
    }
  });

  Object.keys(localElementConfigs).forEach((localElementName) => {
    source
      .find(j.Identifier)
      .filter((path) => path.node.name === localElementName)
      .forEach((path) => {
        if (path.node.type !== 'Identifier') return;

        if (
          path.parent.value.type === 'ImportSpecifier' ||
          path.parent.value.type === 'MemberExpression'
        ) {
          return;
        }

        insertCommentBefore(j, path, POLARIS_MIGRATOR_COMMENT);
      });
  });

  return source.toSource();
}

function getElementNames(name: JSXOpeningElement['name']): string[] {
  if (name.type === 'JSXIdentifier') {
    return [name.name];
  }
  if (name.type === 'JSXMemberExpression') {
    return [...getElementNames(name.object), name.property.name];
  }
  return [];
}