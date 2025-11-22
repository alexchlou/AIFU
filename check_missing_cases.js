import fs from 'fs';
const cases = JSON.parse(fs.readFileSync('src/data/cases.json'));
cases.filter(c => c.country === 'CN' && !c.pkulaw_case_url).forEach(c => console.log(`${c.id}: ${c.case_number}`));
