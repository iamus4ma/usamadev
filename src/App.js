import React, { useEffect } from 'react';
import './App.css';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Qualification from './components/qualification/Qualification';
import Projects from './components/projects/Projects';
import Scrollup from './components/scrollup/Scrollup';
import Services from './components/services/Services';
import Skills from './components/skills/Skills';
import Testimonial from './components/testimonials/Testimonial';
import { Helmet } from 'react-helmet';

function App() {
  useEffect(() => {
    const tawkSrc = 'https://embed.tawk.to/66c5a601ea492f34bc0870c5/1i5q10ubl';

    if (window.location.protocol !== 'https:') {
      return undefined;
    }

    const parsedUrl = new URL(tawkSrc);
    if (parsedUrl.hostname !== 'embed.tawk.to') {
      return undefined;
    }

    // Tawk serves a frequently updated third-party script, so a pinned SRI hash
    // is usually not stable. We mitigate by strict host/protocol checks.
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      return undefined;
    }

    const script = document.createElement("script");
    script.id = 'tawk-script';
    script.async = true;
    script.src = tawkSrc;
    script.charset = "UTF-8";
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'strict-origin-when-cross-origin';

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script); // Clean up the script when the component unmounts
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Usama Hassan | Full Stack Developer</title>
        <meta name="description" content="Full Stack Developer specializing in React, Node.js, and modern web technologies. Explore my portfolio of projects, technical skills, and professional experience." />
        <meta name="keywords" content="Usama Hassan, iamus4ma, Full Stack Developer, MERN Stack Developer, Software Engineer, React Developer, Node.js, Portfolio, Web Developer Pakistan" />
        <meta name="author" content="Usama Hassan" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Usama Hassan | Full Stack Developer" />
        <meta property="og:description" content="Full Stack Developer specializing in React, Node.js, and modern web technologies. Explore my portfolio of projects, technical skills, and professional experience." />
        <meta property="og:image" content="https://www.iamus4ma.com/images/portfolio-thumbnail.jpg" />
        <meta property="og:url" content="https://www.iamus4ma.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Usama Hassan | Full Stack Developer" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="Usama Hassan | Full Stack Developer" />
        <meta name="twitter:description" content="Full Stack Developer specializing in React, Node.js, and modern web technologies." />
        <meta name="twitter:image" content="https://www.iamus4ma.com/images/portfolio-thumbnail.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Usama Hassan",
              "url": "https://www.iamus4ma.com",
              "sameAs": [
                "https://www.linkedin.com/in/usama-hassan-383b2b227/",
                "https://github.com/iamus4ma",
                "https://www.instagram.com/iamus4ma/",
                "https://www.facebook.com/usamahassan.0/"
              ],
              "jobTitle": "Software Engineer",
              "worksFor": {
                "@type": "Organization",
                "name": "Bellmedex"
              }
            }
          `}
        </script>
      </Helmet>
      <Header />
      <main className='main'>
        <Home />
        <About />
        <Skills />
        <Services />
        <Qualification />
        <Projects />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
      <Scrollup />
    </>
  );
}

export default App;
