// js/config.js
const SUPABASE_URL = "https://uyxlwlgxlhoffrbxobxa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGx3bGd4bGhvZmZyYm94YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTAxMTgsImV4cCI6MjA3ODI2NjExOH0.DuO3pa9qT3FV6hUGVqN8f8yPEteedAHvzCGwBXmkZ7c";

// Initialize Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
