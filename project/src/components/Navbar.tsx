import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Video, Upload, Library, User, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';
import Auth from './Auth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">VideoStream</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/upload"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/upload') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Upload
              </Link>
              <Link
                to="/library"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/library') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Library
              </Link>
            </div>

            {/* User Menu */}
            <div className="hidden md:block">
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-700">
                        {user.email}
                      </span>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                    >
                      Sign In
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="container mx-auto px-4 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/upload"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/upload') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Upload
              </Link>
              <Link
                to="/library"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/library') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Library
              </Link>
              
              <div className="pt-4 pb-2 border-t border-gray-200">
                {!loading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        <p className="px-3 py-2 text-sm text-gray-700">
                          Signed in as <span className="font-medium">{user.email}</span>
                        </p>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 rounded-md"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAuthModal(true);
                          closeMenu();
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 rounded-md"
                      >
                        <User className="h-5 w-5" />
                        <span>Sign In</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <Auth onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;