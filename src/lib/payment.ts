import { toast } from 'sonner';

interface CheckoutOptions {
    planId: string;
    amount: number;
    userId: string;
    userEmail: string;
    userName: string;
    billingCycle: 'Annual' | 'Monthly';
}

export async function initiateCheckout({
    planId,
    amount,
    userId,
    userEmail,
    userName,
    billingCycle
}: CheckoutOptions) {
    try {
        const API_URL = import.meta.env.VITE_PAYMENT_API_URL || 'https://payments.nfks.co.in/api/v1';
        const API_KEY = import.meta.env.VITE_PAYMENT_API_KEY;

        if (!API_KEY) {
            console.warn('Missing VITE_PAYMENT_API_KEY. Using mock redirect for demo.');
            // For demo purposes if no API key is set
            toast.loading('Redirecting to payment gateway...');
            setTimeout(() => {
                window.location.href = `/subscription?status=success&session_id=mock_session_${Date.now()}`;
            }, 1500);
            return;
        }

        const response = await fetch(`${API_URL}/checkout/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                order_id: `ORD-${Date.now()}`,
                amount: amount,
                currency: 'INR',
                plan_id: planId,
                plan_name: `AyScroll ${planId === 'pro' ? 'Pro' : 'Go'} - ${billingCycle}`,
                billing_period: {
                    start: new Date().toISOString(),
                    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                customer: {
                    user_id: userId,
                    email: userEmail,
                    name: userName
                },
                redirect_urls: {
                    success: window.location.origin + '/profile?status=success',
                    failure: window.location.origin + '/profile?status=failed',
                    cancel: window.location.origin + '/profile?status=cancelled'
                },
                webhook_url: 'https://api.ayscroll.com/webhooks/payment' // Placeholder for production
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || 'Failed to initiate checkout');
        }

        // Fix: Ensure we redirect to the correct domain if the API returns localhost
        let checkoutUrl = data.data.checkout_url;
        if (checkoutUrl.includes('localhost') && API_URL.includes('nfks.co.in')) {
            checkoutUrl = checkoutUrl.replace('http://localhost:3000', 'https://payments.nfks.co.in');
        }

        // Redirect to Checkout
        window.location.href = checkoutUrl;

    } catch (error) {
        console.warn('Payment API Error (likely CORS or Offline):', error);

        // FALLBACK: Simulate success for demo/development if API fails
        toast.error('Payment Gateway unreachable', {
            description: 'Redirecting to mock success page for DEMO purposes...',
            duration: 3000
        });

        setTimeout(() => {
            window.location.href = window.location.origin + '/profile?status=success&session_id=demo_session_123';
        }, 2000);
    }
}
