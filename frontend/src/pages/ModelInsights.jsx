import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ModelInsights() {
  const [modelData, setModelData] = useState({
    feature_importance: [],
    model_performance: [],
    ensemble_weights: [],
  });

  useEffect(() => {
    fetchModelData();
  }, []);

  const fetchModelData = async () => {
    try {
      const mockData = {
        feature_importance: [
          { name: 'Amount', value: 28, fullMark: 100 },
          { name: 'Transaction Frequency', value: 22, fullMark: 100 },
          { name: 'Geographic Distance', value: 18, fullMark: 100 },
          { name: 'Time of Day', value: 16, fullMark: 100 },
          { name: 'Merchant Category', value: 12, fullMark: 100 },
          { name: 'Device Consistency', value: 10, fullMark: 100 },
        ],
        model_performance: [
          { model: 'XGBoost', accuracy: 97.2, precision: 96.8, recall: 94.5 },
          { model: 'LightGBM', accuracy: 96.8, precision: 96.2, recall: 93.8 },
          { model: 'Random Forest', accuracy: 95.5, precision: 94.9, recall: 92.1 },
          { model: 'Gradient Boosting', accuracy: 94.8, precision: 93.5, recall: 91.2 },
        ],
        ensemble_weights: [
          { model: 'XGBoost', weight: 30 },
          { model: 'LightGBM', weight: 30 },
          { model: 'Random Forest', weight: 20 },
          { model: 'Gradient Boosting', weight: 10 },
          { model: 'Logistic Regression', weight: 5 },
          { model: 'SVM', weight: 5 },
        ],
      };
      setModelData(mockData);
    } catch (error) {
      console.error('Error fetching model data:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">Model Insights</h1>
        <p className="text-slate-400 mt-1">AI/ML ensemble performance and feature analysis</p>
      </motion.div>

      {/* Feature Importance Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Feature Importance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={modelData.feature_importance}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
            <Radar name="Importance" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Individual Model Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelData.model_performance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="model" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="precision" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            <Bar dataKey="recall" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Ensemble Weights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {modelData.ensemble_weights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600 text-center"
          >
            <p className="text-sm text-slate-400">{item.model}</p>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{item.weight}%</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Model Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4"
      >
        <h3 className="text-xl font-semibold text-white">Ensemble Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Method</h4>
            <p className="text-slate-400">Weighted Voting Classifier with Stacking</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Training Data</h4>
            <p className="text-slate-400">500K+ transactions with balanced sampling</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Cross-Validation</h4>
            <p className="text-slate-400">5-fold stratified cross-validation</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Last Updated</h4>
            <p className="text-slate-400">2024-01-18 12:30 UTC</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ModelInsights;
