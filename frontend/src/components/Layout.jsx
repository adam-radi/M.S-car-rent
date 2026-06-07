import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const shouldUseFlushTop = isHomePage || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0c0c' }}>
      <Navbar />
      <main className={`main-content ${shouldUseFlushTop ? 'main-content--flush' : 'main-content--spaced'}`} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
