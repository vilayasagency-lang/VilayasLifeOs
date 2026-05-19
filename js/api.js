/**
 * LifeOS API Bridge (Cloudflare Worker Connection)
 * Path: /js/api.js
 */

const WORKER_URL = 'https://lifeos-api.web-app-vilayash.workers.dev'; 

window.api = {
    // 1. Helper for Authorization Token
    async getAuthHeader() {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (!session) return {};
        return { 
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        };
    },

    // 2. Get Signed URL from R2 for File/Image Upload
    async getUploadUrl(fileName, fileType, folder = 'vault') {
        try {
            const headers = await this.getAuthHeader();
            const url = `${WORKER_URL}/uploads/sign?file=${encodeURIComponent(fileName)}&type=${encodeURIComponent(fileType)}&folder=${folder}`;
            
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error("Worker Signing Error");
            
            return await response.json(); // Returns { uploadUrl, fileKey }
        } catch (err) {
            console.error("API getUploadUrl Error:", err);
            throw err;
        }
    },

    // 3. Create Cashfree Payment Session
    async createPaymentSession(planId) {
        try {
            const headers = await this.getAuthHeader();
            const { data: { user } } = await window.supabase.auth.getUser();
            
            const response = await fetch(`${WORKER_URL}/payments/create-session`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 
                    planId: planId,
                    userId: user.id 
                })
            });
            return await response.json(); // Returns payment_session_id
        } catch (err) {
            console.error("API createPaymentSession Error:", err);
            throw err;
        }
    },

    // 4. Verify Cashfree Payment
    async verifyPayment(orderId) {
        try {
            const headers = await this.getAuthHeader();
            const response = await fetch(`${WORKER_URL}/payments/verify?orderId=${orderId}`, {
                headers: headers
            });
            return await response.json();
        } catch (err) {
            console.error("API verifyPayment Error:", err);
            throw err;
        }
    }
};

console.log("🚀 LifeOS: API Bridge Ready.");
