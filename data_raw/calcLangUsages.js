const data = require('./readDataFile')();

const calcProjectUsage = (lang, proj) => {
  const { usages } = data[lang][proj];
  const available = usages.filter(x => x != 'not_available').length;
  const used = usages.filter(x => x == 'use').length;
  return (used * 100 / available);
};

const calcLangUsage = (lang) => {
  const usages = Object.keys(data[lang]).map((proj) => calcProjectUsage(lang, proj));
  return Math.round(usages.reduce((a, b) => a + b, 0) / usages.length);
};

module.exports = () => Object.keys(data).map((lang) => [lang, calcLangUsage(lang)]).sort((a, b) => b[1] - a[1]);
