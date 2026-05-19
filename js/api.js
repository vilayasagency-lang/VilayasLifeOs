/**
 * LifeOS API Bridge - Final Corrected Version
 * Handles communication with Cloudflare Workers
 */

const WORKER_URL = 'https://lifeos-api.vilayash.workers.dev'; 

const apiObject = {
    // Helper to get Auth Token from Supabase
    async getAuthHeader() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return {};
        return { 
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        };
    },

    // 1. Get Signed URL for R2 Upload
    async getUploadUrl(fileName, fileType, folder = 'vault') {
        try {
            const headers = await this.getAuthHeader();
            const url = `${WORKER_URL}/uploads/sign?file=${encodeURIComponent(fileName)}&type=${encodeURIComponent(fileType)}&folder=${folder}`;
            
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error("Worker failed to sign URL");
            
            return await response.json();
        } catch (err) {
            console.error("Upload URL Error:", err);
            throw err;
        }
    },

    // 2. Create Cashfree Payment Session
    async createPaymentSession(planId) {
        try {
            const headers = await this.getAuthHeader();
            const { data: { user } } = await supabase.auth.getUser();
            
            const response = await fetch(`${WORKER_URL}/payments/create-session`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 
                    planId: planId,
                    userId: user.id 
                })
            });
            return await response.json();
        } catch (err) {
            console.error("Payment Session Error:", err);
            throw err;
        }
    },

    // 3. Verify Payment Status
    async verifyPayment(orderId) {
        try {
            const headers = await this.getAuthHeader();
            const response = await fetch(`${WORKER_URL}/payments/verify?orderId=${orderId}`, {
                headers: headers
            });
            return await response.json();
        } catch (err) {
            console.error("Verify Payment Error:", err);
            throw err;
        }
    },

    // 4. Admin: Get Platform Stats
    async getAdminStats() {
        try {
            const headers = await this.getAuthHeader();
            const response = await fetch(`${WORKER_URL}/admin/stats`, {
                headers: headers
            });
            if (response.status === 403) throw new Error("Unauthorized Access");
            return await response.json();
        } catch (err) {
            console.error("Admin Stats Error:", err);
            throw err;
        }
    },

    // 5. Send Family SOS/Alerts
    async sendFamilyAlert(alertType, message) {
        try {
            const headers = await this.getAuthHeader();
            const response = await fetch(`${WORKER_URL}/notifications/send`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ type: alertType, message: message })
            });
            return await response.json();
        } catch (err) {
            console.error("Family Alert Error:", err);
            throw err;
        }
    }
};

// Global expose - Isse "api is not defined" error khatam ho jayega
window.api = apiObject;
console.log("LifeOS API Bridge: Ready");
