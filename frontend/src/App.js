import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import WalletDemo from "./components/WalletDemo";
import TestDashboard from "./components/TestDashboard";
import FunctionalWalletTest from "./components/FunctionalWalletTest";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo" element={<WalletDemo />} />
          <Route path="/test" element={<TestDashboard />} />
          <Route path="/functional" element={<FunctionalWalletTest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;