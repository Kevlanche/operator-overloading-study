const data = require('./readDataFile')();

const FeatureColumn = {
  Arithmetic: 0,
  CompoundAssignment: 1,
  Comparison: 2,
  LogicalAndOr: 3,
  ArrayIndexing: 4,
  ArbitraryPropAccess: 5,
  ReverseArithmetic: 6
};

const calcFeatureUsage = (column) => {
  const usages = [];
  Object.keys(data).forEach((lang) => {
    Object.keys(data[lang]).forEach((proj) => {
      switch (data[lang][proj].usages[column]) {
        case 'use': {
          usages.push(1);
          break;
        }
        case 'unused': {
          usages.push(0);
          break;
        }
        // Ignore not_available
      }
    });
  });
  return Math.round(usages.reduce((a, b) => a + b, 0) * 100 / usages.length);
};

module.exports = () => Object.keys(FeatureColumn).map(colName => [colName, calcFeatureUsage(FeatureColumn[colName])]);
