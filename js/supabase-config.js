// js/supabase-config.js

const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo'; // Yahan apni long eyJ... wali key dalein

// Bulletproof Initialization
let supabase;

try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        // Agar library load ho chuki hai
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (typeof createClient !== 'undefined') {
        // Kuch CDN versions ke liye
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error("Supabase SDK not found. Make sure the CDN script is above this file.");
    }
} catch (e) {
    console.error("Supabase Config Error:", e.message);
}

// Global expose taaki auth.js ise dekh sake
window.supabaseClient = supabase;
