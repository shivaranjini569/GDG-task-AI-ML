import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

function RiskChart() {
  const data = [
    { time: '00:00', risk: 0.15, transactions: 120 },
    { time: '04:00', risk: 0.22, transactions: 85 },
    { time: '08:00', risk: 0.18, transactions: 250 },
    { time: '12:00', risk: 0.28, transactions: 380 },
    { time: '16:00', risk: 0.35, transactions: 420 },
    { time: '20:00', risk: 0.42, transactions: 310 },
    { time: '23:59', risk: 0.38, transactions: 200 },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">Average Risk Score Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 1]} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskChart;
