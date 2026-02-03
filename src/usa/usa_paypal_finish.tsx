import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { initFacebookPixelWithLogging, trackPurchaseEvent, trackPageViewEvent } from '@/utils/fbpixel';

const PayPalFinish = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState("Finalizing your secure payment...");
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  // Facebook Pixel Init
  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    const eventId = `pageview-${Date.now()}`;
    trackPageViewEvent({}, eventId, PIXEL_ID);
  }, []);

  useEffect(() => {
    const token = searchParams.get('token'); // PayPal sends 'token' as the Order ID
    
    if (!token) {
      setStatus('error');
      setMessage("Invalid payment token received. Please try again.");
      return;
    }

    const capturePayment = async () => {
      try {
        console.log("Capturing PayPal Order:", token);
        
        // Call our unified callback function to capture using Supabase Client
        const { data, error } = await supabase.functions.invoke('tripay-callback', {
          body: {
            action: 'CAPTURE_PAYPAL',
            orderId: token
          }
        });

        if (error) throw new Error(error.message || "Network error");
        if (data && data.error) throw new Error(data.error.message || "Capture failed");

        setStatus('success');
        
        const productName = data.product_name || 'Product';
        const isVIP = productName.includes('VIP') || productName.includes('3000');
        const amount = data.amount || (isVIP ? 1500.00 : 20.00);

        if (isVIP) {
             setMessage("Payment confirmed! Our team has been notified and will contact you via WhatsApp/Email shortly to schedule your first session.");
        } else {
             setMessage("Payment successful! Please check your Email Inbox (and Spam/Important folder). Your Ebook & Audio download links have been sent.");
        }

        // Track Purchase Event (Browser)
        trackPurchaseEvent({
            value: amount,
            currency: 'USD',
            content_name: productName
        }, token, PIXEL_ID);

      } catch (err: any) {
        console.error("Capture Error:", err);
        setStatus('error');
        setMessage("We could not verify your payment. If you were charged, please contact support via WhatsApp.");
      }
    };

    // Prevent double-execution in React Strict Mode
    const hasRun = React.useRef(false);
    if (!hasRun.current) {
        hasRun.current = true;
        capturePayment();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center">
        
        {status === 'processing' && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing...</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3 w-full">
                <Button 
                onClick={() => window.location.href = "https://wa.me/62895325633487?text=Hi%2C%20I%20just%20paid%20via%20PayPal.%20Can%20I%20get%20my%20Ebook%3F"}
                className="w-full bg-green-500 hover:bg-green-600"
                >
                Chat Support (WhatsApp)
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Return to Home
                </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
             <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
            <p className="text-red-500 mb-6">{message}</p>
            <Button onClick={() => window.location.href = "https://wa.me/62895325633487"} variant="default" className="w-full mb-3">
              Contact Support
            </Button>
             <Button variant="ghost" onClick={() => navigate('/usa_ebookhealth')} className="w-full flex items-center gap-2">
              <ArrowLeft size={16} /> Try Again
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PayPalFinish;
