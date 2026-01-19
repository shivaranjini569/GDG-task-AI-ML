import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCog, FaBell, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'High-risk transaction detected', time: '2 min ago', type: 'alert' },
    { id: 2, message: 'Model accuracy improved to 97.8%', time: '1 hour ago', type: 'success' },
    { id: 3, message: 'New fraud pattern identified', time: '3 hours ago', type: 'info' }
  ]);

  const handleExportReport = async () => {
    toast.loading('Generating report...');
    try {
      const response = await axios.post('http://localhost:5000/api/export-report', {
        type: 'summary',
        date_range: { start: '2026-01-01', end: '2026-01-18' }
      });
      
      // Create downloadable file
      const dataStr = JSON.stringify(response.data.report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fraud-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast.dismiss();
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate report');
      console.error(error);
    }
  };

  const handleSettingsClick = () => {
    toast.success('Settings panel opening...');
    // Navigate to settings or open modal
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">Welcome back,</p>
        <p className="text-xl font-semibold text-white">Security Admin</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Export Report */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleExportReport}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition"
        >
          <FaDownload />
          <span className="hidden md:inline">Export Report</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer"
          >
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition">
              <FaBell className="w-5 h-5 text-slate-300" />
            </div>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
            >
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer"
                  >
                    <p className="text-white text-sm">{notif.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-cyan-400 text-sm hover:text-cyan-300">
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSettingsClick}
          className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition"
        >
          <FaCog className="w-5 h-5 text-slate-300" />
        </motion.button>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => toast.success('Profile menu opening...')}
          className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center cursor-pointer"
        >
          <FaUser className="w-5 h-5 text-white" />
        </motion.div>
      </div>
    </header>
  );
}

export default Header;
