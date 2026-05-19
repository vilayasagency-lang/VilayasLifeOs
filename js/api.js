/**
 * LifeOS API Bridge
 * Handles communication with Cloudflare Workers
 */

// js/api.js
const WORKER_URL = 'https://lifeos-api.vilayash.workers.dev'; // Check if this matches your worker!

window.api = {
    async getUploadUrl(fileName, fileType, folder) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const response = await fetch(`${WORKER_URL}/uploads/sign?file=${fileName}&type=${fileType}&folder=${folder}`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            
            if (!response.ok) throw new Error("Worker Error");
            return await response.json();
        } catch (err) {
            console.error("API Error:", err);
            throw err;
        }
    }
};

    // 2. Create Cashfree Payment Session
    async createPaymentSession(planId) {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${WORKER_URL}/payments/create-session`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId })
        });
        return await response.json(); // Returns payment_session_id
    },

    // 3. Verify Payment Status
    async verifyPayment(orderId) {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${WORKER_URL}/payments/verify?orderId=${orderId}`, {
            headers
        });
        return await response.json();
    },

    // 4. Admin: Get Platform Stats
    async getAdminStats() {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${WORKER_URL}/admin/stats`, {
            headers
        });
        if (response.status === 403) throw new Error("Unauthorized");
        return await response.json();
    },

    // 5. Shared Family Notifications (Trigger Push)
    async sendFamilyAlert(alertType, message) {
        const headers = await this.getAuthHeader();
        await fetch(`${WORKER_URL}/notifications/send`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: alertType, message })
        });
    }
};

window.api = api;
