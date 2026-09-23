import React from 'react';
import './App.css';
import Conversation from './components/conversation/Conversation';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <>
      <Helmet>
        <title>Usama Hassan | Full Stack Developer</title>
        <meta name="description" content="Software Engineer and Full Stack Developer specializing in React, React Native, Expo, TypeScript, and Node.js. Explore my portfolio of projects, technical skills, and professional experience." />
        <meta name="keywords" content="Usama Hassan, iamus4ma, Full Stack Developer, MERN Stack Developer, Software Engineer, React Developer, Node.js, Portfolio, Web Developer Pakistan" />
        <meta name="author" content="Usama Hassan" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Usama Hassan | Full Stack Developer" />
        <meta property="og:description" content="Software Engineer and Full Stack Developer specializing in React, React Native, Expo, TypeScript, and Node.js. Explore my portfolio of projects, technical skills, and professional experience." />
        <meta property="og:image" content="https://www.iamus4ma.com/images/portfolio-thumbnail.jpg" />
        <meta property="og:url" content="https://www.iamus4ma.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Usama Hassan | Full Stack Developer" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="Usama Hassan | Full Stack Developer" />
        <meta name="twitter:description" content="Software Engineer and Full Stack Developer specializing in React, React Native, Expo, TypeScript, and Node.js." />
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
                "https://www.linkedin.com/in/iamus4ma/",
                "https://github.com/iamus4ma",
                "https://www.instagram.com/iamus4ma/",
                "https://www.facebook.com/usamahassan.0/"
              ],
              "jobTitle": "Software Engineer",
              "worksFor": {
                "@type": "Organization",
                "name": "Bellmedex Pakistan"
              }
            }
          `}
        </script>
      </Helmet>
      <Conversation />
    </>
  );
}

export default App;
