import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeafBackground from './components/LeafBackground';
import { ToastProvider } from './components/ui/Toast';
import Home from './pages/Home';
import Onboard from './pages/Onboard';
import Breakdown from './pages/Breakdown';
import Reduce from './pages/Reduce';
import Chat from './pages/Chat';
import Challenges from './pages/Challenges';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/breakdown" element={<Breakdown />} />
        <Route path="/reduce" element={<Reduce />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LeafBackground />
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-leaf-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
