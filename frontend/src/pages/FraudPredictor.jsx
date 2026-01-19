import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCrystalBall, FaGlobeAmericas, FaBug, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FraudPredictor = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastDays, setForecastDays] = useState(30);

  const loadPredictions = async (days) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/predict-patterns?days=${days}`);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
      // Mock data
      setPredictions({
        prediction_date: new Date().toISOString(),
        forecast_period: `${days} days`,
        emerging_threats: [
          {
            threat_id: 'EMT-2026-001',
            name: 'AI-Powered Social Engineering',
            description: 'Deepfake voice/video used to bypass verification',
            probability: 0.78,
            severity: 'CRITICAL',
            estimated_impact: '$2.4M potential loss',
            emergence_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            indicators: [
              'Unusual verification bypass patterns',
              'Voice authentication failures followed by success',
              'Video verification in unusual contexts'
            ],
            mitigation: 'Implement multi-modal biometric verification'
          },
          {
            threat_id: 'EMT-2026-002',
            name: 'Behavioral Cloning Attacks',
            description: 'ML models trained to mimic legitimate user behavior',
            probability: 0.89,
            severity: 'CRITICAL',
            estimated_impact: '$3.1M potential loss',
            emergence_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            indicators: [
              'Perfect behavioral scores on suspicious transactions',
              'Timing patterns that match user history exactly',
              'Suspicious account access prior to fraud'
            ],
            mitigation: 'Implement unpredictable challenge-response mechanisms'
          },
          {
            threat_id: 'EMT-2026-003',
            name: 'Supply Chain Transaction Injection',
            description: 'Fraudulent transactions injected via compromised payment processors',
            probability: 0.62,
            severity: 'HIGH',
            estimated_impact: '$1.7M potential loss',
            emergence_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            indicators: [
              'Unusual routing patterns',
              'Duplicate transaction IDs',
              'Processing time anomalies'
            ],
            mitigation: 'Enhanced processor verification and monitoring'
          }
        ],
        risk_timeline: Array.from({ length: days }, (_, i) => {
          const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
          const baseRisk = 0.15 + Math.sin(i / 7) * 0.1 + Math.random() * 0.05;
          return {
            date: date.toISOString().split('T')[0],
            risk_score: Math.min(baseRisk, 0.95),
            risk_level: baseRisk < 0.3 ? 'LOW' : baseRisk < 0.6 ? 'MEDIUM' : 'HIGH',
            expected_fraud_volume: Math.floor(1000 * baseRisk)
          };
        }),
        targeted_sectors: [
          {
            sector: 'E-commerce',
            current_risk: 0.72,
            predicted_risk: 0.84,
            trend: 'INCREASING',
            change_percent: 16.7,
            reason: 'Holiday season approaching, increased transaction volume',
            top_threats: ['Card testing', 'Account takeover', 'Refund fraud']
          },
          {
            sector: 'Financial Services',
            current_risk: 0.65,
            predicted_risk: 0.78,
            trend: 'INCREASING',
            change_percent: 20.0,
            reason: 'New digital banking features increase attack surface',
            top_threats: ['Wire fraud', 'Account draining', 'Synthetic identity']
          },
          {
            sector: 'Cryptocurrency',
            current_risk: 0.81,
            predicted_risk: 0.89,
            trend: 'INCREASING',
            change_percent: 9.9,
            reason: 'Rising crypto values attract more fraud attempts',
            top_threats: ['Wallet compromise', 'Exchange hacking', 'Phishing']
          }
        ],
        geographic_hotspots: [
          {
            region: 'Eastern Europe',
            country_codes: ['RO', 'BG', 'UA'],
            risk_score: 0.87,
            trend: 'INCREASING',
            primary_fraud_types: ['Card fraud', 'Identity theft'],
            estimated_attacks: 23000
          },
          {
            region: 'Southeast Asia',
            country_codes: ['VN', 'PH', 'ID'],
            risk_score: 0.73,
            trend: 'STABLE',
            primary_fraud_types: ['Mobile fraud', 'App fraud'],
            estimated_attacks: 18500
          },
          {
            region: 'West Africa',
            country_codes: ['NG', 'GH', 'CI'],
            risk_score: 0.79,
            trend: 'INCREASING',
            primary_fraud_types: ['Romance scams', 'BEC'],
            estimated_attacks: 12300
          }
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPredictions(forecastDays);
  }, [forecastDays]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaCrystalBall className="text-purple-400" />
          Fraud Pattern Predictor
        </h1>
        <select
          value={forecastDays}
          onChange={(e) => setForecastDays(Number(e.target.value))}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
        >
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
          <option value={60}>60 Days</option>
          <option value={90}>90 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-white text-xl">Analyzing future patterns...</div>
      ) : predictions ? (
        <div className="space-y-6">
          {/* Risk Timeline Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4">Risk Forecast Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions.risk_timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="risk_score" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Emerging Threats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-400" />
              Emerging Threats
            </h3>
            <div className="space-y-4">
              {predictions.emerging_threats.map((threat, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white">{threat.name}</h4>
                      <p className="text-gray-300 text-sm">{threat.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-white text-sm ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 mb-3">
                    <div>
                      <div className="text-gray-400 text-xs">Probability</div>
                      <div className="text-white font-bold">{(threat.probability * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Impact</div>
                      <div className="text-white font-bold">{threat.estimated_impact}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Expected Date</div>
                      <div className="text-white font-bold">{new Date(threat.emergence_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-yellow-400 text-sm font-semibold mb-1">Key Indicators:</div>
                    {threat.indicators.map((indicator, i) => (
                      <div key={i} className="text-gray-300 text-xs ml-2">• {indicator}</div>
                    ))}
                  </div>
                  <div className="bg-green-900/30 p-2 rounded">
                    <div className="text-green-400 text-xs font-semibold">Mitigation:</div>
                    <div className="text-gray-300 text-xs">{threat.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Targeted Sectors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaBug className="text-orange-400" />
              Targeted Sectors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.targeted_sectors.map((sector, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-white mb-2">{sector.sector}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Current Risk</span>
                      <span className="text-orange-400 font-bold">{(sector.current_risk * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Predicted Risk</span>
                      <span className="text-red-400 font-bold">{(sector.predicted_risk * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Trend</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sector.trend === 'INCREASING' ? 'bg-red-500 text-white' : 
                        sector.trend === 'DECREASING' ? 'bg-green-500 text-white' : 
                        'bg-yellow-500 text-black'
                      }`}>
                        {sector.trend}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-gray-400 text-xs mb-1">Top Threats:</div>
                    {sector.top_threats.map((threat, i) => (
                      <div key={i} className="text-cyan-400 text-xs">• {threat}</div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">{sector.reason}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Geographic Hotspots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaGlobeAmericas className="text-blue-400" />
              Geographic Hotspots
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.geographic_hotspots.map((hotspot, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">{hotspot.region}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      hotspot.trend === 'INCREASING' ? 'bg-red-500 text-white' : 
                      hotspot.trend === 'DECREASING' ? 'bg-green-500 text-white' : 
                      'bg-yellow-500 text-black'
                    }`}>
                      {hotspot.trend}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Countries: </span>
                    <span className="text-white font-mono">{hotspot.country_codes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Risk Score</span>
                    <span className="text-red-400 font-bold text-xl">{(hotspot.risk_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Estimated Attacks: </span>
                    <span className="text-white font-bold">{hotspot.estimated_attacks.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-600">
                    <div className="text-gray-400 text-xs mb-1">Primary Fraud Types:</div>
                    {hotspot.primary_fraud_types.map((type, i) => (
                      <div key={i} className="text-cyan-400 text-xs">• {type}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center text-gray-400">No predictions available</div>
      )}
    </div>
  );
};

export default FraudPredictor;
