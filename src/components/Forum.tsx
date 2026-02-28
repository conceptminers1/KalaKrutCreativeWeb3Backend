import React, { useState } from 'react';
import { ForumThread, UserRole } from '../types';
import {
  MessageSquare,
  Users,
  Eye,
  Clock,
  Plus,
  Search,
  X,
  ShieldAlert,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  checkContentForViolation,
  MODERATION_WARNING_TEXT,
} from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';
import { useCanManage } from '@/hooks/usePermissions';
import { useData } from '@/contexts/DataContext';

// CORRECTED: Mock data now aligns with the updated ForumThread type
const getMockThreads = (currentUserId: string): Omit<ForumThread, 'author' | 'authorAvatar'>[] => [
  {
    id: '1',
    authorId: 'user-1',
    title: 'Looking for a bassist for a synthwave project in Brooklyn',
    category: 'Collaboration',
    replies: 14,
    views: 342,
    lastActive: '2h ago',
    isPinned: true,
  },
  {
    id: '2',
    authorId: 'user-2',
    title: 'Selling my Moog Sub 37 - Mint Condition',
    category: 'Gear Swap',
    replies: 5,
    views: 120,
    lastActive: '4h ago',
  },
  {
    id: '3',
    authorId: 'user-2',
    title: 'Tips for efficient DAO proposal drafting?',
    category: 'General',
    replies: 28,
    views: 890,
    lastActive: '1d ago',
  },
  {
    id: '4',
    authorId: 'u_artist',
    title: 'My latest visual set for The Warehouse (Showcase)',
    category: 'Showcase',
    replies: 42,
    views: 1500,
    lastActive: '1d ago',
  },
];

interface ForumProps {
  onBlockUser: () => void;
  currentUserRole: UserRole;
  currentUserId: string;
}

const Forum: React.FC<ForumProps> = ({ onBlockUser, currentUserRole, currentUserId }) => {
  const { notify } = useToast();
  const { getUserById } = useData();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newContent, setNewContent] = useState('');
  const [threads, setThreads] = useState(getMockThreads(currentUserId));
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filters = ['All', 'Collaboration', 'Gear Swap', 'General', 'Showcase'];

  const handleCreateTopic = () => {
    if (checkContentForViolation(`${newTitle} ${newContent}`)) {
      onBlockUser();
      setIsModalOpen(false);
      return;
    }

    if (!newTitle || !newContent) return;

    const newThread: ForumThread = {
      id: Date.now().toString(),
      authorId: currentUserId,
      title: newTitle,
      category: newCategory as any,
      replies: 0,
      views: 0,
      lastActive: 'Just now',
    };

    setThreads([newThread, ...threads]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    notify('Topic posted successfully!', 'success');
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads(threads.filter(t => t.id !== threadId));
    notify(`Thread ${threadId} deleted.`, 'success');
    setActiveDropdown(null);
  };

  const handleEditThread = (thread: ForumThread) => {
    notify(`Editing "${thread.title}". (Not implemented)`, 'info');
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-kala-secondary" /> Community Forum
          </h2>
          <p className="text-kala-400 text-sm">
            Discuss, collaborate, and trade with the collective.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-kala-secondary text-kala-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-900/20"
        >
          <Plus className="w-4 h-4" /> New Topic
        </button>
      </div>

      <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-kala-secondary outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-kala-700 text-white border border-kala-500'
                  : 'bg-kala-900 text-kala-400 border border-kala-700 hover:bg-kala-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {threads
          .filter((t) => filter === 'All' || t.category === filter)
          .map((thread) => {
            const canManage = useCanManage(thread.authorId, currentUserId, currentUserRole);
            const author = getUserById(thread.authorId);

            return (
              <div
                key={thread.id}
                className="bg-kala-800/50 border border-kala-700 rounded-xl p-4 hover:border-kala-500 transition-colors group relative"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <MessageSquare className="w-5 h-5 text-kala-500 group-hover:text-kala-secondary transition-colors" />
                      <span className="text-xs text-kala-400 font-mono">
                        {thread.replies}
                      </span>
                    </div>
                    <div className="cursor-pointer">
                      <h3 className="text-lg font-bold text-white group-hover:text-kala-secondary transition-colors mb-1">
                        {thread.isPinned && (
                          <span className="text-yellow-400 mr-2 text-xs border border-yellow-500/30 bg-yellow-500/10 px-1.5 rounded">
                            PINNED
                          </span>
                        )}
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-kala-400">
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            thread.category === 'Collaboration'
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                              : thread.category === 'Gear Swap'
                                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                : 'bg-kala-700 border-kala-600'
                          }`}
                        >
                          {thread.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <img
                            src={author?.avatar || 'https://picsum.photos/seed/placeholder/50'}
                            className="w-4 h-4 rounded-full"
                          />
                          {author?.name || 'Unknown User'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {thread.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end text-xs text-kala-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {thread.views}
                    </div>
                  </div>

                  {canManage && (
                    <div className="absolute top-2 right-2">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === thread.id ? null : thread.id
                            )
                          }
                          className="p-1.5 bg-kala-900/50 rounded-full text-kala-400 hover:bg-kala-700 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === thread.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-kala-800 border border-kala-700 rounded-md shadow-lg z-10 py-1">
                            <button
                              onClick={() => handleEditThread(thread as ForumThread)}
                              className="w-full text-left px-3 py-1.5 text-sm text-kala-300 hover:bg-kala-700 flex items-center gap-2"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteThread(thread.id)}
                              className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
              <h3 className="text-white font-bold">Start New Discussion</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-kala-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200">
                  {MODERATION_WARNING_TEXT}
                </p>
              </div>

              <div>
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                  placeholder="e.g. Need advice on..."
                />
              </div>

              <div>
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                >
                  <option>General</option>
                  <option>Collaboration</option>
                  <option>Gear Swap</option>
                  <option>Showcase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                  Content
                </label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                onClick={handleCreateTopic}
                className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors"
              >
                Post Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
