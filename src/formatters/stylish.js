import _ from 'lodash';

const identSymbol = '  ';
const objShift = 2;
const formatNode = (key, value, shiftCount, label) => `${identSymbol.repeat(shiftCount)}${label}${key}: ${value}`;

const stringify = (value, shiftCount = 0) => {
  const closeOffset = identSymbol.repeat(shiftCount + 1);
  const currentShift = shiftCount + objShift;

  if (!_.isPlainObject(value)) {
    return value;
  }

  const result = Object.entries(value)
    .map(([key, objValue]) => formatNode(key, stringify(objValue, currentShift), currentShift, '  '))
    .join('\n');

  return `{
${result}
${closeOffset}}`;
};

const stylish = (ast, shiftCount = 1) => {
  const closeOffset = identSymbol.repeat(shiftCount - 1);
  const diffText = ast
    .flatMap(({
      type, key, value, newValue, oldValue, children,
    }) => {
      switch (type) {
        case 'nestedValue':
          return formatNode(key, stylish(children, shiftCount + objShift), shiftCount, '  ');
        case 'addedValue':
          return formatNode(key, stringify(newValue, shiftCount), shiftCount, '+ ');
        case 'removedValue':
          return formatNode(key, stringify(oldValue, shiftCount), shiftCount, '- ');
        case 'unchangedValue':
          return formatNode(key, stringify(value, shiftCount), shiftCount, '  ');
        case 'changedValue':
          return [
            formatNode(key, stringify(oldValue, shiftCount), shiftCount, '- '),
            formatNode(key, stringify(newValue, shiftCount), shiftCount, '+ '),
          ];
        default:
          throw new Error(`Unknown type: '${type}'!`);
      }
    })
    .join('\n');

  return `{
${diffText}
${closeOffset}}`;
};

export default (ast) => stylish(ast, 1);
