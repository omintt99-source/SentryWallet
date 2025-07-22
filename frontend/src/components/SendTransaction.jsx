
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Send } from 'lucide-react';

const SendTransaction = ({ wallet, onTransactionSuccess }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAddress || !amount) {
      setError('Please fill in both fields.');
      return;
    }
    if (!ethers.utils.isAddress(toAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
      };

      const transaction = await wallet.sendTransaction(tx);
      setTxHash(`Transaction sent! Hash: ${transaction.hash}`);
      
      await transaction.wait();

      // Notify parent component of success
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }

      // Reset form
      setToAddress('');
      setAmount('');

    } catch (err) {
      console.error("Transaction failed:", err);
      setError(err.reason || 'Transaction failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="neumorphic-inset rounded-2xl p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100/50 backdrop-blur-sm">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-cyan-400/10 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Recipient Address
              </label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder-gray-400"
                placeholder="Enter BlockDAG address (0x...)"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                Amount (tBDAG)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder-gray-400"
                placeholder="Enter amount to send"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div 
                className="flex items-center text-red-600 bg-red-50 p-3 rounded-xl border border-red-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
            
            {txHash && (
              <motion.div 
                className="text-green-600 text-sm break-all bg-green-50 p-3 rounded-xl border border-green-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="font-semibold">Transaction Success!</span>
                </div>
                {txHash}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className={`btn-enhanced w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-white ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              }`}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send tBDAG
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default SendTransaction;
