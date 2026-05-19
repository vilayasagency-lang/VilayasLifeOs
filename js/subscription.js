const cashfree = Cashfree({ mode: "sandbox" }); // Change to "production" when live

document.getElementById('pay-btn').onclick = async () => {
    const btn = document.getElementById('pay-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        // 1. Create session via Worker
        const session = await api.createPaymentSession('pro_monthly');
        
        // 2. Launch Checkout
        await cashfree.checkout({
            paymentSessionId: session.payment_session_id,
            redirectTarget: "_self"
        });
    } catch (e) {
        alert("Payment Error: " + e.message);
        btn.innerText = "Pay Securely";
        btn.disabled = false;
    }
};
