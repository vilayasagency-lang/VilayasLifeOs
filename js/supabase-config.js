/**
 * LifeOS Supabase Configuration
 * Path: /js/supabase-config.js
 */

const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo';

// Initialize the Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Window object mein save karein taaki har page ise use kar sake
window.supabase = supabaseClient;

console.log("✅ LifeOS: Supabase connected successfully.");
