import {Children, ReactElement} from 'react';
import {Icon, Bleed} from '@shopify/polaris';
import {
  CancelSmallMinor,
  FlagMajor,
  RiskMajor,
  TickSmallMinor,
} from '@shopify/polaris-icons';

import {Box} from '../../../Box';
import {Card, CardProps} from '../../../Card';
import {Stack, Row} from '../../../Stack';
import ImageThumbnail from '../../../ThumbnailPreview';
import styles from './styles.module.scss';

export enum DirectiveStatusName {
  Do = 'Do',
  Dont = "Don't",
  Caution = 'Caution',
  Tip = 'Tip',
}

export type DirectiveStatus = DirectiveStatusName;
interface DirectiveCardProps extends CardProps {
  status: DirectiveStatus;
}
type DirectiveProps = React.PropsWithChildren<DirectiveCardProps>;
export const DirectiveCard = ({children, status, ...props}: DirectiveProps) => {
  const childrenArray = Children.toArray(children) as ReactElement[];

  let image: ReactElement | undefined;

  const rest = childrenArray.filter((d) => {
    if (d?.props?.src) {
      image = d;
    }

    return !d?.props?.src;
  });

  return (
    <Card {...props}>
      {image?.props?.src ? (
        <Stack gap="400">
          <Bleed marginInline="400" marginBlockStart="400">
            <ImageThumbnail
              className={styles.ImageThumbnail}
              src={image?.props?.src}
              alt={image?.props?.alt}
            />
          </Bleed>
          <Stack gap="200">
            <Pill status={status} />
            {rest}
          </Stack>
        </Stack>
      ) : (
        <Stack gap="200">
          <Pill status={status} />
          {rest}
        </Stack>
      )}
    </Card>
  );
};

export const Pill = ({status}: {status: DirectiveStatus}) => {
  const iconMap = {
    Do: TickSmallMinor,
    ["Don't"]: CancelSmallMinor,
    Caution: RiskMajor,
    Tip: FlagMajor,
  };
  return (
    <Box className={styles.Pill} data-value={status.toLowerCase()}>
      <Row>
        <Icon source={iconMap[status]} />
        {status}
      </Row>
    </Box>
  );
};