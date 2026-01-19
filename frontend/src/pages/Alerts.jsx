import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 5 seconds
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const mockAlerts = [
        {
          id: 'ALERT001',
          type: 'high_risk',
          title: 'Unusual Transaction Amount',
          description: 'Transaction amount $8,500 is 5x user average',
          timestamp: new Date(Date.now() - 120000),
          severity: 'critical',
          status: 'active',
        },
        {
          id: 'ALERT002',
          type: 'geographic_anomaly',
          title: 'Geographic Anomaly Detected',
          description: 'Transaction from London detected, last transaction was in NYC 2 hours ago',
          timestamp: new Date(Date.now() - 300000),
          severity: 'high',
          status: 'active',
        },
        {
          id: 'ALERT003',
          type: 'velocity',
          title: 'High Transaction Velocity',
          description: '12 transactions in the last 30 minutes from this user',
          timestamp: new Date(Date.now() - 600000),
          severity: 'medium',
          status: 'active',
        },
        {
          id: 'ALERT004',
          type: 'fraud_detected',
          title: 'Fraud Detected and Blocked',
          description: 'High-risk transaction automatically blocked',
          timestamp: new Date(Date.now() - 3600000),
          severity: 'critical',
          status: 'resolved',
        },
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-pink-500';
      case 'high':
        return 'from-orange-500 to-red-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <FaExclamationTriangle className="w-5 h-5" />;
      case 'medium':
        return <FaClock className="w-5 h-5" />;
      default:
        return <FaCheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">Security Alerts</h1>
        <p className="text-slate-400 mt-1">Real-time fraud detection and security notifications</p>
      </motion.div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{alerts.filter(a => a.severity === 'critical').length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">High Priority</p>
          <p className="text-3xl font-bold text-orange-500 mt-2">{alerts.filter(a => a.severity === 'high').length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Active Alerts</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{alerts.filter(a => a.status === 'active').length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-500 mt-2">{alerts.filter(a => a.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <motion.div className="space-y-4">
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-r ${getSeverityColor(alert.severity)} rounded-lg p-[1px]`}
          >
            <div className="bg-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`text-${alert.severity === 'critical' ? 'red' : 'orange'}-500 mt-1`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.status === 'active' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-2">
                <span>Alert ID: {alert.id}</span>
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Alerts;
