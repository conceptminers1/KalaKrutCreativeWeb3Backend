import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Save, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { checkContentForViolation } from '../services/moderationService';
import { IUser } from '../data/users';

interface OrganizerFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const OrganizerForm: React.FC<OrganizerFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizerName: initialData.organizerName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    bio: initialData.bio || '',
    websiteUrl: initialData.websiteUrl || '',
    organizerType: initialData.organizerType || 'Independent Promoter',
    companyName: initialData.companyName || '',
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
          name: formData.organizerName,
          website: formData.websiteUrl,
          organizerName: formData.organizerName,
          organization: formData.companyName,
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
          body: JSON.stringify({ ...formData, role: 'ORGANIZER' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to submit application.`);
        }

        notify('Organizer application submitted successfully!', 'success');
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
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><User className="text-purple-400" /> Organizer Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="organizerName" onChange={handleChange} value={formData.organizerName} placeholder="Organizer/Promoter Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <select name="organizerType" value={formData.organizerType} onChange={handleChange} className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white">
          <option>Independent Promoter</option>
          <option>Event Planning Company</option>
          <option>Venue Promoter</option>
          <option>Ticketing Platform</option>
          <option>Other</option>
        </select>
        <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Contact Email" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="websiteUrl" onChange={handleChange} value={formData.websiteUrl} placeholder="Website/Social Media URL" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <textarea required name="bio" rows={4} onChange={handleChange} value={formData.bio} placeholder="Brief bio (types of events, experience)" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <div className="border-t border-kala-700/50"></div>
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="text-green-400" /> Company Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="companyName" onChange={handleChange} value={formData.companyName} placeholder="Company Name (If applicable)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="companyReg" onChange={handleChange} value={formData.companyReg} placeholder="Company Registration No. (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Submit Organizer Application')}
      </button>
    </form>
  );
};

export default OrganizerForm;
