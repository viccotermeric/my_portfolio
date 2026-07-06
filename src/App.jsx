import { useEffect, useRef, useState } from 'react';

function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    const bootLogs = [
        "BIOS Date 06/13/2026",
        "Loading Data Architecture Modules... [OK]",
        "Initializing cognitive array (Rishabh::Engine)... [OK]",
        "Routing terminal interface...",
        "Boot complete."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < bootLogs.length) {
            setLines(prev => [...prev, bootLogs[currentIndex]]);
            currentIndex++;
        } else {
            clearInterval(interval);
            setTimeout(onComplete, 250);
        }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
      <div className="terminal-container w-full max-w-4xl mx-auto h-screen flex flex-col justify-center items-start p-8 z-50">
          <div id="scanlines"></div>
          <div>
              {lines.map((line, i) => (
                 <div key={i} className="mb-2 font-mono text-sm animate-pulse" style={{ color: 'var(--color-accent)' }}>
                    {line}
                 </div>
              ))}
              <div className="inline-block w-2 h-4 animate-ping" style={{ backgroundColor: 'var(--color-accent)' }}></div>
          </div>
      </div>
  );
}

import { COMMAND_NAMES, PROMPT_TEXT, RESUME_URL, THEMES } from './constants/terminal.js';
import { portfolioData } from '../portfolio-data.js';
import { GuiView } from './components/GuiView.jsx';
import { SocialIcons } from './components/SocialIcons.jsx';
import { TerminalEntry } from './components/TerminalEntry.jsx';
import { useAnimatedNetwork } from './hooks/useAnimatedNetwork.js';
import { useAudio } from './hooks/useAudio.js';
import { useIpWeather } from './hooks/useIpWeather.js';
import {
  getBootEntry,
  buildDiagnosticsHtml,
  buildManPageHtml,
  buildThemeAppliedHtml,
  buildThemeListHtml,
  getCommandEntries,
} from './utils/terminalContent.js';
import { makeCommandEntry, makeComponentEntry, makeOutputEntry, parseMarkdown } from './utils/terminalHelpers.js';
import { applyTheme, getSavedTheme } from './utils/themeUtils.js';

function getSharedPrefix(matches) {
  return matches.reduce((prefix, command) => {
    let nextPrefix = prefix;
    while (!command.startsWith(nextPrefix) && nextPrefix) {
      nextPrefix = nextPrefix.slice(0, -1);
    }
    return nextPrefix;
  }, matches[0]);
}

function triggerResumeDownload(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'viccotermeric_Resume.pdf';
  link.target = '_blank';
  link.rel = 'noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  const [terminalHistory, setTerminalHistory] = useState(() => [getBootEntry()]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [currentTheme, setCurrentTheme] = useState(() => getSavedTheme());
  const [terminalMode, setTerminalMode] = useState(true);
  const [activeTab, setActiveTab] = useState('About');
  const [showGuiHint, setShowGuiHint] = useState(() => localStorage.getItem('guiHintSeen') !== 'true');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const sessionStartedAtRef = useRef(Date.now());
  const currentYear = new Date().getFullYear();
  const weatherText = useIpWeather();
  const { initAudio, playSound, playTypingSound } = useAudio();

  const footerHtml = `&copy; ${currentYear} Rishabh Trivedi. All rights reserved. | <a href="${RESUME_URL}" class="link">View Resume</a>`;
  const guiFooterHtml = `&copy; ${currentYear} Rishabh Trivedi. All rights reserved. | <a href="${RESUME_URL}" class="link">View Full Resume</a>`;

  useAnimatedNetwork(canvasRef);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    applyTheme(currentTheme, darkMode);
  }, [currentTheme, darkMode]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (terminalMode) {
      inputRef.current?.focus();
    }
  }, [terminalMode]);

  useEffect(() => {
    if (!showGuiHint) return undefined;
    const timeout = setTimeout(() => {
      setShowGuiHint(false);
      localStorage.setItem('guiHintSeen', 'true');
    }, 10000);
    return () => clearTimeout(timeout);
  }, [showGuiHint]);

  useEffect(() => {
    if (terminalMode && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory, terminalMode]);

  useEffect(() => {
    const handleWindowKeyDown = (event) => {
      if (event.metaKey || event.altKey || !terminalMode) {
        return;
      }

      if (event.ctrlKey) {
        return;
      }

      if (document.activeElement === inputRef.current) {
        return;
      }

      // Don't steal focus if user is typing in a nested demo
      if (document.activeElement?.closest('.shell-demo, .thread-demo, .alloc-demo')) {
        return;
      }

      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [terminalMode]);

  async function requestAssistant(userInput) {
    const requestId = crypto.randomUUID();
    
    setTerminalHistory((previous) => [
      ...previous,
      { id: requestId, type: 'output', html: '' }
    ]);

    const normalizedInput = userInput.toLowerCase().trim();
    let responseText = '';
    
    if (
      normalizedInput.includes('who are you') || 
      normalizedInput.includes('about') || 
      normalizedInput.includes('yourself') ||
      normalizedInput.includes('bio') ||
      normalizedInput.includes('name') ||
      normalizedInput === 'hi' ||
      normalizedInput === 'hello' ||
      normalizedInput.includes('hey')
    ) {
      responseText = "Hi, I'm Rishabh Trivedi.\n\n" + portfolioData.about;
    } else if (normalizedInput.includes('skill') || normalizedInput.includes('technolog') || normalizedInput.includes('tech stack') || normalizedInput.includes('learning')) {
      responseText = "My setup:\n\n" + Object.entries(portfolioData.skills).map(([cat, skills]) => `- **${cat}**: ${skills.join(', ')}`).join('\n');
    } else if (normalizedInput.includes('project')) {
      responseText = portfolioData.projects.map(p => `**${p.name}**\n${p.tech}\n${p.desc[0]}`).join('\n\n');
    } else if (normalizedInput.includes('experience')) {
      responseText = portfolioData.experience.map(e => `**${e.role}** at ${e.company} (${e.period})\n${e.desc[0]}`).join('\n\n');
    } else if (normalizedInput.includes('education')) {
      responseText = portfolioData.education.map(e => `**${e.degree}**\n${e.school}\n${e.details}`).join('\n\n');
    } else if (normalizedInput.includes('achievement') || normalizedInput.includes('certification')) {
      responseText = "My recent focus has been building functional projects rather than collecting certifications, but my academic track gives me a strong technical base in data structures and systems.";
    } else if (normalizedInput.includes('resume')) {
      triggerResumeDownload(RESUME_URL);
      responseText = `Downloading...<br>Direct link: <a href="${RESUME_URL}" class="link">Rishabh Trivedi Resume</a>`;
    } else if (normalizedInput.includes('contact') || normalizedInput.includes('github') || normalizedInput.includes('linkedin') || normalizedInput.includes('email') || normalizedInput.includes('location') || normalizedInput.includes('hire')) {
      responseText = `Email: ${portfolioData.contact.email}\nLinkedIn: ${portfolioData.contact.linkedin}\nGitHub: ${portfolioData.contact.github}\nLocation: Mumbai, India`;
    } else if (normalizedInput.includes('why') && (normalizedInput.includes('choose') || normalizedInput.includes('data') || normalizedInput.includes('tech') || normalizedInput.includes('coding') || normalizedInput.includes('field'))) {
      responseText = `I didn't just want to build frontends that looked pretty. I wanted to understand how the data driving them actually moved.\n\nWorking on projects like Persian Darbar and VEDA AI taught me that the hardest problems aren't usually UI bugs—they're race conditions, data inconsistencies, and slow queries. I chose this field because I care about the infrastructure underneath the application. I want to build systems that scale reliably under pressure.`;
    } else if (normalizedInput.includes('want to be') || normalizedInput.includes('future') || normalizedInput.includes('goal') || normalizedInput.includes('looking for')) {
      responseText = `My ultimate goal is to become a Data Architect or robust Full Stack Engineer.\n\nI want to work in an environment where intelligence and infrastructure naturally overlap—whether that means designing resilient ETL pipelines, optimizing cloud data warehouses, or architecting backend services that don't crumble when the user base scales.`;
    } else if (normalizedInput.includes('hobby') || normalizedInput.includes('fun') || normalizedInput.includes('free time')) {
      responseText = `Beyond building predictive models and fixing pipeline routing, I enjoy diving into hackathons, testing out new backend architectures, and continually challenging myself to learn lower-level systems. I believe that understanding the full stack—from database to browser—is the best way to spend free time.`;
    } else {
      responseText = "ERROR: Unknown command.\n\nThis terminal only supports questions related to this portfolio.\n\nType \"help\" to see available commands.";
    }

    let parsedHtml = responseText;
    if (!responseText.includes('<br>')) {
        parsedHtml = parseMarkdown(responseText);    
    }
    
    const chars = parsedHtml.split('');
    let currentHtml = '';
    let chunkSize = 4;

    for (let i = 0; i < chars.length; i += chunkSize) {
        currentHtml += chars.slice(i, i + chunkSize).join('');
        setTerminalHistory((previous) =>
            previous.map((entry) => (entry.id === requestId ? { ...entry, html: currentHtml } : entry))
        );
        playTypingSound();
        await new Promise(r => setTimeout(r, 10)); 
    }
    
    setTerminalHistory((previous) =>
        previous.map((entry) => (entry.id === requestId ? { ...entry, html: parsedHtml } : entry))
    );
  }

  function getRuntimeDiagnostics() {
    // performance.memory is a non-standard, Chrome-only API; undefined elsewhere.
    const memory = performance.memory;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const uptimeSeconds = Math.round((Date.now() - sessionStartedAtRef.current) / 1000);

    return {
      timestamp: new Date(),
      uptimeSeconds,
      memory: memory
        ? {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          }
        : null,
      connection: connection
        ? {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
          }
        : null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      location: {
        host: window.location.host || 'local file',
        protocol: window.location.protocol,
      },
      mode: terminalMode ? 'terminal' : 'gui',
      theme: THEMES[currentTheme]?.name || currentTheme,
      colorScheme: darkMode ? 'dark' : 'light',
      historyEntries: terminalHistory.length,
      commandHistoryEntries: commandHistory.length,
          };
  }

  function getDiagnosticsEntry() {
    return makeOutputEntry(buildDiagnosticsHtml(getRuntimeDiagnostics()));
  }

  function handleSysCommand(subcommand) {
    const normalizedSubcommand = subcommand.trim().toLowerCase();

    if (normalizedSubcommand === '--status') {
      return [getDiagnosticsEntry()];
    }

    if (normalizedSubcommand === '--alloc') {
      return [makeComponentEntry('alloc')];
    }

    if (normalizedSubcommand === '--threads') {
      return [makeComponentEntry('threads')];
    }

    if (normalizedSubcommand === '--shell') {
      return [makeComponentEntry('shell')];
    }

    if (!normalizedSubcommand || normalizedSubcommand === '--help') {
      return getCommandEntries('sys --help');
    }

    return getCommandEntries(`sys ${normalizedSubcommand}`);
  }

  function recordCommand(userInput) {
    setCommandHistory((previous) => [userInput, ...previous]);
    setHistoryIndex(-1);
    setInputValue('');
  }

  function handleSubmit(rawInput = inputValue) {
    const userInput = rawInput.trim();
    if (!userInput) {
      return;
    }

    initAudio();
    playSound(440, 'square', 0.08, 0.2);

    const normalizedFullInput = userInput.toLowerCase();
    const [commandToken, ...args] = userInput.split(/\s+/);
    const normalizedInput = COMMAND_NAMES.includes(normalizedFullInput) ? normalizedFullInput : commandToken.toLowerCase();
    let commandEntries;

    if (normalizedFullInput === 'diagnostics') {
      recordCommand(userInput);
      setTerminalHistory((previous) => [...previous, makeCommandEntry(userInput), getDiagnosticsEntry()]);
      return;
    }

    if (normalizedFullInput === 'download resume') {
      triggerResumeDownload(RESUME_URL);
      recordCommand(userInput);
      setTerminalHistory((previous) => [
        ...previous,
        makeCommandEntry(userInput),
        makeOutputEntry(
          `Downloading...<br>Direct link: <a href="${RESUME_URL}" class="link">viccotermeric_Resume.pdf</a>`
        ),
      ]);
      return;
    }

    if (normalizedFullInput === 'theme --list') {
      recordCommand(userInput);
      setTerminalHistory((previous) => [
        ...previous,
        makeCommandEntry(userInput),
        makeOutputEntry(buildThemeListHtml()),
      ]);
      return;
    }

    const themeMatch = normalizedFullInput.match(/^theme\s+(\S+)$/);
    if (themeMatch) {
      const themeKey = themeMatch[1];
      recordCommand(userInput);

      if (THEMES[themeKey]) {
        setCurrentTheme(themeKey);
        setTerminalHistory((previous) => [
          ...previous,
          makeCommandEntry(userInput),
          makeOutputEntry(buildThemeAppliedHtml(themeKey)),
        ]);
      } else {
        setTerminalHistory((previous) => [
          ...previous,
          makeCommandEntry(userInput),
          makeOutputEntry(
            `Theme <span class="command">${themeKey}</span> not found.<br>` +
              `Type <span class="command">theme --list</span> to see available themes.`
          ),
        ]);
      }
      return;
    }

    if (/^sys(?:\s|$)/.test(normalizedFullInput)) {
      commandEntries = handleSysCommand(normalizedFullInput.slice(3).trim());
    } else if (/^projects(?:\s|$)/.test(normalizedFullInput)) {
      commandEntries = getCommandEntries(normalizedFullInput);
    } else if (normalizedInput === 'man') {
      const joinedSubject = args.join(' ').trim().toLowerCase();
      const subject = joinedSubject || args[0]?.toLowerCase();
      commandEntries = [makeOutputEntry(buildManPageHtml(subject || 'man'))];
    } else {
      commandEntries = getCommandEntries(normalizedInput);
    }

    recordCommand(userInput);

    if (normalizedInput === 'clear') {
            setTerminalHistory([getBootEntry()]);
      return;
    }

    setTerminalHistory((previous) => [...previous, makeCommandEntry(userInput), ...(commandEntries ?? [])]);

    if (!commandEntries) {
      // Don't bill API quota on obvious non-questions: HTML tags, single chars, pure symbols
      const looksLikeQuestion = userInput.trim().length > 3 && !/^<[^>]+>/.test(userInput) && /[a-zA-Z]/.test(userInput);
      if (looksLikeQuestion) {
        void requestAssistant(userInput);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          makeOutputEntry(`<span style="color:var(--color-error)">command not found: ${userInput.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span> — type <span class="command">help</span> to see available commands.`),
        ]);
      }
    }

  }

  function handleKeyDown(event) {
    initAudio();

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();



      if (inputValue) {
        setTerminalHistory((previous) => [
          ...previous,
          makeCommandEntry(inputValue),
          makeOutputEntry('<span class="command">^C</span>'),
        ]);
        setCommandHistory((previous) => [inputValue, ...previous]);
      } else {
        setTerminalHistory((previous) => [...previous, makeOutputEntry('<span class="command">^C</span>')]);
      }

      setInputValue('');
      setHistoryIndex(-1);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const trimmedInput = inputValue.trim().toLowerCase();
      const [commandToken, ...args] = trimmedInput.split(/\s+/);

      if (commandToken === 'man') {
        const subjectInput = args.join(' ').trim();

        if (!subjectInput) {
          setInputValue('man ');
          return;
        }

        const subjectMatches = COMMAND_NAMES.filter((command) => command.startsWith(subjectInput));

        if (subjectMatches.length === 1) {
          setInputValue(`man ${subjectMatches[0]}`);
        } else if (subjectMatches.length > 1) {
          setInputValue(`man ${getSharedPrefix(subjectMatches)}`);
          setTerminalHistory((previous) => [
            ...previous,
            makeOutputEntry(subjectMatches.map((command) => `<span class="command">${command}</span>`).join('&nbsp;&nbsp;')),
          ]);
        }
        return;
      }

      if (commandToken === 'theme') {
        const subjectInput = args.join(' ').trim().toLowerCase();
        const themeOptions = ['--list', ...Object.keys(THEMES)];

        if (!subjectInput) {
          setInputValue('theme ');
          return;
        }

        const subjectMatches = themeOptions.filter((option) => option.startsWith(subjectInput));

        if (subjectMatches.length === 1) {
          setInputValue(`theme ${subjectMatches[0]}`);
        } else if (subjectMatches.length > 1) {
          setInputValue(`theme ${getSharedPrefix(subjectMatches)}`);
          setTerminalHistory((previous) => [
            ...previous,
            makeOutputEntry(subjectMatches.map((option) => `<span class="command">${option}</span>`).join('&nbsp;&nbsp;')),
          ]);
        }
        return;
      }

      if (commandToken === 'contact') {
        const subjectInput = args.join(' ').trim().toLowerCase();
        const contactOptions = ['--schedule'];

        if (!subjectInput) {
          setInputValue('contact ');
          return;
        }

        const subjectMatches = contactOptions.filter((option) => option.startsWith(subjectInput));

        if (subjectMatches.length === 1) {
          setInputValue(`contact ${subjectMatches[0]}`);
        } else if (subjectMatches.length > 1) {
          setInputValue(`contact ${getSharedPrefix(subjectMatches)}`);
          setTerminalHistory((previous) => [
            ...previous,
            makeOutputEntry(subjectMatches.map((option) => `<span class="command">contact ${option}</span>`).join('&nbsp;&nbsp;')),
          ]);
        }
        return;
      }

      if (commandToken === 'projects') {
        const projectNames = portfolioData.projects.map((project) => project.slug);
        const subjectInput = args.join(' ').trim().toLowerCase();

        if (!subjectInput) {
          setInputValue('projects ');
          return;
        }

        const subjectMatches = projectNames.filter((name) => name.startsWith(subjectInput));

        if (subjectMatches.length === 1) {
          setInputValue(`projects ${subjectMatches[0]}`);
        } else if (subjectMatches.length > 1) {
          setInputValue(`projects ${getSharedPrefix(subjectMatches)}`);
          setTerminalHistory((previous) => [
            ...previous,
            makeOutputEntry(
              subjectMatches.map((name) => `<span class="command">projects ${name}</span>`).join('&nbsp;&nbsp;')
            ),
          ]);
        }
        return;
      }

      const matches = COMMAND_NAMES.filter((command) => command.startsWith(trimmedInput));

      if (matches.length === 1) {
        setInputValue(matches[0]);
      } else if (matches.length > 1) {
        setInputValue(getSharedPrefix(matches));
        setTerminalHistory((previous) => [
          ...previous,
          makeOutputEntry(matches.map((command) => `<span class="command">${command}</span>`).join('&nbsp;&nbsp;')),
        ]);
      }
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHistoryIndex((currentIndex) => {
        if (currentIndex < commandHistory.length - 1) {
          const nextIndex = currentIndex + 1;
          setInputValue(commandHistory[nextIndex]);
          return nextIndex;
        }

        return currentIndex;
      });
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHistoryIndex((currentIndex) => {
        if (currentIndex > 0) {
          const nextIndex = currentIndex - 1;
          setInputValue(commandHistory[nextIndex]);
          return nextIndex;
        }

        setInputValue('');
        return -1;
      });
      return;
    }

    playSound(880, 'sine', 0.08, 0.2);
  }


  return (
    <>
      <canvas id="network-canvas" ref={canvasRef}></canvas>
      <div id="scanlines"></div>

      {isBooting ? (
        <BootSequence onComplete={() => setIsBooting(false)} />
      ) : (
        <div className="terminal-container w-full max-w-4xl mx-auto">
        <div id="contact-icons-wrapper">
          <div id="contact-icons-container">
              <div id="status-bar" className="flex items-center gap-4 ml-4">
                <span id="site-name">Rishabh Trivedi</span>
                <div id="clock">{clock}</div>
                <div id="weather-display" className="flex items-center gap-2" title="Your Local Weather">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 17a4 4 0 1 1 0-8 5 5 0 0 1 10 0 4 4 0 1 1 0 8H7z" />
                </svg>
                  <span id="weather-text">{weatherText}</span>
                </div>
              </div>

            <SocialIcons
              darkMode={darkMode}
              onToggleTheme={() => setDarkMode((current) => !current)}
              onToggleView={() => {
                setTerminalMode((current) => !current);
                setShowGuiHint(false);
                localStorage.setItem('guiHintSeen', 'true');
              }}
              terminalMode={terminalMode}
              highlightToggle={showGuiHint}
            />
          </div>
        </div>

        {terminalMode ? (
          <div
            id="terminal"
            ref={terminalRef}
            className="w-full rounded-lg shadow-2xl shadow-stone-500/20 p-4 flex flex-col"
            onClick={(event) => {
              initAudio();
              if (event.target.tagName.toLowerCase() !== 'a') {
                inputRef.current?.focus();
              }
            }}
          >
            <div id="output" className="flex-grow" aria-live="polite" aria-atomic="false" aria-label="Terminal output">
              {terminalHistory.map((entry) => (
                <TerminalEntry
                  key={entry.id}
                  entry={entry}
                  onShellExit={() => {
                    window.setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }}
                />
              ))}
            </div>

            <div id="input-line" className="prompt-line-wrapper mt-4 flex-shrink-0">
              <span className="prompt-live">{PROMPT_TEXT}</span>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                spellCheck="false"
                autoComplete="off"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div id="footer" dangerouslySetInnerHTML={{ __html: footerHtml }} />
          </div>
        ) : (
          <GuiView activeTab={activeTab} onTabChange={setActiveTab} footerHtml={guiFooterHtml} />
        )}
      </div>
      )}
    </>
  );
}
