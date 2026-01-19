import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function RecentTransactions() {
  const transactions = [
    { id: 'TXN001', amount: 1250.50, merchant: 'Amazon', status: 'approved', risk: 0.15 },
    { id: 'TXN002', amount: 5000, merchant: 'Unknown Casino', status: 'blocked', risk: 0.92 },
    { id: 'TXN003', amount: 899.99, merchant: 'Walmart', status: 'approved', risk: 0.08 },
    { id: 'TXN004', amount: 3200, merchant: 'Wire Transfer', status: 'review', risk: 0.62 },
    { id: 'TXN005', amount: 45.99, merchant: 'Starbucks', status: 'approved', risk: 0.05 },
  ];

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

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Transaction ID</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Merchant</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Risk Score</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <motion.tr
                key={txn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition"
              >
                <td className="py-3 px-4 text-white font-mono">{txn.id}</td>
                <td className="py-3 px-4 text-white font-semibold">${txn.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-slate-300">{txn.merchant}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${txn.risk * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      />
                    </div>
                    <span className="text-slate-300 text-xs">{Math.round(txn.risk * 100)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                    {getStatusIcon(txn.status)}
                    {txn.status.toUpperCase()}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full mt-4 text-cyan-400 hover:text-cyan-300 font-medium transition">
        View All Transactions →
      </button>
    </div>
  );
}

export default RecentTransactions;
