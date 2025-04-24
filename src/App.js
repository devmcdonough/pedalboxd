import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/shared/layout/layout';
import HomePage from './components/views/home-page/home-page';
import Searchpage from './components/views/search-page/search-page';
import Detailpage from './components/views/detail-page/detail-page';
import Settingspage from './components/views/settings-page/settings-page';
import LoginPage from './components/views/login-page/login-page';
import RegistrationPage from './components/views/registration-page/registration-page';
import './App.css';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Searchpage />} />
        <Route path="/pedals/:id" element={<Detailpage />} />
        <Route path="/settings" element={<Settingspage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
      </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App;
