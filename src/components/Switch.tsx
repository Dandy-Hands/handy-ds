import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { part } from './part.ts';
import './base.css';
import './Switch.css';

/** Action category: secondary when off, primary `selected` when on (token spec section 4). */
export const Switch = {
  ...BaseSwitch,
  Root: part(BaseSwitch.Root, 'hds-switch'),
  Thumb: part(BaseSwitch.Thumb, 'hds-switch__thumb'),
};
