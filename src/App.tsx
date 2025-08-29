import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import BeginnerGuidePage from "./pages/BeginnerGuidePage";
import WorkoutsPage from "./pages/WorkoutsPage";
import AllArticlesPage from "./pages/AllArticlesPage";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";

import React, { useState } from 'react';
const queryClient = new QueryClient();

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="App" style={{ position: 'relative' }}>
      {showOverlay && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '2rem',
      textAlign: 'center',
      padding: '1rem',
    }}
  >
    <div
      style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '2rem',
        borderRadius: '8px',
      }}
    >
      <strong style={{ fontSize: '2.2rem' }}>FitnessHub has officially moved!</strong>
      <br />
      <span style={{ fontSize: '2.5rem', color: '#cfff6a', fontWeight: 'bold' }}>
        We’ve rebranded and are now SpotyFlex 
      </span>
      <br />
      <p style={{ fontSize: '1.5rem', marginTop: '1.2rem', maxWidth: '700px' }}>
        Discover the same great fitness articles, workouts, and health tips — now with a fresh new name and look.
      </p>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
         Click below to continue your journey on our new website:
      </p>
      <a
        href="https://spotyflex.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '1.5rem',
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: '#cfff6a',
          color: '#222',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none',
          fontSize: '1.5rem',
        }}
      >
        Go to SpotyFlex.com
      </a>
    </div>
  </div>
)}

      {/* Main app content */}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/begin" element={<BeginnerGuidePage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/articles" element={<AllArticlesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
