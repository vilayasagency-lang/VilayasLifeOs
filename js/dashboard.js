document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.checkAuth();
    if (!session) return;

    const user = session.user;
    
    // UI Init
    document.getElementById('user-name').innerText = `Hi, ${user.user_metadata.full_name || 'Chief'}`;
    document.getElementById('today-date').innerText = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

    // Fetch Stats
    fetchData(user.id);
});

async function fetchData(uid) {
    // 1. Expenses
    const { data: exp } = await window.supabase.from('expenses').select('amount').eq('user_id', uid);
    if (exp) {
        const total = exp.reduce((s, e) => s + parseFloat(e.amount), 0);
        document.getElementById('total-spent').innerText = `₹${total.toLocaleString('en-IN')}`;
    }

    // 2. Vault
    const { count } = await window.supabase.from('vault_files').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    document.getElementById('vault-count').innerText = `${count || 0} Files`;
}
