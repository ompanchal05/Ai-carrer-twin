import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import MinimalFooter from '../components/MinimalFooter/MinimalFooter';
import { useAuth } from '../hooks/useAuth';
import BubbleBackground from '../components/Animations/BubbleBackground';
import CareerTwinChatbot from '../components/Chatbot/CareerTwinChatbot';

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 grid-bg selection:bg-brand-500 selection:text-white transition-colors duration-200 overflow-x-hidden">
      {/* Global floating bubble orbs — behind everything */}
      <BubbleBackground />
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Spacer for fixed navbar height */}
      <div className="h-16 flex-shrink-0" />

      <div className="flex flex-1 w-full">
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${
            showSidebar
              ? 'lg:ml-64 px-4 sm:px-6 lg:px-8 py-6'
              : 'px-4 sm:px-6 lg:px-8 py-6'
          }`}
        >
          {/* For public pages: constrain content width & center it */}
          <div className={isPublicPage ? 'max-w-7xl mx-auto' : ''}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* 24/7 AI Career Twin Chatbot for Authenticated Users */}
      {isAuthenticated && <CareerTwinChatbot />}

      {isPublicPage ? <Footer /> : <MinimalFooter />}
    </div>
  );
};

export default MainLayout;
