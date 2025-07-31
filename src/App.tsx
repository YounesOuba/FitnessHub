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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
);

export default App;
