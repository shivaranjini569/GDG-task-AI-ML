import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import RiskChart from '../components/RiskChart';
import RecentTransactions from '../components/RecentTransactions';
import RealTimeMonitor from '../components/RealTimeMonitor';

function Dashboard() {
  const [stats, setStats] = useState({
    total_transactions: 0,
    fraud_detected: 0,
    blocked_transactions: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from backend
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock data - replace with actual API call
      setStats({
        total_transactions: 12543,
        fraud_detected: 127,
        blocked_transactions: 98,
        accuracy: 97.8,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      {/* Header with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="mb-10"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="inline-block"
          style={{ backgroundSize: '200% auto' }}
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
            Fraud Detection Dashboard
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 mt-3 text-lg"
        >
          Real-time transaction monitoring with <span className="text-cyan-400 font-semibold">AI/ML</span>
        </motion.p>
      </motion.div>

      {/* Stats Grid with stagger animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <StatCard
            title="Total Transactions"
            value={stats.total_transactions.toLocaleString()}
            icon={FaClock}
            color="from-blue-500 via-cyan-500 to-teal-500"
            trend={12}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <StatCard
            title="Fraud Detected"
            value={stats.fraud_detected}
            icon={FaExclamationTriangle}
            color="from-red-500 via-pink-500 to-rose-500"
            trend={-8}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <StatCard
            title="Blocked Transactions"
            value={stats.blocked_transactions}
            icon={FaShieldAlt}
            color="from-yellow-500 via-orange-500 to-amber-500"
            trend={5}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <StatCard
            title="Model Accuracy"
            value={`${stats.accuracy}%`}
            icon={FaCheckCircle}
            color="from-green-500 via-emerald-500 to-teal-500"
            trend={2}
          />
        </motion.div>
      </motion.div>

      {/* Real-time Monitor and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="lg:col-span-2"
        >
          <RiskChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <RealTimeMonitor />
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <RecentTransactions />
      </motion.div>
    </div>
  );
}

export default Dashboard;
