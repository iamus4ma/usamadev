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
