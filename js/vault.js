let currentCat = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.checkAuth();
    if(!session) return;
    loadVault(session.user.id);

    document.getElementById('file-up').onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        try {
            const { uploadUrl, fileKey } = await window.api.getUploadUrl(file.name, file.type, 'vault');
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: {'Content-Type': file.type} });
            
            await window.supabase.from('vault_files').insert([{
                user_id: session.user.id,
                file_name: file.name,
                file_key: fileKey,
                file_size: file.size,
                category: currentCat === 'all' ? 'others' : currentCat
            }]);
            location.reload();
        } catch(err) { alert("R2 Upload Failed: Check Worker Binding"); }
    };
});

async function loadVault(uid) {
    const grid = document.getElementById('v-grid');
    let q = window.supabase.from('vault_files').select('*').eq('user_id', uid).order('created_at', {ascending:false});
    if(currentCat !== 'all') q = q.eq('category', currentCat);
    
    const { data: files } = await q;
    grid.innerHTML = (files?.length > 0) ? files.map(f => `
        <div class="card" style="padding:12px; text-align:center; position:relative;">
            <i class="ri-delete-bin-line text-danger" style="position:absolute; top:8px; right:8px;" onclick="delV('${f.id}')"></i>
            <div style="height:80px; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.2); border-radius:12px; margin-bottom:8px;">
                <i class="ri-file-text-fill" style="font-size:2rem; color:var(--primary);"></i>
            </div>
            <p style="font-size:0.7rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${f.file_name}</p>
        </div>
    `).join('') : `<p style="grid-column:span 2; text-align:center; padding:40px; opacity:0.3;">No files found</p>`;
}

window.filterV = (cat, btn) => {
    currentCat = cat;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window.supabase.auth.getUser().then(({data}) => loadVault(data.user.id));
};

window.delV = async (id) => {
    if(confirm("Delete this file?")) {
        await window.supabase.from('vault_files').delete().eq('id', id);
        location.reload();
    }
};
