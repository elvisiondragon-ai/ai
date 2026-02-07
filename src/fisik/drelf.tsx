import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AddressEn from '@/components/address_en';
import drelfImage from '@/assets/drelf.png';
import qrisBcaImage from '@/assets/qrisbca.jpeg';
import { ArrowLeft, Copy, CreditCard, User, Mail, Phone, Plus, Minus, Globe } from 'lucide-react';
import { FaWhatsapp, FaPaypal, FaBitcoin } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { getFbcFbpCookies, getClientIp } from '@/utils/fbpixel';
import { WhatsAppButton } from '@/components/WhatsAppButton';


export default function DrelfPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const PIXEL_ID = '1749197952320359';
  
  const [user, setUser] = useState<any>(null);
  const [currency, setCurrency] = useState('SGD');
  const [quantity, setQuantity] = useState(1);

  const productName = 'Drelf Collagen';
  const unitPriceSGD = 60;
  const bundlePriceSGD = 100; // for 3 boxes

  // Conversion rates (Fixed for consistency with backend)
  const rates = {
    'SGD': 1,
    'USD': 0.75, // Approx 1 SGD = 0.75 USD
    'MYR': 3.5   // Approx 1 SGD = 3.5 MYR
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

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
    try {
      await supabase.auth.getSession();
      const { fbc, fbp } = getFbcFbpCookies();

      const userData: any = {
        client_user_agent: navigator.userAgent,
        fbc,
        fbp
      };

      if (userEmail) userData.em = userEmail;
      if (userName) {
          const nameParts = userName.trim().split(/\s+/);
          userData.fn = nameParts[0];
          if (nameParts.length > 1) userData.ln = nameParts.slice(1).join(' ');
      }
      if (phoneNumber) userData.ph = phoneNumber;
      if (user?.id) userData.external_id = user.id;

      await supabase.functions.invoke('capi-universal', {
        body: {
          pixelId: PIXEL_ID,
          eventName,
          customData: eventData,
          eventId: eventId,
          eventSourceUrl: window.location.href,
          userData
        }
      });
    } catch (err) {
      console.error('CAPI Error:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserName(session.user.user_metadata.full_name || '');
        setUserEmail(session.user.email || '');
      }
    });

    // Track AddToCart on Cart Load (CAPI Only)
    const eventId = `addtocart-${Date.now()}`;
    sendCapiEvent('AddToCart', {
      content_name: 'Drelf Collagen Ritual',
      value: getUnitPrice(),
      currency: currency
    }, eventId);
  }, [currency]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const paymentMethods = [
    { code: 'PAYPAL', name: 'PayPal', description: 'Pay with PayPal or Credit Card', icon: <FaPaypal className="text-[#003087]" /> },
    { code: 'QRIS', name: 'QRIS', description: 'Pay with All Banks, DANA, OVO, SHOPEEPAY', icon: null },
    { code: 'BCA_MANUAL', name: 'Manual Transfer BCA', description: 'Bank Central Asia Manual Transfer', icon: null },
    { code: 'BITCOIN', name: 'Bitcoin (BTC)', description: 'Pay with Bitcoin', icon: <FaBitcoin className="text-[#F7931A]" /> },
    { code: 'USDT', name: 'USDT (BEP20/ERC20)', description: 'Pay with USDT Stablecoin', icon: <SiTether className="text-[#26A17B]" /> },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard",
    });
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !userAddress || !country || !selectedProvince || !kota || !kecamatan || !kodePos || !selectedPaymentMethod) {
      toast({
        title: "Incomplete Data",
        description: "Please complete all shipping information.",
        variant: "destructive",
      });
      return;
    }

    const currentFullAddress = `${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${kodePos}`;

    setLoading(true);

    // Track AddPaymentInfo (CAPI Only)
    const apiEventId = `addpaymentinfo-${Date.now()}`;
    sendCapiEvent('AddPaymentInfo', {
      content_name: productName,
      value: totalAmount,
      currency: currency
    }, apiEventId);

    const { fbc, fbp } = getFbcFbpCookies();
    const clientIp = await getClientIp();

    const manualMethods = ['BCA_MANUAL', 'BITCOIN', 'USDT'];

    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: 'drelf',
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: currentFullAddress,
          province: selectedProvince,
          kota: kota,
          kecamatan: kecamatan,
          kodePos: kodePos,
          amount: totalAmount,
          currency: currency,
          quantity: quantity,
          productName: productName + (quantity >= 3 ? ' (Promo Bundle Applied)' : '') + (shippingFee === 0 ? ' (Free Shipping)' : ''),
          userId: user?.id || null,
          fbc,
          fbp,
          clientIp
        }
      });

      if (error || !data?.success) {
        if (manualMethods.includes(selectedPaymentMethod)) {
          setPaymentData({
            paymentMethod: selectedPaymentMethod,
            amount: totalAmount,
            status: 'UNPAID',
            tripay_reference: `MANUAL-${Date.now()}`,
          });
          setShowPaymentInstructions(true);
          return;
        } else {
          toast({
            title: "Error Creating Payment",
            description: data?.error || error?.message || "Failed to create payment.",
            variant: "destructive",
          });
          return;
        }
      }

      if (data?.success) {
        if (selectedPaymentMethod === 'PAYPAL' && data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
            return;
        }
        setPaymentData(data);
        setShowPaymentInstructions(true);
      }
    } catch (error: any) {
      console.error('Tripay payment error:', error);
      if (manualMethods.includes(selectedPaymentMethod)) {
        setPaymentData({
          paymentMethod: selectedPaymentMethod,
          amount: totalAmount,
          status: 'UNPAID',
          tripay_reference: `MANUAL-${Date.now()}`,
        });
        setShowPaymentInstructions(true);
      } else {
        toast({
          title: "Critical Error",
          description: "Failed to call payment function.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const channel = supabase
      .channel(`payment-status-drelf-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'PAID') {
            toast({
                title: "🎉 Payment Successful!",
                description: "Thank you, your payment has been received.",
                duration: 0,
                action: (() => {
                      const message = `Hello, I have paid for my Drelf Collagen order.\n\nPayment Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Phone: ${phoneNumber}\n- Address: ${fullAddress}\n- Product: ${productName} (${quantity} units)\n- Total: ${formatCurrency(totalAmount)}\n- Method: ${selectedPaymentMethod}\n- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}\n- Status: PAID\nPlease confirm my order. Thank you.`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappHref = `https://wa.me/62895325633487?text=${encodedMessage}`;

                      return (
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white w-full">
                            <FaWhatsapp className="mr-2" /> Contact CS
                          </Button>
                        </a>
                      );
                    })(),
            });
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showPaymentInstructions, paymentData]);

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <Toaster />
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
              Payment Instructions
            </h1>
          </div>
        </div>

        <div className="px-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Status</Label>
                <span className={`font-medium ${paymentData.status === 'UNPAID' ? 'text-orange-500' : 'text-green-500'}`}>
                  {paymentData.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Payment Method</Label>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Total Payment</Label>
                <span className="font-bold text-lg text-primary">{formatCurrency(paymentData.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Tripay Reference</Label>
                <span className="font-medium">{paymentData.tripay_reference}</span>
              </div>
            </CardContent>
          </Card>

          {paymentData.paymentMethod === 'BCA_MANUAL' && (
            <Card>
              <CardHeader>
                <CardTitle>Manual Transfer BCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Account Number</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-mono text-lg">7751146578</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('7751146578')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Name</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-medium">Delia Mutia</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('Delia Mutia')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img src={qrisBcaImage} alt="QRIS BCA" className="w-64 h-64 border rounded-lg" />
                </div>
                <div className="my-12">
                    <a
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hello, I have made a manual BCA transfer for my Drelf Collagen order.\n\nPayment Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Phone: ${phoneNumber}\n- Address: ${fullAddress}\n- Product: ${productName} (${quantity} units)\n- Total: ${formatCurrency(totalAmount)}\n- Method: Manual Transfer BCA\n- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}\nPlease confirm my order. Thank you.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                        <FaWhatsapp className="mr-2" /> Contact CS if already paid
                      </Button>
                    </a>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.paymentMethod === 'BITCOIN' && (
            <Card>
              <CardHeader>
                <CardTitle>Pay via Bitcoin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Bitcoin Address</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-mono text-xs break-all">1HkjTQ1tV619v1b3K9s49T8GNkKxjhoCTb</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('1HkjTQ1tV619v1b3K9s49T8GNkKxjhoCTb')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="my-12">
                    <a
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hello, I have paid for my Drelf Collagen order via Bitcoin.\n\nPayment Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Phone: ${phoneNumber}\n- Total: ${formatCurrency(totalAmount)}\n- Method: Bitcoin\n- Ref: ${paymentData?.tripay_reference || 'N/A'}\nPlease verify my transaction. Thank you.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                        <FaWhatsapp className="mr-2" /> Contact CS after paying
                      </Button>
                    </a>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.paymentMethod === 'USDT' && (
            <Card>
              <CardHeader>
                <CardTitle>Pay via USDT (BEP20/ERC20)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">USDT Address</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-mono text-xs break-all">0x900e0c82489accf05ec95a184169191bb5928df7</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('0x900e0c82489accf05ec95a184169191bb5928df7')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="my-12">
                    <a
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hello, I have paid for my Drelf Collagen order via USDT.\n\nPayment Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Phone: ${phoneNumber}\n- Total: ${formatCurrency(totalAmount)}\n- Method: USDT\n- Ref: ${paymentData?.tripay_reference || 'N/A'}\nPlease verify my transaction. Thank you.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                        <FaWhatsapp className="mr-2" /> Contact CS after paying
                      </Button>
                    </a>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.payCode && (
            <Card>
              <CardHeader>
                <CardTitle>Virtual Account / Payment Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                  <span className="font-mono text-lg">{paymentData.payCode}</span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(paymentData.payCode)}>
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.qrUrl && (
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img src={paymentData.qrUrl} alt="QR Code" className="w-64 h-64 border rounded-lg" />
              </CardContent>
            </Card>
          )}

          {paymentData.checkoutUrl && paymentData.paymentType === 'REDIRECT' && (
            <div className="fixed bottom-20 left-6 right-6">
              <Button onClick={() => window.open(paymentData.checkoutUrl, '_blank')} className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" /> Continue Payment
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster />
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                    Checkout Drelf
                </h1>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Choose Your Currency</span>
                <div className="flex bg-secondary p-1 rounded-lg border border-gold/10">
                    {['SGD', 'USD', 'MYR'].map((cur) => (
                        <button
                            key={cur}
                            onClick={() => setCurrency(cur)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-300 ${
                                currency === cur 
                                ? 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-amber-950 shadow-md scale-105' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {cur}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Order Summary</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Product</Label>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-center my-4">
              <img src={drelfImage} alt="Drelf Product" className="w-48 h-48 object-contain" />
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="quantity" className="text-muted-foreground">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
                    <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm font-medium text-blue-600 text-center bg-blue-50 p-2 rounded-md">
                {quantity < 3 ? "Add to 3 for Auto Discount & FREE Shipping" : "✨ 3+ Bundle: Auto Discount & FREE Shipping applied!"}
            </div>

            <Separator/>
            
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Subtotal</Label>
              <span className="font-medium">{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Shipping Fee</Label>
              <span className={shippingFee === 0 ? "text-green-600 font-bold" : "font-medium"}>
                {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
              </span>
            </div>

            <Separator/>

            <div className="flex justify-between items-center">
              <Label className="text-lg font-bold">Total Price ({currency})</Label>
              <div className="text-right">
                  <span className={`font-bold text-xl text-primary`}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-2">
              <p className="text-amber-900 text-[10px] font-bold">
                🛡️ BPOM RI 271282014100002 (HSA equivalent) by PT. SKA
              </p>
              <p className="text-amber-800 text-[10px] leading-relaxed">
                One box contains 10 sachets. Recommended dosage: 1 sachet per day. 3 boxes for 1 month supply to keep your beauty outstanding naturally.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Shipping Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName"><User className="inline-block w-4 h-4 mr-2"/>Full Name</Label>
              <Input id="userName" name="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="userEmail"><Mail className="inline-block w-4 h-4 mr-2"/>Email</Label>
              <Input id="userEmail" name="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline-block w-4 h-4 mr-2"/>Phone Number</Label>
              <Input id="phoneNumber" name="tel" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+65 8123 4567" required />
            </div>
            <div>
              <Label htmlFor="country"><Globe className="inline-block w-4 h-4 mr-2"/>Country *</Label>
              <Input id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Singapore, USA, Malaysia" required />
            </div>
            <AddressEn
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              city={kota}
              setCity={setKota}
              district={kecamatan}
              setDistrict={setKecamatan}
              postalCode={kodePos}
              setPostalCode={setKodePos}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Payment Method</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label 
                    key={method.code} 
                    htmlFor={method.code} 
                    className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPaymentMethod === method.code 
                        ? (method.code === 'PAYPAL' ? 'border-[#0070ba] bg-[#0070ba]/5 shadow-lg ring-1 ring-[#0070ba]' : 'border-primary shadow-lg') 
                        : 'border-border'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {method.icon}
                                <div>
                                    <span className={`font-bold ${method.code === 'PAYPAL' ? 'text-[#003087]' : ''}`}>{method.name}</span>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </div>
                            </div>
                            {method.code === 'PAYPAL' && (
                                <div className="flex items-center bg-[#ffc439] px-2 py-1 rounded">
                                    <FaPaypal className="text-[#003087] mr-1" />
                                    <span className="text-[#003087] font-extrabold text-xs">PayPal</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Label>
                ))}
            </RadioGroup>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button 
            onClick={handleCreatePayment} 
            disabled={loading} 
            className="w-full h-14 text-xl font-bold shadow-xl transition-all active:scale-95 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-amber-900 border-none hover:opacity-90"
          >
            {loading ? <div className="w-6 h-6 border-4 border-amber-900/30 border-t-amber-900 rounded-full animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {loading ? 'Processing...' : `Pay Now (${formatCurrency(totalAmount)})`}
          </Button>
        </div>

        <footer className="mt-8 px-6 text-center pb-10">
          <div className="pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-xs font-semibold">
              © 2026 eL Vision Group. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
      <WhatsAppButton message="Hi Renata, I have a question about Drelf Collagen Ritual..." />
    </div>
  );
}
