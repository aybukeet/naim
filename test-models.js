const fs = require('fs');
const envStr = fs.readFileSync('.env', 'utf-8');
const key = envStr.split('EXPO_PUBLIC_GEMINI_API_KEY=')[1].split('\n')[0].trim();

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(r => r.json())
  .then(d => {
    let output = "AVAILABLE GEMINI MODELS:\n";
    if(d.models) {
       d.models.forEach(m => {
         if(m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent') && m.name.includes('gemini')) {
            output += m.name + "\n";
         }
       });
       console.log(output);
    } else {
       console.log("Error or empty:", d);
    }
  }).catch(e => console.error("Fetch error:", e));
