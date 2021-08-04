import _ from 'lodash';
import parsers from './parsers.js';

const getAstDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.union(keys1, keys2).sort();

  const astDiff = allKeys.map((key) => {
    const diffKey = { key };
    const isIncludeKeys1 = _.includes(keys1, key);
    const isIncludeKeys2 = _.includes(keys2, key);

    if (!isIncludeKeys1) {
      diffKey.type = 'addedValue';
      diffKey.newValue = obj2[key];
      return diffKey;
    }

    if (!isIncludeKeys2) {
      diffKey.type = 'removedValue';
      diffKey.oldValue = obj1[key];
      return diffKey;
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      diffKey.type = 'node';
      diffKey.children = getAstDiff(obj1[key], obj2[key]);
      return diffKey;
    }

    diffKey.oldValue = obj1[key];
    diffKey.newValue = obj2[key];

    if (diffKey.oldValue === diffKey.newValue) {
      diffKey.type = 'unchangedValue';
      diffKey.value = diffKey.oldValue;
      return diffKey;
    }

    diffKey.type = 'changedValue';
    return diffKey;
  });

  return astDiff;
};

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

const formatStylish = (diffKeys, shiftCount = 1) => {
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
          return `${'  '.repeat(shiftCount)}  ${diffKey.key}: ${formatStylish(diffKey.children, shiftCount + 2)}`;
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

const genDiff = (file1, file2) => {
  const obj1 = parsers(file1);
  const obj2 = parsers(file2);

  const diffKeys = getAstDiff(obj1, obj2);
  // console.log(JSON.stringify(diffKeys, undefined, 4));
  const diffText = formatStylish(diffKeys);

  return diffText;
};

export default genDiff;
