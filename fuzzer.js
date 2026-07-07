import { getAssistantResponse, correctToken } from './src/utils/nlpAssistant.js';
import fs from 'fs';

const TEST_INTENTS = {
  about_me: [
    "Tell me about yourself", "Who are you?", "Introduce yourself", "What's your story?", 
    "give me some background", "I want to know about you", "who am I talking to?", "urself please"
  ],
  skills: [
    "what technologies do you know?", "what are your skills", "show me your tech stack", 
    "which languages do you write", "what frameworks can you use", "Are you good at coding", "do you know react"
  ],
  projects: [
    "show me your projects", "what have you built", "what have you made", 
    "what apps have you developed", "are you building anything interesting currently", "what's your best work"
  ],
  education: [
    "what do you study", "what's your educational background", "where did you go to college", 
    "do you have a degree", "tell me about your academics", "where is your school"
  ],
  goals: [
    "where do you see yourself in five years", "what are your future plans", "what are you aiming for", 
    "what role do you want", "what are your aspirations", "what are you working toward"
  ],
  availability: [
    "are you available for work", "can companies hire you right now", "are you open to opportunities", 
    "would you be interested in an internship", "do you want a job"
  ],
  photo: [
    "show me your face", "what do you look like", "can I see a picture", "do you have a photo", "show me an image of you"
  ]
};

// We will also test a bunch of random out of scope questions
const OUT_OF_SCOPE = [
  "Solve this math problem", "Who is Elon Musk", "What is the capital of France", 
  "Write me some Python code", "Generate an essay about React", "who won the IPL", 
  "explain node.js to me like I'm 5", "tell me a joke about dogs", "what is ChatGPT"
];

let total = 0;
let passed = 0;
let failed = [];

function check(query, expectedIntent) {
    total++;
    // getAssistantResponse logic maps to intent strings in its switch internally
    // We can infer intent by looking at the response text
    const res = getAssistantResponse(query);
    
    let actualIntent = 'unknown';
    if (res.includes('Error: This assistant is a personalized portfolio')) actualIntent = 'unknown';
    else if (res.includes('About Me') || res.includes('Hi, I\'m Rishabh Trivedi')) actualIntent = 'about_me';
    else if (res.includes('My setup:')) actualIntent = 'skills';
    else if (res.includes('Persian Darbar')) actualIntent = 'projects';
    else if (res.includes('Thakur College')) actualIntent = 'education';
    else if (res.includes('Data Architect or robust Full Stack')) actualIntent = 'goals';
    else if (res.includes('open to internships and full-time roles')) actualIntent = 'availability';
    else if (res.includes('profile.png')) actualIntent = 'photo';

    if (actualIntent !== expectedIntent) {
        // Run getAssistantResponse again but we can't easily get tokens from outside, 
        // so we'll just log the failure. But to get tokens, we can copy the logic here.
        const cleanInput = query.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const tokens = cleanInput.split(' ').filter(t => t.length > 0);
        const correctedTokens = tokens.map(correctToken);
        failed.push({query, expected: expectedIntent, actual: actualIntent, tokens: correctedTokens});
    } else {
        passed++;
    }
}

for (const [intent, queries] of Object.entries(TEST_INTENTS)) {
    for (const q of queries) check(q, intent);
}
for (const q of OUT_OF_SCOPE) {
    check(q, 'unknown');
}

let out = `\n\n=== FUZZER RESULTS ===\n`;
out += `Total: ${total} | Passed: ${passed} | Failed: ${failed.length}\n`;
if (failed.length > 0) {
    out += "Failures:\n";
    for (const f of failed) {
        out += ` - "${f.query}" => Expected: ${f.expected}, Got: ${f.actual}\n`;
        out += `   Tokens: ${f.tokens.join(', ')}\n`;
    }
}
fs.writeFileSync('fuzzer_results.txt', out);
console.log("Done. Wrote to fuzzer_results.txt");
