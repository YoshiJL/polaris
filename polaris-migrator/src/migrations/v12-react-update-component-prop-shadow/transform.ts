import type {FileInfo, API} from 'jscodeshift';

import {replacementMaps} from '../v12-styles-replace-custom-property-shadow/transform';
import reactUpdateComponentProp from '../react-update-component-prop/transform';
import type {ComponentFromPropsMap} from '../react-update-component-prop/utils';
import {getReplacementMaps} from '../react-update-component-prop/utils';

const normalizedReplacementMap = Object.fromEntries(
  Object.entries(replacementMaps['/.+/']).map(([fromValue, toValue]) => [
    fromValue.replace('--p-shadow-', ''),
    toValue.replace('--p-shadow-', ''),
  ]),
);

const componentFromPropsMap: ComponentFromPropsMap = {
  Box: ['shadow'],
};

export default function transformer(fileInfo: FileInfo, _: API) {
  return reactUpdateComponentProp(fileInfo, _, {
    replacementMaps: getReplacementMaps(
      componentFromPropsMap,
      normalizedReplacementMap,
    ),
  });
}
