import React from "react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import SignIn from "./components/SignIn";
import Menu from "./components/Menu";
import Search from "./components/Search";
import UploadStudy from './pages/UploadStudy';
import ViewStudies from './pages/ViewStudies';
import UploadedStudies from './pages/MyUploadedStudies';
import Dashboard from './pages/UserDashboard'; 
/**
 *
 * @author Patrick Shaw
 * @author Odera Anakpe
 * @author Joshua Marfleet
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
        <Route path="/search" element={<Search />} />
        <Route path="/studies" element={<ViewStudies />} />
        <Route path="/upload" element={<UploadStudy />} />
        <Route path="/uploadedstudies" element={<UploadedStudies />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
