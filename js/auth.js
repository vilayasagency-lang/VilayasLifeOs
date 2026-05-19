/**
 * LifeOS Authentication Logic
 * Path: /js/auth.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Global Supabase Client Check
    const client = window.supabase;

    if (!client) {
        console.error("Supabase client not initialized. Check supabase-config.js");
        return;
    }

    // --- 1. SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page refresh
            
            const btn = document.getElementById('signup-btn');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullname = document.getElementById('fullname').value;
            const phone = document.getElementById('phone').value;
            const gender = document.getElementById('gender').value;
            const dob = document.getElementById('dob').value;

            btn.innerText = "Creating Account...";
            btn.disabled = true;

            try {
                const { data, error } = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullname,
                            phone: phone,
                            gender: gender,
                            dob: dob
                        }
                    }
                });

                if (error) throw error;

                alert("Signup Successful! Redirecting to Login...");
                window.location.replace('login.html'); // Better than .href for auth

            } catch (err) {
                alert("Signup Failed: " + err.message);
                btn.innerText = "Create Free Account";
                btn.disabled = false;
            }
        });
    }

    // --- 2. LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page refresh
            
            const btn = document.getElementById('login-btn');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            btn.innerText = "Verifying...";
            btn.disabled = true;

            try {
                const { data, error } = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                console.log("Login Successful:", data);
                // Systematically redirect to dashboard
                window.location.replace('dashboard.html');

            } catch (err) {
                alert("Login Failed: " + err.message);
                btn.innerText = "Login to Dashboard";
                btn.disabled = false;
            }
        });
    }
});
