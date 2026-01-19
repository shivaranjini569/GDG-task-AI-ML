import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

function RealTimeMonitor() {
  const recentAlerts = [
    { id: 1, title: 'High amount transaction', risk: 0.92, time: '2 min ago' },
    { id: 2, title: 'Geographic anomaly', risk: 0.78, time: '5 min ago' },
    { id: 3, title: 'Velocity exceeded', risk: 0.65, time: '8 min ago' },
    { id: 4, title: 'Unusual time pattern', risk: 0.58, time: '12 min ago' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-white mb-1">Real-Time Alerts</h3>
        <p className="text-slate-400 text-sm">Last 24 hours</p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentAlerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-red-500 transition"
          >
            <div className="text-red-500 mt-1">
              <FaExclamationTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{alert.title}</p>
              <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <p className="text-sm font-bold text-white">{Math.round(alert.risk * 100)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium transition">
        View All Alerts
      </button>
    </div>
  );
}

export default RealTimeMonitor;
