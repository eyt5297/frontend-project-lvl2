import pkg from 'commander';
import genDiff from '../src/index.js';
// import genDiff from './index.js'; // почему не работает?

const { program } = pkg;

const genDiffCli = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<file1> <file2>')
    .action(genDiff);

  program.parse(process.argv);
};

export default genDiffCli;
