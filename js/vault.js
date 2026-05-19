// js/vault.js
let currentCategory = 'all';

async function loadVault() {
    const { data: { user } } = await supabase.auth.getUser();
    const grid = document.getElementById('vault-grid');
    
    let query = supabase.from('vault_files').select('*').eq('user_id', user.id);
    if(currentCategory !== 'all') query = query.eq('category', currentCategory);
    
    const { data: files } = await query;
    
    if(!files || files.length === 0) {
        grid.innerHTML = `<p class='empty'>No files found</p>`;
        return;
    }

    // Replace with your actual R2 Public URL
    const R2_DOMAIN = 'https://pub-your-id.r2.dev'; 

    grid.innerHTML = files.map(f => `
        <div class="file-item">
            <img src="${R2_DOMAIN}/${f.file_key}" onerror="this.src='https://placehold.co/100?text=File'">
            <div class="file-info">
                <span>${f.file_name}</span>
            </div>
            <button onclick="deleteFile('${f.id}')"><i class="ri-delete-bin-line"></i></button>
        </div>
    `).join('');
}

function setCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    loadVault();
}

// Ensure loadVault is called
document.addEventListener('DOMContentLoaded', loadVault);
