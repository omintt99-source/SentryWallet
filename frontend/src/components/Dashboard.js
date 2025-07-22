import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, Wallet, Settings, X, Moon, Sun, Copy, CheckCircle, Key } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import WalletManager from './WalletManager';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWalletManager, setShowWalletManager] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Authentication error. Please try logging in again.');
          navigate('/login');
          return;
        }

        if (!session) {
          navigate('/login');
          return;
        }

        setUser(session.user);
      } catch (error) {
        setError('Failed to load user session. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/login');
        } else {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError('Failed to logout. Please try again.');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Network error during logout. Please check your connection.');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  // Profile Modal Component
  const ProfileModal = () => (
    <AnimatePresence>
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-accent flex items-center">
                <User className="w-6 h-6 mr-3" />
                Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <span className="flex-1 text-accent font-medium">{user?.email}</span>
                  <button
                    onClick={() => copyToClipboard(user?.email, 'email')}
                    className="ml-2 p-1 hover:bg-white rounded-lg transition-colors"
                    title="Copy email"
                  >
                    {copied === 'email' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-accent font-medium">{user?.user_metadata?.full_name || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Account Created</label>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-accent font-medium">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Settings Modal Component
  const SettingsModal = () => (
    <AnimatePresence>
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-accent flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  {darkMode ? <Moon className="w-5 h-5 mr-3 text-gray-700" /> : <Sun className="w-5 h-5 mr-3 text-yellow-500" />}
                  <div>
                    <p className="font-medium text-accent">Theme</p>
                    <p className="text-sm text-gray-600">{darkMode ? 'Dark mode' : 'Light mode'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Key className="w-5 h-5 mr-3 text-gray-700" />
                  <p className="font-medium text-accent">Wallet Security</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">Your wallet is encrypted and stored securely in your browser.</p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Encryption enabled</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Connected Network</p>
                <p className="text-sm text-blue-600">BlockDAG Testnet</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (showWalletManager) {
    return (
      <WalletManager 
        user={user} 
        onBack={() => setShowWalletManager(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <span className="text-2xl font-bold text-accent">SentryWallet</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-primary/20"
              />
            )}
            <div className="hidden md:block">
              <span className="text-accent font-medium block">
                {user?.user_metadata?.full_name || 'User'}
              </span>
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Shield className="w-5 h-5 mr-3 text-red-600" />
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}

          {/* Welcome Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
              Welcome to SentryWallet
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your secure crypto wallet is ready to use on the BlockDAG network. 
              Create wallets, manage your funds, and enjoy gasless transactions.
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
              <h3 className="text-xl font-bold text-accent mb-4">Your Wallet</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create and manage your crypto wallets with secure encryption and social recovery features.
              </p>
              <button 
                onClick={() => setShowWalletManager(true)}
                className="flex items-center justify-center w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Open My Wallet
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
              <h3 className="text-xl font-bold text-accent mb-4">Security</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your wallets are secured with password encryption and stored safely in your browser.
              </p>
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center justify-center w-full px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </button>
            </motion.div>

            <motion.div
              className="neumorphic rounded-3xl p-8 text-center group hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-2xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-400/20 transition-all duration-300">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-4">Profile</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your account settings and view your profile information.
              </p>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </button>
            </motion.div>
          </motion.div>

          {/* BlockDAG Network Info */}
          <motion.div
            className="mt-8 text-center py-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-accent mb-2">
              Connected to BlockDAG Testnet
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience lightning-fast transactions with ultra-low fees on the BlockDAG network. 
              Perfect for testing and development.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Modals */}
      <ProfileModal />
      <SettingsModal />
    </div>
  );
};

export default Dashboard;