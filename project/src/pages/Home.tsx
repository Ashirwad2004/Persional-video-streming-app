import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Library } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-6">
          Your Personal Video Streaming Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload, store, and stream your videos from anywhere, on any device.
        </p>
        
        <div className="w-full max-w-5xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Video streaming illustration" 
            className="rounded-lg shadow-xl mb-10 w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link 
            to="/upload" 
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Upload className="h-16 w-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload Videos</h2>
            <p className="text-gray-600 text-center">
              Easily upload your videos with our drag-and-drop interface.
            </p>
          </Link>
          
          <Link 
            to="/library" 
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Library className="h-16 w-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Browse Library</h2>
            <p className="text-gray-600 text-center">
              Access all your uploaded videos in one convenient place.
            </p>
          </Link>
        </div>
        
        <div className="bg-indigo-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Uploads</h3>
              <p className="text-gray-600">
                Simple drag-and-drop interface makes uploading videos a breeze.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smooth Streaming</h3>
              <p className="text-gray-600">
                Enjoy buffer-free video playback on any device.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Your videos are safely stored and accessible only to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;