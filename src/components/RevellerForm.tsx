import React, { useState } from 'react';
import { Star, Save, Loader2, Wallet } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { checkContentForViolation } from '../services/moderationService';
import { IUser } from '../data/users';

interface RevellerFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const RevellerForm: React.FC<RevellerFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    interests: initialData.interests?.join(', ') || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (checkContentForViolation(Object.values(formData).join(' '))) {
      onBlockUser();
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'edit') {
        const payload = {
          name: formData.name,
          interests: formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest),
        };

        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile.');
        }

        notify('Profile updated successfully!', 'success');
        onComplete();
      } else {
        const url = 'http://localhost:3001/api/join-requests';
        const method = 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role: 'REVELLER' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to submit application.`);
        }

        notify('Welcome to the community! Connect your wallet to get started.', 'success');
        onComplete();
      }
    } catch (error) {
      let message = 'An unknown error occurred.';
      if (error instanceof Error) {
          message = error.message;
      }
      notify(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-8">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Star className="text-purple-400" /> Join as a Reveller</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="name" onChange={handleChange} value={formData.name} placeholder="Your Name or Nickname" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Your Email" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <textarea name="interests" rows={3} onChange={handleChange} value={formData.interests} placeholder="Tell us what you love (e.g., Techno, Live Bands, Digital Art)" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>

      {mode === 'join' && (
        <>
          <div className="border-t border-kala-700/50"></div>
          <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Wallet className="text-kala-secondary w-5 h-5" /> Get Ready to Participate
              </h3>
              <p className="text-sm text-kala-300">
                To buy music, collect NFTs, and participate in auctions, you'll need to connect a crypto wallet. You can do this from your dashboard after completing your registration. This will be your key to the KalaKrut digital economy.
              </p>
          </div>
        </>
      )}

      <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Complete Registration & Enter')}
      </button>
    </form>
  );
};

export default RevellerForm;
