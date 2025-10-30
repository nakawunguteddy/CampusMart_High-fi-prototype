import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FavoritesProps {
  onNavigate: (page: string, listingId?: string) => void;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  profiles: {
    full_name: string;
  };
}

export default function Favorites({ onNavigate }: FavoritesProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('favorites')
      .select('listing_id, listings(*, profiles(full_name))')
      .eq('user_id', user.id);

    if (data) {
      setListings(data.map((f: any) => f.listings).filter(Boolean));
    }
    setLoading(false);
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) return;
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId);
    setListings(listings.filter((l) => l.id !== listingId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorites</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing to find items you love
            </p>
            <button
              onClick={() => onNavigate('browse')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div
                  onClick={() => onNavigate('listing-detail', listing.id)}
                  className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
                >
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400 text-4xl">📦</div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(listing.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div
                  onClick={() => onNavigate('listing-detail', listing.id)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-blue-600 font-bold text-lg whitespace-nowrap ml-2">
                      ${listing.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {listing.condition}
                    </span>
                    <span>{listing.profiles?.full_name || 'Seller'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
