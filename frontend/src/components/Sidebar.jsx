import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaChartBar, FaExchangeAlt, FaBrain, FaBell, FaLightbulb, FaFingerprint, FaCrystalBall } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FaChartBar },
    { path: '/transactions', label: 'Transactions', icon: FaExchangeAlt },
    { path: '/analytics', label: 'Analytics', icon: FaChartBar },
    { path: '/models', label: 'ML Models', icon: FaBrain },
    { path: '/alerts', label: 'Alerts', icon: FaBell },
    { path: '/explainability', label: 'AI Explainability', icon: FaLightbulb },
    { path: '/biometrics', label: 'Biometrics', icon: FaFingerprint },
    { path: '/predictor', label: 'Fraud Predictor', icon: FaCrystalBall },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 p-6 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <FaShieldAlt className="text-white text-xl" />
        </div>
        <div>
          <p className="font-bold text-white text-lg">FraudShield</p>
          <p className="text-xs text-cyan-400 font-semibold">AI Detection</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-700 space-y-4">
        <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
          <p className="text-xs text-slate-400 mb-3">System Status</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
            <p className="text-sm font-bold text-green-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
