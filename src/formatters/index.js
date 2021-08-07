import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

export default (ast, format) => {
  console.log();
  return formatters[format](ast);
};
