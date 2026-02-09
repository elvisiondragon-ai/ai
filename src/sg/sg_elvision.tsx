import { useState, useEffect, useRef } from 'react';
import { Globe, Check, X, ChevronDown, ArrowLeft, Copy, CheckCircle, ShieldCheck, Loader2, Star } from 'lucide-react';
import { FaPaypal, FaBitcoin } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { supabase } from '@/integrations/supabase/client';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent, 
  AdvancedMatchingData,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import { VideoFacade } from '@/components/ui/video-facade';
import { communityTestimonials, videoTestimonials, content } from './sg_elvision_data';

export default function ELVisionLanding() {
  const [language, setLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const { toast } = useToast();
  const hasFiredPixelsRef = useRef(false);
  const sentEventIdsRef = useRef(new Set<string>());
  const addPaymentInfoFiredRef = useRef(false);
  const purchaseFiredRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('SGD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PAYPAL');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  
  // Dynamic Product Information
  const [productNameBackend, setProductNameBackend] = useState('sg_elvision_en');
  const [displayProductName, setDisplayProductName] = useState('Ebook eL Vision (English Edition)');
  
  // Handle URL Parameters
  useEffect(() => {
    const search = window.location.search;
    if (search.includes('malay')) {
      setLanguage('ms');
      setCurrency('MYR');
      setProductNameBackend('sg_elvision_malay');
      setDisplayProductName('Ebook eL Vision (Malay Edition)');
    } else if (search.includes('en')) {
      setLanguage('en');
      setCurrency('SGD');
      setProductNameBackend('sg_elvision_en');
      setDisplayProductName('Ebook eL Vision (English Edition)');
    }
  }, []);

  const getPrice = () => {
    if (currency === 'SGD') return 47.00;
    if (currency === 'MYR') return 89.00;
    return 47.00;
  };

  const productPrice = getPrice();
  const pixelId = '3319324491540889';

  const paymentMethods = [
    { code: 'PAYPAL', name: 'PayPal', description: 'Pay with PayPal or Credit Card', icon: <FaPaypal className="text-[#003087]" /> },
    { code: 'QRIS', name: 'QRIS Screenshot', description: 'Scan QRIS via any Bank or E-wallet', icon: null },
    { code: 'BITCOIN', name: 'Bitcoin (BTC)', description: 'Pay with Bitcoin', icon: <FaBitcoin className="text-[#F7931A]" /> },
    { code: 'USDT', name: 'USDT (BEP20/ERC20)', description: 'Pay with USDT Stablecoin', icon: <SiTether className="text-[#26A17B]" /> },
  ];

  const formatCurrency = (amount: number) => {
      let displayAmount = amount;
      // If backend returns IDR converted amount, show the original currency amount for consistency
      if (currency === 'SGD' && amount > 1000) displayAmount = 47;
      if (currency === 'MYR' && amount > 1000) displayAmount = 89;

      const symbol = currency === 'SGD' ? '$' : 'RM';
      // Do not use .00 if it's a whole number
      const formattedAmount = displayAmount % 1 === 0 ? displayAmount.toString() : displayAmount.toFixed(2);
      return `${symbol} ${formattedAmount}`;
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast({
          title: "Berhasil Disalin",
          description: "Teks telah disalin ke clipboard",
      });
  };

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
    try {
      if (eventId && sentEventIdsRef.current.has(eventId)) return;
      if (eventId) sentEventIdsRef.current.add(eventId);

      await waitForFbp();

      const { data: { session } } = await supabase.auth.getSession();
      const body: any = {
        pixelId,
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        testCode: 'testcode_indo'
      };

      const { fbc, fbp } = getFbcFbpCookies();
      const userData: any = { client_user_agent: navigator.userAgent };

      let rawName = userName;
      if (userEmail) userData.email = userEmail;
      else if (session?.user?.email) userData.email = session.user.email;
      
      if (phoneNumber) userData.phone = phoneNumber;
      else if (session?.user?.user_metadata?.phone) userData.phone = session.user.user_metadata.phone;
      
      if (!rawName && session?.user?.user_metadata?.full_name) rawName = session.user.user_metadata.full_name;

      if (rawName) {
          const nameParts = rawName.trim().split(/\s+/);
          userData.fn = nameParts[0];
          if (nameParts.length > 1) userData.ln = nameParts.slice(1).join(' ');
      }

      if (session?.user?.id) userData.external_id = session.user.id;
      const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
      if (fbIdentity) userData.db_id = fbIdentity.id;

      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      
      body.userData = userData;

      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const initPixel = async () => {
      if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
        hasFiredPixelsRef.current = true;
        const { data: { session } } = await supabase.auth.getSession();
        const { fbc, fbp } = getFbcFbpCookies();
        const userData: AdvancedMatchingData = {};
        if (session?.user?.id) userData.external_id = session.user.id;
        const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
        if (fbIdentity) userData.db_id = fbIdentity.id;
        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;

        initFacebookPixelWithLogging(pixelId, userData);

        const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        trackPageViewEvent({}, pageEventId, pixelId, userData, 'testcode_indo');

        const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        trackViewContentEvent({
          content_name: displayProductName,
          content_ids: [productNameBackend],
          content_type: 'product',
          value: productPrice,
          currency: currency === 'SGD' ? 'SGD' : 'MYR'
        }, viewContentEventId, pixelId, userData, 'testcode_indo');
      }
    };
    initPixel();
  }, [productNameBackend, displayProductName, productPrice, currency]);

  const handleCreatePayment = async () => {
      if (isProcessingRef.current) return;
      if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
          toast({
              title: "Data Tidak Lengkap",
              description: "Mohon lengkapi nama, email, no. whatsapp, dan metode pembayaran.",
              variant: "destructive",
          });
          return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
          toast({
              title: "Email Tidak Valid",
              description: "Mohon masukkan alamat email yang benar.",
              variant: "destructive",
          });
          return;
      }

      isProcessingRef.current = true;
      setLoading(true);

      const manualMethods = ['QRIS', 'BITCOIN', 'USDT'];

      try {
           if (!addPaymentInfoFiredRef.current) {
              addPaymentInfoFiredRef.current = true;
              const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
              sendCapiEvent('AddPaymentInfo', {
                content_ids: [productNameBackend],
                content_type: 'product',
                value: productPrice,
                currency: currency
              }, addPaymentInfoEventId);
          }

          const { fbc, fbp } = getFbcFbpCookies();
          const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
              body: {
                subscriptionType: productNameBackend,
                paymentMethod: selectedPaymentMethod,
                userName: userName,
                userEmail: userEmail,
                phoneNumber: phoneNumber,
                amount: productPrice,
                currency: currency,
                quantity: 1,
                productName: displayProductName,
                userId: null,
                fbc,
                fbp
              }
          });

          if (error || !data?.success) {
              if (manualMethods.includes(selectedPaymentMethod)) {
                setPaymentData({
                  paymentMethod: selectedPaymentMethod,
                  amount: productPrice,
                  status: 'UNPAID',
                  tripay_reference: `MANUAL-${Date.now()}`,
                });
                setShowPaymentInstructions(true);
                return;
              } else {
                toast({
                  title: "Gagal Memproses",
                  description: data?.error || error?.message || "Terjadi kesalahan sistem.",
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
              toast({
                title: "Order Dibuat!",
                description: "Silakan selesaikan pembayaran Anda.",
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
      } catch (error: any) {
          toast({
            title: "Error",
            description: "Gagal menghubungi server pembayaran.",
            variant: "destructive",
          });
      } finally {
          setLoading(false);
          isProcessingRef.current = false;
      }
  };

  useEffect(() => {
      if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
      const channel = supabase
          .channel(`payment-status-sgel-${paymentData.tripay_reference}`)
          .on('postgres_changes', { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'global_product', 
              filter: `tripay_reference=eq.${paymentData.tripay_reference}`
            },
            (payload) => {
              if (payload.new?.status === 'PAID') {
                  if (purchaseFiredRef.current) return;
                  purchaseFiredRef.current = true;
                  toast({
                      title: "LUNAS! Akses Dikirim.",
                      description: "Pembayaran berhasil. Cek email Anda sekarang.",
                      duration: 5000, 
                  });
              }
            }
          )
          .subscribe();
      return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData]);

  const toggleLanguage = () => {
    if (language === 'en') {
      setLanguage('ms');
      setCurrency('MYR');
      setProductNameBackend('sg_elvision_malay');
      setDisplayProductName('Ebook eL Vision (Malay Edition)');
    } else {
      setLanguage('en');
      setCurrency('SGD');
      setProductNameBackend('sg_elvision_en');
      setDisplayProductName('Ebook eL Vision (English Edition)');
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const t = content[language];
  const dynamicCta = `${t.cta} (${currency === 'SGD' ? '$' : 'RM'} ${t.pricing.current})`;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <Toaster />
      {showPaymentInstructions && paymentData ? (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
          <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-slate-200">
            <div className="p-4 bg-amber-600 text-white flex items-center gap-2 sticky top-0 z-10">
              <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-amber-700">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
            </div>
  
            <div className="p-6 space-y-6">
              <div className="text-center">
                  <p className="text-slate-500">Total Tagihan</p>
                  <p className="text-3xl font-bold text-amber-600">{formatCurrency(paymentData.amount)}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                      Menunggu Pembayaran
                  </div>
              </div>
  
              <Card className="border-2 border-slate-100 bg-white">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                      <Label className="text-slate-500">Nomor Referensi</Label>
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="font-mono text-sm text-amber-600">{paymentData.tripay_reference}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600">
                              <Copy className="w-3 h-3" />
                          </Button>
                      </div>
                  </div>

                  {paymentData.qrUrl && (
                      <div className="flex flex-col items-center">
                          <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border border-slate-200 rounded-lg bg-white" />
                          <p className="text-sm text-slate-500 mt-2 text-center">Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                      </div>
                  )}
                  
                  {paymentData.payCode && (
                      <div className="space-y-2">
                          <Label className="text-slate-600">Kode Bayar / Virtual Account</Label>
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <span className="font-mono text-xl font-bold tracking-wider text-amber-600">{paymentData.payCode}</span>
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-amber-600">
                                  <Copy className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                  )}
  
                  <div className="bg-amber-50 p-3 rounded text-sm text-amber-800 border border-amber-100">
                      <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                 <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order SG Elvision ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                     Bantuan Admin
                 </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <>
      {/* Atmospheric background effects */}

      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      {/* Language Switcher Button */}
      <button
        onClick={toggleLanguage}
        className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 group hover:scale-105 shadow-xl ${
          isScrolled 
            ? 'bg-white text-black border-2 border-purple-500' 
            : 'bg-white text-black'
        }`}
      >
        <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-sm tracking-wide">{t.languageButton}</span>
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-6 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="text-sm tracking-[0.3em] text-purple-400 font-semibold uppercase">{t.hero.subtitle}</span>
          </div>
          
          <h1 className="text-[5rem] md:text-[8rem] font-bold tracking-tight mb-4 opacity-0 animate-fadeInUp leading-none text-white" 
              style={{ 
                animationDelay: '0.4s', 
                animationFillMode: 'forwards',
                fontFamily: '"Cormorant Garamond", serif',
                textShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)'
              }}>
            {t.hero.title}
          </h1>
          
          <p className="text-2xl md:text-3xl text-white font-normal tracking-wide opacity-0 animate-fadeInUp mb-8" 
             style={{ 
               animationDelay: '0.6s', 
               animationFillMode: 'forwards',
               fontFamily: '"Crimson Text", serif'
             }}>
            {t.hero.tagline}
          </p>

          <div className="opacity-0 animate-fadeInUp flex flex-col items-center" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md">
                  <div className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                      <span className="animate-pulse">●</span> {t.pricing.reason}
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-2">
                      <span className="text-2xl text-gray-400 line-through font-light">
                          {currency === 'SGD' ? '$' : 'RM'} {t.pricing.original}
                      </span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {t.pricing.discount}
                      </span>
                  </div>
                  <div className="text-5xl font-black text-white mb-4">
                      {currency === 'SGD' ? '$' : 'RM'} {t.pricing.current}
                  </div>
                  <button 
                    onClick={() => document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30"
                  >
                    {dynamicCta}
                  </button>
              </div>
          </div>
        </div>
      </section>

      {/* Section 1: FOMO Hook */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.section1.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {t.section1.items.map((item: any, i: number) => (
              <div 
                key={i}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:scale-105 shadow-xl"
                style={{
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <h3 className="text-2xl font-bold mb-4 text-purple-300 relative z-10" style={{ fontFamily: '"Crimson Text", serif' }}>
                  {item.title}
                </h3>
                <p className="text-gray-200 leading-relaxed relative z-10 text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Origin Story */}
      <section className="relative py-32 px-6 bg-gray-950/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.section2.title}
          </h2>

          <div className="prose prose-lg prose-invert max-w-none">
            {t.section2.body.split('\n\n').map((para: string, i: number) => (
              <p 
                key={i} 
                className="text-xl leading-relaxed mb-6 text-gray-100"
                style={{ 
                  fontFamily: '"Crimson Text", serif',
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Solution */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.section3.title}
          </h2>

          <div className="prose prose-lg prose-invert max-w-none">
            {t.section3.body.split('\n\n').map((para: string, i: number) => (
              <p 
                key={i} 
                className="text-xl leading-relaxed mb-6 text-gray-100"
                style={{ 
                  fontFamily: '"Crimson Text", serif',
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="relative py-32 px-6 bg-gray-950/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.section4.title}
          </h2>

          <p className="text-2xl text-center mb-12 text-white font-semibold" style={{ fontFamily: '"Crimson Text", serif' }}>
            {t.section4.body}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {t.section4.steps.map((step: any, i: number) => (
              <div 
                key={i}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 shadow-xl"
                style={{
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0
                }}
              >
                <div className="text-5xl font-bold mb-4 text-purple-400" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {step.label}
                </div>
                <p className="text-gray-200 text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <p className="text-2xl font-bold mb-4 text-purple-300" style={{ fontFamily: '"Crimson Text", serif' }}>
              {t.section4.noTime}
            </p>
            <p className="text-xl text-gray-200" style={{ fontFamily: '"Crimson Text", serif' }}>
              {t.section4.noTimeDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {t.section4.modes.map((mode: any, i: number) => (
              <div 
                key={i}
                className="p-6 rounded-xl bg-gray-900 border-2 border-purple-400/50 shadow-lg"
                style={{
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  animationDelay: `${0.8 + i * 0.2}s`,
                  opacity: 0
                }}
              >
                <h4 className="text-xl font-bold mb-3 text-purple-300" style={{ fontFamily: '"Crimson Text", serif' }}>
                  {mode.mode}
                </h4>
                <p className="text-gray-200 text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>
                  {mode.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-xl text-white font-bold" style={{ fontFamily: '"Crimson Text", serif' }}>
            {t.section4.conclusion}
          </p>
        </div>
      </section>

      {/* Section 5: The Transformation */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.section5.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scenario A */}
            <div className="p-10 rounded-2xl bg-gradient-to-br from-red-900 to-red-950 border-2 border-red-500 relative overflow-hidden group shadow-2xl shadow-red-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="mb-2">
                  <span className="text-sm uppercase tracking-widest text-red-300 font-bold">{t.section5.scenarioA.subtitle}</span>
                </div>
                <h3 className="text-3xl font-bold mb-8 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {t.section5.scenarioA.title}
                </h3>

                <ul className="space-y-4">
                  {t.section5.scenarioA.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scenario B */}
            <div className="p-10 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-emerald-500 relative overflow-hidden group shadow-2xl shadow-emerald-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="mb-2">
                  <span className="text-sm uppercase tracking-widest text-emerald-300 font-bold">{t.section5.scenarioB.subtitle}</span>
                </div>
                <h3 className="text-3xl font-bold mb-8 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {t.section5.scenarioB.title}
                </h3>

                <ul className="space-y-4">
                  {t.section5.scenarioB.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-6 bg-gray-950/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {t.faq.title}
          </h2>

          <div className="space-y-4">
            {t.faq.items.map((item: any, i: number) => (
              <div 
                key={i}
                className="bg-gray-900 border-2 border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-400 shadow-lg"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-xl font-bold text-white" style={{ fontFamily: '"Crimson Text", serif' }}>
                    {item.q}
                  </span>
                  <ChevronDown 
                    className={`w-6 h-6 text-purple-400 transition-transform duration-300 flex-shrink-0 ${
                      faqOpen[i] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    faqOpen[i] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line text-lg" style={{ fontFamily: '"Crimson Text", serif' }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-base uppercase tracking-[0.3em] text-purple-300 mb-2 font-bold">
              {language === 'en' ? 'Audio in' : 'Audio dalam'} {t.audioLang}
            </p>
            <p className="text-xl text-white font-semibold">
              {language === 'en' ? 'Payment in' : 'Pembayaran dalam'} {t.currency}
            </p>
          </div>

          <button 
            onClick={() => document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-16 py-6 text-2xl font-bold overflow-hidden rounded-full transition-all duration-300 hover:scale-110 shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/70"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 opacity-50">
              <div className="absolute inset-0 bg-white blur-xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </div>
            <span className="relative z-10 tracking-wide text-white drop-shadow-lg" style={{ fontFamily: '"Crimson Text", serif' }}>
              {dynamicCta}
            </span>
          </button>
        </div>
      </section>

      {/* Authority Section - 15 Years Research */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-10 md:p-16 rounded-[2.5rem] bg-white/5 border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 text-purple-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {t.authority.title}
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed italic" style={{ fontFamily: '"Crimson Text", serif' }}>
              "{t.authority.body}"
            </p>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-10"></div>
            
            <p className="text-lg md:text-xl text-purple-200 leading-relaxed font-medium" style={{ fontFamily: '"Crimson Text", serif' }}>
              {t.authority.list}
            </p>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Transformational Proof
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {videoTestimonials.map((testi, idx) => (
              <div key={idx} className="min-w-[300px] md:min-w-[350px] bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 snap-center border border-purple-500/30">
                <VideoFacade 
                  src={testi.videoUrl} 
                  poster={testi.poster} 
                  className="w-full rounded-xl aspect-[9/16] object-cover mb-4 border border-purple-500/20"
                />
                <div className="font-bold text-xl text-purple-300" style={{ fontFamily: '"Crimson Text", serif' }}>{testi.name}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{testi.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Testimonials - NEW */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.textTestimonials.map((testi: any, idx: number) => (
              <Card key={idx} className="bg-gray-900 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{testi.text}"</p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-2xl">
                      {testi.image}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testi.name}</div>
                      <div className="text-xs text-purple-400 uppercase tracking-widest font-semibold">{testi.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Breakdown Section - Above payment */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                      Premium Value Breakdown
                  </h2>
                  <p className="text-xl text-purple-300 italic">{t.pricing.anchoring}</p>
              </div>

              <div className="bg-gray-900/50 border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                  <div className="space-y-6 mb-12">
                      {t.pricing.valueStack.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                              <span className="text-xl text-white font-medium">{item.label}</span>
                              <span className="text-xl text-gray-400 font-bold">Value {currency === 'SGD' ? '$' : 'RM'} {item.value}</span>
                          </div>
                      ))}
                      <div className="flex justify-between items-center pt-4">
                          <span className="text-2xl font-bold text-white uppercase tracking-wider">Total Value</span>
                          <span className="text-2xl font-bold text-gray-400 line-through">{currency === 'SGD' ? '$' : 'RM'} {t.pricing.totalValue}</span>
                      </div>
                  </div>

                  <div className="text-center p-8 bg-purple-600/10 rounded-2xl border border-purple-500/50">
                      <div className="text-purple-300 uppercase tracking-widest font-bold mb-2">Special Price Today</div>
                      <div className="text-6xl font-black text-white mb-6 tracking-tighter">
                          {currency === 'SGD' ? '$' : 'RM'} {t.pricing.current}
                      </div>
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block font-bold text-sm animate-bounce">
                          {t.pricing.reason}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Payment Form Section */}
      <section id="payment-section" className="relative py-32 px-6 bg-gray-950/50">
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-900 border-2 border-purple-500/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Secure Your Transformation
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                  <div className="grid gap-4">
                      <div>
                          <Label htmlFor="name" className="text-purple-300 font-semibold mb-1 block">Full Name</Label>
                          <Input 
                              id="name" 
                              placeholder="John Doe" 
                              value={userName} 
                              onChange={(e) => setUserName(e.target.value)} 
                              className="bg-black text-white border-purple-500/30 focus:border-purple-500 h-12"
                          />
                      </div>
                      <div>
                          <Label htmlFor="email" className="text-purple-300 font-semibold mb-1 block">Email Address</Label>
                          <Input 
                              id="email" 
                              type="email" 
                              placeholder="john@example.com" 
                              value={userEmail} 
                              onChange={(e) => setUserEmail(e.target.value)} 
                              className="bg-black text-white border-purple-500/30 focus:border-purple-500 h-12"
                          />
                      </div>
                      <div>
                          <Label htmlFor="phone" className="text-purple-300 font-semibold mb-1 block">WhatsApp Number</Label>
                          <Input 
                              id="phone" 
                              type="tel" 
                              placeholder="65xxxxxx" 
                              value={phoneNumber} 
                              onChange={(e) => setPhoneNumber(e.target.value)} 
                              className="bg-black text-white border-purple-500/30 focus:border-purple-500 h-12"
                          />
                      </div>
                  </div>
              </div>

              <div className="space-y-4">
                  <h3 className="font-bold text-lg text-purple-300">Payment Method</h3>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                      {paymentMethods.map((method) => (
                          <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-purple-500 bg-purple-500/10 shadow-md ring-1 ring-purple-500' : 'border-gray-800 bg-black hover:border-purple-500/30'}`}>
                              <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-purple-400 text-purple-500" />
                              <div className="flex-1">
                                  <div className="font-bold text-white text-lg">{method.name}</div>
                                  <div className="text-sm text-gray-400">{method.description}</div>
                              </div>
                          </Label>
                      ))}
                  </RadioGroup>
              </div>

              <Button 
                  size="lg" 
                  className="w-full text-xl py-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white border-none mt-6"
                  onClick={handleCreatePayment}
                  disabled={loading}
              >
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : dynamicCta}
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-medium mt-4">
                  <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL
                  </div>
                  <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-purple-500" /> Instant Download
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Testimonials Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white" 
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Real Results, Real People
          </h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {communityTestimonials.map((img, idx) => (
                  <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500 transition-all duration-300 shadow-xl group">
                      <img 
                        src={img} 
                        alt={`Testimoni ${idx + 1}`} 
                        className="w-full h-auto object-cover transition-all duration-500" 
                        loading="lazy" 
                      />
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-purple-400 mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>eL Vision</div>
          <p className="text-gray-500 text-sm tracking-widest uppercase">© 2026 eL Vision Group. All Rights Reserved.</p>
        </div>
      </footer>
      </>
      )}

      {/* Add custom fonts and animations */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
