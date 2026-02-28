import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Music,
  Link as LinkIcon,
  Save,
  DollarSign,
  Briefcase,
  ShieldAlert,
  Search,
  BrainCircuit,
  Loader2,
} from 'lucide-react';
import {
  checkContentForViolation,
} from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';
import { searchArtist } from '../services/musicBrainzService';
import { Artist } from '../data/knowledgeGraphSchema';
import { IUser } from '../data/users';

interface ArtistFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
  initialData?: Partial<IUser>;
  mode?: 'join' | 'edit';
}

const notableArtists = [
  'Aphex Twin',
  'Boards of Canada',
  'Autechre',
  'Squarepusher',
  'Flying Lotus',
  'deadmau5',
  'Daft Punk',
  'The Chemical Brothers',
  'Massive Attack',
  'Portishead',
];

const ArtistForm: React.FC<ArtistFormProps> = ({ 
  onComplete, 
  onBlockUser, 
  initialData = {}, 
  mode = 'join' 
}) => {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    stageName: initialData.stageName || '',
    location: initialData.location || '',
    genres: initialData.genres?.join(', ') || '',
    bio: initialData.bio || '',
    portfolioUrl: initialData.portfolioUrl || '',
    ratePerGig: initialData.ratePerGig || '',
    skills: initialData.skills?.join(', ') || '',
    equipment: initialData.equipment?.join(', ') || '',
    musicBrainzId: initialData.musicBrainzId || '',
  });
  const [musicBrainzSearch, setMusicBrainzSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  useEffect(() => {
    if (mode === 'join') {
      const randomArtist = notableArtists[Math.floor(Math.random() * notableArtists.length)];
      setMusicBrainzSearch(randomArtist);
    }
  }, [mode]);

  const handleSearch = async () => {
    if (!musicBrainzSearch) return;
    const results = await searchArtist(musicBrainzSearch);
    setSearchResults(results);
    if (results.length === 0) {
      notify(`No artists found on MusicBrainz matching "${musicBrainzSearch}".`, 'warning');
    }
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setFormData({
      ...formData,
      stageName: artist.name,
      bio: artist.bio || formData.bio,
      musicBrainzId: artist.id,
      genres: artist.genres?.join(', ') || formData.genres,
    });
    setSearchResults([]);
    notify(`Profile bootstrapped with data for ${artist.name}.`, 'success');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        const payload: any = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            location: formData.location,
            tags: formData.genres.split(',').map(tag => tag.trim()).filter(tag => tag),
            artistName: formData.stageName,
            genre: formData.genres.split(',')[0]?.trim(),
            bio: formData.bio,
        };

        if (formData.portfolioUrl) {
            payload.website = formData.portfolioUrl;
        }

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
        // Keep original join logic
        const url = 'http://localhost:3001/api/join-requests';
        const method = 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, role: 'ARTIST' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit application.');
        }

        notify('Application submitted successfully! An admin will review your details.', 'success');
        onComplete();
      }
    } catch (error) {
      let message = 'An unknown error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      notify(message, 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-8">
        {mode === 'join' && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BrainCircuit className="text-kala-secondary w-5 h-5" /> Knowledge Graph Link (Optional)
            </h3>
            <p className="text-sm text-kala-300 mb-2">
              Bootstrap your profile by linking to a MusicBrainz artist entry. This can pre-fill your stage name, bio, and genres.
            </p>
            <div className="flex gap-2">
              <input
                value={musicBrainzSearch}
                onChange={(e) => setMusicBrainzSearch(e.target.value)}
                className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                placeholder="Search for your artist name on MusicBrainz..."
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSubmitting}
                className="bg-kala-secondary text-kala-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" /> Search
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 bg-kala-900/50 border border-kala-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                <h4 className="text-white font-bold mb-2">Select your artist profile:</h4>
                <ul>
                  {searchResults.map((artist) => (
                    <li key={artist.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectArtist(artist)}
                        className="w-full text-left p-2 hover:bg-kala-700 rounded-md transition-colors"
                      >
                        <p className="font-bold">{artist.name}</p>
                        <p className="text-sm text-kala-400 line-clamp-2">{artist.bio}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {selectedArtist && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-green-400 shrink-0" />
                <p className="text-sm text-green-200">
                Profile linked to MusicBrainz artist:{' '}
                <span className="font-bold">{selectedArtist.name}</span>
                </p>
            </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="text-kala-secondary w-5 h-5" /> Legal Name & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">First Name</label>
              <input required name="firstName" onChange={handleChange} value={formData.firstName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Last Name</label>
              <input required name="lastName" onChange={handleChange} value={formData.lastName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                    <input required type="email" name="email" onChange={handleChange} value={formData.email} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="jane@example.com" />
                </div>
                <p className="text-[10px] text-kala-500 mt-1">This will be used for notifications and to log in.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-kala-700/50"></div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Music className="text-purple-400 w-5 h-5" /> Creative Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Artist / Stage Name</label>
                <input required name="stageName" onChange={handleChange} value={formData.stageName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Neon Pulse" />
            </div>
            <div>
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                    <input required name="location" onChange={handleChange} value={formData.location} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="City, Country" />
                </div>
            </div>
            <div>
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Genres</label>
              <input required name="genres" onChange={handleChange} value={formData.genres} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Techno, Ambient, Jazz" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Bio</label>
              <textarea required name="bio" rows={4} onChange={handleChange} value={formData.bio} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary resize-none" placeholder="Tell us about your artistic journey..." />
            </div>
          </div>
        </div>

        <div className="border-t border-kala-700/50"></div>

        <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-green-400 w-5 h-5" /> Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Portfolio / Press Kit URL</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                        <input name="portfolioUrl" onChange={handleChange} value={formData.portfolioUrl} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="https://..." />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Standard Rate (Starting)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                        <input name="ratePerGig" onChange={handleChange} value={formData.ratePerGig} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="500" />
                    </div>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Skills / Assets</label>
                    <input name="skills" onChange={handleChange} value={formData.skills} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Sound Design, Piano, Logic Pro X" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Equipment List (Available for Rent/Use)</label>
                    <input name="equipment" onChange={handleChange} value={formData.equipment} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Fender Strat, Pioneer CDJs" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Profile' : 'Submit Application')}
        </button>
    </form>
  );
};

export default ArtistForm;
