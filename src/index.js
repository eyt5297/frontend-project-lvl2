import _ from 'lodash';
import parsers from './parsers.js';
import format from './formatters/index.js';

const getAstDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  const astDiff = allKeys.map((key) => {
    const diffKey = { key };
    const isIncludeKeys1 = _.includes(keys1, key);
    const isIncludeKeys2 = _.includes(keys2, key);

    if (!isIncludeKeys1) {
      return { key, type: 'addedValue', newValue: obj2[key] };
    }

    if (!isIncludeKeys2) {
      return { key, type: 'removedValue', oldValue: obj1[key] };
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, type: 'node', children: getAstDiff(obj1[key], obj2[key]) };
    }

    if (obj1[key] === obj2[key]) {
      return {
        key, type: 'unchangedValue', value: obj1[key],
      };
    }

    return {
      key, type: 'changedValue', newValue: obj2[key], oldValue: obj1[key],
    };
  });

  return astDiff;
};

const genDiff = (file1, file2, styleFormat = 'stylish') => {
  const obj1 = parsers(file1);
  const obj2 = parsers(file2);

  const ast = getAstDiff(obj1, obj2);
  // console.log(JSON.stringify(diffKeys, undefined, 4));
  const diffText = format(ast, styleFormat);

  return diffText;
};

export default genDiff;
