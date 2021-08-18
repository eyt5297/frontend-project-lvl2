import _ from 'lodash';

const formatNode = (key, value, shiftCount, label) => `${'  '.repeat(shiftCount)}${label}${key}: ${value}`;

const getFormatedObject = (obj, shiftCount = 0) => {
  const result = Object.entries(obj)
    .map(([key, objValue]) => {
      const value = _.isPlainObject(objValue)
        ? getFormatedObject(objValue, shiftCount + 2)
        : objValue;
      return formatNode(key, value, shiftCount, '  ');
    })
    .join('\n');

  return `{
${result}
${'  '.repeat(shiftCount - 1)}}`;
};

const fmt = (ast, shiftCount = 1) => {
  const convertValue = (value) => {
    if (_.isPlainObject(value)) {
      return getFormatedObject(value, shiftCount + 2);
    }
    return value;
  };

  const diffText = ast
    .flatMap(({
      type, key, value, newValue, oldValue, children,
    }) => {
      switch (type) {
        case 'nestedValue':
          return formatNode(key, fmt(children, shiftCount + 2), shiftCount, '  ');
        case 'addedValue':
          return formatNode(key, convertValue(newValue), shiftCount, '+ ');
        case 'removedValue':
          return formatNode(key, convertValue(oldValue), shiftCount, '- ');
        case 'unchangedValue':
          return formatNode(key, convertValue(value), shiftCount, '  ');
        case 'changedValue':
          return [
            formatNode(key, convertValue(oldValue), shiftCount, '- '),
            formatNode(key, convertValue(newValue), shiftCount, '+ '),
          ];
        default:
          throw new Error(`Unknown type: '${type}'!`);
      }
    })
    .join('\n');

  return `{
${diffText}
${'  '.repeat(shiftCount - 1)}}`;
};

export default (ast) => fmt(ast, 1);
