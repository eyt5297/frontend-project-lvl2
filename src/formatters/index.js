import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (ast, format) => {
  if (!_.has(formatters, format)) {
    throw new Error('Unknown output format!');
  }

  return formatters[format](ast);
};
