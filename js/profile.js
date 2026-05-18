document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');

    const user = session.user;

    // Load Data
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
        document.getElementById('edit-name').value = profile.full_name || '';
        document.getElementById('edit-phone').value = profile.phone || '';
        document.getElementById('edit-gender').value = profile.gender || 'male';
        document.getElementById('display-name').innerText = profile.full_name || 'User';
    }

    // Logout Function
    document.getElementById('logout-btn').onclick = async () => {
        await supabase.auth.signOut();
        window.location.replace('login.html');
    };
});

async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const updates = {
        full_name: document.getElementById('edit-name').value,
        phone: document.getElementById('edit-phone').value,
        gender: document.getElementById('edit-gender').value,
        updated_at: new Date()
    };

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) alert(error.message);
    else alert("Profile Updated Successfully!");
}
