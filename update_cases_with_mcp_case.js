
import fs from 'fs';
import fetch from 'node-fetch';

const CASES_PATH = './src/data/cases.json';
const API_URL = 'https://apim-gateway.pkulaw.com/mcp-case';
const TOKEN = 'd419a066-e6ff-3f55-b2e6-71914a4cc619';

// Mapping for case number conversion
const PROVINCE_MAP = {
    "E": "鄂",
    "Chuan": "川",
    "Xiang": "湘",
    "Yue": "粤",
    "Jing": "京",
    "Zhe": "浙",
    "Su": "苏"
};

const TYPE_MAP = {
    "Zhi Min Chu": "知民初",
    "Min Chu": "民初",
    "Min Zhong": "民终"
};

function convertCaseNumber(caseNum) {
    if (!caseNum) return null;
    let cnNum = caseNum;

    // Replace Province
    for (const [en, cn] of Object.entries(PROVINCE_MAP)) {
        cnNum = cnNum.replace(en, cn);
    }

    // Replace Type
    for (const [en, cn] of Object.entries(TYPE_MAP)) {
        cnNum = cnNum.replace(en, cn);
    }

    // Replace "No.XXX" with "XXX号"
    cnNum = cnNum.replace(/No\.(\d+)/g, '$1号').replace(/\s+/g, '');

    return cnNum;
}

async function searchCase(caseNum) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json, text/event-stream'
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "tools/call",
                params: {
                    name: "get_case_list",
                    arguments: { fulltext: caseNum }
                },
                id: 1
            })
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status}`);
            return null;
        }

        const text = await response.text();
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const json = JSON.parse(line.slice(6));
                    const content = json.result?.content?.[0]?.text;
                    if (content) {
                        const parsedContent = JSON.parse(content);
                        if (parsedContent.data && parsedContent.data.length > 0) {
                            return parsedContent.data[0];
                        }
                    }
                } catch (e) {
                    // console.error('Parse error:', e);
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function main() {
    const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));
    let updatedCount = 0;

    for (const c of cases) {
        if (c.country === 'CN' && c.case_number) {
            const cnCaseNum = convertCaseNumber(c.case_number);
            console.log(`Processing ${c.name} (${c.case_number} -> ${cnCaseNum})...`);

            // Skip if conversion didn't change anything (likely already Chinese or invalid format)
            if (cnCaseNum === c.case_number && !c.case_number.includes('号')) {
                console.log('  Skipping: Format not recognized.');
                continue;
            }

            const caseData = await searchCase(cnCaseNum);

            if (caseData) {
                console.log(`  Found: ${caseData.Title}`);

                // Extract URL from markdown link [北大法宝](url)
                const urlMatch = caseData.Url.match(/\((.*?)\)/);
                const url = urlMatch ? urlMatch[1] : null;

                if (url) {
                    c.pkulaw_case_url = url;
                    c.official_title = caseData.Title;
                    updatedCount++;
                }
            } else {
                console.log('  Not found.');
            }

            // Be nice to the API
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    fs.writeFileSync(CASES_PATH, JSON.stringify(cases, null, 2));
    console.log(`Updated ${updatedCount} cases.`);
}

main();
