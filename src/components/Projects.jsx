import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const PROFILE_GH = 'https://github.com/viccotermeric';

const projects = [
  {
    title: 'Persian Darbar',
    subtitle: 'Restaurant Reservation System',
    description: 'A dynamic web-based restaurant reservation platform allowing customers to book tables in real-time, with complete table management and clean UX.',
    image: null,
    tags: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    github: null,
    demo: null,
    color: '#00d4ff',
    featured: true,
    icon: '🍽️',
  },
  {
    title: 'VEDA AI',
    subtitle: 'AI-Powered Study Assistant',
    description: 'An intelligent AI-powered study companion for students — featuring smart Q&A, content summarization, and personalized learning paths using React and AI APIs.',
    image: '/VEDA-AI thumbnail.png',
    tags: ['React', 'Tailwind CSS', 'JavaScript', 'AI/ML'],
    github: 'https://github.com/The-Knightts/Team-Lossers',
    demo: null,
    color: '#00ffaa',
    featured: true,
    icon: '🤖',
  },
  {
    title: 'Weather App',
    subtitle: 'Real-Time Weather Dashboard',
    description: 'A sleek real-time weather dashboard fetching live data via OpenWeatherMap API. Shows temperature, humidity, wind speed, and a 5-day forecast with dynamic UI.',
    image: '/weather-app thumbnail.png',
    tags: ['React', 'JavaScript', 'API', 'CSS'],
    github: 'https://github.com/viccotermeric/weather-app',
    demo: null,
    color: '#9b59b6',
    featured: false,
    icon: '🌤️',
  },
  {
    title: 'Coming Soon',
    subtitle: 'Next Project in Progress',
    description: 'An exciting new project currently under development. Leveraging modern technologies to solve real-world problems. Stay tuned!',
    image: null,
    tags: ['Java', 'React', 'MySQL'],
    github: null,
    demo: null,
    color: '#ff9f43',
    featured: false,
    icon: '🚀',
  },
];

const tagColors = {
  HTML: '#e34f26', CSS: '#1572b6', JavaScript: '#f7df1e', MySQL: '#4479a1',
  React: '#61dafb', 'Tailwind CSS': '#38bdf8', 'Framer Motion': '#bb4be0',
  Java: '#f89820', 'AI/ML': '#00ffaa', API: '#00d4ff',
};

function ProjectCard({ project, isActive }) {
  const ghLink = project.github || PROFILE_GH;

  return (
    <motion.div
      className="h-full flex flex-col rounded-2xl overflow-hidden select-none relative"
      style={{
        background: 'rgba(8,16,32,0.92)',
        border: `1px solid ${isActive ? project.color + '60' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isActive
          ? `0 0 50px ${project.color}28, 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 ${project.color}22`
          : '0 8px 32px rgba(0,0,0,0.45)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Colored top stripe */}
      <div className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44, transparent)` }} />

      {/* Image / icon area */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '170px' }}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${project.color}12, #050a14 75%)` }}>
            <motion.div
              style={{ fontSize: '3.5rem', lineHeight: 1, filter: `drop-shadow(0 0 20px ${project.color}60)` }}
              animate={isActive ? { y: [0, -6, 0], scale: [1, 1.08, 1] } : { y: 0, scale: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
              {project.icon}
            </motion.div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(8,16,32,1) 0%, transparent 60%)' }} />
        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-2.5 left-3 text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}40` }}>
            ★ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title + subtitle */}
        <div className="mb-3">
          <h3 className="text-white font-bold text-lg leading-tight mb-0.5">{project.title}</h3>
          <p className="text-xs font-mono tracking-wide" style={{ color: project.color }}>{project.subtitle}</p>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-mono"
              style={{
                background: `${tagColors[tag] || project.color}15`,
                color: tagColors[tag] || project.color,
                border: `1px solid ${tagColors[tag] || project.color}30`,
              }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons row — GitHub always shown */}
        <div className="flex gap-2 flex-wrap">
          <motion.a
            href={ghLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileHover={{
              scale: 1.05,
              color: '#fff',
              borderColor: `${project.color}60`,
              background: `${project.color}12`,
            }}
            whileTap={{ scale: 0.95 }}
            title={project.github ? 'View Project Repo' : 'View GitHub Profile'}
          >
            <FiGithub size={14} />
            {project.github ? 'GitHub' : 'Profile'}
          </motion.a>

          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}50` }}
              whileHover={{ scale: 1.05, background: `${project.color}35` }}
              whileTap={{ scale: 0.95 }}>
              <FiExternalLink size={14} /> Live Demo
            </motion.a>
          )}

          {!project.github && !project.demo && (
            <span className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-xl text-slate-600"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <FiCode size={12} /> In Development
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const swiperRef = useRef(null);

  const NavBtn = ({ direction }) => (
    <motion.button
      aria-label={direction === 'prev' ? 'Previous project' : 'Next project'}
      onClick={() => direction === 'prev' ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext()}
      className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center self-center"
      style={{
        background: 'rgba(5,10,20,0.8)',
        border: '1px solid rgba(0,212,255,0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 20px rgba(0,212,255,0.1)',
        color: '#00d4ff',
      }}
      whileHover={{
        scale: 1.15,
        borderColor: 'rgba(0,212,255,0.8)',
        boxShadow: '0 0 30px rgba(0,212,255,0.4)',
        color: '#ffffff',
      }}
      whileTap={{ scale: 0.9 }}
    >
      {direction === 'prev'
        ? <FiChevronLeft size={20} strokeWidth={2.5} />
        : <FiChevronRight size={20} strokeWidth={2.5} />}
    </motion.button>
  );

  return (
    <div ref={ref} className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">

      {/* Header */}
      <motion.div className="text-center mb-14"
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono text-cyan-400 text-sm mb-2 tracking-widest uppercase">What I've built</p>
        <h2 className="section-title gradient-text text-center">Featured Projects</h2>
        <div className="w-16 h-1 mx-auto rounded-full mt-3"
          style={{ background: 'linear-gradient(90deg, #00d4ff, #9b59b6)' }} />
      </motion.div>

      {/* Card + Arrows layout */}
      <motion.div
        initial={{ opacity: 0, y: 70, filter: 'blur(14px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ delay: 0.2, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}>

        {/* Row: [←]  [card]  [→] */}
        <div className="flex items-center gap-3 sm:gap-14 md:gap-20 justify-center px-1 sm:px-4">
          <div className="z-10">
            <NavBtn direction="prev" />
          </div>

          <div className="w-full max-w-[230px] sm:max-w-[320px] md:max-w-[360px]">
            <Swiper
              modules={[Pagination, EffectCards, Autoplay]}
              effect="cards"
              grabCursor
              centeredSlides
              slideToClickedSlide
              cardsEffect={{ perSlideOffset: 10, perSlideRotate: 4, rotate: true, slideShadows: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
              speed={520}
              onSwiper={(s) => { swiperRef.current = s; }}
              style={{ paddingBottom: '52px' }}
            >
              {projects.map((project) => (
                <SwiperSlide key={project.title} style={{ borderRadius: '16px' }}>
                  {({ isActive }) => <ProjectCard project={project} isActive={isActive} />}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="z-10">
            <NavBtn direction="next" />
          </div>
        </div>
      </motion.div>

      {/* GitHub CTA */}
      <motion.div className="text-center mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}>
        <p className="text-slate-500 mb-4 text-sm">See all my work on GitHub →</p>
        <motion.a href={PROFILE_GH} target="_blank" rel="noopener noreferrer"
          className="btn-outline inline-flex items-center gap-2"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiGithub /> View GitHub Profile
        </motion.a>
      </motion.div>
    </div>
  );
}

export default Projects;
