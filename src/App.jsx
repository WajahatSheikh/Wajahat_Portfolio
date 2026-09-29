import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ContactProvider } from "./context/ContactContext";
import { useSmoothScroll } from "./lib/smoothScroll";
import { useScrollTriggerRefresh } from "./lib/motion";
import { ScrollTrigger } from "./lib/gsap";
import CustomCursor from "./components/CustomCursor";
import ContactModal from "./components/ContactModal";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";

/**
 * A new route renders a page of a completely different height, and every
 * ScrollTrigger on it was measured against the old one. Jump to the top and
 * re-measure, or the first screen of a case study animates as if it were
 * already half scrolled.
 *
 * Skipped when the URL carries a hash — that is an anchor jump, and the
 * handler in smoothScroll owns where it lands.
 */
function ResetScrollOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname, hash]);

  return null;
}

function App() {
  useSmoothScroll();
  useScrollTriggerRefresh();

  return (
    <ContactProvider>
      <CustomCursor />
      <ResetScrollOnNavigate />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<CaseStudy />} />
        {/* Anything else goes home rather than rendering a blank page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ContactModal />
    </ContactProvider>
  );
}

export default App;
