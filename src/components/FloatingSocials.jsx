import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const socials = [
  { icon: FiGithub, href: 'https://github.com/viccotermeric', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/rishabh-trivedi-27b3362b2/', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:rishabhtrivedi06@gmail.com', label: 'Email' },
];

function FloatingSocials() {
  return (
    <motion.div
      className="floating-socials"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      {socials.map(({ icon: Icon, href, label }, i) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-theme-muted hover:text-accent-main transition-colors duration-200"
          whileHover={{ scale: 1.3, x: 4 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 + i * 0.1 }}
        >
          <Icon size={18} />
        </motion.a>
      ))}
    </motion.div>
  );
}

export default FloatingSocials;
