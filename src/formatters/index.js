import stylish from './stylish.js';

const formatters = {
  stylish,
};

export default (ast, format) => {
  console.log();
  return formatters[format](ast);
};
