import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import FloatingSocials from './components/FloatingSocials';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';

function App() {
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#050a14', minHeight: '100vh' }}>
      {/* Main content — always rendered underneath */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        <ScrollProgress />
        <Navbar scrollY={scrollY} />
        <FloatingSocials />
        <BackToTop scrollY={scrollY} />
        <main>
          <section id="home"><Hero /></section>
          <section id="about"><About /></section>
          <section id="skills"><Skills /></section>
          <section id="projects"><Projects /></section>
          <section id="education"><Education /></section>
          <section id="contact"><Contact /></section>
        </main>
        <Footer />
      </motion.div>

      {/* Loading overlay on top — fades out */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            style={{
              position: 'fixed', inset: 0,
              background: '#050a14',
              zIndex: 99999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
