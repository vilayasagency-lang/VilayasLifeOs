document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.replace('login.html');

    const user = session.user;
    
    // UI Greeting
    document.getElementById('greeting').innerText = `Hi, ${user.user_metadata.full_name || 'Chief'}`;
    document.getElementById('current-date').innerText = new Date().toDateString();
    
    // Real Stats
    fetchStats(user.id);
});

async function fetchStats(uid) {
    // Spends
    const { data: exp } = await supabase.from('expenses').select('amount').eq('user_id', uid);
    if(exp) {
        const total = exp.reduce((s, e) => s + parseFloat(e.amount), 0);
        document.getElementById('total-spent').innerText = `₹${total.toLocaleString()}`;
    }

    // Vault
    const { count } = await supabase.from('vault_files').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    document.getElementById('files-count').innerText = `${count || 0} Files`;
}
