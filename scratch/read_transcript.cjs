const fs = require('fs');
const path = require('path');

const logPath = path.join('C:', 'Users', 'Hp', '.gemini', 'antigravity', 'brain', '317de7c5-a3e8-49b4-b2ef-d2dcabe029dd', '.system_generated', 'logs', 'transcript_full.jsonl');

if (!fs.existsSync(logPath)) {
  console.log("Log path does not exist:", logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
console.log("Found", lines.length, "lines in transcript_full.");

// Find user input containing "ana sayfa kodlarını <script setup lang="ts">"
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  try {
    const step = JSON.parse(lines[i]);
    if (step.type === 'USER_INPUT' && step.content && step.content.includes('ana sayfa kodlarını <script setup lang="ts">')) {
      console.log("Found matching USER_INPUT at line", i);
      
      // Extract the raw text from the content string (or check if it has been parsed)
      let rawText = step.content;
      
      // Save it to a file
      fs.writeFileSync(path.join(__dirname, 'original_user_vue_code_full.txt'), rawText, 'utf8');
      console.log("Saved original_user_vue_code_full.txt successfully!");
      break;
    }
  } catch (err) {
    // Ignore JSON parse errors
  }
}
