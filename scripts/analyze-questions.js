const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/question-pool-ultra.json', 'utf8'));

const categoryCounts = {};
const subcategoryCounts = {};

data.questions.forEach(q => {
  categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  const subKey = `${q.category}/${q.subcategory}`;
  subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1;
});

console.log('Questions per category:');
console.log('========================');
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count}`);
});

console.log('\nTop subcategories:');
console.log('==================');
Object.entries(subcategoryCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([subcat, count]) => {
    console.log(`${subcat}: ${count}`);
  });

console.log(`\nTotal unique questions: ${data.totalQuestions}`);
console.log(`Total categories: ${Object.keys(categoryCounts).length}`);
console.log(`Total subcategories: ${Object.keys(subcategoryCounts).length}`);

// Sample some questions
console.log('\nSample questions:');
console.log('=================');
for (let i = 0; i < 5; i++) {
  const q = data.questions[Math.floor(Math.random() * data.questions.length)];
  console.log(`\n${i + 1}. [${q.category}/${q.subcategory}] ${q.q}`);
  q.a.forEach(a => console.log(`   - ${a.t} (${a.v})`));
}