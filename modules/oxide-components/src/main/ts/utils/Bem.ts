import { type BlocksMap, type ElementsMap } from '@tinymce/oxide/skins/ui/default/skin.ts';

export const block = <
  B extends keyof BlocksMap,
  M extends keyof BlocksMap[B]
>(block: B, modifiers: M[] = []): string => {
  if (modifiers.length === 0) {
    return block as string;
  } else {
    return [ block as string, ...modifiers.map((modifier) => block + '--' + (modifier as string)) ].join(' ');
  }
};

export const element = <
  B extends keyof ElementsMap,
  E extends keyof ElementsMap[B],
  M extends keyof ElementsMap[B][E]
>(block: B, element: E, modifiers: M[] = []): string => {
  const prefix = (block as string) + '__' + (element as string);

  if (modifiers.length === 0) {
    return prefix;
  } else {
    return [ prefix, ...modifiers.map((modifier) => prefix + '--' + (modifier as string)) ].join(' ');
  }
};
