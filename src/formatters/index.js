import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (ast, format) => {
  console.log();
  return formatters[format](ast);
};
