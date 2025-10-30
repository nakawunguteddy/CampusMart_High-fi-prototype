import { useState } from 'react';
import { Menu, X, Search, Plus, Heart, MessageSquare, User, LogOut, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // new: central sign-out handler — awaits signOut if it's async, closes menus, then navigate to browse
  const handleSignOut = async () => {
    try {
      // signOut may be sync or async; await if it returns a promise
      await (signOut?.() as Promise<void> | void);
    } catch (err) {
      // keep minimal logging; UI error handling can be added later
      // eslint-disable-next-line no-console
      console.error('Sign out failed', err);
    } finally {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      onNavigate('browse');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('browse')}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="relative z-10">
                  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14C8 11.7909 9.79086 10 12 10H18C18.5523 10 19 10.4477 19 11V24C19 24.5523 18.5523 25 18 25H12C9.79086 25 8 23.2091 8 21V14Z" fill="white" fillOpacity="0.9"/>
                    <path d="M29 11C29 10.4477 29.4477 10 30 10H36C38.2091 10 40 11.7909 40 14V37C40 37.5523 39.5523 38 39 38H30C29.4477 38 29 37.5523 29 37V11Z" fill="white" fillOpacity="0.9"/>
                    <path d="M19 24H29V31C29 31.5523 28.5523 32 28 32H20C19.4477 32 19 31.5523 19 31V24Z" fill="white" fillOpacity="0.9"/>
                    <circle cx="24" cy="17" r="2" fill="#10B981"/>
                    <rect x="21" y="28" width="6" height="2" rx="1" fill="#10B981"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">CampusMart</span>
            </button>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate('browse')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'browse'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Browse
              </button>
              {user && (
                <>
                  <button
                    onClick={() => onNavigate('my-listings')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'my-listings'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    My Listings
                  </button>
                  <button
                    onClick={() => onNavigate('favorites')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'favorites'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Favorites
                  </button>
                  <button
                    onClick={() => onNavigate('messages')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'messages'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Messages
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('create-listing')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sell Item</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          // replaced direct signOut() with handler that also navigates to browse
                          handleSignOut();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                onNavigate('browse');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Browse
            </button>
            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('create-listing');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sell Item
                </button>
                <button
                  onClick={() => {
                    onNavigate('my-listings');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Listings
                </button>
                <button
                  onClick={() => {
                    onNavigate('favorites');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Favorites
                </button>
                <button
                  onClick={() => {
                    onNavigate('messages');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    // replaced direct signOut() with handler so browse is loaded after sign out
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
