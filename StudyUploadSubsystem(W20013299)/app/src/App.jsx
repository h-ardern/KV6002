import React from 'react';
import { AuthContextProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import SignIn from './components/SignIn';
import Menu from './components/Menu';
import UploadStudy from './pages/UploadStudy';
import ViewStudies from './pages/ViewStudies';
import UploadedStudies from './pages/MyUploadedStudies';

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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/studies" element={<ViewStudies />} />
        <Route path="/upload" element={<UploadStudy />} />
        <Route path="/uploadedstudies" element={<UploadedStudies />} />
       
      </Routes>
    </AuthContextProvider>
  );
}

export default App;