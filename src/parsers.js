import yaml from 'js-yaml';
import _ from 'lodash';

const parseContent = {
  json: (content) => JSON.parse(content),
  yaml: (content) => yaml.load(content),
  yml: (content) => yaml.load(content),
};

export default (content, fileFormat) => {
  if (!_.has(parseContent, fileFormat)) {
    throw new Error(`Unknown format file: ${fileFormat}`);
  }

  return parseContent[fileFormat](content);
};
