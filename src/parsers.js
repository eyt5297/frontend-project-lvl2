import fs from 'fs';
import { extname } from 'path';
import yaml from 'js-yaml';

const parseContent = {
  json: (content) => JSON.parse(content),
  yaml: (content) => yaml.load(content),
};

const parseFile = (file) => {
  const exts = {
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
  };

  const ext = exts[extname(file)];
  const content = fs.readFileSync(file, 'utf8');
  const obj = parseContent[ext](content);

  return obj;
};

export default parseFile;
