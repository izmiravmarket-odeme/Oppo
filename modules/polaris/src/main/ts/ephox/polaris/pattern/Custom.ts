import { Optional } from '@ephox/katamari';

import { PRegExp } from './Types';

export const Custom = (regex: string, prefix: PRegExp['prefix'], suffix: PRegExp['suffix'], flags: Optional<string>): PRegExp => {
  const term = () => {
    return new RegExp(regex, flags.getOr('g'));
  };

  return {
    term,
    prefix,
    suffix
  };
};
