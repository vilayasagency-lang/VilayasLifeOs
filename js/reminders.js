document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');
    
    const userId = session.user.id;
    loadReminders(userId);

    document.getElementById('reminder-form').onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('rem-title').value;
        const time = document.getElementById('rem-time').value;

        const { error } = await supabase.from('reminders').insert([{
            user_id: userId,
            title: title,
            time: time
        }]);

        if(!error) { closeReminderModal(); location.reload(); }
    };
});

async function loadReminders(userId) {
    const container = document.getElementById('reminders-list');
    const { data: rems } = await supabase.from('reminders').select('*').eq('user_id', userId).order('time', {ascending: true});

    if(rems && rems.length > 0) {
        container.innerHTML = rems.map(r => `
            <div class="rem-item">
                <div style="flex:1">
                    <p style="font-weight:700;">${r.title}</p>
                    <p style="font-size:0.75rem; color:var(--text-dim);"><i class="ri-time-line"></i> ${new Date(r.time).toLocaleString()}</p>
                </div>
                <i class="ri-delete-bin-line" style="color:var(--danger);" onclick="deleteRem('${r.id}')"></i>
            </div>
        `).join('');
    }
}
