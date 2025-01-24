import React, { useEffect } from 'react';
import './App.css';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Qualification from './components/qualification/Qualification';
import Scrollup from './components/scrollup/Scrollup';
import Services from './components/services/Services';
import Skills from './components/skills/Skills';
import Testimonial from './components/testimonials/Testimonial';
import { Helmet } from 'react-helmet';

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/66c5a601ea492f34bc0870c5/1i5q10ubl";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when the component unmounts
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Usama Hassan | Full Stack Developer Portfolio</title>
        <meta name="description" content="Usama Hassan's portfolio showcasing front-end development skills in React JS, JavaScript, and more. Explore my projects, skills, and qualifications." />
        <meta name="keywords" content="Usama Hassan, Usama Hassan portfolio, iamus4ma, Front-end Developer, Full Stack Developer, MERN Stack Developer, Software Engineer, React JS, Portfolio" />
        <meta name="author" content="Usama Hassan" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Usama Hassan | Full Stack Developer Portfolio" />
        <meta property="og:description" content="Usama Hassan's portfolio showcasing front-end development skills in React JS, JavaScript, and more. Explore my projects, skills, and qualifications." />
        <meta property="og:image" content="https://www.iamus4ma.com/images/portfolio-thumbnail.jpg" />
        <meta property="og:url" content="https://www.iamus4ma.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Usama Hassan Portfolio" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="Usama Hassan | Full Stack Developer Portfolio" />
        <meta name="twitter:description" content="Usama Hassan's portfolio showcasing front-end development skills in React JS, JavaScript, and more." />
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
        <Testimonial />
        <Contact />
      </main>
      <Footer />
      <Scrollup />
    </>
  );
}

export default App;
