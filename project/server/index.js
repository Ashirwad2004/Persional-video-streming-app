import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorange({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: function (req, file, cb) {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// Initialize Supabase client

const supabaseUrl = process.env.SUPABASE_URL || 'https://phqvvgcykcyqzfxjiloh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXZ2Z2N5a2N5cXpmeGppbG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Nzk2MjIsImV4cCI6MjA1NjI1NTYyMn0.k0z9E_BCFNoIxX1SDaTE-YPI_E3y99wXeG2kA7H64do';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoints
app.post('/api/videos/upload', upload.single('video'), async (req, res) => {

  try {
    if (!req.file) {
  return res.status(400).json({ error: 'No video file uploaded' });
}

   const { title, description, userId } = req.body;

    
    if (!title) {
  return res.status(400).json({ error: 'Video title is required' });
}

    const filename = req.file.filename;
const videoUrl = `/api/videos/stream/${filename}`;

const thumbnailUrl = 'https://images.unsplash.com/photo-...';

    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title,
          description: description || '',
          filename,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: userId || null, // In a real app, this would be the authenticated user's ID
          duration: '00:00' // In a real app, you would extract this from the video
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save video metadata' });
    }

    res.status(201).json({
      id: data[0].id,
      title,
      description: description || '',
      videoUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch videos' });
    }

    // Transform data to match frontend expectations
    const videoList = data.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      thumbnailUrl: video.thumbnail_url,
      uploadDate: video.upload_date,
      duration: video.duration
    }));
    
    res.json(videoList);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get video details by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({
      id: data.id,
      title: data.title,
      description: data.description || '',
      videoUrl: data.video_url,
      uploadDate: data.upload_date
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// Stream video
app.get('/api/videos/stream/:filename', (req, res) => {
  const videoPath = path.join(uploadsDir, req.params.filename);
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video file not found' });
  }
  
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    // Handle range request for video streaming
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    });
    
    file.pipe(res);
  } else {
    // Handle normal request
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    });
    
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});