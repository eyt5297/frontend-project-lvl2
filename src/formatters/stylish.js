import _ from 'lodash';

const getFormatedObject = (obj, shiftCount = 0) => {
  const keys = Object.keys(obj).sort();

  const result = keys
    .map((key) => {
      const value = _.isPlainObject(obj[key])
        ? getFormatedObject(obj[key], shiftCount + 2)
        : obj[key];
      return `${'  '.repeat(shiftCount)}  ${key}: ${value}`;
    })
    .join('\n');

  return `{
${result}
${'  '.repeat(shiftCount - 1)}}`;
};

const fmt = (diffKeys, shiftCount = 1) => {
  const convertValue = (value) => {
    if (_.isPlainObject(value)) {
      return getFormatedObject(value, shiftCount + 2);
    }
    return value;
  };

  const diffText = diffKeys
    .flatMap((diffKey) => {
      switch (diffKey.type) {
        case 'node':
          return `${'  '.repeat(shiftCount)}  ${diffKey.key}: ${fmt(diffKey.children, shiftCount + 2)}`;
        case 'addedValue':
          return `${'  '.repeat(shiftCount)}+ ${diffKey.key}: ${convertValue(diffKey.newValue)}`;
        case 'removedValue':
          return `${'  '.repeat(shiftCount)}- ${diffKey.key}: ${convertValue(diffKey.oldValue)}`;
        case 'unchangedValue':
          return `${'  '.repeat(shiftCount)}  ${diffKey.key}: ${convertValue(diffKey.value)}`;
        case 'changedValue':
          return `${'  '.repeat(shiftCount)}- ${diffKey.key}: ${convertValue(diffKey.oldValue)}
${'  '.repeat(shiftCount)}+ ${diffKey.key}: ${convertValue(diffKey.newValue)}`;
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

export default fmt;
