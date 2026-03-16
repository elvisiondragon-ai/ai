import { useEffect } from 'react';
import { CreditCard, ArrowRight } from 'lucide-react';

export default function PaypalPaymentPage() {
  // Facebook Pixel Base Code (Assuming the same ID as 3000.tsx)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f: any = window;
    const b: any = document;
    const e = 'script';
    const v = 'https://connect.facebook.net/en_US/fbevents.js';
    let n: any, t: any, s: any;
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
    
    f.fbq('init', '3319324491540889');
    f.fbq('track', 'PageView');
  }, []);

  const handlePaypalClick = () => {
    // Facebook Pixel Purchase Event
    const f: any = window;
    if (typeof f.fbq === 'function') {
      f.fbq('track', 'Purchase', {
        value: 3000.00,
        currency: 'USD',
        content_name: 'eL Vision 3000 Installment',
      });
    }
    // Redirect to PayPal payment link
    window.location.href = 'https://www.paypal.com/ncp/payment/3XU3SJV595CE4';
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 text-center shadow-xl">
        <CreditCard className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          eL Vision 3000 Installment
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Secure your spot for the 6-week program.
        </p>
        <p className="text-3xl font-bold text-white mb-8">
          $3,000.00 USD
        </p>
        <button
          onClick={handlePaypalClick}
          className="group bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-700/50 flex items-center justify-center gap-3 w-full"
        >
          Pay with PayPal
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
