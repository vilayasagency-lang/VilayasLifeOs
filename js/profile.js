document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.href = 'login.html';

    const user = session.user;
    
    // 1. Fill Basic Auth Info
    document.getElementById('profile-email').innerText = user.email;
    document.getElementById('profile-name').innerText = user.user_metadata.full_name || "User";

    // 2. Fetch Extended Profile Data from Public.Profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile) {
        document.getElementById('profile-phone').innerText = profile.phone || "Not set";
        document.getElementById('profile-gender').innerText = profile.gender || "-";
        document.getElementById('profile-dob').innerText = profile.dob || "-";
        document.getElementById('profile-plan').innerText = (profile.subscription_plan || "Free") + " Tier";
        if (profile.avatar_url) {
            document.getElementById('user-avatar').src = profile.avatar_url;
        }
    }

    // 3. Logout Logic
    document.getElementById('logout-btn').onclick = async () => {
        if(confirm("Are you sure you want to logout?")) {
            await supabase.auth.signOut();
            window.location.replace('login.html');
        }
    };

    // 4. Password Reset Logic
    document.getElementById('reset-pass-btn').onclick = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email);
        if(!error) alert("Password reset link sent to your email!");
    };

    // 5. Avatar Upload Logic (R2 Integration)
    document.getElementById('avatar-upload').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { uploadUrl, fileKey } = await api.getUploadUrl(file.name, file.type, 'avatars');
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
            
            const publicUrl = `https://your-r2-public-domain.com/${fileKey}`;
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            
            document.getElementById('user-avatar').src = publicUrl;
            alert("Profile picture updated!");
        } catch (err) {
            console.error(err);
        }
    };
});
