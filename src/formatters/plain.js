import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

export default (ast) => {
  const iter = (currentValue, prePath) => currentValue
    .filter(({ type }) => type !== 'unchangedValue')
    .flatMap(({
      type, key, newValue, oldValue, children,
    }) => {
      const path = [...prePath, key];
      const pathName = path.join('.');
      switch (type) {
        case 'addedValue':
          return `Property '${pathName}' was added with value: ${stringify(newValue)}`;
        case 'removedValue':
          return `Property '${pathName}' was removed`;
        case 'changedValue':
          return `Property '${pathName}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
        case 'nestedValue':
          return iter(children, path);
        default:
          throw new Error(`Unknown type: '${type}'!`);
      }
    });
  return iter(ast, []).join('\n');
};
