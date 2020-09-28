import pkg from 'commander';

const { program } = pkg;

const gendiff = () => {
  program.version('0.0.1');

  program.parse(process.argv);
};

export default gendiff;
