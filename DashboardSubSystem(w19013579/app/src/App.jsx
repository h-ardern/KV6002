import React from 'react';
import { AuthContextProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import Dashboard from './pages/UserDashboard'; 
import SignIn from './components/SignIn';
import Menu from './components/Menu';
/**
 * 
 * @author Patrick Shaw
 */
function App() {
  return (
    <AuthContextProvider>
      <SignIn />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;