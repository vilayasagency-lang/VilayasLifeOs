/**
 * LifeOS Vault Engine
 * Path: /js/vault.js
 */

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Check
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    const user = session.user;
    loadVault(user.id);

    // 2. Handle File Upload
    const uploadInput = document.getElementById('vault-upload');
    uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Visual feedback
        const grid = document.getElementById('vault-grid');
        const loader = document.createElement('div');
        loader.className = 'card';
        loader.innerHTML = `<p style="text-align:center; font-size:0.8rem;">Uploading ${file.name.substring(0,10)}...</p>`;
        grid.prepend(loader);

        try {
            // Step A: Get Signed URL from Cloudflare Worker (via api.js)
            const { uploadUrl, fileKey } = await window.api.getUploadUrl(file.name, file.type, 'vault-files');

            // Step B: Upload directly to Cloudflare R2
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!uploadResponse.ok) throw new Error("R2 Upload Failed");

            // Step C: Save Metadata to Supabase
            const { error } = await window.supabase.from('vault_files').insert([{
                user_id: user.id,
                file_name: file.name,
                file_key: fileKey,
                file_size: file.size,
                file_type: file.type,
                category: currentCategory === 'all' ? 'others' : currentCategory
            }]);

            if (error) throw error;

            // Success
            loadVault(user.id);
            alert("File secured forever!");

        } catch (err) {
            console.error("Vault Error:", err);
            alert("Upload Failed: " + err.message);
            loadVault(user.id); // Refresh to remove loader
        }
    });
});

/**
 * Fetch and Display Files
 */
async function loadVault(userId) {
    const grid = document.getElementById('vault-grid');
    const storageUsage = document.getElementById('storage-usage');
    const storageBar = document.getElementById('storage-bar');

    try {
        let query = window.supabase
            .from('vault_files')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (currentCategory !== 'all') {
            query = query.eq('category', currentCategory);
        }

        const { data: files, error } = await query;
        if (error) throw error;

        // Calculate Storage (Total 500 MB Free Tier)
        const totalSize = files.reduce((sum, f) => sum + (f.file_size || 0), 0);
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        storageUsage.innerText = `${sizeMB} MB / 500 MB`;
        storageBar.style.width = `${Math.min((sizeMB / 500) * 100, 100)}%`;

        if (!files || files.length === 0) {
            grid.innerHTML = `<div style="grid-column: span 2; text-align:center; padding:50px; color:var(--text-dim);">
                <i class="ri-folder-open-line" style="font-size:3rem; opacity:0.2;"></i>
                <p>No files in this category</p>
            </div>`;
            return;
        }

        // Render Files
        grid.innerHTML = files.map(f => {
            const isImage = f.file_type.includes('image');
            // Note: Update with your Public R2 domain if you have one, 
            // otherwise thumbnails will show icons.
            const icon = isImage ? 'ri-image-2-fill' : 'ri-file-text-fill';
            
            return `
                <div class="file-item fade-in">
                    <div class="file-delete" onclick="deleteFile('${f.id}', '${f.file_key}')">
                        <i class="ri-close-line"></i>
                    </div>
                    <div class="file-preview">
                        <i class="${icon}" style="font-size:2.5rem; color:var(--primary); opacity:0.5;"></i>
                    </div>
                    <span class="file-name">${f.file_name}</span>
                </div>
            `;
        }).join('');

    } catch (err) {
        grid.innerHTML = `<p style="grid-column: span 2; color:var(--danger);">Error loading files</p>`;
    }
}

/**
 * Filter by Category
 */
window.setCategory = (cat, el) => {
    currentCategory = cat;
    // Update UI chips
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    
    // Reload data
    window.supabase.auth.getUser().then(({data}) => {
        if(data.user) loadVault(data.user.id);
    });
};

/**
 * Delete File
 */
window.deleteFile = async (id, fileKey) => {
    if (!confirm("Delete this file permanently?")) return;

    try {
        const { error } = await window.supabase
            .from('vault_files')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        // Refresh UI
        const { data: { user } } = await window.supabase.auth.getUser();
        loadVault(user.id);

    } catch (err) {
        alert("Delete failed: " + err.message);
    }
};
