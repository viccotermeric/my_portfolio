import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaJava, FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaPython,
} from 'react-icons/fa';
import { SiMysql, SiVscodium, SiMongodb, SiPostgresql, SiEclipseide } from 'react-icons/si';

const skillGroups = [
  {
    category: 'Programming Languages', color: '#00d4ff',
    skills: [
      { name: 'Java', icon: FaJava, level: 80 },
      { name: 'JavaScript', icon: FaJs, level: 75 },
      { name: 'Python', icon: FaPython, level: 65 },
    ],
  },
  {
    category: 'Web Development', color: '#9b59b6',
    skills: [
      { name: 'HTML5', icon: FaHtml5, level: 90 },
      { name: 'CSS3', icon: FaCss3Alt, level: 85 },
      { name: 'React', icon: FaReact, level: 70 },
    ],
  },
  {
    category: 'Database', color: '#00ffaa',
    skills: [
      { name: 'MySQL', icon: SiMysql, level: 70 },
      { name: 'MongoDB', icon: SiMongodb, level: 60 },
      { name: 'PostgreSQL', icon: SiPostgresql, level: 55 },
    ],
  },
  {
    category: 'Tools', color: '#ff9f43',
    skills: [
      { name: 'Git', icon: FaGitAlt, level: 75 },
      { name: 'GitHub', icon: FaGithub, level: 80 },
      { name: 'VS Code', icon: SiVscodium, level: 90 },
      { name: 'Eclipse', icon: SiEclipseide, level: 70 },
    ],
  },
];

const floatingIcons = [FaJava, FaJs, FaHtml5, FaReact, FaGitAlt, SiMysql, SiMongodb, SiPostgresql];

function SkillBar({ name, icon: Icon, level, color, delay }) {
  return (
    <motion.div
      className="glass rounded-xl p-4 group neon-border"
      initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${color}25` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div className="text-2xl" style={{ color }}
          whileHover={{ scale: 1.35, rotate: 12, filter: `drop-shadow(0 0 8px ${color})` }}
          transition={{ type: 'spring', stiffness: 300 }}>
          <Icon />
        </motion.div>
        <span className="font-semibold text-white text-sm">{name}</span>
        <span className="ml-auto font-mono text-xs" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${color}, rgba(155,89,182,0.7))` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.25, duration: 1.1, ease: 'easeOut' }}>
          <motion.div className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: delay + 1 }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Skills() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="py-24 px-6" style={{ background: 'rgba(13,23,38,0.5)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header — centered */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
          <p className="font-mono text-cyan-400 text-sm mb-2 tracking-widest uppercase text-center">What I work with</p>
          <h2 className="section-title gradient-text text-center">Technical Skills</h2>
          <div className="w-16 h-1 mx-auto rounded-full mt-3"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #9b59b6)' }} />
        </motion.div>

        {/* Skill groups */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {skillGroups.map((group, gi) => (
            <motion.div key={group.category}
              initial={{ opacity: 0, y: 50, filter: 'blur(8px)', scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: gi * 0.13, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="font-mono text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: group.color }}>
                <span className="inline-block w-2 h-2 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 10px ${group.color}` }} />
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.skills.map((skill, si) => (
                  <SkillBar key={skill.name} {...skill} color={group.color}
                    delay={gi * 0.1 + si * 0.09} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating icons */}
        <motion.div className="flex flex-wrap gap-5 justify-center"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}>
          {floatingIcons.map((Icon, i) => (
            <motion.div key={i}
              className="w-14 h-14 rounded-xl glass flex items-center justify-center"
              style={{ border: '1px solid rgba(0,212,255,0.12)' }}
              whileHover={{ scale: 1.25, borderColor: 'rgba(0,212,255,0.7)', boxShadow: '0 0 25px rgba(0,212,255,0.35)' }}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
              <Icon className="text-2xl text-cyan-400" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Skills;
