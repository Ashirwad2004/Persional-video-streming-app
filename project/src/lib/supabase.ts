import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXZ2Z2N5a2N5cXpmeGppbG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Nzk2MjIsImV4cCI6MjA1NjI1NTYyMn0.k0z9E_BCFNoIxX1SDaTE-YPI_E3y99wXeG2kA7H64do';

export const supabase = createClient(
  supabaseUrl || 'https://phqvvgcykcyqzfxjiloh.supabase.co',
  supabaseAnonKey
);