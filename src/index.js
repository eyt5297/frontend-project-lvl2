import _ from 'lodash';
import fs from 'fs';
import { extname } from 'path';
import parse from './parsers.js';
import format from './formatters/index.js';

const getAstDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  return allKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return { key, type: 'addedValue', newValue: obj2[key] };
    }

    if (!_.has(obj2, key)) {
      return { key, type: 'removedValue', oldValue: obj1[key] };
    }

    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, type: 'nestedValue', children: getAstDiff(obj1[key], obj2[key]) };
    }

    if (_.isEqual(obj1[key], obj2[key])) {
      return {
        key, type: 'unchangedValue', value: obj1[key],
      };
    }

    return {
      key, type: 'changedValue', newValue: obj2[key], oldValue: obj1[key],
    };
  });
};

const getFormat = (filePath) => extname(filePath).slice(1);

const genDiff = (file1, file2, styleFormat = 'stylish') => {
  const content1 = fs.readFileSync(file1, 'utf8');
  const content2 = fs.readFileSync(file2, 'utf8');

  const obj1 = parse(content1, getFormat(file1));
  const obj2 = parse(content2, getFormat(file2));

  const ast = getAstDiff(obj1, obj2);

  return format(ast, styleFormat);
};

export default genDiff;
