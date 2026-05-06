import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Saved from './pages/Saved';
import OpportunityDetail from './pages/OpportunityDetail';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

// Protected Route Wrapper to enforce onboarding
const ProtectedRoute = ({ children }) => {
  const { hasOnboarded } = useApp();
  const location = useLocation();

  if (!hasOnboarded && location.pathname !== '/onboarding' && location.pathname !== '/') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Route transition wrapper
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
        
        {/* Protected Routes */}
        <Route path="/discover" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        <Route path="/hackathons" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        <Route path="/workshops" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        <Route path="/cultural" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><PageWrapper><Discover /></PageWrapper></ProtectedRoute>} />
        
        <Route path="/saved" element={<ProtectedRoute><PageWrapper><Saved /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/opportunity/:id" element={<ProtectedRoute><PageWrapper><OpportunityDetail /></PageWrapper></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;