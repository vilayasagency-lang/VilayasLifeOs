// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const client = window.supabase;

    // --- SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page refresh
            const btn = document.getElementById('signup-btn');
            btn.innerText = "Creating...";
            btn.disabled = true;

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullname = document.getElementById('fullname').value;
            const phone = document.getElementById('phone').value;
            const gender = document.getElementById('gender').value;
            const dob = document.getElementById('dob').value;

            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullname, phone, gender, dob }
                }
            });

            if (error) {
                alert("Error: " + error.message);
                btn.innerText = "Create Account";
                btn.disabled = false;
            } else {
                alert("Signup Success! Check Email or Login now.");
                window.location.href = 'login.html';
            }
        });
    }

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page refresh
            const btn = document.getElementById('login-btn');
            btn.innerText = "Verifying...";
            btn.disabled = true;

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await client.auth.signInWithPassword({ email, password });

            if (error) {
                alert("Login Error: " + error.message);
                btn.innerText = "Login";
                btn.disabled = false;
            } else {
                console.log("Login Successful", data);
                // Redirecting systematically to dashboard
                window.location.replace('dashboard.html'); 
            }
        });
    }
});
