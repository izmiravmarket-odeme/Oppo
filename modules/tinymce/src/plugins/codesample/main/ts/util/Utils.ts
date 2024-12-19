import { Type } from '@ephox/katamari';

const isCodeSample = (elm: Element | null): elm is HTMLPreElement => {
  return Type.isNonNullable(elm) && elm.nodeName === 'PRE' && elm.className.includes('language-');
};

const trimArg = <T>(predicateFn: (a: T) => boolean) => {
  return (arg1: unknown, arg2: T): boolean => {
    return predicateFn(arg2);
  };
};

export {
  isCodeSample,
  trimArg
};
