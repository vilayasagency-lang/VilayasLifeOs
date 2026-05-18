// js/supabase-config.js

const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo';

// Supabase client create karein alag naam se
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Isse global window object mein save karein taaki auth.js ise use kar sake
window.supabase = supabaseClient;

console.log("Supabase initialized successfully!");
