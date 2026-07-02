const fs = require('fs');

async function testBatch() {
  const rawCsv = fs.readFileSync('src/data/tousandtopics0501.csv', 'utf-8');
  const lines = rawCsv.trim().split(/\r?\n/).slice(1, 11); // Take first 10 IDs
  
  const ids = lines.map(line => {
    const parts = line.split(',');
    return parts[0].replace(/"/g, '').trim();
  });
  
  console.log("Testing APIs for IDs:", ids);
  
  let successes = 0;
  let failures = 0;
  
  for (const id of ids) {
    try {
      const url = `https://tsi.us-east-2.cnt-tags.prod.cloud.siriusxm.com/scores/${encodeURIComponent(id).replace(/%3A/gi, ':')}`;
      const res = await fetch(url);
      if (res.ok) {
        successes++;
        console.log(`✅ Success for ${id}`);
      } else {
        failures++;
        console.log(`❌ Failed for ${id}: ${res.status} ${res.statusText}`);
      }
    } catch (e) {
      failures++;
      console.log(`❌ Error for ${id}: ${e.message}`);
    }
  }
  console.log(`\nBatch Test Complete. Successes: ${successes}, Failures: ${failures}`);
}

testBatch();
