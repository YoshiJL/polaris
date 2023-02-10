import {ColorPicker} from '@shopify/polaris';
import {useState} from 'react';
import {withPolarisExample} from '../../src/components/PolarisExampleWrapper';

function WithTransparentValueAndTextFields() {
  const [color, setColor] = useState({
    hue: 300,
    brightness: 1,
    saturation: 0.7,
    alpha: 0.7,
  });

  return (
    <ColorPicker onChange={setColor} color={color} allowAlpha textEditor />
  );
}

export default withPolarisExample(WithTransparentValueAndTextFields);
