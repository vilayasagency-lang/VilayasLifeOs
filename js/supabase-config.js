// js/supabase-config.js

const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo';

let supabaseClient;

try {
    // Supabase v2 browser library check
    if (typeof supabase !== 'undefined') {
        // Syntax for Supabase v2 CDN
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabase = supabaseClient; 
        console.log("LifeOS: Supabase initialized!");
    } else {
        alert("CRITICAL ERROR: Supabase Library not loaded! Check internet or CDN link.");
    }
} catch (e) {
    alert("Config Error: " + e.message);
}
