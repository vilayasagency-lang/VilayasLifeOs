document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    const user = session.user;
    
    // 2. UI Update
    document.getElementById('greeting').innerText = `Hello, ${user.user_metadata.full_name || 'User'}`;
    document.getElementById('date').innerText = new Date().toDateString();

    // 3. Fetch Real Stats
    loadStats(user.id);
});

async function loadStats(userId) {
    // Fetch Expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', userId);
    
    if (expenses) {
        const total = expenses.reduce((s, e) => s + e.amount, 0);
        document.getElementById('total-expense').innerText = `₹${total.toLocaleString()}`;
    }

    // Fetch Vault Count
    const { count } = await supabase
        .from('vault_files')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    
    document.getElementById('vault-count').innerText = count || 0;
}
