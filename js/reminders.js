/**
 * LifeOS Reminders Logic
 * Fixes: Timezone, Edit & Delete Working
 */

window.editingId = null; 

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');
    
    loadReminders(session.user.id);

    // Handle Form Submit (Add or Update)
    document.getElementById('reminder-form').onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('rem-title').value;
        const timeInput = document.getElementById('rem-time').value;

        // Step 1: Handle Timezone (Local to ISO)
        const isoTime = new Date(timeInput).toISOString();

        try {
            if (window.editingId) {
                // UPDATE
                const { error } = await supabase.from('reminders')
                    .update({ title, time: isoTime })
                    .eq('id', window.editingId);
                if(error) throw error;
                alert("Alert Updated! 🚀");
            } else {
                // INSERT
                const { error } = await supabase.from('reminders').insert([{
                    user_id: session.user.id,
                    title: title,
                    time: isoTime
                }]);
                if(error) throw error;
                alert("Alert Activated! 🔔");
            }

            closeReminderModal();
            location.reload();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };
});

async function loadReminders(userId) {
    const container = document.getElementById('reminders-list');
    const { data: rems, error } = await supabase.from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('time', {ascending: true});

    if(error) {
        container.innerHTML = `<p style="text-align:center; color:red;">Connection Error</p>`;
        return;
    }

    if(!rems || rems.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.5; padding:50px;">No alerts found.</p>`;
        return;
    }

    // Step 2: Convert UTC from DB to Local Time for Display
    container.innerHTML = rems.map(r => {
        const localTime = new Date(r.time).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });

        return `
            <div class="rem-item fade-in">
                <div style="flex:1">
                    <p style="font-weight:700; font-size:1rem;">${r.title}</p>
                    <p style="font-size:0.8rem; color:var(--primary); font-weight:600;">
                        <i class="ri-time-line"></i> ${localTime}
                    </p>
                </div>
                <div style="display:flex; gap:12px;">
                    <button onclick="editRem('${r.id}', '${r.title}', '${r.time}')" style="background:none; border:none; color:var(--secondary); font-size:1.3rem;">
                        <i class="ri-edit-box-line"></i>
                    </button>
                    <button onclick="deleteRem('${r.id}')" style="background:none; border:none; color:var(--accent); font-size:1.3rem;">
                        <i class="ri-delete-bin-7-line"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// DELETE WORKING LOGIC
window.deleteRem = async (id) => {
    if(confirm("Confirm Delete Alert?")) {
        const { error } = await supabase.from('reminders').delete().eq('id', id);
        if(!error) location.reload();
        else alert("Failed to delete.");
    }
};

// EDIT WORKING LOGIC
window.editRem = (id, title, time) => {
    window.editingId = id;
    document.getElementById('modal-title').innerText = "Edit Alert";
    document.getElementById('submit-btn').innerText = "Update Now";
    
    document.getElementById('rem-title').value = title;
    
    // ISO to local input format
    const date = new Date(time);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    document.getElementById('rem-time').value = date.toISOString().slice(0,16);
    
    openReminderModal();
};
