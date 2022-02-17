const data = require('./readDataFile')();
const fs = require('fs');

const ROWS_PER_PAGE = 48;

const outBuffer = [];
const addl = (line) => outBuffer.push(`${line}\n`);

let numPages = 0;
const beginPage = () => {
  addl(`
%<!sigchi-a>\\begin{table*}
%<sigchi-a>\\begin{margintable}
  \\caption{Project data${numPages === 0 ? '' : ' (cont.)'}}
  \\label{tab:projects${String.fromCharCode('A'.charCodeAt(0) + numPages)}}
  \\projdesc
  \\begin{tabular}{|c|c|c|c|c|c|c|c|}
    \\projhead
`.trim());
  ++numPages;
};

const endPage = () => {
  addl(`
\\end{tabular}
%<sigchi-a>\\end{margintable}
%<!sigchi-a>\\end{table*}
`.trim());
  addl('');
}

let budget = ROWS_PER_PAGE;
beginPage();

Object.keys(data).forEach((lang) => {
  const cost = 1 + Object.keys(data[lang]).length;
  if (cost > budget) {
    endPage();
    beginPage();
    budget = ROWS_PER_PAGE;
  }

  budget -= cost;

  addl(`\\projl{${lang.replace('#', '\\#')}} \\\\ \\hline`.padStart(32, ' '));
  Object.keys(data[lang]).forEach((proj) => {
    addl(`${proj.trim().padStart(24, ' ')} & ${data[lang][proj].usages.map((usage) => {
      switch (usage) {
        case 'use': return '\\ye';
        case 'unused': return '\\no';
        case 'not_available': return '\\na';
        default: throw new Error('Unexpected usage value ' + usage);
      }
    }).join(' & ')} \\\\ \\hline`);
  });
});
if (budget != ROWS_PER_PAGE) {
  endPage();
}


fs.writeFileSync(`../data_processed/appendix-tables.dtx`, outBuffer.join(''));
