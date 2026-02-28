import React, { useState } from 'react';
import { Building, Mail, MapPin, Phone, User, Save, Loader2, Briefcase } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { checkContentForViolation } from '../services/moderationService';
import { IUser } from '../data/users';

interface VenueFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const VenueForm: React.FC<VenueFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    venueName: initialData.venueName || '',
    email: initialData.email || '',
    contactName: initialData.contactName || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',
    capacity: initialData.capacity || '',
    amenities: initialData.amenities?.join(', ') || '',
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
        const capacityAsNumber = formData.capacity ? parseInt(formData.capacity, 10) : undefined;
        
        const payload = {
          name: formData.contactName,
          location: `${formData.city}, ${formData.country}`.trim(),
          venueName: formData.venueName,
          bookingEmail: formData.email,
          address: formData.address,
          capacity: isNaN(capacityAsNumber) ? undefined : capacityAsNumber,
          amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
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
          body: JSON.stringify({ ...formData, role: 'VENUE' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit application.');
        }

        notify('Venue application submitted successfully!', 'success');
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
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Building className="text-purple-400" /> Venue Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="venueName" onChange={handleChange} value={formData.venueName} placeholder="Venue Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required name="capacity" type="number" onChange={handleChange} value={formData.capacity} placeholder="Capacity" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required name="address" onChange={handleChange} value={formData.address} placeholder="Street Address" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required name="city" onChange={handleChange} value={formData.city} placeholder="City" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required name="country" onChange={handleChange} value={formData.country} placeholder="Country" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <textarea name="amenities" onChange={handleChange} value={formData.amenities} placeholder="Key Amenities (e.g., Bar, Stage, Parking)" className="md:col-span-2 bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
      <div className="border-t border-kala-700/50"></div>
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><User className="text-kala-secondary" /> Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="contactName" onChange={handleChange} value={formData.contactName} placeholder="Primary Contact Name" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Contact Email" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Contact Phone (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
      </div>
        <div className="border-t border-kala-700/50"></div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="text-green-400" /> Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="companyName" onChange={handleChange} value={formData.companyName} placeholder="Company Name (If different)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
            <input name="companyReg" onChange={handleChange} value={formData.companyReg} placeholder="Company Registration No. (Optional)" className="bg-kala-900 border border-kala-700 p-2 rounded-lg text-white" />
        </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Submit Venue Application')}
      </button>
    </form>
  );
};

export default VenueForm;
