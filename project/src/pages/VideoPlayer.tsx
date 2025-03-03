import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadDate: string;
}

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        // Fetch video details from Supabase
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setVideo({
          id: data.id,
          title: data.title,
          description: data.description || '',
          videoUrl: data.video_url,
          uploadDate: data.upload_date
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
        
        // For demo purposes, load mock data
        setVideo({
          id: id || '1',
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript in this comprehensive tutorial. This video covers everything you need to know to get started with web development, including setting up your development environment, understanding the basics of HTML structure, styling with CSS, and adding interactivity with JavaScript.',
          videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          uploadDate: '2023-06-15'
        });
      }
    };

    if (id) {
      fetchVideoDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Video not found'}</p>
        <Link to="/library" className="text-indigo-600 hover:text-indigo-800 font-medium">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/library" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to library
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          controls
          autoPlay
          poster="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{video.title}</h1>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Uploaded on {new Date(video.uploadDate).toLocaleDateString()}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;