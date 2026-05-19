/**
 * LifeOS Profile Logic
 * Path: /js/profile.js
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Check
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    const user = session.user;
    loadProfileData(user);

    // 2. Handle Logout
    document.getElementById('logout-btn').onclick = async () => {
        if (confirm("Are you sure you want to logout?")) {
            await window.supabase.auth.signOut();
            window.location.replace('login.html');
        }
    };

    // 3. Handle Avatar Upload (R2 + Supabase)
    const avatarInput = document.getElementById('avatar-input');
    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            document.getElementById('profile-avatar').style.opacity = "0.5";
            
            // Step A: Get Signed URL from Worker
            const { uploadUrl, fileKey } = await window.api.getUploadUrl(file.name, file.type, 'avatars');

            // Step B: Upload to Cloudflare R2
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!response.ok) throw new Error("R2 Upload Failed");

            // Step C: Update Avatar URL in Supabase Profiles table
            // Replace with your actual R2 public domain if you have one
            const publicUrl = `https://lifeos-api.web-app-vilayash.workers.dev/public/${fileKey}`; 
            
            const { error } = await window.supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (error) throw error;

            // Update UI
            document.getElementById('profile-avatar').src = URL.createObjectURL(file);
            document.getElementById('profile-avatar').style.opacity = "1";
            alert("Profile photo updated!");

        } catch (err) {
            alert("Upload Error: " + err.message);
            document.getElementById('profile-avatar').style.opacity = "1";
        }
    });
});

/**
 * Load User Profile from Database
 */
async function loadProfileData(user) {
    try {
        const { data: profile, error } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        if (profile) {
            // Fill Inputs
            document.getElementById('display-name').innerText = profile.full_name || "User";
            document.getElementById('display-email').innerText = user.email;
            document.getElementById('edit-fullname').value = profile.full_name || "";
            document.getElementById('edit-phone').value = profile.phone || "";
            document.getElementById('edit-gender').value = profile.gender || "male";
            document.getElementById('plan-status').innerText = (profile.subscription_plan || "FREE").toUpperCase();

            // Set Avatar if exists
            if (profile.avatar_url) {
                document.getElementById('profile-avatar').src = profile.avatar_url;
            }
        }
    } catch (err) {
        console.error("Profile Load Error:", err);
    }
}

/**
 * Save Name/Phone Updates
 */
window.saveProfileUpdates = async () => {
    const btn = document.getElementById('save-profile-btn');
    const name = document.getElementById('edit-fullname').value;
    const phone = document.getElementById('edit-phone').value;
    const gender = document.getElementById('edit-gender').value;

    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        
        const { error } = await window.supabase
            .from('profiles')
            .update({
                full_name: name,
                phone: phone,
                gender: gender,
                updated_at: new Date()
            })
            .eq('id', user.id);

        if (error) throw error;

        document.getElementById('display-name').innerText = name;
        alert("Profile updated successfully!");

    } catch (err) {
        alert("Update failed: " + err.message);
    } finally {
        btn.innerText = "Save Changes";
        btn.disabled = false;
    }
};
