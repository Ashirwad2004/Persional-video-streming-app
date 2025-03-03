export type Video = {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  video_url: string;
  thumbnail_url: string;
  upload_date: string;
  duration: string;
  user_id: string;
};

export type VideoInsert = Omit<Video, 'id' | 'upload_date'>;