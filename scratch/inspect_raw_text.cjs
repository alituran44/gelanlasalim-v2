const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'original_user_vue_code_full.txt');
const text = fs.readFileSync(filePath, 'utf8');

console.log("File size:", text.length, "chars");
console.log("Does it contain <template>?", text.toLowerCase().includes('<template>'));
console.log("Does it contain </template>?", text.toLowerCase().includes('</template>'));
console.log("Does it contain <script?", text.toLowerCase().includes('<script'));
console.log("Does it contain </script>?", text.toLowerCase().includes('</script>'));

const lines = text.split('\n');
console.log("Total lines:", lines.length);
console.log("Last 20 lines:");
console.log(lines.slice(Math.max(0, lines.length - 20)).join('\n'));
