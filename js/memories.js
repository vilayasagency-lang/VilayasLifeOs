document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');

    loadMemories(session.user.id);

    document.getElementById('mem-upload').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { uploadUrl, fileKey } = await api.getUploadUrl(file.name, file.type, 'memories');
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

            await supabase.from('memories').insert([{
                user_id: session.user.id,
                file_key: fileKey,
                caption: "A special moment"
            }]);
            location.reload();
        } catch (err) { alert("Upload Failed"); }
    };
});

async function loadMemories(userId) {
    const grid = document.getElementById('memories-grid');
    const { data: mems } = await supabase.from('memories').select('*').eq('user_id', userId).order('created_at', {ascending: false});

    if (!mems || mems.length === 0) {
        grid.innerHTML = "<p style='grid-column:span 2; text-align:center;'>No memories yet.</p>";
        return;
    }

    const R2_URL = 'https://lifeos-api.web-app-vilayash.workers.dev/public'; // Check your public access path
    grid.innerHTML = mems.map(m => `
        <div style="height:180px; border-radius:15px; overflow:hidden; background:var(--card); border:1px solid var(--border);">
            <img src="${R2_URL}/${m.file_key}" style="width:100%; height:100%; object-fit:cover;">
        </div>
    `).join('');
}
