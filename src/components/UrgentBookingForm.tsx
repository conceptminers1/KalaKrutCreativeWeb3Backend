import React, { useState } from 'react';
import { X, Calendar, DollarSign, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface UrgentBookingFormProps {
  artistName: string;
  onClose: () => void;
  onSubmit: (details: any) => void;
}

const UrgentBookingForm: React.FC<UrgentBookingFormProps> = ({
  artistName,
  onClose,
  onSubmit,
}) => {
  const { notify } = useToast();
  const [eventName, setEventName] = useState('');
  const [daysUntilEvent, setDaysUntilEvent] = useState('3');
  const [totalRate, setTotalRate] = useState('');
  const [message, setMessage] = useState('');

  const advanceAmount = totalRate
    ? (parseFloat(totalRate) * 0.5).toFixed(2)
    : '0.00';
  const finalPayout = totalRate
    ? (parseFloat(totalRate) * 0.5).toFixed(2)
    : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !totalRate) {
      notify('Please fill in all required fields.', 'error');
      return;
    }

    onSubmit({
      eventName,
      daysUntilEvent,
      totalRate: parseFloat(totalRate),
      message,
      artistName,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-kala-800 border border-kala-700 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-kala-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold text-white">
              Urgent Booking Request
            </h2>
          </div>
          <p className="text-kala-400 mb-6">
            Requesting{' '}
            <span className="font-bold text-white">{artistName}</span> for an
            event in the next 0-6 days.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-kala-300 mb-2 block">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g., 'Warehouse Rave'"
                className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="days"
                className="text-sm font-bold text-kala-300 mb-2 block"
              >
                Days Until Event
              </label>
              <select
                id="days"
                value={daysUntilEvent}
                onChange={(e) => setDaysUntilEvent(e.target.value)}
                className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-red-500 outline-none appearance-none"
              >
                {[...Array(7).keys()].map((i) => (
                  <option key={i} value={i}>
                    {i} day{i !== 1 && 's'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-kala-300 mb-2 block">
                Total Rate (USD)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-kala-500"
                  size={18}
                />
                <input
                  type="number"
                  value={totalRate}
                  onChange={(e) => setTotalRate(e.target.value)}
                  placeholder="e.g., 2000"
                  className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center bg-kala-900/50 p-3 rounded-lg border border-kala-700">
              <div>
                <div className="text-lg font-bold text-green-400">
                  ${advanceAmount}
                </div>
                <div className="text-xs text-kala-400">50% Advance Booking</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  ${finalPayout}
                </div>
                <div className="text-xs text-kala-400">50% Final Payout</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-kala-300 mb-2 block">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide a brief description of the event or your needs."
                className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-red-500 outline-none"
                rows={3}
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3 rounded-lg transition-all"
              >
                Send Urgent Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UrgentBookingForm;
