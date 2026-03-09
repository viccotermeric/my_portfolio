import { useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiChevronDown, FiExternalLink } from 'react-icons/fi';

// Neon particle canvas — cyan/purple theme
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const isLight = document.documentElement.classList.contains('light');
    const COLORS = isLight 
      ? ['rgba(59,130,246,', 'rgba(139,92,246,', 'rgba(16,185,129,'] // Elegant Light Tones
      : ['rgba(0,212,255,', 'rgba(155,89,182,', 'rgba(0,255,170,'];
    const count = window.innerWidth < 768 ? 50 : 100;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.6,
      alpha: isLight ? Math.random() * 0.3 + 0.1 : Math.random() * 0.5 + 0.2, // Softer in light mode
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    canvas.addEventListener('mouseleave', () => { mouseRef.current = { x: -9999, y: -9999 }; });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) { p.vx += (dx / d) * 0.3; p.vy += (dy / d) * 0.3; }
        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > 1.8) { p.vx = (p.vx / sp) * 1.8; p.vy = (p.vy / sp) * 1.8; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dd = Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
          if (dd < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `${p.color}${(1 - dd / 110) * 0.14})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'auto' }} />
  );
}

function Hero() {
  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden grid-bg"
      aria-labelledby="hero-heading">
      <ParticleCanvas />

      {/* Floating ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', top: '-5%', left: '-15%' }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[450px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', bottom: '5%', right: '-10%' }}
          animate={{ x: [0, -35, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 glass neon-border"
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-main)', boxShadow: '0 0 8px var(--accent-glow)' }} />
          <span className="text-sm font-mono text-theme-muted tracking-wide">Available for internships</span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 id="hero-heading" className="font-space font-bold leading-tight mb-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            <span className="text-theme-text">Hi, I'm </span>
            <span className="gradient-text" style={{ filter: 'drop-shadow(0 0 40px var(--accent-glow))' }}>
              Rishabh Trivedi
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-theme-muted mb-2 text-center w-full"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', letterSpacing: '0.02em' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Computer Engineering Student &nbsp;&middot;&nbsp; Aspiring Software Developer
        </motion.p>

        {/* Typing */}
        <motion.div className="mb-12 h-14 flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
          <span className="font-mono text-xl md:text-2xl font-semibold tracking-wide" style={{ color: 'var(--accent-main)' }}>
            &gt;&nbsp;
            <TypeAnimation
              sequence={['Web Developer', 2200, 'Java Programmer', 2200, 'Tech Enthusiast', 2200, 'Problem Solver', 2200]}
              wrapper="span" speed={52} repeat={Infinity}
            />
            <span className="animate-pulse ml-0.5">_</span>
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div className="flex flex-wrap gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}>
          <motion.button className="btn-primary" onClick={() => go('projects')}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <FiExternalLink size={15} /> View Projects
          </motion.button>
          <motion.button className="btn-outline" onClick={() => go('contact')}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            Contact Me
          </motion.button>
        </motion.div>

        {/* Tech badges */}
        <motion.div className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          {['React', 'Java', 'JavaScript', 'MySQL', 'Git'].map((tech, i) => (
            <motion.span key={tech}
              className="px-3 py-1 rounded-full text-xs font-mono glass neon-border text-theme-muted"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              whileHover={{ scale: 1.15, color: 'var(--accent-main)' }}>
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group z-10"
        onClick={() => go('about')}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, type: 'spring' }}
        aria-label="Scroll to About">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-theme-subtle group-hover:text-cyan-400 transition-colors">
          Scroll
        </span>
        <div className="w-5 h-8 border-2 border-slate-500/50 rounded-full flex justify-center p-1 relative backdrop-blur-sm group-hover:border-cyan-400 transition-colors duration-300">
          <motion.div 
            className="w-1 h-2 bg-cyan-400 rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1], scale: [1, 0.8, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.button>
    </section>
  );
}

export default Hero;
