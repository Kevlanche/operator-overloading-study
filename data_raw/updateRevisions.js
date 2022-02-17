const data = require('./readDataFile')();
const fs = require('fs');


const rootDir = process.env.REVISION_ROOT_DIR;
if (!rootDir) {
  throw new Error('Environment variable "REVISION_ROOT_DIR" required to extract revisions information');
}

if (rootDir) {
  const getRevision = require('./getRevision');
  console.log('Updating revisions.json...');
  const revisions = Object.assign({}, ...Object.keys(data).map(lang => {
    return {
      [lang]: Object.assign({}, ...(Object.keys(data[lang]).map(proj => ({
        [proj]: {
          url: data[lang][proj].url,
          revision: getRevision(rootDir, lang, proj),
        }
      }))))
    };
  }));
  fs.writeFileSync('../data_processed/revisions.json', JSON.stringify(revisions, null, 2));
  console.log('Updated revisions.json')
}

