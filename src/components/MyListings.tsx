import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MyListingsProps {
  onNavigate: (page: string, listingId?: string) => void;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  status: string;
  created_at: string;
}

export default function MyListings({ onNavigate }: MyListingsProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  const loadListings = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setListings(data);
    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(listings.filter((l) => l.id !== id));
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'sold' : 'active';
    await supabase.from('listings').update({ status: newStatus }).eq('id', id);
    setListings(
      listings.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Listings
            </h1>
            <p className="text-gray-600">
              Manage your items for sale
            </p>
          </div>
          <button
            onClick={() => onNavigate('create-listing')}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Listing</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No listings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start selling by creating your first listing
            </p>
            <button
              onClick={() => onNavigate('create-listing')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Listing</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    onClick={() => onNavigate('listing-detail', listing.id)}
                    className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 cursor-pointer"
                  >
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-3xl">📦</div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {listing.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              listing.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {listing.status === 'active' ? 'Active' : 'Sold'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-semibold text-blue-600 text-lg">
                            ${listing.price.toFixed(2)}
                          </span>
                          <span className="capitalize">{listing.condition}</span>
                          <span>
                            {new Date(listing.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => onNavigate('listing-detail', listing.id)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => toggleStatus(listing.id, listing.status)}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                          listing.status === 'active'
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {listing.status === 'active'
                          ? 'Mark as Sold'
                          : 'Mark as Active'}
                      </button>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
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
