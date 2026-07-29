import { ContactProvider } from "./context/ContactContext";
import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectsGrid from "./components/ProjectsGrid";
import AboutMe from "./components/AboutMe";
import WhatIDo from "./components/WhatIDo";
import TechStack from "./components/TechStack";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";

function App() {
  return (
    <ContactProvider>
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <ProjectsGrid />
        <AboutMe />
        <WhatIDo />
        <TechStack />
        <Testimonials />
      </main>
      <Footer />
      <ContactModal />
    </ContactProvider>
  );
}

export default App;
