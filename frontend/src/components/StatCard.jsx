import React from 'react';
import { motion } from 'framer-motion';

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="relative overflow-hidden rounded-xl cursor-pointer group"
    >
      {/* Animated gradient border */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: '200% 200%' }}
      />
      
      {/* Card content */}
      <div className="relative bg-slate-800/95 backdrop-blur-xl m-[2px] rounded-xl p-6 space-y-4">
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
        
        <div className="flex items-center justify-between relative z-10">
          <p className="text-slate-400 text-sm font-medium tracking-wide">{title}</p>
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        
        <div className="space-y-2 relative z-10">
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
          >
            {value}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <motion.span
              animate={{
                y: trend >= 0 ? [-2, 0, -2] : [0, 2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`text-sm font-bold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {trend >= 0 ? '↑' : '↓'}
            </motion.span>
            <p className={`text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(trend)}% from last week
            </p>
          </motion.div>
        </div>
        
        {/* Glow effect on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
        />
      </div>
    </motion.div>
  );
}

export default StatCard;
