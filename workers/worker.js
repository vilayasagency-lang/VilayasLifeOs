export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // 1. R2 SIGNED URL LOGIC
      if (url.pathname === '/uploads/sign') {
        const fileKey = `${url.searchParams.get('folder')}/${Date.now()}-${url.searchParams.get('file')}`;
        const uploadUrl = await env.R2_BUCKET.createSignedUrl(fileKey, {
          method: 'PUT', expiresIn: 3600, contentType: url.searchParams.get('type')
        });
        return new Response(JSON.stringify({ uploadUrl, fileKey }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 2. CASHFREE PAYMENT LOGIC
      if (url.pathname === '/payments/create-session') {
        const { planId, userId } = await request.json();
        const res = await fetch("https://sandbox.cashfree.com/pg/orders", {
          method: "POST",
          headers: { "x-api-version": "2023-08-01", "x-client-id": env.CASHFREE_APP_ID, "x-client-secret": env.CASHFREE_SECRET_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ order_amount: 199.00, order_currency: "INR", order_id: `ORDR_${Date.now()}`, customer_details: { customer_id: userId, customer_phone: "9999999999" } })
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response("LifeOS API Online", { headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
