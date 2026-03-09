import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin } from 'react-icons/fi';

const timelineItems = [
  {
    degree: 'B.E. Computer Engineering',
    institution: 'Thakur College of Engineering and Technology (TCET)',
    period: '2025 – Present',
    location: 'Mumbai, Maharashtra',
    description: 'Pursuing Bachelor of Engineering in Computer Engineering, building on a strong technical foundation from diploma studies, with focus on software development, data structures, algorithms, and modern web technologies.',
    highlights: ['Data Structures & Algorithms', 'Web Development', 'Database Management', 'OOP with Java'],
    color: '#00d4ff',
    icon: '🎓',
  },
  {
    degree: 'Diploma in Information Technology',
    institution: 'Thakur Polytechnic',
    period: '2022 – 2025',
    location: 'Mumbai, Maharashtra',
    description: 'Completed a 3-year Diploma in Information Technology, gaining hands-on experience in programming, networking, database management, and web development fundamentals.',
    highlights: ['Programming in C / Java', 'Web Technologies', 'Database Systems', 'Computer Networks'],
    color: '#9b59b6',
    icon: '🖥️',
  },
  {
    degree: 'Secondary School Certificate (SSC)',
    institution: 'Maharashtra State Board',
    period: '2021 – 2022',
    location: 'Mumbai, Maharashtra',
    description: 'Completed secondary education with strong academic performance, building a solid foundation in Mathematics, Science, and analytical thinking.',
    highlights: ['Mathematics', 'Science', 'English'],
    color: '#00ffaa',
    icon: '🏫',
  },
];

function TimelineItem({ item, index }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Center dot (desktop) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{
            background: 'var(--dark-surface)',
            border: `2px solid ${item.color}44`,
            boxShadow: 'var(--shadow-card)',
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        >
          {item.icon}
        </motion.div>
      </div>

      {/* Mobile dot */}
      <div className="md:hidden flex-shrink-0" aria-hidden="true">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ 
            background: 'var(--dark-surface)', 
            border: `2px solid ${item.color}44`,
            boxShadow: 'var(--shadow-card)' 
          }}
        >
          {item.icon}
        </div>
      </div>

      {/* Content card */}
      <div className={`flex-1 min-w-0 ${isLeft ? 'md:pr-16' : 'md:pl-16'}`}>
        <motion.div
          className="glass rounded-2xl p-5 md:p-6 transition-all duration-300"
          style={{ 
            border: `1px solid var(--glass-border)`,
            background: 'var(--dark-surface)',
            boxShadow: 'var(--shadow-card)'
          }}
          whileHover={{ 
            borderColor: 'var(--neon-blue)', 
            y: -5,
            boxShadow: '0 20px 40px var(--shadow-card)' 
          }}
        >
          <h3 className="font-bold text-theme-text text-base md:text-lg mb-0.5">{item.degree}</h3>
          <p className="font-semibold text-sm mb-2" style={{ color: item.color }}>{item.institution}</p>
          <div className="flex flex-wrap gap-3 text-xs text-theme-subtle mb-3">
            <span className="flex items-center gap-1.5"><FiCalendar size={11} aria-hidden="true" /> {item.period}</span>
            <span className="flex items-center gap-1.5"><FiMapPin size={11} aria-hidden="true" /> {item.location}</span>
          </div>
          <p className="text-theme-muted text-sm leading-relaxed mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Key subjects">
            {item.highlights.map((h) => (
              <span
                key={h}
                role="listitem"
                className="text-xs px-2.5 py-1 rounded-full font-medium text-theme-subtle"
                style={{ 
                  background: 'var(--dark-bg)', 
                  border: `1px solid var(--glass-border)` 
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

function Education() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6" style={{ background: 'var(--section-bg-alt)' }} aria-labelledby="education-heading">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-cyan-400 text-xs md:text-sm mb-2 tracking-widest uppercase">My journey</p>
          <h2 id="education-heading" className="section-title gradient-text">Education</h2>
          <div className="w-16 h-1 mx-auto rounded-full mt-3" style={{ background: 'linear-gradient(90deg, #00d4ff, #9b59b6)' }} aria-hidden="true" />
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px"
            style={{ background: 'linear-gradient(to bottom, #00d4ff, #9b59b6, #00ffaa)', top: 0, bottom: 0 }}
            aria-hidden="true"
          />
          <div className="space-y-10 md:space-y-14">
            {timelineItems.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
