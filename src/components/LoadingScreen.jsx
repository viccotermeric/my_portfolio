import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const codeLines = [
  'const developer = {',
  '  name: "Rishabh Trivedi",',
  '  role: "CE Student",',
  '  skills: ["Java", "React", "JS"],',
  '  open: true,',
  '};',
  '',
  'async function buildFuture() {',
  '  await learn(newTech);',
  '  return portfolio.launch();',
  '}',
];

function LoadingScreen() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (lineIndex < codeLines.length) {
      const t = setTimeout(() => setLineIndex(i => i + 1), 180);
      return () => clearTimeout(t);
    }
  }, [lineIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', width: '100%', height: '100%' }}>

      {/* Spinning neon ring logo */}
      <div className="relative flex items-center justify-center">
        <motion.div className="absolute w-24 h-24 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, var(--neon-blue), var(--neon-purple), var(--neon-cyan), transparent, var(--neon-blue))', filter: 'blur(1px)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--dark-bg)', border: '1px solid var(--glass-border)' }}>
          <span className="gradient-text font-mono font-bold text-2xl">&lt;/&gt;</span>
        </div>
      </div>

      {/* Code snippet */}
      <div className="terminal-window w-80">
        <div className="terminal-header">
          <div className="terminal-dot" style={{ background: '#ff5f57' }} />
          <div className="terminal-dot" style={{ background: '#febc2e' }} />
          <div className="terminal-dot" style={{ background: '#28c840' }} />
          <span className="ml-3 text-theme-subtle text-xs font-mono">loading.js</span>
        </div>
        <div className="terminal-body" style={{ minHeight: '220px' }}>
          {codeLines.slice(0, lineIndex).map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-xs leading-6"
              style={{
                color: line.includes('"') ? 'var(--neon-purple)'
                  : line.includes('async') || line.includes('const') || line.includes('return') || line.includes('await') ? 'var(--neon-blue)'
                  : 'var(--text-subtle)',
              }}>
              {line || '\u00a0'}
            </motion.div>
          ))}
          {lineIndex < codeLines.length && (
            <motion.span className="inline-block w-2 h-4"
              style={{ background: 'var(--neon-blue)' }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }} />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-56">
        <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))', boxShadow: '0 0 10px var(--accent-glow)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.6, ease: 'easeInOut' }} />
        </div>
        <p className="text-center text-theme-subtle text-xs font-mono mt-2 tracking-widest">Initializing...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
