document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // SIGNUP LOGIC
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullname = document.getElementById('fullname').value;

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullname } }
            });

            if (error) throw error;
            
            alert("Signup Successful! Redirecting to login...");
            window.location.href = '/login.html';
        } catch (err) {
            alert("Signup Failed: " + err.message); // Ye batayega ki error kya hai
        }
    });
}

// LOGIN LOGIC
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            alert("Login Successful! Going to Dashboard...");
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
    });
}

    // --- LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('login-btn');

            btn.innerText = "Logging in...";
            btn.disabled = true;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert("Login Error: " + error.message);
                btn.innerText = "Login";
                btn.disabled = false;
            } else {
                window.location.href = '/dashboard.html';
            }
        });
    }

    // --- LOGOUT BUTTON TRIGGER ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = logoutUser;
    }
});
