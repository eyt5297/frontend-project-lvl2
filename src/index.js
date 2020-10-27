import fs from 'fs';

const genDiff = (file1, file2) => {
  const contentFile1 = fs.readFileSync(file1);
  const contentFile2 = fs.readFileSync(file2);
  console.log(contentFile1);
  console.log(contentFile2);
  console.log('do...');
};

export default genDiff;
