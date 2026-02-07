import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AddressEn from '@/components/address_en';
import { ArrowLeft, CreditCard, User, Mail, Phone, Plus, Minus, Globe } from 'lucide-react';
import { FaWhatsapp, FaPaypal, FaBitcoin } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { getFbcFbpCookies, getClientIp } from '@/utils/fbpixel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function JewelryPaymentPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const PIXEL_ID = 'CAPI_JEWELRY'; // Signals capi-universal to use JEWELRY_PIXEL_ID env
  
  const products = [
    {
      id: 'innocence',
      name: 'Innocence',
      priceValue: 1000,
      image: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/eljewelry/innocence1.jpg'
    },
    {
      id: 'full-moisanite',
      name: 'Full moisanite',
      priceValue: 1500,
      image: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/eljewelry/fulmoisanite1.png'
    },
    {
      id: 'liontin-chanel',
      name: 'Liontin Chanel',
      priceValue: 1200,
      image: 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/eljewelry/chanelliontin.jpg'
    }
  ];

  const [user, setUser] = useState<any>(null);
  const [currency, setCurrency] = useState('SGD');

  // Conversion rates (Fixed for consistency with backend)
  const rates = {
    'SGD': 1,
    'USD': 0.75, // Approx 1 SGD = 0.75 USD
    'MYR': 3.5   // Approx 1 SGD = 3.5 MYR
  };

  // Get initial product info from URL params if available
  const initialProductName = searchParams.get('product') || products[0].name;
  const initialProduct = products.find(p => initialProductName.includes(p.name)) || products[0];

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  
  const [userName, setUserName] = useState(searchParams.get('name') || '');
  const [userEmail, setUserEmail] = useState(searchParams.get('email') || '');
  const [phoneNumber, setPhoneNumber] = useState(searchParams.get('phone') || '');
  const [userAddress, setUserAddress] = useState(searchParams.get('address') || '');
  const [country, setCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('region') || '');
  const [kota, setKota] = useState(searchParams.get('city') || '');
  const [kecamatan, setKecamatan] = useState(searchParams.get('district') || '');
  const [kodePos, setKodePos] = useState(searchParams.get('postalCode') || '');
  
  // Custom params for Jewelry
  const [ringSize, setRingSize] = useState(searchParams.get('ringSize') || '');
  const [goldColor, setGoldColor] = useState(searchParams.get('goldColor') || '');

  const fullAddress = `${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${country}, ${kodePos}`;
  
  const getUnitPrice = () => selectedProduct.priceValue * (rates[currency as keyof typeof rates]);
  const totalAmount = getUnitPrice() * quantity;

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
      if (session?.user && !userName) {
        setUserName(session.user.user_metadata.full_name || '');
        setUserEmail(session.user.email || '');
      }
    });

    // Track AddToCart on Cart Load (CAPI Only)
    const eventId = `addtocart-jewelry-${Date.now()}`;
    sendCapiEvent('AddToCart', {
      content_name: selectedProduct.name,
      value: getUnitPrice(),
      currency: currency
    }, eventId);
  }, [currency, selectedProduct]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const paymentMethods = [
    { code: 'PAYPAL', name: 'PayPal', description: 'Pay with PayPal or Credit Card', icon: <FaPaypal className="text-[#003087]" /> },
    { code: 'QRIS', name: 'QRIS', description: 'Pay with All Banks, DANA, OVO, SHOPEEPAY', icon: null },
    { code: 'BITCOIN', name: 'Bitcoin (BTC)', description: 'Pay with Bitcoin', icon: <FaBitcoin className="text-[#F7931A]" /> },
    { code: 'USDT', name: 'USDT (BEP20/ERC20)', description: 'Pay with USDT Stablecoin', icon: <SiTether className="text-[#26A17B]" /> },
  ];

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !userAddress || !country || !selectedProvince || !kota || !kecamatan || !kodePos || !selectedPaymentMethod || !ringSize || !goldColor) {
      toast({
        title: "Incomplete Data",
        description: "Please complete all shipping and product customization information.",
        variant: "destructive",
      });
      return;
    }

    const currentFullAddress = `${userAddress}, ${kecamatan}, ${kota}, ${selectedProvince}, ${kodePos}`;

    setLoading(true);

    // Track AddPaymentInfo (CAPI Only)
    const apiEventId = `addpaymentinfo-jewelry-${Date.now()}`;
    sendCapiEvent('AddPaymentInfo', {
      content_name: selectedProduct.name,
      value: totalAmount,
      currency: currency
    }, apiEventId);

    const { fbc, fbp } = getFbcFbpCookies();
    const clientIp = await getClientIp();

    const manualMethods = ['BITCOIN', 'USDT'];

    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: 'jewelry',
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: `Ring Size: ${ringSize}, Color: ${goldColor}. Address: ${currentFullAddress}`,
          amount: totalAmount,
          currency: currency,
          quantity: quantity,
          productName: `Jewelry: ${selectedProduct.name} (${goldColor}, Size ${ringSize})`,
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
      .channel(`payment-status-jewelry-${paymentData.tripay_reference}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'PAID') {
            toast({
                title: "🎉 Payment Successful!",
                description: "Thank you, your payment has been received.",
                duration: 0,
                action: (() => {
                      const message = `Hello, I have paid for my Jewelry order.

Payment Details:
- Name: ${userName}
- Email: ${userEmail}
- Phone: ${phoneNumber}
- Address: ${fullAddress}
- Product: ${selectedProduct.name} (${goldColor}, Size ${ringSize})
- Total: ${formatCurrency(totalAmount)}
- Method: ${selectedPaymentMethod}
- Ref TriPay: ${paymentData?.tripay_reference || 'N/A'}
- Status: PAID
Please confirm my order. Thank you.`;
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

          {paymentData.payCode && (
            <Card>
              <CardHeader>
                <CardTitle>Virtual Account / Payment Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                  <span className="font-mono text-lg">{paymentData.payCode}</span>
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
                <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                    Checkout Jewelry
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
            <div className="flex justify-center mb-4">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-48 h-48 object-cover rounded-lg border border-gold/20"
              />
            </div>
            <div>
              <Label htmlFor="product">Product Model *</Label>
              <select 
                id="product" 
                value={selectedProduct.name}
                onChange={(e) => {
                  const p = products.find(prod => prod.name === e.target.value);
                  console.log('Selected product name:', e.target.value, 'Found product:', p);
                  if (p) setSelectedProduct(p);
                }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background mt-1"
                required
              >
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Specifications:</span>
                <span className="font-medium">
                  {goldColor || 'Not selected'}, Size {ringSize || 'Not selected'}
                </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-4">
              <p className="text-blue-800 text-xs font-semibold flex items-center gap-2">
                ✨ Premium Moissanite Specification:
              </p>
              <p className="text-blue-700 text-[11px] mt-1 leading-relaxed">
                Our moissanite stones range from <strong>2.0 to 3.0 Carats</strong>. The exact carat weight is optimized based on your selected ring size to ensure the most elegant and balanced aesthetic for your piece.
              </p>
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

            <Separator/>

            <div className="flex justify-between items-center">
              <Label className="text-lg font-bold">Total Price ({currency})</Label>
              <div className="text-right">
                  <span className="font-bold text-xl text-primary">{formatCurrency(totalAmount)}</span>
              </div>
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

            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ringSize">Ring Size (US) *</Label>
                <select 
                  id="ringSize" 
                  value={ringSize} 
                  onChange={(e) => setRingSize(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Select your size</option>
                  {[3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12].map(size => (
                    <option key={size} value={size.toString()}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Gold Color (18Ct Gold) *</Label>
                <RadioGroup value={goldColor} onValueChange={setGoldColor} className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <RadioGroupItem value="Rose Gold" id="rose-gold" className="sr-only" />
                    <Label 
                      htmlFor="rose-gold" 
                      className={`flex items-center gap-2 p-2 rounded-full border transition-all ${goldColor === 'Rose Gold' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-transparent'}`}
                    >
                      <span className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #e5b2ca 0%, #703642 100%)' }}></span>
                      <span className="text-sm font-medium">Rose Gold</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <RadioGroupItem value="Yellow Gold" id="yellow-gold" className="sr-only" />
                    <Label 
                      htmlFor="yellow-gold" 
                      className={`flex items-center gap-2 p-2 rounded-full border transition-all ${goldColor === 'Yellow Gold' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-transparent'}`}
                    >
                      <span className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)' }}></span>
                      <span className="text-sm font-medium">Yellow Gold</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    <RadioGroupItem value="White Gold" id="white-gold" className="sr-only" />
                    <Label 
                      htmlFor="white-gold" 
                      className={`flex items-center gap-2 p-2 rounded-full border transition-all ${goldColor === 'White Gold' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-transparent'}`}
                    >
                      <span className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #e5e5e5 0%, #a0a0a0 100%)' }}></span>
                      <span className="text-sm font-medium">White Gold</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
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
                        selectedPaymentMethod === method.code ? 'border-primary shadow-lg' : 'border-border'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {method.icon}
                                <div>
                                    <span className="font-bold">{method.name}</span>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </div>
                            </div>
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

                      © 2026 eL Royal Jewelry. All Rights Reserved.

                    </p>

                  </div>

                </footer>

              </div>

              <WhatsAppButton message={`Hi Renata, I have a question about ${selectedProduct.name} jewelry...`} />

            </div>

          );

        }

        