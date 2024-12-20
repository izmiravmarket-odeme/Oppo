import { Arr, Optional } from '@ephox/katamari';

const units = {
  // we don't really support all of these different ways to express a length
  unsupportedLength: [
    'em' as const,
    'ex' as const,
    'cap' as const,
    'ch' as const,
    'ic' as const,
    'rem' as const,
    'lh' as const,
    'rlh' as const,
    'vw' as const,
    'vh' as const,
    'vi' as const,
    'vb' as const,
    'vmin' as const,
    'vmax' as const,
    'cm' as const,
    'mm' as const,
    'Q' as const,
    'in' as const,
    'pc' as const,
    'pt' as const,
    'px' as const
  ],
  // these are the length values we do support
  fixed: [ 'px' as const, 'pt' as const ],
  relative: [ '%' as const ],
  empty: [ '' as const ]
};

type Units = {
  [K in keyof typeof units]: typeof units[K][number];
};

export interface Dimension<U extends keyof Units> {
  readonly value: number;
  readonly unit: Units[U];
}

// Built from https://tc39.es/ecma262/#prod-StrDecimalLiteral
// Matches a float followed by a trailing set of characters
const pattern: RegExp = (() => {
  const decimalDigits = '[0-9]+';
  const signedInteger = '[+-]?' + decimalDigits;
  const exponentPart = '[eE]' + signedInteger;
  const dot = '\\.';

  const opt = (input: string) => `(?:${input})?`;

  const unsignedDecimalLiteral = [
    'Infinity',
    decimalDigits + dot + opt(decimalDigits) + opt(exponentPart),
    dot + decimalDigits + opt(exponentPart),
    decimalDigits + opt(exponentPart)
  ].join('|');

  const float = `[+-]?(?:${unsignedDecimalLiteral})`;

  return new RegExp(`^(${float})(.*)$`);
})();

const isUnit = <T extends keyof Units>(unit: string, accepted: T[]): unit is Units[T] =>
  Arr.exists(accepted, (acc: T) =>
    Arr.exists(units[acc], (check) => unit === check)
  );

export const parse = <T extends keyof Units>(input: string, accepted: T[]): Optional<Dimension<T>> => {
  const match = Optional.from(pattern.exec(input));
  return match.bind((array) => {
    const value = Number(array[1]);
    const unitRaw = array[2];

    if (isUnit(unitRaw, accepted)) {
      return Optional.some({
        value,
        unit: unitRaw
      });
    } else {
      return Optional.none();
    }
  });
};

export const normalise = <T extends keyof Units>(input: string, accepted: T[]): Optional<string> =>
  parse(input, accepted).map(({ value, unit }) => value + unit);
