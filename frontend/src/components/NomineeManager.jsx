import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '../utils/wallet';
import { Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import SentryInheritanceABI from '../contracts/SentryInheritance.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;

const NomineeManager = ({ user, wallet }) => {
  const [nomineeEmail, setNomineeEmail] = useState(''); // Off-chain email
  const [nomineeAddress, setNomineeAddress] = useState(''); // On-chain address
  const [sharePercentage, setSharePercentage] = useState(''); // On-chain share
  const [currentNomineeOnChain, setCurrentNomineeOnChain] = useState(null); // { address, share }
  const [currentNomineeOffChain, setCurrentNomineeOffChain] = useState(''); // Off-chain email

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
        // Fetch off-chain nominee email
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

        // Fetch on-chain nominee data if contract is available
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
      // Save off-chain email
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ nominee_email: nomineeEmail })
        .eq('id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }
      setCurrentNomineeOffChain(nomineeEmail);

      // Save on-chain nominee if contract is available
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
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="ml-2">Loading Nominee Info...</span>
      </div>
    );
  }

  return (
    <div className="neumorphic-inset rounded-2xl p-6">
      {currentNomineeOffChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current Off-chain Nominee Email: <span className="font-semibold text-accent">{currentNomineeOffChain}</span>
        </div>
      )}
      {currentNomineeOnChain && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Current On-chain Nominee: <span className="font-semibold text-accent">{currentNomineeOnChain.address}</span> (Share: <span className="font-semibold text-accent">{currentNomineeOnChain.share}%</span>)
        </div>
      )}
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
            Nominee's Email Address
=======
            Nominee's Email Address (Off-chain)
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
          </label>
          <input
            id="nomineeEmail"
            type="email"
            value={nomineeEmail}
<<<<<<< HEAD
            onChange={(e) => {
              setNomineeEmail(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setNomineeEmail(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="nominee@example.com"
            required
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
        <div>
          <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's Wallet Address
=======

        <div>
          <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Nominee's BlockDAG Address (On-chain)
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
          </label>
          <input
            id="nomineeAddress"
            type="text"
            value={nomineeAddress}
<<<<<<< HEAD
            onChange={(e) => {
              setNomineeAddress(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setNomineeAddress(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="0x..."
            required
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
=======

>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
        <div>
          <label htmlFor="sharePercentage" className="block text-sm font-medium text-gray-700 mb-2">
            Share Percentage (1-100)
          </label>
          <input
            id="sharePercentage"
            type="number"
            value={sharePercentage}
<<<<<<< HEAD
            onChange={(e) => {
              setSharePercentage(e.target.value);
              setError('');
            }}
=======
            onChange={(e) => setSharePercentage(e.target.value)}
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 50 for 50%"
            required
            min="1"
            max="100"
            disabled={isSaving}
          />
        </div>
<<<<<<< HEAD
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSaving || error ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent/90 text-white'
          }`}
          disabled={isSaving || !!error}
        >
          {isSaving ? 'Saving...' : 'Save Nominee'}
        </button>
      </form>
      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Nominee Added!</h2>
            <p className="mb-6">Nominee details have been saved successfully.</p>
            <button
              className="px-6 py-2 bg-accent text-white rounded-xl font-semibold"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
=======

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent hover:bg-accent/90 text-white'
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Save Nominee On-Chain
            </>
          )}
        </button>
      </form>
>>>>>>> 7449015e2c7871b4e7f0bb34a5c54550e0f30bc1
    </div>
  );
};

export default NomineeManager;
