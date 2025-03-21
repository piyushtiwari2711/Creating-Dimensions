import React from 'react'
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { MentorSection } from '../components/MentorSection';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
const Home = () => {
  return (
    <div className="min-h-screen mx-auto bg-white">
      <Navbar />
      <Hero />
      <Features />
      <MentorSection />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default Home