import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
];

// Smooth scroll with navbar offset so section appears properly in view
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 70; // navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

function Navbar({ scrollY }) {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const isScrollingManually = useRef(false);
  const scrollTimeout = useRef(null);
  const scrolled = scrollY > 40;

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const ids = navLinks.map(l => l.id);
    const handleScroll = () => {
      if (isScrollingManually.current) return;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (id) => { 
    setMenuOpen(false); 
    setActiveSection(id);
    
    isScrollingManually.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isScrollingManually.current = false;
    }, 1000);
    
    scrollTo(id); 
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
        transition: 'background 0.2s, backdrop-filter 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => go('home')}
          className="font-mono font-bold text-xl gradient-text"
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        >
          &lt;Dev/&gt;
        </motion.button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className="relative px-3.5 py-2 text-sm font-medium transition-colors duration-150"
                style={{ color: isActive ? 'var(--neon-blue)' : 'var(--nav-text)' }}
              >
                <span className="relative z-10 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors duration-150">
                  {link.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-1 left-3 right-3 h-px rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))' }}
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          <motion.button
            onClick={() => go('contact')}
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', boxShadow: '0 10px 20px var(--accent-glow)' }}
            whileHover={{ scale: 1.06, boxShadow: '0 15px 30px var(--accent-glow)' }}
            whileTap={{ scale: 0.94 }}
          >
            Hire Me
          </motion.button>
          
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-full relative overflow-hidden"
            style={{ 
              background: 'var(--dark-bg)',
              color: theme === 'light' ? '#f59e0b' : 'var(--neon-blue)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-card)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme === 'light' ? 'sun' : 'moon'}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-center justify-center w-5 h-5"
              >
                {theme === 'light' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <motion.button
            onClick={toggleTheme}
            className="p-1.5 rounded-full relative overflow-hidden flex items-center justify-center w-8 h-8"
            style={{ 
              background: 'var(--dark-bg)',
              color: theme === 'light' ? '#f59e0b' : 'var(--neon-blue)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-card)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme === 'light' ? 'sun' : 'moon'}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {theme === 'light' ? <FiSun size={16} /> : <FiMoon size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            className="p-2 text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.88 }}
          >
          <AnimatePresence mode="wait">
            {menuOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}><FiX size={22} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}><FiMenu size={22} /></motion.span>
            }
          </AnimatePresence>
        </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.92 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="md:hidden mx-3 mb-3 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1"
              style={{ background: 'var(--nav-menu-bg)', border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,212,255,0.12)'}`, backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => go(link.id)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: activeSection === link.id ? 'var(--neon-blue)' : 'var(--nav-text)', background: activeSection === link.id ? 'var(--section-bg-alt)' : 'transparent' }}>
                  {link.label}
                </button>
              ))}
              <button onClick={() => go('contact')}
                className="mt-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}>
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
