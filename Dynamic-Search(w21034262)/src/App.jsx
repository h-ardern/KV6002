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
/**
 *
 * @author Patrick Shaw
 * @author Odera Anakpe
 */
function App() {
  return (
    <AuthContextProvider>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
