import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const resultStylish = readFile('resultStylish.txt').trim();
const resultPlain = readFile('resultPlain.txt').trim();
const resultJson = readFile('resultJson.json').trim();

test.each([
  {
    format: 'stylish', file1: 'file1.json', file2: 'file2.json', expected: resultStylish,
  },
  {
    format: 'stylish', file1: 'file1.yaml', file2: 'file2.yaml', expected: resultStylish,
  },
  {
    format: 'plain', file1: 'file1.json', file2: 'file2.json', expected: resultPlain,
  },
  {
    format: 'plain', file1: 'file1.yaml', file2: 'file2.yaml', expected: resultPlain,
  },
  {
    format: 'json', file1: 'file1.json', file2: 'file2.json', expected: resultJson,
  },
  {
    format: 'json', file1: 'file1.yaml', file2: 'file2.yaml', expected: resultJson,
  },
])('genDiff $format $file1 $file2', ({
  format, file1, file2, expected,
}) => {
  const filePath1 = getFixturePath(file1);
  const filePath2 = getFixturePath(file2);
  expect(genDiff(filePath1, filePath2, format)).toEqual(expected);
});
