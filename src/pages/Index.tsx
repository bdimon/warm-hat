
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import Catalog from '@/components/Catalog';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Smooth scroll to section when hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
        }
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Benefits />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
