const xlsx = require('xlsx');
const fs = require('fs');
const workbook = xlsx.readFile(process.argv[2]);
const sheetNames = workbook.SheetNames;
let out = '';
sheetNames.forEach(sheet => {
  out += `\n\n=== SHEET: ${sheet} ===\n\n`;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
  out += JSON.stringify(data, null, 2);
});
fs.writeFileSync('parsed_excel_utf8.json', out, 'utf8');
