import React, { useState } from 'react';
import { ShoppingCart, Briefcase, Save, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { checkContentForViolation } from '../services/moderationService';
import { IUser } from '../data/users';

interface SponsorFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const SponsorForm: React.FC<SponsorFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sponsorName: initialData.sponsorName || '',
    email: initialData.email || '',
    contactName: initialData.contactName || '',
    phone: initialData.phone || '',
    websiteUrl: initialData.websiteUrl || '',
    sponsorshipInterests: initialData.sponsorshipInterests?.join(', ') || '',
    entityType: initialData.entityType || 'Company',
    companyReg: initialData.companyReg || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          name: formData.contactName,
          website: formData.websiteUrl,
          sponsorName: formData.sponsorName,
          companyName: formData.entityType === 'Company' ? formData.sponsorName : '',
          focusAreas: formData.sponsorshipInterests.split(',').map(interest => interest.trim()).filter(interest => interest),
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
          body: JSON.stringify({ ...formData, role: 'SPONSOR' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to submit application.`);
        }

        notify('Sponsor application submitted successfully!', 'success');
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
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart className="text-purple-400" /> Sponsorship Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="sponsorName" onChange={handleChange} value={formData.sponsorName} placeholder="Brand/Organization Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required name="contactName" onChange={handleChange} value={formData.contactName} placeholder="Primary Contact Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Contact Email" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="websiteUrl" onChange={handleChange} value={formData.websiteUrl} placeholder="Website URL" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <textarea name="sponsorshipInterests" rows={3} onChange={handleChange} value={formData.sponsorshipInterests} placeholder="Areas of Interest (e.g., event types, artist tiers)" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <div className="border-t border-kala-700/50"></div>
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="text-green-400" /> Organization Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="entityType" value={formData.entityType} onChange={handleChange} className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white">
          <option>Company</option>
          <option>Foundation</option>
          <option>Charitable Trust</option>
          <option>Individual/Patron</option>
          <option>Other</option>
        </select>
        <input name="companyReg" onChange={handleChange} value={formData.companyReg} placeholder="Registration No. (if applicable)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Submit Sponsor Application')}
      </button>
    </form>
  );
};

export default SponsorForm;
