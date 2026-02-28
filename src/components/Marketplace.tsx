import React, { useState } from 'react';
import { MarketplaceItem, UserRole } from '../types';
import { useData } from '../contexts/DataContext';
import {
  ShoppingBag,
  Clock,
  Search,
  X,
  CheckCircle,
  Plus,
  ShieldAlert,
  UploadCloud,
  MessageCircle,
  Eye,
  Tag,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import {
  checkContentForViolation,
  MODERATION_WARNING_TEXT,
} from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';

interface MarketplaceProps {
  onBlockUser: () => void;
  onChat: (seller: { name: string; avatar: string }) => void;
  currentUserRole: UserRole;
  currentUserId: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  onBlockUser,
  onChat,
  currentUserRole,
  currentUserId,
}) => {
  const { marketItems, addMarketItem } = useData();
  const { notify } = useToast();
  const [filter, setFilter] = useState('All');
  const [viewingItem, setViewingItem] = useState<MarketplaceItem | null>(null);
  const [buyingItem, setBuyingItem] = useState<MarketplaceItem | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // List Item Form State
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState('Physical Art');

  const filters = [
    'All',
    'NFT',
    'Physical Art',
    'Instrument',
    'Ticket',
    'Equipment',
  ];
  const items =
    filter === 'All'
      ? marketItems
      : marketItems.filter((i) => i.type === filter);

  const handleListItem = () => {
    // Content Moderation
    if (checkContentForViolation(newItemTitle)) {
      onBlockUser();
      setIsListModalOpen(false);
      return;
    }

    if (!newItemTitle || !newItemPrice) return;

    const newItem: MarketplaceItem = {
      id: `m-${Date.now()}`,
      sellerId: currentUserId, // Assign ownership
      title: newItemTitle,
      price: parseFloat(newItemPrice),
      currency: 'USD',
      type: newItemType as any,
      image: 'https://picsum.photos/seed/' + Date.now() + '/400/400',
      seller: {
        name: 'You', // This should be updated to reflect the current user's name
        avatar: 'https://picsum.photos/seed/you/50',
        verified: true,
      },
      isAuction: false,
    };

    addMarketItem(newItem);
    notify('Item listed successfully!', 'success');
    setIsListModalOpen(false);
    setNewItemTitle('');
    setNewItemPrice('');
  };
  
  const handleDeleteItem = (itemId: string) => {
    // In a real app, you'd call an API here.
    // For now, we'll just notify.
    notify(`Item ${itemId} deleted. (Mock Action)`, 'success');
    setActiveDropdown(null);
    setViewingItem(null);
  }
  
  const handleEditItem = (item: MarketplaceItem) => {
    // In a real app, this would open an edit modal.
    notify(`Editing ${item.title}. (Mock Action)`, 'info');
    setActiveDropdown(null);
  }

  const handleChat = (item: MarketplaceItem) => {
    onChat({ name: item.seller.name, avatar: item.seller.avatar });
  };

  return (
    <div className="space-y-6 relative" onClick={() => activeDropdown && setActiveDropdown(null)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-kala-secondary" /> Marketplace
          </h2>
          <p className="text-kala-400 text-sm">
            Buy, Sell, Rent & Auction unique creative assets.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsListModalOpen(true)}
            className="bg-kala-secondary text-kala-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> List Item
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
          <input
            type="text"
            placeholder="Search for art, gear, tickets..."
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const canManage = currentUserRole === UserRole.SYSTEM_ADMIN_LIVE || currentUserRole === UserRole.ADMIN || item.sellerId === currentUserId;
          return (
            <div
              key={item.id}
              className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden group hover:border-kala-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden" onClick={() => setViewingItem(item)}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold flex items-center gap-1">
                  {item.type}
                </div>
                {item.isAuction && (
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ends in {item.endTime}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2" onClick={() => setViewingItem(item)}>
                    <img
                      src={item.seller.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-kala-300 truncate max-w-[80px]">
                      {item.seller.name}
                    </span>
                    {item.seller.verified && <CheckBadge />}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChat(item);
                      }}
                      className="text-kala-400 hover:text-white transition-colors p-1"
                      title="Chat with Seller"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    
                    {canManage && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === item.id ? null : item.id)
                          }}
                          className="text-kala-400 hover:text-white transition-colors p-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === item.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-kala-800 border border-kala-700 rounded-md shadow-lg z-20 py-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="w-full text-left px-3 py-1.5 text-sm text-kala-300 hover:bg-kala-700 flex items-center gap-2"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                  )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 mb-1 truncate cursor-pointer" onClick={() => setViewingItem(item)}>
                  {item.title}
                </h3>

                <div className="mt-auto pt-3 border-t border-kala-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-kala-400 uppercase tracking-wider">
                      {item.isAuction ? 'Current Bid' : 'Price'}
                    </p>
                    <p className="text-lg font-mono font-bold text-kala-secondary">
                      {item.price} {item.currency}
                    </p>
                  </div>
                   <button
                      onClick={(e) => {
                         e.stopPropagation();
                         setBuyingItem(item)
                      }}
                      className="px-3 py-2 rounded-lg bg-kala-secondary text-kala-900 hover:bg-cyan-400 transition-colors text-xs font-bold"
                    >
                      {item.isAuction ? 'Bid' : 'Buy'}
                    </button>
                </div>
              </div>
            </div>
        )})}
      </div>

      {/* Modals */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setViewingItem(null)}>
          <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative">
              <img
                src={viewingItem.image}
                alt={viewingItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white font-bold border border-white/10">
                {viewingItem.type}
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {viewingItem.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 bg-kala-800 px-2 py-1 rounded-full border border-kala-700">
                      <img
                        src={viewingItem.seller.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-kala-300 font-bold">
                        {viewingItem.seller.name}
                      </span>
                      {viewingItem.seller.verified && <CheckBadge />}
                    </div>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                  {(currentUserRole === UserRole.SYSTEM_ADMIN_LIVE || currentUserRole === UserRole.ADMIN || viewingItem.sellerId === currentUserId) && (
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === viewingItem.id ? null : viewingItem.id)}
                        className="p-2 bg-kala-800 rounded-full text-white hover:bg-kala-700 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdown === viewingItem.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-kala-800 border border-kala-700 rounded-md shadow-lg z-20 py-1">
                          <button
                            onClick={() => handleEditItem(viewingItem)}
                            className="w-full text-left px-3 py-1.5 text-sm text-kala-300 hover:bg-kala-700 flex items-center gap-2"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(viewingItem.id)}
                            className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => setViewingItem(null)}
                    className="text-kala-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-mono font-bold text-kala-secondary">
                  {viewingItem.price} {viewingItem.currency}
                </span>
                {viewingItem.isAuction && (
                  <div className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Ends in {viewingItem.endTime}
                  </div>
                )}
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-xs font-bold text-kala-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Condition & Type
                  </h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded bg-kala-800 text-kala-300 text-sm border border-kala-700">
                      {viewingItem.condition || 'Pre-owned'}
                    </span>
                    <span className="px-3 py-1 rounded bg-kala-800 text-kala-300 text-sm border border-kala-700">
                      {viewingItem.type}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-kala-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Description
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {viewingItem.description ||
                      'No detailed description provided for this item.'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-kala-800 flex gap-4">
                <button
                  onClick={() => {
                    setViewingItem(null);
                    handleChat(viewingItem);
                  }}
                  className="flex-1 py-3 bg-kala-800 hover:bg-kala-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-kala-600"
                >
                  <MessageCircle className="w-5 h-5" /> Chat Seller
                </button>
                <button
                  onClick={() => {
                    setViewingItem(null);
                    setBuyingItem(viewingItem);
                  }}
                  className="flex-1 py-3 bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
                >
                  {viewingItem.isAuction ? 'Place Bid' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {buyingItem && (
        <PaymentGateway
          amount={buyingItem.price}
          currency={buyingItem.currency}
          itemDescription={buyingItem.title}
          onSuccess={(method) => {
            notify(
              `Transaction initiated via ${method === 'crypto' ? 'Crypto' : 'Fiat'}!`,
              'success'
            );
            setBuyingItem(null);
          }}
          onCancel={() => setBuyingItem(null)}
        />
      )}

      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsListModalOpen(null)}>
          <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
              <h3 className="text-white font-bold">List New Item</h3>
              <button
                onClick={() => setIsListModalOpen(false)}
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

              <div className="border-2 border-dashed border-kala-700 rounded-xl p-6 flex flex-col items-center justify-center text-kala-400 hover:bg-kala-800/30 cursor-pointer transition-colors">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold">Upload Image</span>
              </div>

              <div>
                <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                  Item Title
                </label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                  placeholder="e.g. Gibson Les Paul"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">
                    Type
                  </label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                  >
                    {filters
                      .filter((f) => f !== 'All')
                      .map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleListItem}
                className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckBadge = () => (
  <svg
    className="w-4 h-4 text-cyan-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default Marketplace;
