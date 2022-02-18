

const fs = require('fs');
const data = fs.readFileSync('data.csv').toString('utf-8');

const ParseState = {
  INIT: 0,
  START_LANG: 1,
  LANG_DATA: 2,
};

const mostlyEmpty = (line) => line.startsWith(",,,,,,,,,,,,,,,,,,,,,");

const symbolToUsage = (char) => {
  switch (char) {
    case "x": return "use";
    case "0": return "unused";
    case "-": return "not_available";
    default: {
      console.error('Bad usage symbol "%s"', char);
      throw new Error("Bad usage symbol");
    }
  }
}

/**
 *
 * @returns {{
 *  [langName: string]: {
 *    [projectName: string]: {
 *      usages: ('use'|'unused'|'not_available')[];
 *      url: string;
 *    }
 *  };
 * }}
 */
function readDataFile() {
  let state = ParseState.INIT;
  let langBuilder = {
    lang: '',
    entries: {}
  };
  const allData = {};

  const handlers = {
    [ParseState.INIT]: (line) => {
      if (mostlyEmpty(line)) {
        return ParseState.START_LANG;
      }
      console.log('Unexpected line in INIT state:', line);
      throw new Error("Unexpected line");
    },
    [ParseState.START_LANG]: (line) => {
      langBuilder.lang = line.split(',')[1];
      return ParseState.LANG_DATA;
    },
    [ParseState.LANG_DATA]: (line) => {
      if (mostlyEmpty(line)) {
        allData[langBuilder.lang] =langBuilder.entries;
        langBuilder = {
          lang: '',
          entries: {}
        }
        return ParseState.INIT;
      }
      const parts = line.split(",");
      const project = parts[1];
      const usages = parts.slice(2,9).map(symbolToUsage);
      const url = parts[14];
      if (!url || url.endsWith('/')) {
        console.log('Bad data for', langBuilder.lang, '->', project, ', url missing or badly formatted');
        throw new Error('Bad data');
      }
      langBuilder.entries[project] = ({ usages, url });
      return ParseState.LANG_DATA;
    }
  }
  data.split("\n").filter(Boolean).forEach(line => state = handlers[state](line));
  return allData;
}
module.exports = readDataFile;
