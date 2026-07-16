const fs = require('fs');
const path = require('path');

const rawTxtPath = path.join(__dirname, 'original_user_vue_code_full.txt');
let content = fs.readFileSync(rawTxtPath, 'utf8');

// Find starting of <script setup lang="ts">
const startIdx = content.indexOf('<script setup lang="ts">');
if (startIdx === -1) {
  console.log('Could not find script tag');
  process.exit(1);
}

let vueCode = content.substring(startIdx);
// Find last index of </template>
const lastTemplateIdx = vueCode.lastIndexOf('</template>');
if (lastTemplateIdx === -1) {
  console.log('Could not find template tag');
  process.exit(1);
}

vueCode = vueCode.substring(0, lastTemplateIdx + '</template>'.length);

fs.writeFileSync(path.join(__dirname, 'index_clean.vue'), vueCode, 'utf8');
console.log("Extracted index_clean.vue successfully!");
