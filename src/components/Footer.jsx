import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const quickLinks = ['Home', 'About', 'Skills', 'Projects', 'Education', 'Contact'];
const socials = [
  { icon: FiGithub, href: 'https://github.com/viccotermeric', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/rishabh-trivedi-27b3362b2/', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:rishabhtrivedi06@gmail.com', label: 'Email' },
];

function Footer() {
  const handleNavClick = (label) => {
    const el = document.getElementById(label.toLowerCase());
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden"
      style={{ background: '#030810', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #9b59b6, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <motion.button
              onClick={() => handleNavClick('home')}
              className="font-mono font-bold text-2xl gradient-text inline-block mb-3"
              whileHover={{ scale: 1.05 }}>
              &lt;Dev/&gt;
            </motion.button>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Computer Engineering student passionate about building elegant, efficient, and impactful digital experiences.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  whileHover={{ scale: 1.15, borderColor: 'rgba(0,212,255,0.4)' }}
                  whileTap={{ scale: 0.9 }}>
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <motion.button onClick={() => handleNavClick(link)}
                    className="text-slate-500 hover:text-cyan-400 text-sm transition-colors flex items-center gap-2 group"
                    whileHover={{ x: 4 }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/100 transition-all" />
                    {link}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JavaScript'].map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 rounded-full font-mono text-slate-400"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-slate-600 text-sm font-mono">
            © {new Date().getFullYear()} Rishabh Trivedi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
