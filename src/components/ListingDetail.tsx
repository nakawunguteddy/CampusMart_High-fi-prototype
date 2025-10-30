import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageSquare, User, Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ListingDetailProps {
  listingId: string;
  onNavigate: (page: string, listingId?: string) => void;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  created_at: string;
  seller_id: string;
  profiles: {
    full_name: string;
    phone: string;
  };
  categories: {
    name: string;
  };
}

export default function ListingDetail({ listingId, onNavigate }: ListingDetailProps) {
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadListing();
    if (user) {
      checkFavorite();
    }
  }, [listingId, user]);

  const loadListing = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(full_name, phone), categories(name)')
      .eq('id', listingId)
      .maybeSingle();
    if (data) setListing(data as any);
  };

  const checkFavorite = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listingId)
      .maybeSingle();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        listing_id: listingId,
      });
      setIsFavorite(true);
    }
  };

  const sendMessage = async () => {
    if (!user || !listing) {
      onNavigate('auth');
      return;
    }

    setSending(true);
    await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: listing.seller_id,
      content: message,
    });
    setSending(false);
    setShowMessageModal(false);
    setMessage('');
    alert('Message sent!');
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('browse')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-8xl">📦</div>
                  </div>
                )}
              </div>
            </div>

            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      selectedImage === idx
                        ? 'ring-4 ring-blue-600'
                        : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${listing.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
                    {listing.categories?.name || 'Uncategorized'}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                </div>
                {!isOwner && (
                  <button
                    onClick={toggleFavorite}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                )}
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-6">
                ${listing.price.toFixed(2)}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Tag className="w-5 h-5" />
                  <span>Condition: <span className="font-medium capitalize">{listing.condition}</span></span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Listed {new Date(listing.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>Seller: <span className="font-medium">{listing.profiles?.full_name}</span></span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {!isOwner && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Contact Seller</span>
                </button>
              )}

              {isOwner && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm">
                  This is your listing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Send Message
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, is this item still available?"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
