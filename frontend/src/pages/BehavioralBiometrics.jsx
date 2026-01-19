import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaFingerprint, FaMouse, FaKeyboard, FaMobile, FaShieldAlt } from 'react-icons/fa';

const BehavioralBiometrics = () => {
  const [biometricData, setBiometricData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeBiometrics = async () => {
    setLoading(true);
    
    const mockBiometricData = {
      user_id: 'USR_789',
      typing_data: {
        avg_time: 180,
        variance: 35,
        rhythm_score: 0.7
      },
      mouse_data: {
        speed: 1200,
        curvature: 0.6,
        pauses: 8
      },
      device_data: {
        browser: 'Chrome 120',
        os: 'Windows 11',
        screen_resolution: '1920x1080',
        timezone: 'UTC-5',
        language: 'en-US',
        is_new: false,
        vpn_detected: false,
        tor_detected: false,
        emulator_detected: false
      },
      session_data: {
        duration: 245,
        pages_visited: 7,
        direct_to_payment: false,
        failed_logins: 0,
        rapid_clicks: 3
      }
    };

    try {
      const response = await axios.post('http://localhost:5000/api/biometric-analysis', mockBiometricData);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing biometrics:', error);
      // Mock response
      setAnalysis({
        biometric_risk_score: 0.28,
        risk_level: 'LOW',
        typing_analysis: {
          score: 0.15,
          avg_keystroke_time: 180,
          pattern_match: 0.85,
          anomalies: []
        },
        mouse_analysis: {
          score: 0.25,
          movement_speed: 1200,
          pattern_match: 0.75,
          anomalies: []
        },
        device_analysis: {
          score: 0.1,
          fingerprint: 'a3f8d92bc4e1a567',
          is_known_device: true,
          device_attributes: {
            browser: 'Chrome 120',
            os: 'Windows 11',
            screen: '1920x1080',
            timezone: 'UTC-5',
            language: 'en-US',
            vpn: false,
            tor: false
          }
        },
        session_analysis: {
          score: 0.2,
          pattern_match: 0.8,
          anomalies: []
        },
        confidence: 0.92,
        recommendation: 'ALLOW - Behavioral patterns match user profile'
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    analyzeBiometrics();
  }, []);

  const getRiskColor = (score) => {
    if (score < 0.3) return 'text-green-400';
    if (score < 0.6) return 'text-yellow-400';
    if (score < 0.8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskBg = (score) => {
    if (score < 0.3) return 'bg-green-900/30 border-green-500';
    if (score < 0.6) return 'bg-yellow-900/30 border-yellow-500';
    if (score < 0.8) return 'bg-orange-900/30 border-orange-500';
    return 'bg-red-900/30 border-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaFingerprint className="text-purple-400" />
          Behavioral Biometrics Analysis
        </h1>
        <button
          onClick={analyzeBiometrics}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Analyze Current Session
        </button>
      </div>

      {loading ? (
        <div className="text-center text-white text-xl">Analyzing behavioral patterns...</div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Overall Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg border-2 ${getRiskBg(analysis.biometric_risk_score)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaShieldAlt />
                  Risk Level: {analysis.risk_level}
                </h2>
                <p className="text-gray-300 mt-2">{analysis.recommendation}</p>
                <div className="mt-3 text-sm text-gray-400">
                  Confidence: {(analysis.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getRiskColor(analysis.biometric_risk_score)}`}>
                  {(analysis.biometric_risk_score * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400">Biometric Risk</div>
              </div>
            </div>
          </motion.div>

          {/* Typing Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaKeyboard className="text-blue-400" />
              Typing Pattern Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Risk Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.typing_analysis.score)}`}>
                  {(analysis.typing_analysis.score * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Avg Keystroke Time</div>
                <div className="text-2xl font-bold text-white">
                  {analysis.typing_analysis.avg_keystroke_time}ms
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Pattern Match</div>
                <div className="text-2xl font-bold text-green-400">
                  {(analysis.typing_analysis.pattern_match * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            {analysis.typing_analysis.anomalies.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-yellow-400 font-semibold">Anomalies Detected:</div>
                {analysis.typing_analysis.anomalies.map((anomaly, i) => (
                  <div key={i} className="text-gray-300 text-sm">• {anomaly}</div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Mouse Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMouse className="text-cyan-400" />
              Mouse Behavior Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Risk Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.mouse_analysis.score)}`}>
                  {(analysis.mouse_analysis.score * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Movement Speed</div>
                <div className="text-2xl font-bold text-white">
                  {analysis.mouse_analysis.movement_speed} px/s
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Pattern Match</div>
                <div className="text-2xl font-bold text-green-400">
                  {(analysis.mouse_analysis.pattern_match * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            {analysis.mouse_analysis.anomalies.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-yellow-400 font-semibold">Anomalies Detected:</div>
                {analysis.mouse_analysis.anomalies.map((anomaly, i) => (
                  <div key={i} className="text-gray-300 text-sm">• {anomaly}</div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Device Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMobile className="text-green-400" />
              Device Fingerprint Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Risk Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.device_analysis.score)}`}>
                  {(analysis.device_analysis.score * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Device Status</div>
                <div className="text-2xl font-bold text-green-400">
                  {analysis.device_analysis.is_known_device ? 'Known' : 'New'}
                </div>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-gray-400 text-sm mb-2">Device Fingerprint</div>
              <div className="font-mono text-cyan-400 text-sm">{analysis.device_analysis.fingerprint}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-400">Browser:</span> <span className="text-white">{analysis.device_analysis.device_attributes.browser}</span></div>
                <div><span className="text-gray-400">OS:</span> <span className="text-white">{analysis.device_analysis.device_attributes.os}</span></div>
                <div><span className="text-gray-400">Screen:</span> <span className="text-white">{analysis.device_analysis.device_attributes.screen}</span></div>
                <div><span className="text-gray-400">Timezone:</span> <span className="text-white">{analysis.device_analysis.device_attributes.timezone}</span></div>
                <div><span className="text-gray-400">VPN:</span> <span className={analysis.device_analysis.device_attributes.vpn ? 'text-red-400' : 'text-green-400'}>{analysis.device_analysis.device_attributes.vpn ? 'Yes' : 'No'}</span></div>
                <div><span className="text-gray-400">TOR:</span> <span className={analysis.device_analysis.device_attributes.tor ? 'text-red-400' : 'text-green-400'}>{analysis.device_analysis.device_attributes.tor ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          </motion.div>

          {/* Session Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4">Session Behavior Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Risk Score</div>
                <div className={`text-2xl font-bold ${getRiskColor(analysis.session_analysis.score)}`}>
                  {(analysis.session_analysis.score * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-gray-400 text-sm">Pattern Match</div>
                <div className="text-2xl font-bold text-green-400">
                  {(analysis.session_analysis.pattern_match * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            {analysis.session_analysis.anomalies.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-yellow-400 font-semibold">Anomalies Detected:</div>
                {analysis.session_analysis.anomalies.map((anomaly, i) => (
                  <div key={i} className="text-gray-300 text-sm">• {anomaly}</div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="text-center text-gray-400">No analysis available</div>
      )}
    </div>
  );
};

export default BehavioralBiometrics;
