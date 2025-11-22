
import fs from 'fs';
import fetch from 'node-fetch';

const CASES_PATH = './src/data/cases.json';
const API_URL = 'https://apim-gateway.pkulaw.com/mcp-law-search-service';
const TOKEN = 'd419a066-e6ff-3f55-b2e6-71914a4cc619';

// Mapping of summary keywords to Chinese search terms
const KEYWORD_MAPPING = {
    "picture": "人工智能 生成图片 著作权",
    "image": "人工智能 生成图片 著作权",
    "voice": "人工智能 声音权 著作权",
    "video": "人工智能 生成视频 著作权",
    "text": "人工智能 生成文本 著作权",
    "avatar": "虚拟数字人 著作权",
    "face-swapping": "AI 换脸 侵权",
    "algorithm": "人工智能 算法 侵权",
    "competition": "人工智能 不正当竞争",
    "copyrightability": "人工智能生成内容 可版权性",
    "default": "人工智能 著作权"
};

async function searchLaws(query) {
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
                    name: "search_article",
                    arguments: { text: query }
                },
                id: 1
            })
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status}`);
            return [];
        }

        const text = await response.text();
        // Parse SSE
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const json = JSON.parse(line.slice(6));
                    return json.result?.content?.[0]?.text ? JSON.parse(json.result.content[0].text) : [];
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }
        return [];
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function main() {
    const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));
    let updatedCount = 0;

    for (const c of cases) {
        if (c.country === 'CN') {
            console.log(`Processing ${c.name}...`);

            // Determine query
            let query = KEYWORD_MAPPING['default'];
            const summaryLower = c.summary.toLowerCase();

            for (const [key, term] of Object.entries(KEYWORD_MAPPING)) {
                if (summaryLower.includes(key)) {
                    query = term;
                    break;
                }
            }

            console.log(`  Query: ${query}`);
            const laws = await searchLaws(query);

            if (laws && laws.length > 0) {
                // Take top 2 relevant laws
                c.relevant_laws = laws.slice(0, 2).map(l => ({
                    title: l.title,
                    article: l.article,
                    url: l.url
                }));
                console.log(`  Found ${c.relevant_laws.length} laws.`);
                updatedCount++;
            } else {
                console.log('  No laws found.');
            }

            // Be nice to the API
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    fs.writeFileSync(CASES_PATH, JSON.stringify(cases, null, 2));
    console.log(`Updated ${updatedCount} cases.`);
}

main();
