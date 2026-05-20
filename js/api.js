const WORKER_URL = 'https://lifeos-api.web-app-vilayash.workers.dev';

window.api = {
    async getUploadUrl(fileName, fileType, folder) {
        const { data: { session } } = await window.supabase.auth.getSession();
        const response = await fetch(`${WORKER_URL}/uploads/sign?file=${fileName}&type=${fileType}&folder=${folder}`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        return await response.json();
    },
    async createPayment(planId) {
        const { data: { session } } = await window.supabase.auth.getSession();
        const res = await fetch(`${WORKER_URL}/payments/create-session`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, userId: session.user.id })
        });
        return await res.json();
    }
};
