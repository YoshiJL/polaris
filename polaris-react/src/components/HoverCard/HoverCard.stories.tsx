import React, {useCallback, useState} from 'react';
import type {ComponentMeta} from '@storybook/react';
import {
  ActionList,
  Avatar,
  Box,
  Button,
  LegacyCard,
  FormLayout,
  HoverCard,
  ResourceList,
  Select,
  Listbox,
  TextField,
  Icon,
  Link,
  AutoSelection,
  Scrollable,
  EmptySearchResult,
  Text,
  VerticalStack,
} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';

import {useFeatures} from '../../utilities/features';

export default {
  component: HoverCard,
} as ComponentMeta<typeof HoverCard>;

export function Default() {
  const [active, setActive] = useState(false);

  const toggleHoverCardActive = useCallback((popover, isClosing) => {
    const currentHoverCard = isClosing ? null : popover;
    setActive(currentHoverCard);
  }, []);

  const activator = <Link url="#">Colm Dillane</Link>;

  return (
    <div style={{height: '250px'}}>
      <HoverCard toggleActive={setActive} active={active} activator={activator}>
        <Box padding="4">
          <VerticalStack gap="2">
            <span>
              <Link>Colm Dillane</Link>
            </span>
            <Text as="p">1-800-KID-SUPR</Text>
            <Text as="p">colm@kid.super</Text>
            <Text as="p">Brooklyn, NY</Text>
          </VerticalStack>
        </Box>
      </HoverCard>
    </div>
  );
}

const StopPropagation = ({children}: React.PropsWithChildren<any>) => {
  const stopEventPropagation = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  return (
    <div onClick={stopEventPropagation} onTouchStart={stopEventPropagation}>
      {children}
    </div>
  );
};