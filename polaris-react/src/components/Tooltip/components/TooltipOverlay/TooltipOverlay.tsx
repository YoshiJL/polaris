import React from 'react';

import {classNames} from '../../../../utilities/css';
import {layer} from '../../../shared';
import {
  PositionedOverlayProps,
  PositionedOverlay,
} from '../../../PositionedOverlay';
import {useI18n} from '../../../../utilities/i18n';

import styles from './TooltipOverlay.scss';

export interface TooltipOverlayProps {
  id: string;
  active: boolean;
  preferredPosition?: PositionedOverlayProps['preferredPosition'];
  children?: React.ReactNode;
  activator: HTMLElement;
  accessibilityLabel?: string;
  onClose(): void;
  transform?: string;
}

export function TooltipOverlay({
  active,
  activator,
  preferredPosition = 'below',
  id,
  children,
  accessibilityLabel,
  transform,
}: TooltipOverlayProps) {
  const i18n = useI18n();
  const markup = active ? (
    <PositionedOverlay
      active={active}
      activator={activator}
      preferredPosition={preferredPosition}
      render={renderTooltip}
      transform={transform}
    />
  ) : null;

  return markup;

  function renderTooltip(
    overlayDetails: Parameters<PositionedOverlayProps['render']>[0],
  ) {
    const {measuring, desiredHeight, positioning} = overlayDetails;

    const containerClassName = classNames(
      styles.TooltipOverlay,
      measuring && styles.measuring,
      positioning === 'above' && styles.positionedAbove,
      positioning === 'below' && styles.positionedBelow,
    );

    const contentStyles = measuring ? undefined : {minHeight: desiredHeight};

    return (
      <div className={containerClassName} {...layer.props}>
        <div
          id={id}
          role="tooltip"
          className={styles.Content}
          style={contentStyles}
          aria-label={
            accessibilityLabel
              ? i18n.translate('Polaris.TooltipOverlay.accessibilityLabel', {
                  label: accessibilityLabel,
                })
              : undefined
          }
        >
          {children}
        </div>
      </div>
    );
  }
}
