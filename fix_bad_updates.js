import fs from 'fs';

const CASES_PATH = './src/data/cases.json';
const BAD_IDS = ['voice-artist-v-soundx'];

const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));
let count = 0;

for (const c of cases) {
    if (BAD_IDS.includes(c.id)) {
        if (c.pkulaw_case_url) {
            console.log(`Reverting ${c.id} (${c.official_title})...`);
            delete c.pkulaw_case_url;
            delete c.official_title;
            count++;
        }
    }
}

fs.writeFileSync(CASES_PATH, JSON.stringify(cases, null, 2));
console.log(`Reverted ${count} cases.`);
