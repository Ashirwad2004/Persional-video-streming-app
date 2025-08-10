import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message?: string;
}

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    progress: 0
  });
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        setUploadStatus({
          status: 'error',
          progress: 0,
          message: 'Please select a valid video file.'
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus({
      status: 'idle',
      progress: 0
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'Please select a video file to upload.'
      });
      return;
    }

    if (!title.trim()) {
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: 'Please enter a title for your video.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    
    // Add user ID if available
    if (user) {
      formData.append('userId', user.id);
    }

    setUploadStatus({
      status: 'uploading',
      progress: 0
    });

    try {
      // Upload directly to server
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadStatus({
            status: 'uploading',
            progress: percentCompleted
          });
        }
      });

      setUploadStatus({
        status: 'success',
        progress: 100,
        message: 'Video uploaded successfully!'
      });
      
      // Reset form after successful upload
      setTimeout(() => {
        setFile(null);
        setTitle('');
        setDescription('');
        setUploadStatus({
          status: 'idle',
          progress: 0
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus({
        status: 'error',
        progress: 0,
        message: error.response?.data?.error || 'Failed to upload video. Please try again.'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Video</h1>
      
      <form onSubmit={handleUpload} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Video Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter video title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter video description"
            rows={4}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Video File *
          </label>
          
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              <input {...getInputProps()} />
              <UploadIcon className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
              <p className="text-gray-700 mb-2">
                {isDragActive ? 'Drop the video here' : 'Drag & drop a video file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: MP4, WebM, AVI, MOV (Max size: 100MB)
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 flex items-start">
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {uploadStatus.status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{uploadStatus.message}</span>
          </div>
        )}
        
        {uploadStatus.status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{uploadStatus.message}</span>
          </div>
        )}
        
        {uploadStatus.status === 'uploading' && (
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-700">{uploadStatus.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${uploadStatus.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploadStatus.status === 'uploading'}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            uploadStatus.status === 'uploading'
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {uploadStatus.status === 'uploading' ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default Upload;