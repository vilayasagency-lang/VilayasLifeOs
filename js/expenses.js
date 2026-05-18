document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return window.location.href = 'login.html';

    const userId = session.user.id;
    loadExpenses(userId);

    // Form Submit
    document.getElementById('expense-form').onsubmit = async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('desc').value;
        const category = document.getElementById('category').value;

        const { error } = await supabase.from('expenses').insert([{
            user_id: userId,
            amount: parseFloat(amount),
            description: description,
            category: category,
            date: new Date().toISOString().split('T')[0]
        }]);

        if (!error) {
            closeExpenseModal();
            location.reload();
        } else {
            alert(error.message);
        }
    };
});

async function loadExpenses(userId) {
    const list = document.getElementById('expense-list');
    const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (!expenses || expenses.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:var(--text-dim); padding:40px;">No expenses tracked yet.</p>`;
        return;
    }

    let total = 0;
    list.innerHTML = expenses.map(e => {
        total += e.amount;
        return `
            <div class="expense-item">
                <div style="flex:1">
                    <p style="font-weight:600;">${e.description}</p>
                    <p style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">${e.category} • ${e.date}</p>
                </div>
                <div style="text-align:right">
                    <p style="font-weight:800; color:var(--text);">₹${e.amount}</p>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('month-total').innerText = `₹${total.toLocaleString()}`;
}
