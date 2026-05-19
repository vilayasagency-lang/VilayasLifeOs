/**
 * LifeOS Expense Logic
 * Path: /js/expenses.js
 */

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Session Check
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) {
        window.location.replace('login.html');
        return;
    }

    const userId = session.user.id;
    loadExpenses(userId);

    // 2. Form Submission
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const amount = document.getElementById('exp-amount').value;
        const desc = document.getElementById('exp-desc').value;
        const category = document.getElementById('exp-category').value;

        try {
            const { error } = await window.supabase.from('expenses').insert([{
                user_id: userId,
                amount: parseFloat(amount),
                description: desc,
                category: category,
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
            }]);

            if (error) throw error;

            // Success: Reset and Reload
            expenseForm.reset();
            closeExpenseModal(); // Function defined in HTML
            loadExpenses(userId);
            
        } catch (err) {
            alert("Error saving: " + err.message);
        }
    });
});

/**
 * Fetch and Render Expenses
 */
async function loadExpenses(userId) {
    const listContainer = document.getElementById('expense-list');
    const totalEl = document.getElementById('month-total');

    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        let query = window.supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .gte('date', firstDay)
            .order('date', { ascending: false });

        if (currentFilter !== 'all') {
            query = query.eq('category', currentFilter);
        }

        const { data: expenses, error } = await query;
        if (error) throw error;

        // Calculate Total
        const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        totalEl.innerText = `₹${total.toLocaleString('en-IN')}`;

        if (!expenses || expenses.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; color:var(--text-dim); padding:40px;">No transactions found</p>`;
            return;
        }

        // Render List
        listContainer.innerHTML = expenses.map(e => `
            <div class="expense-item fade-in">
                <div class="cat-icon">${getCategoryIcon(e.category)}</div>
                <div style="flex: 1;">
                    <p style="font-weight: 700; font-size: 0.95rem;">${e.description}</p>
                    <p style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">${e.category} • ${e.date}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 800; font-size: 1rem;">₹${parseFloat(e.amount).toLocaleString('en-IN')}</p>
                    <span onclick="deleteExpense('${e.id}', '${userId}')" style="color: var(--danger); font-size: 0.7rem;">Delete</span>
                </div>
            </div>
        `).join('');

    } catch (err) {
        listContainer.innerHTML = `<p style="color:var(--danger);">Error loading data</p>`;
    }
}

/**
 * Helper: Category Icons
 */
function getCategoryIcon(cat) {
    const icons = {
        food: '🍔',
        transport: '🚗',
        shopping: '🛍️',
        bills: '⚡',
        others: '📁'
    };
    return icons[cat] || '💰';
}

/**
 * Filter Expenses
 */
window.filterExpenses = (cat, el) => {
    currentFilter = cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    
    window.supabase.auth.getUser().then(({data}) => {
        if(data.user) loadExpenses(data.user.id);
    });
};

/**
 * Delete Expense
 */
window.deleteExpense = async (id, userId) => {
    if (!confirm("Delete this transaction?")) return;
    const { error } = await window.supabase.from('expenses').delete().eq('id', id);
    if (!error) loadExpenses(userId);
};
