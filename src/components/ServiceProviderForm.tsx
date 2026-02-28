import React, { useState } from 'react';
import { Wrench, Briefcase, Save, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { checkContentForViolation } from '../services/moderationService';
import { IUser } from '../data/users';

interface ServiceProviderFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceProviderName: initialData.serviceProviderName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    servicesOffered: initialData.servicesOffered?.join(', ') || '',
    portfolioUrl: initialData.portfolioUrl || '',
    companyName: initialData.companyName || '',
    companyReg: initialData.companyReg || '',
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
          name: formData.serviceProviderName,
          website: formData.portfolioUrl,
          serviceProviderName: formData.serviceProviderName,
          serviceType: formData.servicesOffered.split(',')[0]?.trim(),
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
          body: JSON.stringify({ ...formData, role: 'SERVICE_PROVIDER' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to submit application.`);
        }

        notify('Service Provider application submitted successfully!', 'success');
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
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Wrench className="text-purple-400" /> Service Provider Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="serviceProviderName" onChange={handleChange} value={formData.serviceProviderName} placeholder="Your Name / Business Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Contact Email" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="portfolioUrl" onChange={handleChange} value={formData.portfolioUrl} placeholder="Portfolio/Website URL" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <textarea required name="servicesOffered" rows={4} onChange={handleChange} value={formData.servicesOffered} placeholder="Services Offered (e.g., Sound Engineering, Lighting Design)" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <div className="border-t border-kala-700/50"></div>
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="text-green-400" /> Company Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="companyName" onChange={handleChange} value={formData.companyName} placeholder="Company Name (If applicable)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="companyReg" onChange={handleChange} value={formData.companyReg} placeholder="Company Registration No. (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Submit Service Provider Application')}
      </button>
    </form>
  );
};

export default ServiceProviderForm;
