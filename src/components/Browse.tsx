import { useState, useEffect } from 'react';
import { Search, Filter, Heart, MapPin, Star, ShieldCheck, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ugandanUniversities } from '../utils/sampleData';
import * as Icons from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
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
  category_id: string;
  location: string;
  views: number;
  profiles: {
    full_name: string;
    verified_student: boolean;
    rating: number;
  };
}

interface BrowseProps {
  onNavigate: (page: string, listingId?: string) => void;
}

export default function Browse({ onNavigate }: BrowseProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
    loadListings();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, selectedLocations]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
  };

  const loadListings = async () => {
    setLoading(true);
    let query = supabase
      .from('listings')
      .select('*, profiles(full_name, verified_student, rating)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (selectedLocations.length > 0) {
      query = query.in('location', selectedLocations);
    }

    const { data } = await query;
    if (data) setListings(data as any);
    setLoading(false);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedLocations([]);
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const loadFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);
    if (data) {
      setFavorites(new Set(data.map((f) => f.listing_id)));
    }
  };

  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (favorites.has(listingId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(listingId);
        return next;
      });
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        listing_id: listingId,
      });
      setFavorites((prev) => new Set(prev).add(listingId));
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find What You Need
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Buy and sell with your campus community
          </p>

          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 flex-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {getIconComponent(category.icon)}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (UGX)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {ugandanUniversities.slice(0, 5).map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer"
              >
                <div
                  onClick={() => onNavigate('listing-detail', listing.id)}
                  className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
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
                      toggleFavorite(listing.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(listing.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 flex-1">
                      {listing.title}
                    </h3>
                    <span className="text-blue-600 font-bold text-lg whitespace-nowrap ml-2">
                      UGX {listing.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.location || 'Campus'}</span>
                    </div>
                    {listing.profiles?.verified_student && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {listing.profiles?.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{listing.views || 0} views</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('listing-detail', listing.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
