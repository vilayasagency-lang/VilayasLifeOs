let editId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.checkAuth();
    if(!session) return;
    loadR(session.user.id);

    document.getElementById('reminder-form').onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('rtitle').value;
        const time = new Date(document.getElementById('rtime').value).toISOString();

        if(editId) {
            await window.supabase.from('reminders').update({title, time}).eq('id', editId);
            editId = null;
        } else {
            await window.supabase.from('reminders').insert([{user_id: session.user.id, title, time}]);
        }
        location.reload();
    };
});

async function loadR(uid) {
    const list = document.getElementById('reminders-list');
    const { data: rems } = await window.supabase.from('reminders').select('*').eq('user_id', uid).order('time', {ascending:true});
    
    list.innerHTML = rems?.length > 0 ? rems.map(r => `
        <div class="card flex-between" style="padding:15px; border-left:5px solid var(--primary);">
            <div>
                <p style="font-weight:800; font-size:0.95rem;">${r.title}</p>
                <p style="font-size:0.75rem; color:var(--primary);">${new Date(r.time).toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short'})}</p>
            </div>
            <div style="display:flex; gap:15px;">
                <i class="ri-edit-box-line" style="color:var(--accent); font-size:1.2rem;" onclick="editR('${r.id}','${r.title}','${r.time}')"></i>
                <i class="ri-delete-bin-7-line text-danger" style="font-size:1.2rem;" onclick="delR('${r.id}')"></i>
            </div>
        </div>
    `).join('') : `<p style="text-align:center; opacity:0.3; padding:50px;">No alerts set</p>`;
}

window.delR = async (id) => {
    if(confirm("Kill this alert?")) {
        await window.supabase.from('reminders').delete().eq('id', id);
        location.reload();
    }
};

window.editR = (id, t, tm) => {
    editId = id;
    document.getElementById('rtitle').value = t;
    const date = new Date(tm);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    document.getElementById('rtime').value = date.toISOString().slice(0,16);
    document.getElementById('modal-title').innerText = "Edit Alert";
    openModal(); // Defined in reminders.html
};
