const data = require('./readDataFile')();
const fs = require('fs');
const childProc = require('child_process');

const langToDir = (lang) => {
  switch (lang) {
    case "C++": return "cpp";
    case "C#": return "csharp";
    case "Visual Basic": return "visualbasic";
    case "Delphi/Object Pascal": return "pascal";
    default: return lang;
  }
}

const getRevision = (rootDir, lang, proj) => {
  const parentDir = langToDir(lang);
  const childDir = data[lang][proj].url.split('/').slice(-1)[0];

  const fullPath = [rootDir, parentDir, childDir].join('/').toLowerCase();

  if (!fs.existsSync(fullPath)) {
    console.warn('Missing project', lang, ':', proj, ', searched in "', fullPath, '"');
    return '?';
  }
  const res = childProc.execSync('git rev-parse HEAD', {
    cwd: fullPath
  });
  return res.toString('utf-8').trim();
};


module.exports = getRevision;
