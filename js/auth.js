document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // SIGNUP LOGIC
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('signup-btn');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const gender = document.getElementById('gender').value;
        const dob = document.getElementById('dob').value;

        btn.innerText = "Creating Account...";
        btn.disabled = true;

        const { data, error } = await supabase.auth.signUp({
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

        if (error) {
            alert("Signup Error: " + error.message);
            btn.innerText = "Create Account";
            btn.disabled = false;
        } else {
            alert("Success! Please check your email for verification.");
            window.location.href = '/login.html';
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
