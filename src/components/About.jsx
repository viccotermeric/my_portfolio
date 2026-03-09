import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useCountUp } from 'react-countup';
import TerminalAnimation from './TerminalAnimation';

const stats = [
  { label: 'Projects Completed', value: 5, suffix: '+' },
  { label: 'Technologies Learned', value: 10, suffix: '+' },
  { label: 'Coding Hours', value: 500, suffix: '+' },
];

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { start, update } = useCountUp({ 
    ref, 
    start: 0, 
    end: value, 
    duration: 2.2, 
    suffix, 
    startOnMount: false 
  });

  useEffect(() => {
    if (inView) {
      start();
    }
  }, [inView, start]);

  return (
    <motion.div
      className="text-center p-6 glass rounded-2xl neon-border group cursor-default"
      whileHover={{ y: -8, boxShadow: 'var(--shadow-card)', borderColor: 'var(--neon-blue)' }}
      transition={{ duration: 0.3 }}
    >
      <div 
        ref={ref}
        className="gradient-text font-space font-bold mb-2"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }} 
      />
      <p className="text-theme-subtle text-sm font-medium">{label}</p>
    </motion.div>
  );
}

function About() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div ref={sectionRef} className="py-24 px-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={itemVariants} id="about-heading" className="section-title gradient-text">About Me</motion.h2>
        <motion.div variants={itemVariants} className="w-16 h-px mx-auto bg-white/30" />
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid lg:grid-cols-2 gap-16 items-center mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Profile image */}
        <motion.div variants={itemVariants} className="flex justify-center order-2 lg:order-1">
          <div className="relative">
            {/* Soft white radial glow — no spinning ring */}
            <div
              className="absolute -inset-6 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--glass-bg) 0%, transparent 70%)' }}
            />
            <motion.div style={{ y: imageY }}>
              <div
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
                style={{ border: '1px solid var(--glass-border)', boxShadow: '0 0 60px var(--shadow-card)' }}
              >
                <img
                  src="/profile.png"
                  alt="Rishabh Trivedi"
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center 15%',
                    filter: 'brightness(1.06) contrast(1.08)',
                  }}
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, var(--img-vignette) 0%, transparent 55%)' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div variants={itemVariants} className="space-y-5 order-1 lg:order-2">
          <h3 className="text-2xl font-bold text-theme-text">
            Passionate about <span className="gradient-text">building digital experiences</span>
          </h3>
          <p className="text-theme-muted leading-relaxed">
            I specialize in <span className="text-theme-text font-semibold underline decoration-accent-main/30 underline-offset-4">frontend development</span> and UI/UX design, creating sleek, immersive web experiences. I love combining modern frameworks with creative animations to bring ideas to life.
          </p>
          <p className="text-theme-muted leading-relaxed">
            From building responsive web applications to developing backend systems, I enjoy every aspect of the SDLC. I'm always eager to learn new technologies and tackle real-world technical challenges.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['React', 'Java', 'JavaScript', 'MySQL', 'HTML/CSS', 'Git'].map((skill) => (
              <motion.span key={skill}
                className="px-3 py-1 rounded-full font-mono text-xs text-theme-subtle"
                style={{ border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px var(--glass-border)', borderColor: 'var(--neon-blue)' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Terminal animation */}
      <motion.div
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <p className="font-mono text-theme-subtle text-xs mb-4 text-center tracking-widest uppercase">
          // interactive terminal
        </p>
        <TerminalAnimation />
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.3, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {stats.map((s) => <StatCounter key={s.label} {...s} />)}
      </motion.div>
    </div>
  );
}

export default About;
