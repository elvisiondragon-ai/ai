import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, User, Mail, Phone, Copy } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent, 
  trackAddPaymentInfoEvent, 
  trackPurchaseEvent,
  AdvancedMatchingData,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/62895325633487"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
    aria-label="Contact via WhatsApp"
  >
    <FaWhatsapp size={28} />
  </a>
);

const qrisBcaImage = "https://placehold.co/400x400?text=QRIS+BCA";

export default function AudioProductPaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  const purchaseFiredRef = useRef(false);
  const isProcessingRef = useRef(false);
  const addPaymentInfoFiredRef = useRef(false);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {
    try {
      await waitForFbp();

      const { data: { session } } = await supabase.auth.getSession();
      const body: any = {
        pixelId: '3319324491540889',
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        testCode: 'testcode_indo'
      };

      const { fbc, fbp } = getFbcFbpCookies();

      const userData: any = {
        client_user_agent: navigator.userAgent,
      };

      let rawName = userName;
      if (userEmail) {
        userData.email = userEmail;
      } else if (session?.user?.email) {
        userData.email = session.user.email;
      }
      if (phoneNumber) {
        userData.phone = phoneNumber;
      } else if (session?.user?.user_metadata?.phone) {
        userData.phone = session.user.user_metadata.phone;
      }
      if (!rawName && session?.user?.user_metadata?.full_name) {
        rawName = session.user.user_metadata.full_name;
      }

      if (rawName) {
        const nameParts = rawName.trim().split(/\s+/);
        userData.fn = nameParts[0];
        if (nameParts.length > 1) {
          userData.ln = nameParts.slice(1).join(' ');
        }
      }

      if (session?.user?.id) {
        userData.external_id = session.user.id;
      } else if (user?.id) {
        userData.external_id = user.id;
      }

      const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
      if (fbIdentity) {
        userData.db_id = fbIdentity.id;
      }

      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      
      body.userData = userData;

      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState('audio_verse_6');
  const productPrice = 200000;
  const totalQuantity = 1;

  const audioProducts = [
    { id: 'audio_verse_6', name: 'Verse 6: Beautify', description: 'Audio for Inner Beauty & Radiance' },
    { id: 'audio_verse_14', name: 'Verse 14: Divine Goddess', description: 'Audio for Divine Feminine Energy' },
  ];

  const getProductName = () => {
    const product = audioProducts.find(p => p.id === selectedProduct);
    return product ? product.name : 'Audio Product';
  };

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  
  const totalAmount = productPrice;

  const hasFiredPixelsRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
      hasFiredPixelsRef.current = true;
      const pixelId = '3319324491540889';
      
      initFacebookPixelWithLogging(pixelId);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);

      const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackViewContentEvent({
        content_name: 'Audio Series',
        content_ids: ['audio_product'],
        content_type: 'product',
        value: productPrice,
        currency: 'IDR'
      }, viewContentEventId, pixelId);
    }
  }, []);

  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Bayar ke Semua Bank, DANA, OVO, SHOPEEPAY' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer via BCA Virtual Account' },
    { code: 'PERMATAVA', name: 'Permata Virtual Account', description: 'Transfer via Permata Virtual Account' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer otomatis via BNI' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer via BRI Virtual Account' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer via Mandiri Virtual Account' },
    { code: 'BCA_MANUAL', name: 'Manual Transfer BCA', description: '' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  const handleCreatePayment = async () => {
    if (isProcessingRef.current) return;

    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua informasi: nama, email, telepon, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    let currentUserId = user?.id;

    isProcessingRef.current = true;
    setLoading(true);

    const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const pixelId = '3319324491540889';
    const productNameBackend = 'audio_product'; 

    const userDataPixel: AdvancedMatchingData = {
      em: userEmail,
      ph: phoneNumber,
      fn: userName,
      external_id: user?.id || currentUserId
    };

    if (!addPaymentInfoFiredRef.current) {
      addPaymentInfoFiredRef.current = true;
      trackAddPaymentInfoEvent({
        content_ids: [productNameBackend],
        content_type: 'product',
        value: totalAmount,
        currency: 'IDR'
      }, addPaymentInfoEventId, pixelId, userDataPixel, 'testcode_indo');
      
      sendCapiEvent('AddPaymentInfo', {
        content_ids: [productNameBackend],
        content_type: 'product',
        value: totalAmount,
        currency: 'IDR'
      }, addPaymentInfoEventId);
    }

    const { fbc, fbp } = getFbcFbpCookies();

    // Determine the specific subscription type based on selection
    // The backend/email logic will use this to send the correct file
    const subscriptionType = selectedProduct; 

    try {
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: subscriptionType, // 'audio_verse_6' or 'audio_verse_14'
          paymentMethod: selectedPaymentMethod,
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber,
          address: null, 
          amount: totalAmount,
          quantity: totalQuantity,
          productName: getProductName(),
          userId: currentUserId,
          affiliateRef: affiliateRef,
          fbc,
          fbp
        }
      });

      if (error || !data?.success) {
        if (selectedPaymentMethod === 'BCA_MANUAL') {
          setPaymentData({
            paymentMethod: selectedPaymentMethod,
            amount: totalAmount,
            status: 'UNPAID',
            tripay_reference: `MANUAL-${Date.now()}`,
          });
          setShowPaymentInstructions(true);
          toast({
            title: "Instruksi Pembayaran Manual",
            description: "Silakan lanjutkan dengan transfer manual BCA.",
          });
          return;
        } else {
          toast({
            title: "Error Membuat Pembayaran",
            description: data?.error || error?.message || "Gagal membuat pembayaran. Silakan coba lagi.",
            variant: "destructive",
          });
          return;
        }
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Pembayaran Berhasil Dibuat",
          description: "Silakan selesaikan pembayaran.",
        });
      }
    } catch (error: any) {
      console.error('Tripay payment error:', error);
      if (selectedPaymentMethod === 'BCA_MANUAL') {
        setPaymentData({
          paymentMethod: selectedPaymentMethod,
          amount: totalAmount,
          status: 'UNPAID',
          tripay_reference: `MANUAL-${Date.now()}`,
        });
        setShowPaymentInstructions(true);
        toast({
          title: "Instruksi Pembayaran Manual",
          description: "Silakan lanjutkan dengan transfer manual BCA.",
        });
      } else {
        toast({
          title: "Error Kritis",
          description: "Gagal memanggil fungsi pembayaran. Periksa konsol untuk detail.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const tableName = 'global_product';
    const channelName = `payment-status-audio-${paymentData.tripay_reference}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}`},
        (payload) => {
          if (payload.new?.status === 'PAID') {
            if (purchaseFiredRef.current) return;
            purchaseFiredRef.current = true;

            toast({
                title: "🎉 Pembayaran Berhasil!",
                description: "Terima kasih, pembayaran Anda telah kami terima. Link audio akan dikirim ke email Anda.",
                duration: 0, 
            });

            const eventId = paymentData.tripay_reference;
            const pixelId = '3319324491540889';
            const productNameBackend = 'audio_product';
            
            const userDataPixel: AdvancedMatchingData = {
              em: userEmail,
              ph: phoneNumber,
              fn: userName,
              external_id: user?.id
            };

            trackPurchaseEvent({
              content_ids: [productNameBackend],
              content_type: 'product',
              value: payload.new?.amount || totalAmount,
              currency: 'IDR'
            }, eventId, pixelId, userDataPixel, 'testcode_indo');
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
              Instruksi Pembayaran
            </h1>
          </div>
        </div>

        <div className="px-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Status</Label>
                <span className={`font-medium ${paymentData.status === 'UNPAID' ? 'text-orange-500' : 'text-green-500'}`}>
                  {paymentData.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Metode Pembayaran</Label>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Total Pembayaran</Label>
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
                <CardTitle>Transfer Manual BCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Nomor Rekening</Label>
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <span className="font-mono text-lg">7751146578</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('7751146578')}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Atas Nama</Label>
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
                      href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah transfer manual BCA untuk pesanan Audio ${getProductName()}.\n\nRef: ${paymentData?.tripay_reference}\nMohon konfirmasi. Terima kasih.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" size="lg">
                        <FaWhatsapp className="mr-2" /> Hubungi CS jika sudah bayar
                      </Button>
                    </a>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentData.payCode && (
            <Card>
              <CardHeader>
                <CardTitle>Nomor Virtual Account / Kode Pembayaran</CardTitle>
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
                <CreditCard className="w-4 h-4 mr-2" /> Lanjutkan Pembayaran
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
      <WhatsAppButton />
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold font-exo bg-gradient-primary bg-clip-text text-transparent">
                    Checkout Audio Series
                </h1>
            </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card className="mb-6 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Pilih Audio Series</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct} className="space-y-4">
              {audioProducts.map((product) => (
                <Label key={product.id} className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${selectedProduct === product.id ? 'border-amber-500 bg-gray-700' : 'border-gray-600 bg-gray-800'}`}>
                  <RadioGroupItem value={product.id} id={product.id} className="mt-1 mr-3 border-gray-400 text-amber-500" />
                  <div className="flex-1">
                    <div className="font-bold text-lg text-amber-400">{product.name}</div>
                    <div className="text-sm text-gray-300">{product.description}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>1. Rangkuman Pesanan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Produk</Label>
              <span className="font-medium">{getProductName()}</span>
            </div>
            <Separator/>
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Harga</Label>
              <span className="font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Informasi Pembeli</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName"><User className="inline-block w-4 h-4 mr-2"/>Nama Lengkap</Label>
              <Input id="userName" name="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="userEmail"><Mail className="inline-block w-4 h-4 mr-2"/>Email</Label>
              <Input id="userEmail" name="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div>
              <Label htmlFor="phoneNumber"><Phone className="inline-block w-4 h-4 mr-2"/>Nomor Telepon</Label>
              <Input id="phoneNumber" name="tel" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08123456789" required />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Metode Pembayaran</CardTitle></CardHeader>
            <CardContent>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                <Label key={method.code} htmlFor={method.code} className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-primary shadow-lg' : 'border-border'}`}>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <div className="flex-1">
                            <span className="font-medium">{method.name}</span>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                    </div>
                </Label>
                ))}
            </RadioGroup>
            </CardContent>
        </Card>

        <div className="fixed bottom-20 left-6 right-6">
          <Button onClick={handleCreatePayment} disabled={loading} className="w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black border-none shadow-xl" size="lg">
            {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {loading ? 'Memproses...' : `Bayar Sekarang (${formatCurrency(totalAmount)})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
