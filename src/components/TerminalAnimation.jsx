import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const commands = [
  { prompt: '~', cmd: 'whoami',              delay: 0,    output: 'rishabh-trivedi',                                         outputColor: '#00d4ff' },
  { prompt: '~', cmd: 'cat skills.txt',      delay: 800,  output: 'Java | JavaScript | React | HTML | CSS | MySQL | Git',    outputColor: '#9b59b6' },
  { prompt: '~', cmd: 'ls projects/',        delay: 1800, output: 'persian-darbar/   veda-ai/   portfolio/',                 outputColor: '#00ffaa' },
  { prompt: '~', cmd: 'echo $STATUS',        delay: 2700, output: '✓ Available for internships — Open to opportunities!',   outputColor: '#00d4ff' },
  { prompt: '~', cmd: 'git log --oneline -1',delay: 3600, output: 'a4f8c2d (HEAD) feat: uploaded portfolio v2.0',           outputColor: '#f7df1e' },
];

function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState('typing');
  const [restart, setRestart] = useState(0);
  const charRef = useRef(0);

  useEffect(() => {
    setVisibleLines([]); setTypingIndex(0); setTypedText(''); setPhase('typing'); charRef.current = 0;
  }, [restart]);

  useEffect(() => {
    if (typingIndex >= commands.length) {
      const t = setTimeout(() => setRestart(r => r + 1), 3500);
      return () => clearTimeout(t);
    }
    const cmd = commands[typingIndex];
    if (phase === 'typing') {
      const startTyping = setTimeout(() => {
        const fullCmd = cmd.cmd;
        const interval = setInterval(() => {
          charRef.current += 1;
          setTypedText(fullCmd.slice(0, charRef.current));
          if (charRef.current >= fullCmd.length) { clearInterval(interval); setPhase('output'); }
        }, 42);
        return () => clearInterval(interval);
      }, typingIndex === 0 ? cmd.delay : 0);
      return () => clearTimeout(startTyping);
    }
    if (phase === 'output') {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, { ...cmd, typedCmd: cmd.cmd }]);
        setTypedText(''); charRef.current = 0; setTypingIndex(i => i + 1); setPhase('typing');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [typingIndex, phase, restart]);

  return (
    <div className="terminal-window w-full max-w-xl mx-auto">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#ff5f57' }} />
        <div className="terminal-dot" style={{ background: '#febc2e' }} />
        <div className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-3 text-theme-subtle text-xs font-mono">rishabh@portfolio:~</span>
      </div>
      <div className="terminal-body min-h-[200px]">
        {visibleLines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2">
              <span className="text-accent-main">$ </span>
              <span className="text-theme-muted">{line.typedCmd}</span>
            </div>
            <div style={{ color: line.outputColor }} className="pl-4 mb-1">{line.output}</div>
          </motion.div>
        ))}
        {typingIndex < commands.length && (
          <div className="flex items-center gap-2">
            <span className="text-accent-main">$ </span>
            <span className="text-theme-muted">{typedText}</span>
            <motion.span className="inline-block w-2 h-4 ml-0.5 align-middle bg-accent-main" 
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TerminalAnimation;
