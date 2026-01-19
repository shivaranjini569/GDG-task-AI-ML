import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    fraud_trend: [],
    category_distribution: [],
    hourly_transactions: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock data
      const mockData = {
        fraud_trend: [
          { day: 'Mon', legitimate: 450, fraud: 12 },
          { day: 'Tue', legitimate: 520, fraud: 18 },
          { day: 'Wed', legitimate: 380, fraud: 8 },
          { day: 'Thu', legitimate: 610, fraud: 25 },
          { day: 'Fri', legitimate: 780, fraud: 32 },
        ],
        category_distribution: [
          { name: 'Retail', value: 45, fill: '#0ea5e9' },
          { name: 'Travel', value: 25, fill: '#8b5cf6' },
          { name: 'Gaming', value: 18, fill: '#ef4444' },
          { name: 'Other', value: 12, fill: '#10b981' },
        ],
        hourly_transactions: [
          { hour: '00:00', count: 120 },
          { hour: '04:00', count: 85 },
          { hour: '08:00', count: 250 },
          { hour: '12:00', count: 380 },
          { hour: '16:00', count: 420 },
          { hour: '20:00', count: 310 },
        ],
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Comprehensive fraud detection insights</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Weekly Fraud Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.fraud_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Line type="monotone" dataKey="legitimate" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Fraud by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.category_distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.category_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Hourly Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.hourly_transactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export default Analytics;
