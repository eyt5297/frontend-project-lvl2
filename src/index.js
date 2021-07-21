import _ from 'lodash';
import parsers from './parsers.js';

const getStatusKeys = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.union(keys1, keys2).sort();

  const getValue = (objValue) => {
    if (_.isPlainObject(objValue)) {
      return getStatusKeys(objValue, objValue);
    }
    return objValue;
  };

  const statusKeys = allKeys.map((key) => {
    const diffKey = { key };
    const isIncludeKeys1 = _.includes(keys1, key);
    const isIncludeKeys2 = _.includes(keys2, key);

    if (!isIncludeKeys1) {
      diffKey.status = 'add';
      diffKey.newValue = getValue(obj2[key]);
      return diffKey;
    }

    if (!isIncludeKeys2) {
      diffKey.status = 'remove';
      diffKey.value = getValue(obj1[key]);
      return diffKey;
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      diffKey.value = getStatusKeys(obj1[key], obj2[key]);
      diffKey.status = 'leav';
      return diffKey;
    }

    diffKey.value = getValue(obj1[key]);
    diffKey.newValue = getValue(obj2[key]);

    if (diffKey.value === diffKey.newValue) {
      diffKey.status = 'leav';
      return diffKey;
    }

    diffKey.status = 'change';
    return diffKey;
  });

  return statusKeys;
};

const getResultDiff = (diffKeys, shiftCount = 1) => {
  const convertValue = (value) => {
    if (_.isArray(value)) {
      return getResultDiff(value, shiftCount + 2);
    }
    return value;
  };

  const diffText = diffKeys
    .flatMap((diffKey) => {
      switch (diffKey.status) {
        case 'add':
          return `${'  '.repeat(shiftCount)}+ ${diffKey.key}: ${convertValue(diffKey.newValue)}`;
        case 'remove':
          return `${'  '.repeat(shiftCount)}- ${diffKey.key}: ${convertValue(diffKey.value)}`;
        case 'leav':
          return `${'  '.repeat(shiftCount)}  ${diffKey.key}: ${convertValue(diffKey.value)}`;
        case 'change':
          return `${'  '.repeat(shiftCount)}- ${diffKey.key}: ${convertValue(diffKey.value)}
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

  const diffKeys = getStatusKeys(obj1, obj2);
  // console.log(JSON.stringify(diffKeys, undefined, 4));
  const diffText = getResultDiff(diffKeys);

  return diffText;
};

export default genDiff;
