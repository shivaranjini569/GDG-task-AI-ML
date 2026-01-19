import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import ModelInsights from './pages/ModelInsights';
import Alerts from './pages/Alerts';
import AIExplainability from './pages/AIExplainability';
import BehavioralBiometrics from './pages/BehavioralBiometrics';
import FraudPredictor from './pages/FraudPredictor';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
        <ParticleBackground />
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Header />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/models" element={<ModelInsights />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/explainability" element={<AIExplainability />} />
              <Route path="/biometrics" element={<BehavioralBiometrics />} />
              <Route path="/predictor" element={<FraudPredictor />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
