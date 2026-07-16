const fs = require('fs');
const path = require('path');

const logPath = path.join('C:', 'Users', 'Hp', '.gemini', 'antigravity', 'brain', '317de7c5-a3e8-49b4-b2ef-d2dcabe029dd', '.system_generated', 'logs', 'transcript_full.jsonl');

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (line.includes('<script setup lang="ts">')) {
    console.log(`Line ${idx + 1}: length = ${line.length}`);
  }
});
