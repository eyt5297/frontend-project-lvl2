import fs from 'fs';
import { extname } from 'path';
import yaml from 'js-yaml';

const readFile = {
  json: (file) => {
    const contentFile = fs.readFileSync(file, 'utf8');
    return JSON.parse(contentFile);
  },
  yaml: (file) => yaml.load(fs.readFileSync(file, 'utf8')),
};

const parsers = (file) => {
  const exts = {
    '.json': 'json',
    '.yaml': 'yaml',
    '.yml': 'yaml',
  };
  const ext = exts[extname(file)];
  const obj = readFile[ext](file);

  return obj;
};

export default parsers;
