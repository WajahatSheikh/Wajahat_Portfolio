import Header from "../components/Header";
import Hero from "../components/Hero";
import Showreel from "../components/Showreel";
import ProjectsGrid from "../components/ProjectsGrid";
import WhatIDo from "../components/WhatIDo";
import Experience from "../components/Experience";
import TechStack from "../components/TechStack";
import AboutMe from "../components/AboutMe";
import Testimonials from "../components/Testimonials";
import ContactCTA from "../components/ContactCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      {/* Section surfaces follow the Figma frame exactly: the page is one
          continuous #eeeef2 field, and Tech Stack is the only band that
          breaks to white. Sampled off the frame render, not eyeballed. */}
      <main>
        <Hero />
        <Showreel />
        <ProjectsGrid />
        <WhatIDo />
        <Experience />
        <TechStack />
        <AboutMe />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
