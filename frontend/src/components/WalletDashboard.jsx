
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Send, UserPlus } from 'lucide-react';
import WalletBalance from './WalletBalance';
import SendTransaction from './SendTransaction';
import NomineeManager from './NomineeManager';
import { supabase } from '../utils/wallet';

const WalletDashboard = ({ wallet }) => {
  const [transactionCount, setTransactionCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (!wallet) {
    return null;
  }

  const handleTransactionSuccess = () => {
    setTransactionCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen gradient-background">
      {/* Enhanced Header Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl flex items-center justify-center neumorphic shadow-xl">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Your Crypto Wallet
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 font-mono text-sm md:text-base break-all bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-primary/10 shadow-lg">
              <span className="text-primary font-semibold">Address:</span> {wallet.address}
            </p>
          </div>
        </motion.div>

        {/* Main Grid Layout - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Your Wallet */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Enhanced Balance Section */}
            <div className="neumorphic rounded-3xl p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-accent">Wallet Balance</h2>
                  <p className="text-gray-600 text-sm">Real-time BlockDAG balance</p>
                </div>
              </div>
              <WalletBalance wallet={wallet} transactionCount={transactionCount} />
            </div>

            {/* Enhanced Send Transaction Section */}
            <div className="neumorphic rounded-3xl p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-accent">Send Transaction</h2>
                  <p className="text-gray-600 text-sm">Transfer funds securely</p>
                </div>
              </div>
              <SendTransaction wallet={wallet} onTransactionSuccess={handleTransactionSuccess} />
            </div>
          </motion.div>

          {/* Right Column - Nominee Manager */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="neumorphic rounded-3xl p-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mr-4">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-accent">Nominee Manager</h2>
                  <p className="text-gray-600 text-sm">On-chain inheritance system</p>
                </div>
              </div>
              <NomineeManager user={user} wallet={wallet} />
            </div>
          </motion.div>
        </div>

        {/* Enhanced Footer Info */}
        <motion.div
          className="mt-12 text-center py-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-primary/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <span className="text-accent font-semibold text-lg">Secured by BlockDAG Network</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your wallet is protected with advanced encryption, social recovery, and operates on the ultra-fast BlockDAG blockchain with gasless transactions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletDashboard;
