const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo';

const { createClient } = supabase;
window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fast Session Check Helper
window.checkAuth = async () => {
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html') && window.location.pathname !== '/') {
        window.location.replace('login.html');
    }
    return session;
};
