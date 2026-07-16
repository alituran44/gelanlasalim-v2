const fs = require('fs');
const path = require('path');

const pageJsPath = path.join(__dirname, '..', 'app', 'pages', 'index.vue');
const pageContent = fs.readFileSync(pageJsPath, 'utf8');

const lines = pageContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('id="sss"') || line.includes('</template>')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
