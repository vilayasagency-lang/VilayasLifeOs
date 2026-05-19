/**
 * LifeOS Dashboard Logic
 * Path: /js/dashboard.js
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Check (Double Verification)
    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    const user = session.user;
    console.log("Welcome to Dashboard:", user.email);

    // 2. Initialize Dashboard UI
    initUI(user);
    
    // 3. Fetch Real-Time Stats from Supabase
    fetchExpenses(user.id);
    fetchVaultCount(user.id);
});

/**
 * Update UI with User Info and Date
 */
function initUI(user) {
    // Set User Greeting
    const name = user.user_metadata.full_name || "User";
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.innerText = `Hi, ${name}`;

    // Set Current Date
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', options);
}

/**
 * Fetch and Sum Monthly Expenses
 */
async function fetchExpenses(userId) {
    const totalSpentEl = document.getElementById('total-spent');
    
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { data: expenses, error } = await window.supabase
            .from('expenses')
            .select('amount')
            .eq('user_id', userId)
            .gte('date', firstDay);

        if (error) throw error;

        if (expenses) {
            const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            totalSpentEl.innerText = `₹${total.toLocaleString('en-IN')}`;
        }
    } catch (err) {
        console.error("Expense Fetch Error:", err);
        totalSpentEl.innerText = "₹0";
    }
}

/**
 * Fetch Total Vault Files Count
 */
async function fetchVaultCount(userId) {
    const countEl = document.getElementById('files-count');

    try {
        const { count, error } = await window.supabase
            .from('vault_files')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;

        countEl.innerText = `${count || 0} Files`;
    } catch (err) {
        console.error("Vault Count Error:", err);
        countEl.innerText = "0 Files";
    }
}
