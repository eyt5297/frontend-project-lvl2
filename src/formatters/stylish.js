import _ from 'lodash';

const formatNode = (key, value, shiftCount, label) => `${'  '.repeat(shiftCount)}${label}${key}: ${value}`;

const getFormatedObject = (obj, shiftCount = 0) => {
  const keys = _.sortBy(Object.keys(obj));

  const result = keys
    .map((key) => {
      const value = _.isPlainObject(obj[key])
        ? getFormatedObject(obj[key], shiftCount + 2)
        : obj[key];
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
    .flatMap((node) => {
      switch (node.type) {
        case 'node':
          return formatNode(node.key, fmt(node.children, shiftCount + 2), shiftCount, '  ');
        case 'addedValue':
          return formatNode(node.key, convertValue(node.newValue), shiftCount, '+ ');
        case 'removedValue':
          return formatNode(node.key, convertValue(node.oldValue), shiftCount, '- ');
        case 'unchangedValue':
          return formatNode(node.key, convertValue(node.value), shiftCount, '  ');
        case 'changedValue':
          return [
            formatNode(node.key, convertValue(node.oldValue), shiftCount, '- '),
            formatNode(node.key, convertValue(node.newValue), shiftCount, '+ '),
          ];
        default:
          break;
      }
      return null;
    })
    .join('\n');

  return `{
${diffText}
${'  '.repeat(shiftCount - 1)}}`;
};

export default (ast) => fmt(ast, 1);
