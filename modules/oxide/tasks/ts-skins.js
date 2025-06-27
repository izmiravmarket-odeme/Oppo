const fs = require('node:fs');
const { default: DtsCreator } = require('typed-css-modules');

let creator = new DtsCreator();

const files = fs.readdirSync(process.argv[2], {
  recursive: true,
});

const hasElement = (className) => className.includes('__');
const hasModifier = (className) => className.includes('--');
const getBlockName = (className) => className.split('__')[0];
const getElementName = (className) => className.split('__')[1]?.split('--')[0];
const getModifierName = (className) => className.split('--')[1];

const toObject = (arr) =>
  arr.reduce((acc, modifier) => ({ ...acc, [modifier]: {} }), {})

const getModifiersByPrefix = (classes, prefix) => {
  return toObject(classes
    .filter(className => className.startsWith(prefix) && hasModifier(className))
    .map(getModifierName));
};

const generateBem = (classes) => {
  const blocks = {};
  const elements = {};

  const blockClasses = classes.filter((className) => !hasElement(className) && !hasModifier(className));
  blockClasses.forEach((className) => {
    const blockName = getBlockName(className);
    blocks[className] = getModifiersByPrefix(classes, className + '--');

    const elementClasses = classes.filter((className) => className.startsWith(blockName + '__') && !hasModifier(className));
    elementClasses.forEach((className) => {
      const elementName = getElementName(className);

      if (!elements[blockName]) {
        elements[blockName] = {}
      }

      const modifiers = getModifiersByPrefix(classes, className + '--');
      elements[blockName][elementName] = modifiers;
    });
  });

  return {
    blocks,
    elements
  };
};

const generateBemTypes = (bem) => {
  const lines = [];

  lines.push('export interface BlocksMap ' + JSON.stringify(bem.blocks, null, 2).replace(/"/g, "'"));
  lines.push('');
  lines.push('export interface ElementsMap ' + JSON.stringify(bem.elements, null, 2).replace(/"/g, "'"));

  return lines.join('\n');
};

files.forEach(file => {
  if (file.endsWith('.css')) {
    creator.create(process.argv[2] + '/' + file).then(content => {
      const result = generateBemTypes(generateBem(content.tokens));

      fs.writeFileSync(process.argv[2] + '/' + file.replace('.css', '.ts'), result);
    }).catch(err => {
      console.error(`Error creating CSS module for ${file.name}:`, err);
    });
  }
});
