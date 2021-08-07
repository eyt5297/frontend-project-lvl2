import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return `${value}`;
};

export default (ast) => {
  const iter = (currentValue, prePath) => {
    const res = currentValue
      .filter(({ type }) => type !== 'unchangedValue')
      .flatMap(({
        type, key, newValue, oldValue, children,
      }) => {
        const path = [...prePath, key].join('.');
        switch (type) {
          case 'addedValue':
            return `Property '${path}' was added with value: ${formatValue(newValue)}`;
          case 'removedValue':
            return `Property '${path}' was removed`;
          case 'changedValue':
            return `Property '${path}' was updated. From ${formatValue(oldValue)} to ${formatValue(newValue)}`;
          case 'node':
            return iter(children, [path]);
          default:
            break;
        }
        return null;
      });

    return res;
  };

  return iter(ast, []).join('\n');
};
