import fs from 'fs';
import _ from 'lodash';

const readJSON = (file) => {
  const contentFile = fs.readFileSync(file, 'utf8');
  return JSON.parse(contentFile);
};

const genDiff = (file1, file2) => {
  const json1 = readJSON(file1);
  const json2 = readJSON(file2);

  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);
  const keysAll = _.union(keys1, keys2).sort();

  const diffKeys = keysAll.map((key) => {
    const diffKey = { key };
    const hasInJson1 = _.has(json1, key);
    const hasInJson2 = _.has(json2, key);
    if (!hasInJson1) {
      diffKey.status = 'add';
      diffKey.newValue = json2[key];
      return diffKey;
    }

    if (!hasInJson2) {
      diffKey.status = 'remove';
      diffKey.value = json1[key];
      return diffKey;
    }

    diffKey.value = json1[key];
    diffKey.newValue = json2[key];

    if (diffKey.value === diffKey.newValue) {
      diffKey.status = 'leav';
      return diffKey;
    }

    diffKey.status = 'change';
    return diffKey;
  });

  const diffText = diffKeys.map((diffKey) => {
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
  }).join('\n');

  // console.log(diffText);
  return `{
${diffText}
}`;
};

export default genDiff;
