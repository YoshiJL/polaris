import React from 'react';
// @ts-expect-error
import {MyComponent1, MyComponent2 as CustomComponent} from '@shopify/polaris';

declare function Child(props: any): JSX.Element;

const MyComponentWrapper = MyComponent1;

export function App() {
  return (
    <>
      <MyComponent1 prop1="value-1" foo="bar">
        Hello
        <Child prop1="value-1" />
        <MyComponentWrapper />
      </MyComponent1>
      <CustomComponent prop2="value-2" foo="bar">
        Hello
        <Child prop2="value-2" />
        <MyComponentWrapper />
      </CustomComponent>
    </>
  );
}
