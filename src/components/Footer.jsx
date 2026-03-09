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
      style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--glass-border)' }}>
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-main), var(--accent-secondary), transparent)' }} />

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
            <p className="text-theme-subtle text-sm leading-relaxed mb-4">
              Computer Engineering student passionate about building elegant, efficient, and impactful digital experiences.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-theme-muted hover:text-accent-main transition-colors"
                  style={{ border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}
                  whileHover={{ scale: 1.15, borderColor: 'var(--accent-main)' }}
                  whileTap={{ scale: 0.9 }}>
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-theme-text mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <motion.button onClick={() => handleNavClick(link)}
                    className="text-theme-subtle hover:text-accent-main text-sm transition-colors flex items-center gap-2 group"
                    whileHover={{ x: 4 }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-main opacity-0 group-hover:opacity-100 transition-all" />
                    {link}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="font-semibold text-theme-text mb-4 text-sm">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JavaScript'].map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 rounded-full font-mono text-theme-muted"
                  style={{ border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-theme-subtle text-sm font-mono">
            © {new Date().getFullYear()} Rishabh Trivedi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
