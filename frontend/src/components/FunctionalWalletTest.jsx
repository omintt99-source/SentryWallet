import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { Wallet, DollarSign, Send, UserPlus, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Mock wallet object for testing
const createMockWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    // Mock methods for testing
    getBalance: async () => ethers.utils.parseEther("1234.5678"),
    sendTransaction: async (tx) => {
      console.log('Mock transaction:', tx);
      return {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        wait: async () => ({ status: 1 })
      };
    }
  };
};

const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: null
  }
};

const WalletBalanceTest = ({ wallet }) => {
  const [balance, setBalance] = useState('1,234.5678');
  const [isLoading] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <div className="neumorphic-inset rounded-2xl p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-400/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-emerald-400/10 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-gray-500">Fetching balance...</span>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mb-2">
                <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {balance}
                </span>
                <span className="text-2xl font-semibold text-gray-600 ml-3">tBDAG</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Balance</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SendTransactionTest = ({ wallet }) => {
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
      // Mock transaction
      const mockTx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      });
      setTxHash(`Transaction sent! Hash: ${mockTx.hash}`);
      await mockTx.wait();

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
    <div className="relative overflow-hidden">
      <div className="neumorphic-inset rounded-2xl p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100/50 backdrop-blur-sm">
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
    </div>
  );
};

const NomineeManagerTest = ({ user }) => {
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [sharePercentage, setSharePercentage] = useState('');
  const [currentNomineeOffChain, setCurrentNomineeOffChain] = useState('guardian@example.com');
  const [currentNomineeOnChain, setCurrentNomineeOnChain] = useState({
    address: '0x742d35Cc6634C0532925a3b8D53aE7c',
    share: '50'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    if (!nomineeEmail || !nomineeAddress || !sharePercentage) {
      setError('All fields are required.');
      setIsSaving(false);
      return;
    }

    if (!ethers.utils.isAddress(nomineeAddress)) {
      setError('Invalid nominee BlockDAG address.');
      setIsSaving(false);
      return;
    }

    const share = parseInt(sharePercentage);
    if (isNaN(share) || share <= 0 || share > 100) {
      setError('Share percentage must be a number between 1 and 100.');
      setIsSaving(false);
      return;
    }

    try {
      // Mock saving process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentNomineeOffChain(nomineeEmail);
      setCurrentNomineeOnChain({ address: nomineeAddress, share: sharePercentage });
      
      setSuccess('Nominee saved successfully!');
      setNomineeEmail('');
      setNomineeAddress('');
      setSharePercentage('');
    } catch (err) {
      setError('Failed to save nominee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="neumorphic-inset rounded-2xl p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-400/10 rounded-full blur-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-pink-400/10 rounded-full blur-md"></div>
        </div>
        
        <div className="relative z-10">
          {/* Current Nominees Display */}
          {(currentNomineeOffChain || currentNomineeOnChain) && !error && (
            <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
              <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Current Nominees
              </h3>
              {currentNomineeOffChain && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> 
                  <span className="text-purple-700 font-semibold ml-2">{currentNomineeOffChain}</span>
                </div>
              )}
              {currentNomineeOnChain && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">On-chain:</span> 
                  <span className="text-purple-700 font-semibold ml-2 font-mono text-xs">{currentNomineeOnChain.address}...</span>
                  <span className="text-purple-600 ml-2">({currentNomineeOnChain.share}%)</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Nominee's Email Address (Off-chain)
              </label>
              <input
                type="email"
                value={nomineeEmail}
                onChange={(e) => setNomineeEmail(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder-gray-400"
                placeholder="nominee@example.com"
                required
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                Nominee's BlockDAG Address (On-chain)
              </label>
              <input
                type="text"
                value={nomineeAddress}
                onChange={(e) => setNomineeAddress(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder-gray-400"
                placeholder="0x... BlockDAG address"
                required
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Share Percentage (1-100)
              </label>
              <input
                type="number"
                value={sharePercentage}
                onChange={(e) => setSharePercentage(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder-gray-400"
                placeholder="Enter percentage (e.g., 50)"
                required
                min="1"
                max="100"
                disabled={isSaving}
              />
            </div>

            {error && (
              <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed text-white opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving to Blockchain...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Save Nominee On-Chain
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FunctionalWalletTest = () => {
  const [wallet] = useState(() => createMockWallet());
  const [transactionCount, setTransactionCount] = useState(0);

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

        {/* Test Mode Notice */}
        <motion.div
          className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Shield className="w-5 h-5 mr-3 text-green-600" />
          <div>
            <span className="font-semibold">Functional Test Mode:</span> 
            <span className="ml-2">This wallet dashboard is fully functional with mock blockchain data. Try sending transactions and managing nominees!</span>
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
              <WalletBalanceTest wallet={wallet} />
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
              <SendTransactionTest wallet={wallet} onTransactionSuccess={handleTransactionSuccess} />
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
              <NomineeManagerTest user={mockUser} />
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

export default FunctionalWalletTest;