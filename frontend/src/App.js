import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import './styles/responsive.css';
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
