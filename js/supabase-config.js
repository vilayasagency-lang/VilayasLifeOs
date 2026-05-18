// Supabase Configuration
const SUPABASE_URL = 'https://gjjwtwhdodwjqvyvfnwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqand0d2hkb2R3anF2eXZmbndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzkwNzcsImV4cCI6MjA5NDYxNTA3N30.nOdOqHubefP6Ai2nGtpzbU6p87YZuKLOHhEXyjcWhoo';

// Initialize the Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global Helper to check session
async function checkUserSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        return null;
    }
    return session.user;
}

// Global Logout Function
async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Error logging out: " + error.message);
    } else {
        window.location.href = '/login.html';
    }
}

// Export for use in other files
window.supabase = supabase;
