import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import TransactionTable from '../components/TransactionTable';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Mock data - replace with API call
      const mockTransactions = [
        {
          id: 'TXN001',
          amount: 1250.50,
          merchant: 'Amazon',
          status: 'approved',
          risk_score: 0.15,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'TXN002',
          amount: 5000,
          merchant: 'Unknown Casino',
          status: 'blocked',
          risk_score: 0.92,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: 'TXN003',
          amount: 899.99,
          merchant: 'Walmart',
          status: 'approved',
          risk_score: 0.08,
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <p className="text-slate-400 mt-1">View and analyze all transactions</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-4 backdrop-blur-sm border border-slate-700 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search transaction ID or merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Transactions</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
            <option value="review">Under Review</option>
          </select>

          {/* Export */}
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <FaDownload />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TransactionTable transactions={transactions} loading={loading} />
      </motion.div>
    </div>
  );
}

export default Transactions;
