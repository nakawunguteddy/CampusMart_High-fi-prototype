import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Star, ShieldCheck, Package, ShoppingBag, List, MessageSquare, Settings as SettingsIcon, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onNavigate: (page: string, listingId?: string) => void;
}

interface ProfileData {
  full_name: string;
  phone: string;
  campus_location: string;
  verified_student: boolean;
  rating: number;
  total_ratings: number;
  items_sold: number;
  items_purchased: number;
  member_since: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'purchases' | 'reviews' | 'settings'>('listings');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadMyListings();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as ProfileData);
    }
    setLoading(false);
  };

  const loadMyListings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setMyListings(data as Listing[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        campus_location: profile.campus_location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    setSaving(false);
    alert('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  const activeListingsCount = myListings.filter(l => l.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="pb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                    {profile.verified_student && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">Verified Student</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.campus_location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{profile.rating.toFixed(1)}/5.0</span>
                      <span className="text-gray-500">({profile.total_ratings} ratings)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Items Sold</p>
                    <p className="text-3xl font-bold text-blue-900">{profile.items_sold}</p>
                  </div>
                  <Package className="w-10 h-10 text-blue-600 opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Items Purchased</p>
                    <p className="text-3xl font-bold text-green-900">{profile.items_purchased}</p>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Active Listings</p>
                    <p className="text-3xl font-bold text-purple-900">{activeListingsCount}</p>
                  </div>
                  <List className="w-10 h-10 text-purple-600 opacity-50" />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'listings'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <List className="w-4 h-4" />
                    <span>My Listings</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'purchases'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Purchases</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Reviews</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'settings'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SettingsIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              {activeTab === 'listings' && (
                <div>
                  {myListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No listings yet</p>
                      <button
                        onClick={() => onNavigate('create-listing')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Listing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => onNavigate('listing-detail', listing.id)}
                        >
                          <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                            {listing.images && listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                📦
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {listing.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-600 font-bold">
                                UGX {listing.price.toLocaleString()}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  listing.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {listing.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'purchases' && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No purchases yet</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campus Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profile.campus_location}
                        onChange={(e) =>
                          setProfile({ ...profile, campus_location: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
