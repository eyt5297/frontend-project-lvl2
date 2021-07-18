import fs from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import yaml from 'js-yaml';

// const readYaml = (file) => yaml.load(fs.readFileSync(file, 'utf8'));
const readFile = {
  json: (file) => {
    const contentFile = fs.readFileSync(file, 'utf8');
    return JSON.parse(contentFile);
  },

  yaml: (file) => yaml.load(fs.readFileSync(file, 'utf8')),
};

const getStatusKeys = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.union(keys1, keys2).sort();

  const statusKeys = allKeys.map((key) => {
    const diffKey = { key };
    const isIncludeKeys1 = _.includes(keys1, key);
    const isIncludeKeys2 = _.includes(keys2, key);

    if (!isIncludeKeys1) {
      diffKey.status = 'add';
      diffKey.newValue = obj2[key];
      return diffKey;
    }

    if (!isIncludeKeys2) {
      diffKey.status = 'remove';
      diffKey.value = obj1[key];
      return diffKey;
    }

    diffKey.value = obj1[key];
    diffKey.newValue = obj2[key];

    if (diffKey.value === diffKey.newValue) {
      diffKey.status = 'leav';
      return diffKey;
    }

    diffKey.status = 'change';
    return diffKey;
  });

  return statusKeys;
};

const getResultDiff = (diffKeys) => {
  const diffText = diffKeys
    .map((diffKey) => {
      switch (diffKey.status) {
        case 'add':
          return `  + ${diffKey.key}: ${diffKey.newValue}`;
        case 'remove':
          return `  - ${diffKey.key}: ${diffKey.value}`;
        case 'leav':
          return `    ${diffKey.key}: ${diffKey.value}`;
        default:
          break;
      }
      return `  - ${diffKey.key}: ${diffKey.value}
  + ${diffKey.key}: ${diffKey.newValue}`;
    })
    .join('\n');

  return `{
${diffText}
}`;
};

const genDiff = (file1, file2) => {
  const exts = {
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
  };
  const ext1 = exts[extname(file1)];
  const obj1 = readFile[ext1](file1);
  const ext2 = exts[extname(file2)];
  const obj2 = readFile[ext2](file2);

  const diffKeys = getStatusKeys(obj1, obj2);
  const diffText = getResultDiff(diffKeys);

  return diffText;
};

export default genDiff;
