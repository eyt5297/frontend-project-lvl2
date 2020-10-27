import fs from 'fs';

const readJSON = (file) => {
  const contentFile = fs.readFileSync(file, 'utf8');
  return JSON.parse(contentFile);
};

const genDiff = (file1, file2) => {
  const json1 = readJSON(file1);
  const json2 = readJSON(file2);

  console.log(json1);
  console.log(json2);
};

export default genDiff;
