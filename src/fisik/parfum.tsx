import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AddressEn from '@/components/address_en';
import qrisBcaImage from '@/assets/qrisbca.jpeg';
import { ArrowLeft, Copy, Plus, Minus } from 'lucide-react';
import { FaWhatsapp, FaPaypal, FaBitcoin } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { getFbcFbpCookies, getClientIp } from '@/utils/fbpixel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function ParfumPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const PIXEL_ID = 'CAPI_INDO';
  
  const [user, setUser] = useState<any>(null);
  const [currency, setCurrency] = useState('SGD');
  const [quantity, setQuantity] = useState(3);

  const productName = 'eL Royale Parfum';
  const unitPriceSGD = 40; 
  const bundlePriceSGD = 100; 

  const rates = {
    'SGD': 1,
    'USD': 0.75,
    'MYR': 3.5
  };

  const getUnitPrice = () => unitPriceSGD * (rates[currency as keyof typeof rates]);
  const getBundlePrice = () => bundlePriceSGD * (rates[currency as keyof typeof rates]);

  const calculateTotal = () => {
    const unit = getUnitPrice();
    const bundle = getBundlePrice();
    if (quantity >= 3) {
        const bundles = Math.floor(quantity / 3);
        const remaining = quantity % 3;
        return (bundles * bundle) + (remaining * unit);
    }
    return quantity * unit;
  };

  const shippingFee = quantity >= 3 ? 0 : (10 * rates[currency as keyof typeof rates]);
  const totalAmount = calculateTotal() + shippingFee;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [country, setCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');
  
  const fullAddress = `${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${country}, ${kodePos}`;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PAYPAL');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === 'SGD' ? 'en-SG' : currency === 'USD' ? 'en-US' : 'ms-MY', {
      style: 'currency',
      currency: currency,
    }).format(amount) + ` ${currency}`;
  };

  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
    try {
      const { fbc, fbp } = getFbcFbpCookies();
      const userData: any = { client_user_agent: navigator.userAgent, fbc, fbp };
      if (userEmail) userData.em = userEmail;
      if (userName) userData.fn = userName.trim().split(/\s+/)[0];
      if (phoneNumber) userData.ph = phoneNumber;
      if (user?.id) userData.external_id = user.id;

      await supabase.functions.invoke('capi-universal', {
        body: { pixelId: PIXEL_ID, eventName, customData: eventData, eventId, eventSourceUrl: window.location.href, userData }
      });
    } catch (err) { console.error('CAPI Error:', err); }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { setUserName(session.user.user_metadata.full_name || ''); setUserEmail(session.user.email || ''); }
    });
    sendCapiEvent('AddToCart', { content_name: productName, value: getUnitPrice(), currency: currency }, `addtocart-${Date.now()}`);
  }, [currency]);

  const paymentMethods = [
    { code: 'PAYPAL', name: 'PayPal', description: 'Pay with PayPal or Credit Card', icon: <FaPaypal className="text-[#003087]" /> },
    { code: 'QRIS', name: 'QRIS', description: 'Pay with All Banks, DANA, OVO, SHOPEEPAY', icon: null },
    { code: 'BCA_MANUAL', name: 'Manual Transfer BCA', description: 'Bank Central Asia Manual Transfer', icon: null },
    { code: 'BITCOIN', name: 'Bitcoin (BTC)', description: 'Pay with Bitcoin', icon: <FaBitcoin className="text-[#F7931A]" /> },
    { code: 'USDT', name: 'USDT (BEP20/ERC20)', description: 'Pay with USDT Stablecoin', icon: <SiTether className="text-[#26A17B]" /> },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text has been copied to clipboard" });
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !userAddress || !country || !selectedPaymentMethod) {
      toast({ title: "Incomplete Data", description: "Please complete all shipping information.", variant: "destructive" });
      return;
    }
    setLoading(true);
    sendCapiEvent('AddPaymentInfo', { content_name: productName, value: totalAmount, currency: currency }, `addpaymentinfo-${Date.now()}`);
    const { fbc, fbp } = getFbcFbpCookies();
    const clientIp = await getClientIp();

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: 'parfum',
          paymentMethod: selectedPaymentMethod,
          userName, userEmail, phoneNumber,
          address: fullAddress,
          amount: totalAmount,
          currency, quantity,
          productName: `${productName} (${quantity} Bottles)`,
          userId: user?.id || null, fbc, fbp, clientIp
        }
      });

      if (data?.success) {
        if (selectedPaymentMethod === 'PAYPAL' && data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
        setPaymentData(data); setShowPaymentInstructions(true);
      } else {
        if (['BCA_MANUAL', 'BITCOIN', 'USDT'].includes(selectedPaymentMethod)) {
          setPaymentData({ paymentMethod: selectedPaymentMethod, amount: totalAmount, status: 'UNPAID', tripay_reference: `MANUAL-${Date.now()}` });
          setShowPaymentInstructions(true);
        } else {
          toast({ title: "Error", description: data?.error || invokeError?.message || "Failed to create payment.", variant: "destructive" });
        }
      }
    } catch (error) { console.error('Payment error:', error); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    const channel = supabase.channel(`payment-status-parfum-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}`}, (payload) => {
          if (payload.new?.status === 'PAID') {
            toast({ title: "🎉 Payment Successful!", description: "Thank you, your payment has been received.", duration: 0,
                action: (() => {
                      const message = `Hello, I have paid for my Parfum order.\n\nDetails:\n- Name: ${userName}\n- Product: ${productName} (${quantity} units)\n- Total: ${formatCurrency(totalAmount)}\n- Ref: ${paymentData?.tripay_reference}\nPlease confirm. Thank you.`;
                      return <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="w-full"><Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white w-full"><FaWhatsapp className="mr-2" /> Contact CS</Button></a>;
                    })(),
            });
          }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData, userName, quantity, totalAmount, selectedPaymentMethod, formatCurrency]);

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-32 p-6">
        <Toaster />
        <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)}><ArrowLeft /></Button>
        <h1 className="text-2xl font-bold mt-4 mb-6">Payment Instructions</h1>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between"><span>Status</span><span className="font-bold text-orange-500">{paymentData.status}</span></div>
            <div className="flex justify-between"><span>Method</span><span className="font-bold">{paymentData.paymentMethod}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="font-bold text-primary">{formatCurrency(paymentData.amount)}</span></div>
            <div className="flex justify-between"><span>Ref</span><span className="font-mono text-xs">{paymentData.tripay_reference}</span></div>
          </CardContent>
        </Card>
        {paymentData.paymentMethod === 'BCA_MANUAL' && (
          <Card className="mt-6">
            <CardHeader><CardTitle>BCA Manual Transfer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary p-3 rounded flex justify-between"><span>7751146578</span><Button variant="ghost" size="icon" onClick={() => copyToClipboard('7751146578')}><Copy size={16}/></Button></div>
              <p className="text-center font-bold">Delia Mutia</p>
              <img src={qrisBcaImage} className="mx-auto w-48 border rounded" />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <div className="p-6 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft /></Button>
        <h1 className="text-xl font-bold">Checkout Parfum</h1>
        <div className="flex bg-secondary p-1 rounded-lg">
          {['SGD', 'USD', 'MYR'].map((cur) => (
            <button key={cur} onClick={() => setCurrency(cur)} className={`px-3 py-1 text-xs font-bold rounded transition-all ${currency === cur ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-amber-950 shadow-md' : 'text-muted-foreground'}`}>{cur}</button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>1. Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between font-bold"><span>{productName}</span><span>{formatCurrency(calculateTotal())}</span></div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus size={16}/></Button>
                <span className="font-bold">{quantity} Bottles</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => q+1)}><Plus size={16}/></Button>
            </div>
            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">{quantity >= 3 ? "✨ Bundle Promo & FREE Shipping applied!" : "Add 3 for Bundle Promo & FREE Shipping"}</div>
            <Separator />
            <div className="flex justify-between text-lg font-bold"><span>Total Price</span><span className="text-primary">{formatCurrency(totalAmount)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Shipping Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)} />
            <Input placeholder="Email" type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
            <Input placeholder="Phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <Input placeholder="Country (e.g. Singapore, USA, Malaysia)" value={country} onChange={e => setCountry(e.target.value)} />
            <AddressEn selectedProvince={selectedProvince} setSelectedProvince={setSelectedProvince} userAddress={userAddress} setUserAddress={setUserAddress} city={kota} setCity={setKota} district={kecamatan} setDistrict={setKecamatan} postalCode={kodePos} setPostalCode={setKodePos} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Payment Method</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label key={method.code} htmlFor={method.code} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${selectedPaymentMethod === method.code ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value={method.code} id={method.code} />
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">{method.icon}<div><span className="font-bold">{method.name}</span><p className="text-xs text-muted-foreground">{method.description}</p></div></div>
                    </div>
                </Label>
                ))}
            </RadioGroup>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button onClick={handleCreatePayment} disabled={loading} className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-500 to-rose-600 text-white">
            {loading ? 'Processing...' : `Pay Now (${formatCurrency(totalAmount)})`}
          </Button>
        </div>
      </div>
      <WhatsAppButton message="Hi Renata, I have a question about eL Royale Parfum..." />
    </div>
  );
}
