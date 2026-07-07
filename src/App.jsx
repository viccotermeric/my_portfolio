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
import { makeCommandEntry, makeComponentEntry, makeOutputEntry, parseMarkdown, sanitizeHtml } from './utils/terminalHelpers.js';
import { applyTheme, getSavedTheme } from './utils/themeUtils.js';
import { getAssistantResponse } from './utils/nlpAssistant.js';

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

  // Client-Side Security & Inspection Deterrence
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.metaKey && e.shiftKey && (e.key === 'C' || e.key === 'I'))
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    
    if (normalizedInput.startsWith('ping ')) {
      const target = normalizedInput.substring(5).trim();
      responseText = `PING ${target} (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.042 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.038 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.041 ms\n\n--- ${target} ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss`;
    } else if (normalizedInput === 'ping') {
      responseText = "Usage: ping <destination>";
    } else if (normalizedInput === 'ifconfig' || normalizedInput === 'if config' || normalizedInput === 'ip a' || normalizedInput === 'ipconfig' || normalizedInput === 'ip config') {
      responseText = `en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500\n\toptions=400<CHANNEL_IO>\n\tether b0:7d:64:5b:ea:11\n\tinet6 fe80::b27d:64ff:fe5b:ea11%en0 prefixlen 64 secured scopeid 0x4\n\tinet 192.168.1.104 netmask 0xffffff00 broadcast 192.168.1.255\n\tnd6 options=201<PERFORMNUD,DAD>\n\tmedia: autoselect\n\tstatus: active`;
    } else if (normalizedInput === 'netstat') {
      responseText = `Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)\ntcp4       0      0  192.168.1.104.55132    104.244.42.193.443     ESTABLISHED\ntcp4       0      0  192.168.1.104.55134    142.250.217.110.443    ESTABLISHED\ntcp4       0      0  192.168.1.104.55160    github.com.443         ESTABLISHED`;
    } else if (normalizedInput.startsWith('traceroute ')) {
      const target = normalizedInput.substring(11).trim();
      responseText = `traceroute to ${target} (93.184.216.34), 64 hops max, 52 byte packets\n 1  router.local (192.168.1.1)  2.132 ms  1.423 ms  1.332 ms\n 2  isp-gateway.local (10.0.0.1)  12.441 ms  13.220 ms  14.004 ms\n 3  core-router.isp.net (172.16.2.1)  24.112 ms  25.044 ms  26.772 ms\n 4  ${target} (93.184.216.34)  40.123 ms  41.521 ms  42.065 ms`;
    } else if (normalizedInput === 'traceroute') {
      responseText = "Usage: traceroute <host>";
    } else {
      responseText = getAssistantResponse(userInput);
      if (responseText.includes('Downloading...')) {
        triggerResumeDownload(RESUME_URL);
      }
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

    if (normalizedFullInput === 'theme --list' || normalizedFullInput === 'theme' || normalizedFullInput === 'thme') {
      recordCommand(userInput);
      setTerminalHistory((previous) => [
        ...previous,
        makeCommandEntry(userInput),
        makeOutputEntry(buildThemeListHtml()),
      ]);
      return;
    }

    const themeMatch = normalizedFullInput.match(/^(?:theme|thme)\s+(\S+)$/);
    if (themeMatch) {
      let themeKey = themeMatch[1];
      
      // Enforce lower bounds safety for exact template strings
      if (themeKey === 'default') themeKey = 'default';
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
    } else if (normalizedInput === 'email' || normalizedInput === 'contact') {
      commandEntries = [makeComponentEntry('contact')];
    } else if (normalizedInput === 'ls') {
      commandEntries = [makeOutputEntry(`portfolio-data.js&nbsp;&nbsp;&nbsp;README.md&nbsp;&nbsp;&nbsp;resume.pdf`)];
    } else if (normalizedInput === 'pwd') {
      commandEntries = [makeOutputEntry(`/home/rishabh/portfolio`)];
    } else if (normalizedInput === 'date') {
      commandEntries = [makeOutputEntry(new Date().toString())];
    } else if (normalizedInput === 'cd') {
      const dir = args[0] || '~';
      commandEntries = [makeOutputEntry(dir === '..' ? `bash: cd: permission denied` : `bash: cd: ${sanitizeHtml(dir)}: Not a directory`)];
    } else if (normalizedInput === 'echo') {
      commandEntries = [makeOutputEntry(sanitizeHtml(args.join(' ')))];
    } else if (normalizedInput === 'cat') {
      const file = args[0];
      if (!file) commandEntries = [makeOutputEntry(`usage: cat [file]`)];
      else if (file === 'README.md') commandEntries = [makeOutputEntry(`# Rishabh Trivedi Terminal<br><br>Welcome to my portfolio! Use 'help' to see commands.`)];
      else if (file.includes('resume')) commandEntries = [makeOutputEntry(`Error: Binary file. Please use 'download resume' command instead.`)];
      else if (file === 'portfolio-data.js') commandEntries = [makeOutputEntry(`cat: permission denied: portfolio-data.js is read-only.`)];
      else commandEntries = [makeOutputEntry(`cat: ${sanitizeHtml(file)}: No such file or directory`)];
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

  const handleSocialEmailClick = () => {
    if (terminalMode) {
      setTerminalHistory((prev) => [...prev, makeCommandEntry('email'), makeComponentEntry('contact')]);
       window.setTimeout(() => {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }, 50);
    } else {
      setActiveTab('Contact');
    }
  };

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
              onEmailClick={handleSocialEmailClick}
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
              if (event.target.tagName.toLowerCase() !== 'a' && !event.target.closest('.shell-demo, .thread-demo, .alloc-demo')) {
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
