import { portfolioData } from '../../portfolio-data.js';
import { CALENDLY_URL, COMMAND_GROUPS, COMMAND_MANUALS, COMMAND_NAMES, EMAIL_HREF, RESUME_URL, THEMES } from '../constants/terminal.js';
import { formatBreaks, makeOutputEntry } from './terminalHelpers.js';

export function getBootEntry() {
  return makeOutputEntry(
    `Von Neumann mapped the architecture.<br>` +
    `Codd structured the data.<br>` +
    `Torvalds proved it could be open.<br><br>` +
    `I'm just trying to make sure the pipelines don't collapse at midnight.<br>` +
    `So far: scalable MERN infrastructure, generative AI workflows, and entirely too much time spent figuring out why MySQL dropped a transaction under load.<br><br>` +
    `Type <span class="command">'help'</span> to see what's here, or ask me conversational questions directly.`
  );
}

export function buildHelpHtml() {
  return (
    `Here are the commands you can use to navigate my portfolio:<br><br>` +
    `<span class="command">about</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Learn about my background<br>` +
    `<span class="command">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- View my technical skills<br>` +
    `<span class="command">projects</span> &nbsp;&nbsp;&nbsp;- See the apps I've built<br>` +
    `<span class="command">experience</span> &nbsp;- View my work history<br>` +
    `<span class="command">education</span> &nbsp;&nbsp;- See my academic background<br>` +
    `<span class="command">contact</span> &nbsp;&nbsp;&nbsp;&nbsp;- Get my email and links<br>` +
    `<span class="command">resume</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Download my resume<br>` +
    `<span class="command">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal<br><br>` +
    `Or you can just ask me simple questions in plain English like: <i>"Who are you?"</i>, <i>"What's your name?"</i>, or <i>"What is your tech stack?"</i>`
  );
}

export function buildManPageHtml(command) {
  const manual = COMMAND_MANUALS[command];
  if (!manual) {
    return `No manual entry for <span class="command">${command}</span>.<br>Try <span class="command">help</span>.`;
  }
  return `<div class="skills-category-title">NAME</div><span class="command">${command}</span> - ${manual.summary}<br><br><div class="skills-category-title">SYNOPSIS</div><span class="command">${manual.usage}</span><br><br><div class="skills-category-title">DESCRIPTION</div>${manual.description}`;
}

function buildAboutHtml() {
  return `<div class="skills-category-title">About Me</div>${formatBreaks(portfolioData.about)}`;
}

export function buildThemeListHtml() {
  const rows = Object.entries(THEMES).map(([key, theme]) => `<span class="command">${key}</span>${'&nbsp;'.repeat(Math.max(1, 14 - key.length))}- ${theme.name}`).join('<br>');
  return `<div class="skills-category-title">Available Themes</div>${rows}<br><br>Type <span class="command">theme [name]</span> to apply.`;
}

export function buildThemeAppliedHtml(themeKey) {
  const theme = THEMES[themeKey];
  return `Theme set to <span class="command">${theme.name}</span>.`;
}

function buildSysHelpHtml() {
  return `<span class="command">sys --status</span> - live terminal diagnostics`;
}

export function buildDiagnosticsHtml(stats) {
  return `<div class="skills-category-title">[DIAGNOSTICS]</div><pre class="log-entry">Status: OK</pre>`;
}

function buildLogHtml() {
  return `<div class="skills-category-title">[SYSTEM LOG]</div><pre class="log-entry">No active background processes.</pre>`;
}

function buildVersionHtml() {
  return `<div class="skills-category-title">System Version</div><pre class="log-entry">Version 1.0.0\nOperator: Rishabh Trivedi</pre>`;
}

function buildAvailabilityHtml() {
  return `<div class="skills-category-title">Availability</div>Open to Software Engineering roles.`;
}

function buildEducationHtml() {
  return `<div class="skills-category-title">Education</div>` + portfolioData.education.map(e => `<span class="command">${e.school}</span><br>${e.degree}<br><i>${e.details}</i>`).join('<br><br>');
}

function buildExperienceHtml() {
  return `<div class="skills-category-title">Experience</div>` + portfolioData.experience.map(e => `<span class="command">${e.role}</span> @ ${e.company} (${e.period})<br>${e.desc.join('<br>')}`).join('<br><br>');
}

function buildProjectsHtml() {
  let html = `<div class="skills-category-title">Projects</div>`;
  html += portfolioData.projects.map(p => `<span class="command">projects ${p.slug}</span><br>${p.tech}`).join('<br><br>');
  return html + `<br><br>Type <span class="command">projects [name]</span> for full breakdown.`;
}

function buildProjectDetailHtml(name) {
  const p = portfolioData.projects.find(x => x.slug === name);
  if (p) {
    let html = `<div class="skills-category-title">${p.name}</div><span class="command">Stack:</span> ${p.tech}<br><br>${p.desc.join('<br>')}<br><br>GitHub: <a href="${p.url}" target="_blank" class="link">${p.url}</a>`;
    if (p.liveUrl) html += `<br>Live: <a href="${p.liveUrl}" target="_blank" class="link">${p.liveUrl}</a>`;
    if (p.screenshots && p.screenshots.length > 0) {
        html += `<br><br><span class="command">Screenshots</span><br><div class="project-screenshots">`;
        html += p.screenshots.map(src => `<img src="` + src + `" alt="" class="project-screenshot" loading="lazy">`).join('');
        html += `</div>`;
    }
    return html;
  }
  return `<span class="error">Project not found:</span> <span class="command">${name}</span>`;
}

function buildSkillsHtml() {
  let html = '<div class="skills-container"><div class="skills-category-title">Skills</div>';
  Object.entries(portfolioData.skills).forEach(([c, s]) => {
    html += `<div class="skills-subcategory-title">${c}</div><div class="skills-grid">`;
    s.forEach(skill => { html += `<div class="skill-box">${skill}</div>`; });
    html += '</div>';
  });
  return html + '</div>';
}

function buildLanguagesHtml() {
  return `<div class="skills-category-title">Languages</div>` + portfolioData.languages.map(l => `<span class="command">${l.lang}:</span> ${l.proficiency}`).join('<br>');
}

function buildResumeHtml() {
  return `<div class="skills-category-title">Resume</div>Access my full resume here: <a href="${RESUME_URL}" class="link">Resume.pdf</a>`;
}

function buildContactHtml() {
  return `<div class="skills-category-title">Contact</div>Email: <a href="${EMAIL_HREF}" class="link">${portfolioData.contact.email}</a><br>LinkedIn: <a href="${portfolioData.contact.linkedin}" class="link">${portfolioData.contact.linkedin}</a><br>GitHub: <a href="${portfolioData.contact.github}" class="link">${portfolioData.contact.github}</a>`;
}

function buildSudoHireHtml() {
  return `[sudo] password for hiring_manager: ••••••••<br><br>Available immediately.<br>Resume: <a href="${RESUME_URL}" target="_blank" rel="noreferrer" class="link">Resume.pdf</a>`;
}

function buildAllHtml() {
  return [buildAboutHtml(), buildEducationHtml(), buildExperienceHtml(), buildProjectsHtml(), buildSkillsHtml(), buildResumeHtml(), buildContactHtml()].join('<br><br>');
}

export function getCommandEntries(command) {
  if (command.startsWith('projects ')) {
    return [makeOutputEntry(buildProjectDetailHtml(command.slice('projects '.length).trim()))];
  }
  switch (command) {
    case 'terminal --version': return [makeOutputEntry(buildVersionHtml())];
    case 'availability': return [makeOutputEntry(buildAvailabilityHtml())];
    case 'sys --help': return [makeOutputEntry(buildSysHelpHtml())];
    case 'diagnostics': return [makeOutputEntry(`<div class="skills-category-title">[DIAGNOSTICS]</div>Run <span class="command">sys --status</span>`)];
    case 'help': return [makeOutputEntry(buildHelpHtml())];
    case 'about': return [makeOutputEntry(buildAboutHtml())];
    case 'log': return [makeOutputEntry(buildLogHtml())];
    case 'education': return [makeOutputEntry(buildEducationHtml())];
    case 'experience': return [makeOutputEntry(buildExperienceHtml())];
    case 'projects': return [makeOutputEntry(buildProjectsHtml())];
    case 'skills': return [makeOutputEntry(buildSkillsHtml())];
    case 'resume': return [makeOutputEntry(buildResumeHtml())];
    case 'contact': return [makeOutputEntry(buildContactHtml())];
    case 'contact --schedule': return [makeOutputEntry(`Book time here: <a href="${CALENDLY_URL}" target="_blank" class="link">${CALENDLY_URL}</a>`)];
    case 'creator': return [makeOutputEntry(`<div class="creator-caption">Rishabh Trivedi — Software &amp; AI Engineer</div>`)];
    case 'sudo hire': return [makeOutputEntry(buildSudoHireHtml())];
    case 'all': return [makeOutputEntry(buildAllHtml())];
  }
}
