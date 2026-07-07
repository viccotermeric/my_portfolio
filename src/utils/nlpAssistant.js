import { portfolioData } from '../../portfolio-data.js';

// Levenshtein distance for spelling correction
function levenshteinDistance(s, t) {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
}

// Map of common acronyms/shorthand to full words
const SHORTHAND_MAP = {
  'u': 'you',
  'ur': 'your',
  'urself': 'yourself',
  'wht': 'what',
  'r': 'are',
  'tel': 'tell',
  'plz': 'please',
  'pls': 'please',
  'abut': 'about',
  'abt': 'about',
  'tech': 'technology'
};

const VOCABULARY = [
  'about', 'yourself', 'who', 'introduce', 'background', 'story', 'developer',
  'skills', 'technologies', 'technology', 'stack', 'languages', 'frameworks', 'tools', 'coding', 'react', 'python', 'know',
  'projects', 'built', 'show', 'apps', 'developed', 'building', 'interesting', 'proud', 'favorite',
  'education', 'study', 'educational', 'college', 'degree', 'academics', 'qualification', 'course', 'school', 'university', 'learning',
  'goals', 'future', 'plans', 'aiming', 'role', 'opportunities', 'seeking', 'aspirations', 'years', 'working', 'toward',
  'availability', 'hire', 'available', 'internships', 'open', 'work', 'job', 'companies',
  'contact', 'email', 'linkedin', 'github', 'location',
  'resume', 'download',
  'photo', 'picture', 'face', 'image', 'look'
];

export function correctToken(token) {
  // Direct shorthand mapping
  if (SHORTHAND_MAP[token]) {
    return SHORTHAND_MAP[token];
  }
  
  let bestMatch = token;
  let minDistance = 1000;
  
  for (const word of VOCABULARY) {
    const dist = levenshteinDistance(token, word);
    // Only corrects if it's very close or proportionally close
    const maxAllowedDistance = Math.min(2, Math.floor(word.length / 3));
    if (dist <= maxAllowedDistance && dist < minDistance) {
      minDistance = dist;
      bestMatch = word;
    }
  }
  return bestMatch;
}

const INTENT_KEYWORDS = {
  photo: { 'photo': 5, 'picture': 5, 'face': 5, 'image': 5, 'look': 3, 'see': 2 },
  resume: { 'resume': 5, 'download': 4, 'cv': 5 },
  contact: { 'contact': 5, 'email': 5, 'linkedin': 5, 'github': 5, 'location': 4 },
  availability: { 'availability': 5, 'hire': 5, 'available': 5, 'internships': 5, 'open': 4, 'job': 5, 'companies': 4, 'interested': 3 },
  goals: { 'goals': 5, 'future': 4, 'plans': 5, 'aiming': 4, 'seeking': 4, 'aspirations': 5, 'years': 4, 'working': 2, 'role': 3, 'five': 3, 'toward': 2, 'want': 2, 'where': 2 },
  education: { 'education': 8, 'study': 4, 'educational': 8, 'college': 5, 'degree': 5, 'academics': 8, 'qualification': 5, 'course': 4, 'school': 5, 'university': 5, 'pursuing': 3, 'learning': 3 },
  projects: { 'projects': 5, 'built': 4, 'show': 2, 'apps': 4, 'developed': 4, 'building': 4, 'applications': 5, 'made': 4, 'work': 3, 'best': 3 },
  skills: { 'skills': 8, 'technologies': 5, 'technology': 5, 'stack': 5, 'languages': 4, 'frameworks': 4, 'tools': 4, 'coding': 4, 'react': 5, 'python': 5, 'strengths': 4, 'know': 2 },
  about_me: { 'about': 1, 'yourself': 4, 'who': 2, 'you': 1, 'introduce': 4, 'background': 3, 'story': 4, 'developer': 3, 'am': 2, 'talking': 3, 'tell': 1, 'know': 1 }
};

function classifyIntent(correctedTokens) {
  const scores = {
    about_me: 0,
    skills: 0,
    projects: 0,
    education: 0,
    goals: 0,
    availability: 0,
    contact: 0,
    resume: 0,
    photo: 0
  };
  
  for (const token of correctedTokens) {
    for (const [intent, weights] of Object.entries(INTENT_KEYWORDS)) {
      if (weights[token]) {
        scores[intent] += weights[token];
      }
    }
  }
  
  // Specific exclusions: if someone asks a pure non-portfolio command like "write python code", negate
  if (correctedTokens.includes('solve') || correctedTokens.includes('generate') || (correctedTokens.includes('write') && correctedTokens.includes('code'))) {
      return 'unknown';
  }
  
  let bestIntent = null;
  let maxScore = 0;
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }
  
  // Require composite score >= 3
  return maxScore >= 3 ? bestIntent : 'unknown';
}

export function getAssistantResponse(userInput) {
  // Tokenize and clean punctuation
  const cleanInput = userInput.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = cleanInput.split(' ').filter(t => t.length > 0);
  
  const correctedTokens = tokens.map(correctToken);
  console.log('NLP Tokens:', correctedTokens);
  
  const intent = classifyIntent(correctedTokens);
  
  switch (intent) {
    case 'about_me':
      return "Hi, I'm Rishabh Trivedi.\n\n" + portfolioData.about;
      
    case 'skills':
      return "My setup:\n\n" + Object.entries(portfolioData.skills).map(([cat, skills]) => `- **${cat}**: ${skills.join(', ')}`).join('\n');
      
    case 'projects':
      return portfolioData.projects.map(p => `**${p.name}**\n${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}\n${p.desc ? p.desc[0] : (p.challenge || '')}`).join('\n\n');
      
    case 'education':
      return portfolioData.education.map(e => `**${e.degree}**\n${e.school}\n${e.details}`).join('\n\n');
      
    case 'goals':
      return "My ultimate goal is to become a Data Architect or robust Full Stack Engineer.\n\nI want to work in an environment where intelligence and infrastructure naturally overlap—whether that means designing resilient ETL pipelines, optimizing cloud data warehouses, or architecting backend services that don't crumble when the user base scales.";
      
    case 'availability':
      return "I am open to internships and full-time roles in scalable Data Architecture or Full-Stack Engineering. I am available to start immediately.";
      
    case 'contact':
      return `Email: ${portfolioData.contact.email}\nLinkedIn: ${portfolioData.contact.linkedin}\nGitHub: ${portfolioData.contact.github}\nLocation: Mumbai, India`;
      
    case 'resume':
      return `Downloading...<br>Direct link: <a href="/Rishabh_Trivedi_Resume.pdf" class="link">Rishabh Trivedi Resume</a>`;
      
    case 'photo':
      return `This is me:<br><br><img src="/profile.png" alt="Rishabh" style="width:180px; height:180px; object-fit:cover; object-position:center; border-radius:12%; border:2px solid var(--color-accent); box-shadow:0 0 15px rgba(0,0,0,0.5); display:block; margin: 10px 0;" /><br>`;
      
    default:
      return `Error: This assistant is a personalized portfolio assistant.

I can only answer questions related to:

• About Me
• Education
• Skills
• Projects
• Experience
• Certifications
• Achievements
• Goals
• Resume
• Contact Information
• Availability

Try asking:

Tell me about yourself

What technologies do you know

What projects have you built

What certifications do you have

What are your career goals`;
  }
}
