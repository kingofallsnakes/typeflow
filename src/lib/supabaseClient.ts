// Cobra player backend — the project owner's own Supabase instance.
// The anon key is a public, publishable key: it is safe in browser code
// because every table is protected by row-level security policies.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vvolshivqohfdbbxmuyz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b2xzaGl2cW9oZmRiYnhtdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjUwNzMsImV4cCI6MjEwNDY0MTA3M30.F6UTDzopG3mHq7Zjz5x-fQbJvQQ02A01EwWey9_mg3w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
