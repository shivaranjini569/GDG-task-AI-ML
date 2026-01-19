import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function TransactionTable({ transactions, loading }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'blocked':
        return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      case 'review':
        return <FaClock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'blocked':
        return 'bg-red-500/20 text-red-300';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full"></div>
        </div>
        <p className="text-slate-400 mt-4">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Transaction ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Merchant</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Risk Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.map((txn, idx) => (
              <motion.tr
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-700/50 transition"
              >
                <td className="px-6 py-4 text-white font-mono">{txn.id}</td>
                <td className="px-6 py-4 text-white font-semibold">${txn.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-300">{txn.merchant}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${txn.risk_score * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      />
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">{Math.round(txn.risk_score * 100)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                    {getStatusIcon(txn.status)}
                    {txn.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {new Date(txn.timestamp).toLocaleTimeString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
