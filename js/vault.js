document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.href = 'login.html';

    const userId = session.user.id;
    loadFiles(userId);

    // Handle Upload
    const fileInput = document.getElementById('file-input');
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Get Signed URL from Cloudflare Worker
        const { uploadUrl, fileKey } = await api.getUploadUrl(file.name, file.type, 'vault');

        // 2. Direct Upload to R2
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type }
        });

        if (response.ok) {
            // 3. Save Metadata to Supabase
            await supabase.from('vault_files').insert([{
                user_id: userId,
                file_name: file.name,
                file_key: fileKey,
                file_size: file.size,
                file_type: file.type
            }]);
            loadFiles(userId);
            alert("File secured successfully!");
        }
    };
});

async function loadFiles(userId) {
    const list = document.getElementById('vault-list');
    const { data: files } = await supabase
        .from('vault_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (!files || files.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:50px; color:var(--text-dim);">
            <i class="ri-folder-open-line" style="font-size:3rem; opacity:0.3;"></i>
            <p>Your vault is empty</p>
        </div>`;
        return;
    }

    list.innerHTML = files.map(f => `
        <div class="file-item">
            <div class="file-icon"><i class="ri-file-text-line"></i></div>
            <div style="flex:1">
                <p style="font-weight:600; font-size:0.9rem;">${f.file_name.substring(0, 20)}...</p>
                <p style="font-size:0.75rem; color:var(--text-dim);">${(f.file_size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onclick="deleteFile('${f.id}')" style="background:none; border:none; color:var(--danger); font-size:1.2rem;">
                <i class="ri-delete-bin-7-line"></i>
            </button>
        </div>
    `).join('');
}

async function deleteFile(id) {
    if(confirm("Permanently delete this file?")) {
        await supabase.from('vault_files').delete().eq('id', id);
        location.reload();
    }
}
