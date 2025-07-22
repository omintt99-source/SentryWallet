import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../utils/wallet';
import { Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import SentryInheritanceABI from '../contracts/SentryInheritance.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;

const NomineeManager = ({ user, wallet }) => {
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [sharePercentage, setSharePercentage] = useState('');
  const [currentNomineeOnChain, setCurrentNomineeOnChain] = useState(null);
  const [currentNomineeOffChain, setCurrentNomineeOffChain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inheritanceContract = CONTRACT_ADDRESS && wallet ? new ethers.Contract(CONTRACT_ADDRESS, SentryInheritanceABI, wallet) : null;

  useEffect(() => {
    const fetchNomineeData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError('');

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('nominee_email')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        if (profileData && profileData.nominee_email) {
          setCurrentNomineeOffChain(profileData.nominee_email);
          setNomineeEmail(profileData.nominee_email);
        }

        if (inheritanceContract && wallet) {
          const onChainShare = await inheritanceContract.nominees(wallet.address);
          if (onChainShare > 0) {
            setCurrentNomineeOnChain({ address: wallet.address, share: onChainShare.toString() });
            setNomineeAddress(wallet.address);
            setSharePercentage(onChainShare.toString());
          }
        }

      } catch (err) {
        setError('Could not fetch nominee information.');
        console.error("Error fetching nominee:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNomineeData();
  }, [user, wallet, inheritanceContract]);

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
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_email: nomineeEmail })
        .eq('id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }
      setCurrentNomineeOffChain(nomineeEmail);

      if (inheritanceContract) {
        const tx = await inheritanceContract.setNominee(nomineeAddress, share);
        await tx.wait();
        setCurrentNomineeOnChain({ address: nomineeAddress, share: sharePercentage });
      }

      setSuccess('Nominee saved successfully!');
      setNomineeEmail('');
      setNomineeAddress('');
      setSharePercentage('');
    } catch (err) {
      setError(err.reason || 'Failed to save nominee. Please try again.');
      console.error("Error saving nominee:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <span className="text-gray-600 font-medium">Loading Nominee Info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="neumorphic-inset rounded-2xl p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50 backdrop-blur-sm">
        {/* Background decoration */}
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
                  <span className="text-purple-700 font-semibold ml-2 font-mono text-xs">{currentNomineeOnChain.address}</span>
                  <span className="text-purple-600 ml-2">({currentNomineeOnChain.share}%)</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label htmlFor="nomineeEmail" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Nominee's Email Address (Off-chain)
              </label>
              <input
                id="nomineeEmail"
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
              <label htmlFor="nomineeAddress" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                Nominee's BlockDAG Address (On-chain)
              </label>
              <input
                id="nomineeAddress"
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
              <label htmlFor="sharePercentage" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Share Percentage (1-100)
              </label>
              <input
                id="sharePercentage"
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

export default NomineeManager;
