const data = require('./readDataFile')();
const fs = require('fs');

const mergedData = {};
const printSection = (id, header, sectionData) => {
  console.log('-------------------------------');
  mergedData[id] = Object.assign({}, ...sectionData.map(([k,v]) => ({ [k]: v })));
  console.log(header);
  sectionData.forEach(([label, usage]) => {
    console.log(label.padStart(24, ' '),  '|'.padEnd(4 - `${usage}`.length, ' '), usage, '|');
  })
}

printSection('usage-lang', 'Usage by lang', require('./calcLangUsages')());
printSection('usage-feature', 'Feature usages', require('./calcFeatureUsages')());
printSection('meta', 'Meta info', [
  ['Num languages', Object.values(data).length],
  ['Num projects', Object.values(data).reduce((a,b) => a + Object.values(b).length, 0)]
]);

fs.writeFileSync('../data_processed/usage-data.json', JSON.stringify(mergedData, null, 2));
