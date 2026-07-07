import { portfolioData } from '../../portfolio-data.js';
import { EMAIL_HREF } from '../constants/terminal.js';
import { formatBreaks } from '../utils/terminalHelpers.js';
import { ContactFormDemo } from './ContactFormDemo.jsx';

const PRIMARY_TABS = ['About', 'Experience', 'Projects', 'Skills', 'Contact'];
const SECONDARY_TABS = ['Education', 'Leadership'];

export function GuiView({ activeTab, onTabChange, footerHtml }) {
  return (
    <div id="gui-mode" className="w-full rounded-lg shadow-2xl shadow-stone-500/20 p-8 overflow-y-auto">
      <div className="gui-tabs-nav">
        {PRIMARY_TABS.map((tab) => (
          <button key={tab} type="button" className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => onTabChange(tab)}>
            {tab}
          </button>
        ))}
        <div className="gui-tabs-divider" />
        {SECONDARY_TABS.map((tab) => (
          <button key={tab} type="button" className={`tab-button tab-button-secondary ${activeTab === tab ? 'active' : ''}`} onClick={() => onTabChange(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="gui-tabs-content">
        {activeTab === 'About' && (
          <div className="tab-content active">
            <div className="gui-identity mb-6 mt-4">
              <h1 className="gui-identity-name text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Building scalable architecture and <span style={{ color: 'var(--color-accent)' }}>interfaces people enjoy</span> using.
              </h1>
              <p className="gui-identity-title text-base md:text-lg opacity-85 max-w-2xl font-mono mt-4 leading-relaxed tracking-wide">
                I enjoy crafting clean, intuitive experiences and transforming complex ideas into reliable backend systems and scalable digital products.
              </p>
            </div>
            <div className="gui-tabs-divider mt-8 mb-6" style={{ opacity: 0.3 }} />
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBreaks(portfolioData.about) }} />
          </div>
        )}

        {activeTab === 'Experience' && (
          <div className="tab-content active">
            {portfolioData.experience.map((experience, i) => (
              <div key={`${experience.role}-${experience.company}`} className={`gui-item gui-item-ruled ${i === 0 ? 'gui-item-first' : ''}`}>
                <div className="gui-item-title">
                  <span style={{ color: 'var(--color-accent)' }}>{experience.role}</span> @ {experience.company}
                </div>
                <div style={{ opacity: 0.65, fontSize: '0.85em', marginBottom: '0.75rem' }}>{experience.period}</div>
                {experience.desc.map((point, index) => (
                  <p key={index} style={{ marginBottom: '0.6rem' }}>{point}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Projects' && (
          <div className="tab-content active">
            <h2 className="skills-category-title">Featured</h2>
            {portfolioData.projects
              .filter((project) => project.featured)
              .map((project) => (
                <div key={project.name} className="gui-item project-card-v2 p-6 rounded-lg mb-8 border border-opacity-20 shadow-sm transition-all duration-300 transform group relative" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="gui-item-title text-2xl font-bold mb-4">{project.name}</div>
                  
                  <div className="mb-4">
                    <strong style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Challenge</strong>
                    <p className="mt-1 leading-snug">{project.challenge}</p>
                  </div>
                  
                  <div className="mb-4">
                    <strong style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</strong>
                    <p className="mt-1 leading-snug">{project.solution}</p>
                  </div>
                  
                  <div className="mb-5">
                    <strong style={{ color: 'var(--color-accent)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Result</strong>
                    <p className="mt-1 font-semibold" style={{ color: 'var(--color-text)' }}>{project.result}</p>
                  </div>

                  <div className="tech-pill-container flex flex-wrap gap-2 mt-6 mb-4">
                    {Array.isArray(project.tech) ? project.tech.map((t, idx) => (
                      <span key={idx} className="tech-pill text-xs px-2.5 py-1 rounded inline-block font-mono border" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                        {t}
                      </span>
                    )) : null}
                  </div>

                  {project.screenshots?.length > 0 && (
                    <div className="project-screenshots-gui mt-4 mb-4 rounded overflow-hidden">
                      {project.screenshots.map((src, index) => (
                        <img key={index} src={src} alt={`${project.name} screenshot`} className="project-screenshot-gui hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ))}
                    </div>
                  )}
                  <div className="gui-project-links flex gap-5 mt-4 items-center">
                    {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="link font-bold hover:underline transition-all">GitHub →</a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="link font-bold hover:underline transition-all" style={{ color: 'var(--color-accent)' }}>Live Demo →</a>}
                  </div>
                </div>
              ))}

            <h2 className="skills-category-title">Other Work</h2>
            {portfolioData.projects
              .filter((project) => !project.featured)
              .map((project) => (
                <div key={project.name} className="gui-item project-card-v2 p-5 rounded-lg mb-6 border border-opacity-20 shadow-sm transition-all duration-300 transform group relative" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="gui-item-title text-xl font-bold mb-3">{project.name}</div>
                  <div className="mb-2">
                    <p className="mt-1 leading-snug">{project.challenge || project.solution || project.desc?.[0]}</p>
                  </div>
                  <div className="tech-pill-container flex flex-wrap gap-2 mt-4 mb-3">
                    {Array.isArray(project.tech) ? project.tech.map((t, idx) => (
                      <span key={idx} className="tech-pill text-[10px] px-2 py-0.5 rounded inline-block font-mono border opacity-80" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                        {t}
                      </span>
                    )) : null}
                  </div>
                  <a href={project.url} target="_blank" rel="noreferrer" className="link text-sm font-semibold opacity-85 hover:opacity-100 transition-opacity">
                    View on GitHub →
                  </a>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'Hackathons' && (
          <div className="tab-content active">
            {portfolioData.hackathons.map((h) => (
              <div key={h.name} className="gui-item">
                <div className="gui-item-title">{h.name} <span className="text-sm">({h.date})</span></div>
                <div className="text-sm" style={{ opacity: 0.7, marginBottom: '0.4rem' }}>{h.team}</div>
                <p>{h.desc}</p>
                <a href={h.url} target="_blank" rel="noreferrer" className="link">GitHub →</a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="tab-content active">
            {Object.entries(portfolioData.skills).map(([category, skills]) => (
              <div key={category}>
                <div className="skills-subcategory-title">{category}</div>
                <div className="skills-grid">
                  {skills.map((skill) => (
                    <div key={skill} className="skill-box">{skill}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Education' && (
          <div className="tab-content active">
            {portfolioData.education.map((education) => (
              <div key={education.school} className="gui-item">
                <div className="gui-item-title">{education.school}</div>
                <div>{education.degree}</div>
                <i>{education.details}</i>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Leadership' && (
          <div className="tab-content active">
            {portfolioData.leadership.map((role) => (
              <div key={`${role.role}-${role.org}`} className="gui-item">
                <div className="gui-item-title">
                  <span style={{ color: 'var(--color-accent)' }}>{role.role}</span> @ {role.org}
                </div>
                <div style={{ opacity: 0.65, fontSize: '0.85em', marginBottom: '0.75rem' }}>{role.period}</div>
                <ul>
                  {role.points.map((point, index) => (
                    <li key={index} style={{ marginBottom: '0.4rem', fontSize: '0.9em' }}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Contact' && (
          <div className="tab-content active">
            <div className="gui-item" style={{ border: 'none', padding: 0, background: 'transparent', marginBottom: '2rem' }}>
              <ContactFormDemo onExit={() => {}} />
            </div>
            <div className="gui-item">
              <div className="gui-item-title">Email</div>
              <a href={`mailto:${portfolioData.contact.email}`} className="link">{portfolioData.contact.email}</a>
            </div>
            <div className="gui-item">
              <div className="gui-item-title">LinkedIn</div>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="link">{portfolioData.contact.linkedin}</a>
            </div>
            <div className="gui-item">
              <div className="gui-item-title">GitHub</div>
              <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="link">{portfolioData.contact.github}</a>
            </div>
          </div>
        )}
      </div>

      <div id="gui-footer" dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  );
}
