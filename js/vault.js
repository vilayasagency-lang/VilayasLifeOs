let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');

    loadVault(session.user.id);

    // Handle Upload
    document.getElementById('vault-file-input').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 1. Get Signed URL from Worker
            const { uploadUrl, fileKey } = await api.getUploadUrl(file.name, file.type, 'vault');
            
            // 2. PUT to R2
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

            // 3. Save to Supabase
            await supabase.from('vault_files').insert([{
                user_id: session.user.id,
                file_name: file.name,
                file_key: fileKey,
                file_size: file.size,
                category: currentCategory
            }]);
            
            location.reload();
        } catch (err) { alert("Upload Failed: " + err.message); }
    };
});

async function loadVault(userId) {
    const container = document.getElementById('vault-list');
    let query = supabase.from('vault_files').select('*').eq('user_id', userId).order('created_at', {ascending: false});
    
    if(currentCategory !== 'all') query = query.eq('category', currentCategory);
    
    const { data: files } = await query;
    if(!files || files.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding: 50px; color: var(--text-dim);">No files in this category.</p>`;
        return;
    }

    container.innerHTML = files.map(f => `
        <div class="file-card">
            <div class="file-icon"><i class="ri-file-text-line"></i></div>
            <div style="flex:1">
                <p style="font-weight:600; font-size:0.9rem;">${f.file_name.substring(0,20)}</p>
                <p style="font-size:0.75rem; color:var(--text-dim);">${(f.file_size/1024/1024).toFixed(2)} MB</p>
            </div>
            <i class="ri-delete-bin-line" style="color:var(--danger); font-size:1.2rem;" onclick="deleteFile('${f.id}')"></i>
        </div>
    `).join('');
}

function filterVault(cat) {
    currentCategory = cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    loadVault(window.supabase.auth.user().id); // Dummy reload
}
