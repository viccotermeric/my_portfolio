import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

// ─── EmailJS Configuration ────────────────────────────────────────────────────
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add Email Service (Gmail) → get YOUR_SERVICE_ID
// 3. Create Email Template → get YOUR_TEMPLATE_ID
//    Template variables to use: {{from_name}}, {{from_email}}, {{message}}
// 4. Go to Account → API Keys → get YOUR_PUBLIC_KEY
// Replace the placeholders below with your actual values:
const EMAILJS_SERVICE_ID = 'service_ytojj8o';
const EMAILJS_TEMPLATE_ID = 'template_ttx132m';
const EMAILJS_PUBLIC_KEY = 'TxdzA0eW_hEQBHkZF';
// ─────────────────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.length < 10) errs.message = 'Message too short (min 10 chars)';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
      alert('⚠️ EmailJS not configured yet. Please set up your service/template/key in Contact.jsx first.');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          reply_to: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'rishabhtrivedi06@gmail.com', href: 'mailto:rishabhtrivedi06@gmail.com' },
    { icon: FiGithub, label: 'GitHub', value: 'github.com/viccotermeric', href: 'https://github.com/viccotermeric' },
    { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/rishabh-trivedi', href: 'https://www.linkedin.com/in/rishabh-trivedi-27b3362b2/' },
  ];

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)', scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-cyan-400 text-sm mb-2 tracking-widest uppercase">Say hello</p>
        <h2 className="section-title gradient-text">Get In Touch</h2>
        <div className="w-16 h-1 mx-auto rounded-full mt-3" style={{ background: 'linear-gradient(90deg, #00d4ff, #9b59b6)' }} />
        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
          I'm always open to discussing new opportunities, interesting projects, or just having a conversation about tech.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left — info cards */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            Let's work <span className="gradient-text">together</span>
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Whether you're looking for an intern, want to collaborate on a project, or just want to say hi — my inbox is always open!
          </p>
          <div className="space-y-4 mt-8">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 glass rounded-xl neon-border group"
                whileHover={{ x: 6 }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Icon className="text-cyan-400" size={17} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">{label}</p>
                  <p className="text-slate-300 text-sm group-hover:text-cyan-400 transition-colors">{value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 md:p-8 neon-border space-y-5">
            <div>
              <label htmlFor="contact-name" className="text-xs font-mono text-slate-400 mb-1.5 block">Name</label>
              <input
                id="contact-name" type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your Name" className="input-glow" autoComplete="off"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><FiAlertCircle size={11} />{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className="text-xs font-mono text-slate-400 mb-1.5 block">Email Address</label>
              <input
                id="contact-email" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="hello@example.com" className="input-glow" autoComplete="off"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><FiAlertCircle size={11} />{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="contact-message" className="text-xs font-mono text-slate-400 mb-1.5 block">Message</label>
              <textarea
                id="contact-message" name="message" value={form.message} onChange={handleChange}
                placeholder="I'd love to connect about..." rows={5} className="input-glow resize-none"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><FiAlertCircle size={11} />{errors.message}</p>}
            </div>

            <motion.button
              type="submit" id="contact-submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={status === 'sending' || status === 'success'}
            >
              {status === 'sending' && (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {status === 'success' && <FiCheck size={16} />}
              {status === 'idle' && <FiSend size={16} />}
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Try Again' : 'Send Message'}
            </motion.button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg text-sm"
                  style={{ background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)', color: '#00ffaa' }}>
                  <FiCheck size={15} /> Thank you! I'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg text-sm"
                  style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b' }}>
                  <FiAlertCircle size={15} /> Failed to send. Please email me directly at rishabhtrivedi06@gmail.com
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
