import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBrain, FaTree, FaChartLine, FaLightbulb } from 'react-icons/fa';

const AIExplainability = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockTransaction = {
    transaction_id: 'TXN_12345',
    amount: 2500,
    merchant: 'Online Electronics Store',
    merchant_risk_score: 0.75,
    location: 'Romania',
    is_international: true,
    transaction_hour: 3,
    velocity_1h: 5,
    user_id: 'USR_789'
  };

  const explainTransaction = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/explain', mockTransaction);
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error explaining transaction:', error);
      // Use mock data for demo
      setExplanation({
        decision: 'FRAUD',
        confidence: 0.87,
        risk_score: 0.89,
        decision_path: [
          {
            node: 1,
            feature: 'transaction_amount',
            condition: 'amount > 1000',
            decision: 'HIGH_RISK_PATH',
            samples: 1245,
            fraud_rate: 0.73
          },
          {
            node: 2,
            feature: 'merchant_risk',
            condition: 'merchant_risk > 0.7',
            decision: 'SUSPICIOUS_MERCHANT',
            samples: 445,
            fraud_rate: 0.89
          },
          {
            node: 3,
            feature: 'location',
            condition: 'international_transaction',
            decision: 'CROSS_BORDER_FLAG',
            samples: 312,
            fraud_rate: 0.65
          }
        ],
        top_factors: [
          {
            factor: 'High Transaction Amount',
            value: '$2500.00',
            impact: 'INCREASES_RISK',
            weight: 0.25,
            explanation: 'Amount $2500.00 is 3.2x above user average'
          },
          {
            factor: 'Suspicious Merchant',
            value: '75.0%',
            impact: 'INCREASES_RISK',
            weight: 0.22,
            explanation: 'Merchant has 47% fraud rate in last 30 days'
          },
          {
            factor: 'International Transaction',
            value: 'Romania',
            impact: 'INCREASES_RISK',
            weight: 0.18,
            explanation: 'User has never transacted from this country before'
          }
        ],
        feature_impacts: {
          amount: 0.18,
          merchant_risk: 0.15,
          international: 0.14,
          unusual_time: 0.12,
          velocity: 0.15
        },
        model_reasoning: 'This transaction shows multiple high-risk indicators: the amount ($2500.00) is significantly above normal, the merchant has a poor reputation score, and the transaction pattern deviates from the user\'s typical behavior.'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    explainTransaction();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaBrain className="text-cyan-400" />
          AI Explainability Dashboard
        </h1>
        <button
          onClick={explainTransaction}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Analyze New Transaction
        </button>
      </div>

      {loading ? (
        <div className="text-center text-white text-xl">Analyzing transaction...</div>
      ) : explanation ? (
        <div className="space-y-6">
          {/* Decision Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg ${
              explanation.decision === 'FRAUD' ? 'bg-red-900/30 border-2 border-red-500' : 'bg-green-900/30 border-2 border-green-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{explanation.decision}</h2>
                <p className="text-gray-300 mt-2">{explanation.model_reasoning}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">{(explanation.risk_score * 100).toFixed(1)}%</div>
                <div className="text-gray-400">Risk Score</div>
                <div className="text-sm mt-2 text-gray-300">Confidence: {(explanation.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </motion.div>

          {/* Decision Tree Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaTree className="text-green-400" />
              Decision Tree Path
            </h3>
            <div className="space-y-4">
              {explanation.decision_path.map((node, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Node {node.node}
                  </div>
                  <div className="flex-1 bg-gray-700 p-4 rounded-lg">
                    <div className="font-semibold text-white">{node.feature}</div>
                    <div className="text-gray-300 text-sm">{node.condition}</div>
                    <div className="mt-2 text-xs text-gray-400">
                      {node.samples && `Samples: ${node.samples} | Fraud Rate: ${(node.fraud_rate * 100).toFixed(1)}%`}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded ${
                    node.decision.includes('HIGH_RISK') || node.decision.includes('FRAUD') 
                      ? 'bg-red-500 text-white' 
                      : node.decision.includes('SUSPICIOUS')
                      ? 'bg-yellow-500 text-black'
                      : 'bg-green-500 text-white'
                  }`}>
                    {node.decision}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contributing Factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-yellow-400" />
              Top Contributing Factors
            </h3>
            <div className="space-y-3">
              {explanation.top_factors.map((factor, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white">{factor.factor}</div>
                    <div className="text-cyan-400 font-bold">{(factor.weight * 100).toFixed(0)}% impact</div>
                  </div>
                  <div className="text-gray-300 text-sm mb-2">{factor.explanation}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Value:</span>
                    <span className="text-white font-semibold">{factor.value}</span>
                    <span className={`ml-auto px-2 py-1 rounded text-xs ${
                      factor.impact === 'INCREASES_RISK' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {factor.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Impact Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaLightbulb className="text-purple-400" />
              Feature Impact (SHAP-like Values)
            </h3>
            <div className="space-y-3">
              {Object.entries(explanation.feature_impacts).map(([feature, impact]) => (
                <div key={feature}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 capitalize">{feature.replace('_', ' ')}</span>
                    <span className="text-white font-semibold">{(impact * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${impact > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.abs(impact) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center text-gray-400">No explanation available</div>
      )}
    </div>
  );
};

export default AIExplainability;
