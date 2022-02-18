const data = require('./readDataFile')();
const FeatureColumn = require('./FeatureColumn');

const isNotAvailable = (feat, lang) => {
  if (feat === FeatureColumn.CompoundAssignment) {
    return ["Fortran", "R", "Haskell"].includes(lang);
  }
  return false;
}

const calcFeaturePresence = (feat) => {
  let available = 0;
  let notAvailable = 0;
  Object.keys(data).forEach(lang => {
    if (isNotAvailable(feat, lang)) {
      ++notAvailable;
      return;
    } else if (Object.values(data[lang])[0].usages[feat] !== 'not_available') {
      ++available;
    }
  });
  return Math.round(available * 100 / (Object.keys(data).length - notAvailable));
};

// module.exports = () => Object.keys(data).map((lang) => [lang, calcFeaturePresence(lang)]);
module.exports = () => Object.keys(FeatureColumn).map(colName => [colName, calcFeaturePresence(FeatureColumn[colName])]);
