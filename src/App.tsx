import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Browse from './components/Browse';
import ListingDetail from './components/ListingDetail';
import CreateListing from './components/CreateListing';
import MyListings from './components/MyListings';
import Messages from './components/Messages';
import Favorites from './components/Favorites';
import Profile from './components/Profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('browse');
  const [selectedListingId, setSelectedListingId] = useState<string>('');

  const handleNavigate = (page: string, listingId?: string) => {
    setCurrentPage(page);
    if (listingId) setSelectedListingId(listingId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      {currentPage === 'auth' && <Auth onNavigate={handleNavigate} />}
      {currentPage === 'browse' && <Browse onNavigate={handleNavigate} />}
      {currentPage === 'listing-detail' && (
        <ListingDetail listingId={selectedListingId} onNavigate={handleNavigate} />
      )}
      {currentPage === 'create-listing' && user && (
        <CreateListing onNavigate={handleNavigate} />
      )}
      {currentPage === 'my-listings' && user && (
        <MyListings onNavigate={handleNavigate} />
      )}
      {currentPage === 'messages' && user && (
        <Messages onNavigate={handleNavigate} />
      )}
      {currentPage === 'favorites' && user && (
        <Favorites onNavigate={handleNavigate} />
      )}
      {currentPage === 'profile' && user && (
        <Profile onNavigate={handleNavigate} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
