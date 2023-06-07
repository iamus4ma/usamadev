// updated


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
