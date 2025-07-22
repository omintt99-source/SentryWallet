import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Wallet, ArrowLeft } from 'lucide-react';
import WalletManager from './WalletManager';

// Mock user object for testing
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: null
  },
  created_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString()
};

const TestDashboard = () => {
  const navigate = useNavigate();
  const [showWalletManager, setShowWalletManager] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  if (showWalletManager) {
    return (
      <WalletManager 
        user={mockUser} 
        onBack={() => setShowWalletManager(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <span className="text-2xl font-bold text-accent">SentryWallet</span>
            <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">TEST MODE</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100"
              title="Go to Real Login"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <span className="text-accent font-medium block">
                {mockUser.user_metadata.full_name}
              </span>
              <span className="text-sm text-gray-600">
                {mockUser.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Test Mode Notice */}
          <motion.div
            className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-2xl flex items-center shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Shield className="w-5 h-5 mr-3 text-yellow-600" />
            <div>
              <span className="font-semibold">Test Mode Active:</span> 
              <span className="ml-2">This is a testing environment to demonstrate the new wallet dashboard UI without requiring authentication.</span>
            </div>
          </motion.div>

          {/* Welcome Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
              Welcome to SentryWallet
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your secure crypto wallet is ready to use on the BlockDAG network. 
              Click below to test the new wallet interface!
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="neumorphic rounded-3xl p-8 text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Test New Wallet UI</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Experience the new side-by-side wallet interface with enhanced visual design and improved user experience.
              </p>
              <button 
                onClick={() => setShowWalletManager(true)}
                className="flex items-center justify-center w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Open Wallet Dashboard
              </button>
            </motion.div>

            <motion.div
              className="neumorphic rounded-3xl p-8 text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">View Demo</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                See the static demo version of the new wallet interface without any functionality.
              </p>
              <button 
                onClick={() => navigate('/demo')}
                className="flex items-center justify-center w-full px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <Shield className="w-4 h-4 mr-2" />
                View Demo
              </button>
            </motion.div>

            <motion.div
              className="neumorphic rounded-3xl p-8 text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-2xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-400/20 transition-all duration-300">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Real Login</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access the real authentication system with Supabase integration.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4 mr-2" />
                Go to Login
              </button>
            </motion.div>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            className="neumorphic rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-accent mb-6 flex items-center">
              <User className="w-6 h-6 mr-3" />
              Test Account Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <p className="text-accent font-medium bg-gray-50 rounded-lg px-4 py-2">
                    {mockUser.email}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-accent font-medium bg-gray-50 rounded-lg px-4 py-2">
                    {mockUser.user_metadata.full_name}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Sign In
                  </label>
                  <p className="text-accent font-medium bg-gray-50 rounded-lg px-4 py-2">
                    {new Date(mockUser.last_sign_in_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Account Created
                  </label>
                  <p className="text-accent font-medium bg-gray-50 rounded-lg px-4 py-2">
                    {new Date(mockUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default TestDashboard;