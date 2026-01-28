import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, User, CheckCircle, Star, ShieldCheck, BookOpen, Headphones, Heart, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { VideoFacade } from '@/components/ui/video-facade';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent, 
  trackAddPaymentInfoEvent, 
  trackPurchaseEvent,
  trackCustomEvent,
  AdvancedMatchingData,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 15, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 0, minutes: 15, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 text-center font-bold text-sm md:text-base animate-pulse">
            ✨ Penawaran Berakhir Dalam: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
    );
};

const WhatsAppButton = () => (
  <a
    href="https://wa.me/62895325633487"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-5 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
    aria-label="Contact via WhatsApp"
  >
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

export default function EbookFeminineLanding() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const productNameBackend = 'ebook_feminine';
  const displayProductName = 'Feminine Magnetism: Audio Hipnoterapi + Ebook';
  const originalPrice = 300000;
  const productPrice = 100000;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const purchaseFiredRef = React.useRef(false);
  const hasFiredPixelsRef = React.useRef(false);
  const addPaymentInfoFiredRef = React.useRef(false);
  const isProcessingRef = React.useRef(false);
  const sentEventIdsRef = React.useRef(new Set<string>());

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
    try {
      // 🛡️ DEDUPLICATION CHECK
      if (eventId && sentEventIdsRef.current.has(eventId)) {
        console.warn(`⚠️ Duplicate CAPI Event Blocked: ${eventName} (ID: ${eventId})`);
        return;
      }
      if (eventId) {
        sentEventIdsRef.current.add(eventId);
      }

      // ⏳ Wait for FBP to be generated by the browser pixel before sending CAPI
      await waitForFbp();

      const { data: { session } } = await supabase.auth.getSession();
      const body: any = {
        pixelId: '3319324491540889', // EbookIndo Pixel
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        testCode: 'TEST94618'
      };

      // Get FBC and FBP from cookies using the utility function
      const { fbc, fbp } = getFbcFbpCookies();

      const userData: any = {
        client_user_agent: navigator.userAgent,
      };

      // Prioritize form input email/phone/name, then authenticated user email/phone/name
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

      // 🧠 NAME SPLITTING LOGIC (For Surname/LN support)
      if (rawName) {
        const nameParts = rawName.trim().split(/\s+/);
        userData.fn = nameParts[0];
        if (nameParts.length > 1) {
          userData.ln = nameParts.slice(1).join(' ');
        }
      }

      // External ID from authenticated user (Supabase user ID)
      if (session?.user?.id) {
        userData.external_id = session.user.id;
      }

      // 🎯 FACEBOOK LOGIN ID EXTRACTION
      // If user logged in via Facebook, extract their real Facebook UID
      const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
      if (fbIdentity) {
        userData.db_id = fbIdentity.id; // Map to facebook_login_id in backend
      }

      if (fbc) {
        userData.fbc = fbc;
      }
      if (fbp) {
        userData.fbp = fbp;
      }
      
      body.userData = userData;

      console.log(`🚀 Sending CAPI Event: ${eventName}`, body); // DEBUG LOG

      const { data, error } = await supabase.functions.invoke('capi-universal', { body });
      
      if (error) {
          console.error(`❌ CAPI Error for ${eventName}:`, error);
      } else {
          console.log(`✅ CAPI Success for ${eventName}:`, data);
      }
    } catch (err) {
      console.error('Failed to send CAPI event (Critical):', err);
    }
  };

  // Pixel Tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
      hasFiredPixelsRef.current = true;
      const pixelId = '3319324491540889';
      
      initFacebookPixelWithLogging(pixelId);
      
      // 1. PageView - Shared ID for Deduplication
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);
      sendCapiEvent('PageView', {}, pageEventId);

      // 2. ViewContent - Shared ID for Deduplication
      const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackViewContentEvent({
        content_name: displayProductName,
        content_ids: [productNameBackend],
        content_type: 'product',
        value: productPrice,
        currency: 'IDR'
      }, viewContentEventId, pixelId);
      
      sendCapiEvent('ViewContent', {
        content_name: displayProductName,
        content_ids: [productNameBackend],
        content_type: 'product',
        value: productPrice,
        currency: 'IDR'
      }, viewContentEventId);
    }
  }, []);

  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Scan pakai GoPay, OVO, Dana, ShopeePay, BCA Mobile, dll' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer otomatis via BCA' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer otomatis via BNI' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer otomatis via BRI' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer otomatis via Mandiri' },
    { code: 'PERMATAVA', name: 'Permata Virtual Account', description: 'Transfer otomatis via Permata' },
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

  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast({
        title: "Email Tidak Valid",
        description: "Mohon masukkan alamat email yang benar (contoh: nama@email.com).",
        variant: "destructive",
      });
      return;
    }

    isProcessingRef.current = true;
    setLoading(true);
    try {
      const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const pixelId = '3319324491540889';
      const userData: AdvancedMatchingData = {
        em: userEmail,
        ph: phoneNumber,
        fn: userName,
        external_id: user?.id
      };

      // Track AddPaymentInfo (Only once)
      if (!addPaymentInfoFiredRef.current) {
        addPaymentInfoFiredRef.current = true;
        trackAddPaymentInfoEvent({
          content_ids: [productNameBackend],
          content_type: 'product',
          value: totalAmount,
          currency: 'IDR'
        }, addPaymentInfoEventId, pixelId, userData);
        
        sendCapiEvent('AddPaymentInfo', {
          content_ids: [productNameBackend],
          content_type: 'product',
          value: totalAmount,
          currency: 'IDR'
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
          amount: totalAmount,
          quantity: totalQuantity,
          productName: displayProductName,
          userId: null, // No auth required
          fbc,
          fbp
        }
      });

      if (error || !data?.success) {
        // Extract specific error message from nested details if available
        let errorMessage = data?.error || error?.message || "Terjadi kesalahan sistem.";
        
        if (data?.details?.message) {
             errorMessage = data.details.message;
             // Translate common Tripay errors
             if (errorMessage.includes("Invalid customer email")) {
                 errorMessage = "Format email tidak valid. Mohon periksa kembali penulisan email Anda.";
             } else if (errorMessage.includes("Invalid customer phone")) {
                 errorMessage = "Format nomor HP tidak valid. Gunakan awalan 08...";
             }
        }

        toast({
          title: "Gagal Memproses",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        setPaymentData(data);
        setShowPaymentInstructions(true);
        toast({
          title: "Order Dibuat!",
          description: "Silakan selesaikan pembayaran Anda.",
        });
        // Scroll to top to see instructions
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
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

  // Realtime Payment Listener
  useEffect(() => {
    if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
    
    const channel = supabase
      .channel(`payment-${paymentData.tripay_reference}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'global_product', 
        filter: `tripay_reference=eq.${paymentData.tripay_reference}`
      }, (payload) => {
        if (payload.new?.status === 'PAID') {
          if (purchaseFiredRef.current) return;
          purchaseFiredRef.current = true;

          toast({
              title: "LUNAS! Akses Dikirim.",
              description: "Pembayaran berhasil. Cek email Anda sekarang untuk akses Audio & Ebook.",
              duration: 5000, 
              variant: "default"
          });
          
          // Use exact tripay_reference to match Backend CAPI event_id for deduplication
          const eventId = paymentData.tripay_reference;

          // Prepare User Data for Advanced Matching
          const pixelId = '3319324491540889';
          const userData: AdvancedMatchingData = {
            em: userEmail,
            ph: phoneNumber,
            fn: userName,
            external_id: user?.id
          };
          
          // TEST MODE CHECK
          const isTestUser = userEmail === 'elvisiondragon@gmail.com';
          const finalEventName = isTestUser ? 'Test_Purchase' : 'Purchase';

          if (isTestUser) {
              console.log('🧪 TEST MODE DETECTED: Firing Test_Purchase instead of Purchase');
              // Track Custom Event for Test
              trackCustomEvent(finalEventName, {
                content_ids: [productNameBackend],
                content_type: 'product',
                value: totalAmount,
                currency: 'IDR'
              }, eventId, pixelId, userData);
          } else {
              // Track Standard Purchase
              trackPurchaseEvent({
                content_ids: [productNameBackend],
                content_type: 'product',
                value: totalAmount,
                currency: 'IDR'
              }, eventId, pixelId, userData);
          }
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData]);

  // --- RENDER PAYMENT INSTRUCTIONS ---
  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-pink-50 pb-20 font-sans">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
          <div className="p-4 bg-rose-600 text-white flex items-center gap-2 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-rose-700">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-500">Total Tagihan</p>
                <p className="text-3xl font-bold text-rose-600">{formatCurrency(paymentData.amount)}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                    Menunggu Pembayaran
                </div>
            </div>

            <Card className="border-2 border-rose-100">
              <CardContent className="pt-6 space-y-4">
                {paymentData.qrUrl && (
                    <div className="flex flex-col items-center">
                        <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border rounded-lg" />
                        <p className="text-sm text-gray-500 mt-2 text-center">Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                    </div>
                )}
                
                {paymentData.payCode && (
                    <div className="space-y-2">
                        <Label>Kode Bayar / Virtual Account</Label>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <span className="font-mono text-xl font-bold tracking-wider text-rose-700">{paymentData.payCode}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                    <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
               <Button variant="outline" className="w-full gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Feminine Magnetism ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                   Bantuan Admin
               </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE CONTENT ---
  return (
    <div className="min-h-screen bg-rose-50/30 font-sans text-slate-800">
      <WhatsAppButton />
      <Toaster />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2c1a32] to-[#4a2c40] text-white pt-20 pb-28 px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
                <pattern id="sparkles" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#sparkles)" />
            </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full text-sm font-bold tracking-wider mb-6 backdrop-blur-sm">
            UNTUK WANITA YANG LELAH MENGEJAR
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Aktifkan <span className="text-pink-400">Feminine Magnetism</span> & Buat Dia Tergila-gila Tanpa Usaha
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Berhenti menjadi 'pemburu'. Mulailah menjadi 'hadiah'. Rahasia psikologi pria & aktivasi energi feminin yang membuat Anda dikejar, dihargai, dan diratukan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-1" onClick={scrollToCheckout}>
              SAYA SIAP JADI MAGNET
            </Button>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-sm text-gray-400">Garansi Uang Kembali 100%</p>
              <div className="flex text-pink-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <Card className="border-4 border-rose-50 bg-white mb-12 shadow-none overflow-hidden rounded-[2rem]">
          <CardContent className="p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1a32] font-serif leading-tight">
                Sudah Mencoba 1000 Cara, Tapi Hati Masih Sering Patah?
            </h2>
          </CardContent>
        </Card>
        
        <div className="space-y-8 mb-16">
             <div className="bg-red-50 p-8 rounded-2xl border-l-8 border-red-500 shadow-md">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                   <span className="text-3xl">🛑</span> Masalahnya BUKAN Kamu Kurang Cantik.
                </h3>
                <p className="text-red-900 text-lg leading-relaxed">
                   Kamu bisa diet mati-matian, beli skincare mahal, dan belajar teknik dating tercanggih. 
                   Tapi jika <strong>ALAM BAWAH SADAR (Subconscious)</strong> kamu masih menyimpan program "Saya Tidak Layak Dicintai" atau "Semua Pria Akan Menyakiti Saya", maka kamu akan TERUS menarik pria yang salah.
                </p>
                <p className="mt-4 text-red-900 font-semibold italic">
                   Ini seperti menginjak pedal gas (keinginan sadar) sambil menarik rem tangan (ketakutan bawah sadar). Mobil tidak akan jalan, mesin justru rusak.
                </p>
             </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Lelah Menjadi 'Ibu' Bagi Pasangan", desc: "Kamu lelah harus selalu mengatur, mengingatkan, dan memimpin hubungan. Bukannya jadi ratu, kamu malah jadi 'ibu asuh' bagi pria dewasa yang tidak mandiri." },
                { title: "Trauma Diselingkuhi Berulang", desc: "Kenapa polanya selalu sama? Ganti orang, tapi rasa sakitnya sama. Kamu mulai percaya 'semua pria brengsek', padahal subconscious-mu yang menarik tipe ini." },
                { title: "Berusaha Keras Tapi Tidak Dihargai", desc: "Semakin kamu berkorban, semakin dia menjauh. Kamu memberi 100%, dia memberi 10%. Kamu merasa kosong, lelah, dan tidak diinginkan." }
            ].map((item, i) => (
                <Card key={i} className="border-none shadow-lg bg-white hover:shadow-xl transition-all transform hover:-translate-y-2 duration-300">
                    <CardHeader>
                        <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4 shadow-sm">
                            <Heart className="w-7 h-7" />
                        </div>
                        <CardTitle className="text-xl text-slate-900 font-serif font-bold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 leading-relaxed text-base">{item.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* SCIENCE SECTION - THE SUBCONSCIOUS SECRET */}
      <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         
         <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-serif bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
               Kenapa Usaha Sadar Kamu GAGAL?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
               Pikiran sadar (logika) hanya mengendalikan 5% hidupmu. Sisanya, <strong>95% dikendalikan oleh Bawah Sadar</strong>.
               Itulah kenapa afirmasi positif di depan cermin sering gagal. Kamu mencoba melawan gajah (bawah sadar) dengan semut (pikiran sadar).
            </p>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
               <h3 className="text-2xl font-bold text-pink-300 mb-6 flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6" /> Solusi Plug & Play eL Vision
               </h3>
               <p className="text-lg mb-6">
                  Kami telah meriset metode ini selama <strong>16 Tahun</strong> dan terbukti sukses membantu ribuan wanita selama <strong>7 Tahun terakhir</strong>.
               </p>
               <p className="text-gray-200 mb-8">
                  Teknologi Audio Hipnoterapi kami dirancang untuk <strong>BYPASS (menembus) filter kritis pikiran sadar</strong> dan langsung meng-install program baru ke dalam "mesin" bawah sadar kamu saat kamu tidur atau rileks.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start gap-3">
                     <CheckCircle className="text-green-400 w-6 h-6 mt-1 flex-shrink-0" />
                     <p>Tidak perlu "berusaha" keras. Cukup dengarkan.</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <CheckCircle className="text-green-400 w-6 h-6 mt-1 flex-shrink-0" />
                     <p>Mengubah self-image dari "Pengemis Cinta" menjadi "Dewi Cinta".</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <CheckCircle className="text-green-400 w-6 h-6 mt-1 flex-shrink-0" />
                     <p>Otomatis memancarkan aura High Value tanpa dibuat-buat.</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <CheckCircle className="text-green-400 w-6 h-6 mt-1 flex-shrink-0" />
                     <p>Hasil permanen karena akarnya yang diperbaiki.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-white py-20 px-6 border-y border-rose-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
                    <div className="relative bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-8 shadow-xl text-center">
                        <Sparkles className="w-20 h-20 text-pink-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2 text-[#2c1a32] font-serif">High Value Woman</h3>
                        <p className="text-gray-500">The Art of Receiving</p>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c1a32] font-serif">
                    Kembalikan Mahkotamu dengan <span className="text-pink-600">Feminine Magnetism</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Program audio hipnoterapi & panduan eksklusif untuk mengakses kembali energi feminin murnimu. Biarkan alam bawah sadarmu memancarkan sinyal "High Value" yang membuat pria ingin melindungi, memberi, dan berkomitmen.
                </p>
                <ul className="space-y-4">
                    {[
                        "Menghapus trauma 'tidak layak dicintai'",
                        "Mengaktifkan aura 'The Prize' (Hadiah) bukan 'Chaser'",
                        "Membuat pria merasa maskulin & berguna di dekatmu",
                        "Menarik komitmen tanpa perlu memohon atau menuntut"
                    ].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="text-pink-500 w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-slate-700">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <Card className="border-4 border-rose-50 bg-white mb-16 shadow-none overflow-hidden rounded-[2rem]">
          <CardContent className="p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1a32] font-serif leading-tight">Apa Yang Kamu Dapatkan?</h2>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                    <Headphones className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">1. Audio "Goddess Awakening" (Sleep Hypnosis)</h3>
                    <p className="text-slate-600">Audio 20 menit dengan gelombang Theta untuk didengarkan sebelum tidur. Menghapus <em>inner block</em>, meningkatkan <em>self-worth</em>, dan memancarkan aura dewi yang tenang.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-rose-100 p-3 rounded-lg text-rose-600">
                    <Sparkles className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">2. Audio "Morning Radiance" Booster</h3>
                    <p className="text-slate-600">Audio 5 menit untuk pagi hari. Membangkitkan mood ceria, playful, dan magnetis. Pria sangat tertarik pada wanita yang bahagia dengan dirinya sendiri.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-colors">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">3. Ebook "The Siren's Secret"</h3>
                    <p className="text-slate-600">Buku panduan psikologi pria. Pelajari cara berkomunikasi yang membuat pria mendengarkan, cara menetapkan batasan (boundaries) yang seksi, dan seni menerima.</p>
                </div>
            </div>
        </div>
      </section>

      {/* AFTER PURCHASE STEPS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <Card className="border-4 border-rose-50 bg-white mb-16 shadow-none overflow-hidden rounded-[2rem]">
          <CardContent className="p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1a32] font-serif mb-6 leading-tight">6 Langkah Transformasi Kamu</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">Inilah yang akan terjadi tepat setelah kamu mendapatkan akses:</p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Baca Ebook Siren's Secret",
              desc: "Kamu akhirnya akan paham kenapa selama ini selalu menarik pria yang salah. Kamu akan mengerti 'Frekuensi Penolakan' dan cara mematikannya seketika."
            },
            {
              step: "02",
              title: "Tentukan Praktik Harian",
              desc: "Ikuti peta jalan yang sederhana. Kamu akan tahu persis tindakan kecil apa yang harus dilakukan setiap hari untuk tetap berada dalam energi feminin tanpa usaha keras."
            },
            {
              step: "03",
              title: "Protokol 15 Menit",
              desc: "Dengarkan audio Pagi dan Malam (masing-masing 15 menit). Inilah bagian 'Kerja Beratnya'—biarkan alam bawah sadar kamu yang bekerja sementara kamu bersantai."
            },
            {
              step: "04",
              title: "Perubahan 7 Hari Pertama",
              desc: "Setelah hanya satu minggu konsisten, alam bawah sadar kamu mulai menerima realita baru. Kamu akan bangun dengan perasaan 'luar biasa' tanpa alasan logika yang jelas."
            },
            {
              step: "05",
              title: "Detoks Emosional",
              desc: "Tarikan negatif masa lalu akan hilang. Kecemasan, overthinking, dan keinginan untuk 'mengejar' akan lenyap begitu saja. Kamu merasa tenang, terpusat, dan berharga."
            },
            {
              step: "06",
              title: "Manifestasi Magnetis",
              desc: "Tiba-tiba, 'dia' akan muncul. Apakah itu pria berkualitas baru atau perubahan total pada pasanganmu saat ini—semakin dekat frekuensi kamu, semakin cepat mereka datang."
            }
          ].map((item, i) => (
            <Card key={i} className="border-2 border-rose-50 bg-white hover:border-rose-200 transition-all shadow-none relative pt-8">
              <div className="absolute -top-4 left-8 bg-rose-500 text-white font-black px-4 py-1 rounded-full text-sm">
                LANGKAH {item.step}
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 font-serif font-bold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* WHY BUY NOW - LOGIC SECTION */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20 px-6">
         <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-8 text-amber-900 font-serif">
                Pertanyaan Sederhana untuk Masa Depan Cintamu
             </h2>

             {/* Direct Video Player */}
             <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                <div className="w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-black flex items-center justify-center">
                    <VideoFacade 
                      src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/ebook_indo/ugc1_id.mp4" 
                      poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/ebook_indo/ugc1_id.jpg" 
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-black flex items-center justify-center">
                    <VideoFacade 
                      src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/ebook_indo/ugc2_id.mp4" 
                      poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/ebook_indo/ugc2_id.jpg" 
                      className="w-full h-full object-cover"
                    />
                </div>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200">
                <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                   Apakah hati, mental health, dan masa depan percintaanmu <strong>lebih murah daripada harga makan siang ?</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
                   <div className="space-y-4">
                      <h4 className="font-bold text-red-600 text-lg border-b pb-2">JIKA TIDAK BERTINDAK:</h4>
                      <ul className="space-y-2 text-slate-600">
                         <li className="flex gap-2">❌ Membuang waktu bertahun-tahun mencari akar masalah sendiri.</li>
                         <li className="flex gap-2">❌ Mental hancur karena terus disakiti pria yang salah.</li>
                         <li className="flex gap-2">❌ Stress, insecure, dan merasa tidak berharga seumur hidup.</li>
                      </ul>
                   </div>
                   <div className="space-y-4">
                      <h4 className="font-bold text-green-600 text-lg border-b pb-2">INVESTASI 100 RIBU HARI INI:</h4>
                      <ul className="space-y-2 text-slate-600">
                         <li className="flex gap-2">✅ <strong>Plug & Play Technology:</strong> Tinggal dengar, subconscious berubah.</li>
                         <li className="flex gap-2">✅ Hemat biaya konseling jutaan rupiah.</li>
                         <li className="flex gap-2">✅ Jalan pintas pengalaman riset 16 tahun kami.</li>
                         <li className="flex gap-2">✅ Garansi Uang Kembali jika tidak ada perubahan.</li>
                      </ul>
                   </div>
                </div>
                <Button size="lg" className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl px-12 py-6 rounded-full shadow-lg animate-pulse" onClick={scrollToCheckout}>
                   AMBIL JALAN PINTAS SEKARANG
                </Button>
             </div>
         </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2c1a32] font-serif">Kisah Nyata Dari Mereka Yang "Bangun"</h2>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Ini bukan sekadar testimoni "produk bagus". Ini adalah cerita hidup yang berubah arah.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah M., 29th", role: "Manager & Single",
                        title: "Dulu Aku 'Doormat', Sekarang Ratu.",
                        text: "Aku selalu jadi pihak yang 'ngemis' perhatian. Chat gak dibales, aku bombardir. Dia selingkuh, aku maafin. Aku pikir itu cinta, ternyata itu trauma. Setelah 7 hari denger audio Goddess Awakening, tiba-tiba aku ngerasa... jijik sama kelakuanku dulu. Aku putusin pacarku yang toxic. Seminggu kemudian, aku ketemu pria yang memperlakukan aku seperti putri raja tanpa aku minta. Gila, cuma karena subconscious aku berubah, realitaku berubah 180 derajat.",
                        avatar: "S"
                    },
                    {
                        name: "Amanda, 34th", role: "Ibu Rumah Tangga",
                        title: "Suami Kembali Pulang.",
                        text: "Pernikahanku di ujung tanduk. Suami dingin, sering lembur. Aku capek marah-marah dan nagih waktu. Iseng beli ebook + audio ini karena putus asa. Aku berhenti ngomel, fokus dengerin audio dan praktek 'The Art of Receiving'. Ajaibnya, suami mulai notice. 'Kamu kok beda ya, lebih adem liatnya'. Sekarang dia yang ngejar-ngejar aku buat date night. Makasih eL Vision, 100rb ini nyelametin rumah tanggaku.",
                        avatar: "A"
                    },
                    {
                        name: "Jessica, 26th", role: "Mahasiswi S2",
                        title: "Bukan Sulap, Ini Sains.",
                        text: "Awalnya skeptis. Masa dengerin audio bisa bikin enteng jodoh? Tapi karena eL Vision bilang ini riset 16 tahun, aku coba. Bener dong, mindset 'Saya Butuh Pria' hilang, ganti jadi 'Pria Beruntung Dapetin Saya'. Energinya beda banget! Temen-temen cowokku bilang auraku beda, lebih 'mahal' dan bikin penasaran. Sekarang aku yang milih, bukan dipilih.",
                        avatar: "J"
                    },
                    {
                        name: "Dinda K., 31th", role: "Entrepreneur",
                        title: "Terlalu Independen Jadi Lembut.",
                        text: "Sebagai CEO, aku terbiasa kontrol segalanya. Tapi di asmara, itu malah bikin cowok mundur. Audio ini bantu aku untuk 'lean back' dan rileks. Hasilnya? Pacarku sekarang jadi jauh lebih inisiatif dan protektif. Aku tetap hebat di kantor, tapi jadi 'ratu' di rumah.",
                        avatar: "D"
                    },
                    {
                        name: "Bella R., 25th", role: "Content Creator",
                        title: "Bypass Trauma Masa Kecil.",
                        text: "Aku baru sadar kenapa selalu dapet fuckboy. Ternyata subconscious-ku 'nyari' luka yang familiar. Audio Theta Wave ini bener-bener nge-delete pola itu. Sekarang aku lagi deket sama cowok yang stabil dan mature. Gak ada lagi drama nangis tengah malem.",
                        avatar: "B"
                    },
                    {
                        name: "Emily, 32th", role: "Designer",
                        title: "Investasi Terbaik Tahun Ini.",
                        text: "Udah habis jutaan buat coaching dan terapi. Tapi ebook 100rb + audio ini malah yang paling ngefek. Karena dia langsung ke akar (bawah sadar). Aku bangun tidur ngerasa beda aja, lebih tenang dan magnetis. Rekomendasi banget!",
                        avatar: "E"
                    }
                ].map((testi, i) => (
                    <Card key={i} className="bg-white border border-rose-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-400 to-rose-600"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
                                {testi.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{testi.name}</h4>
                                <p className="text-xs text-rose-600 font-medium uppercase tracking-wide">{testi.role}</p>
                            </div>
                        </div>
                        <h5 className="font-bold text-slate-800 mb-3 text-lg border-b border-rose-50 pb-2">"{testi.title}"</h5>
                        <p className="text-slate-600 text-sm leading-relaxed">"{testi.text}"</p>
                        <div className="mt-4 flex text-yellow-400 gap-1">
                            {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#2c1a32] font-serif">Pertanyaan Yang Sering Diajukan</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Berapa lama sampai terlihat hasilnya?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sebagian besar pengguna merasakan shift mental (lebih tenang & percaya diri) dalam 5-10 hari pertama. Perubahan dinamika hubungan biasanya terlihat setelah 21 hari rutin mendengarkan.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apakah ini aman secara agama/medis?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sangat aman. Ini adalah teknik relaksasi mendalam (hipnoterapi) untuk menanamkan mindset positif. Tidak ada unsur mistis. Hanya psikologi dan neuroscience.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apakah ini akan membuat saya jadi 'jahat'?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        TIDAK. Menjadi "High Value" bukan berarti sombong atau jual mahal. Itu berarti kamu menghargai dirimu sendiri, sehingga orang lain pun otomatis menghargaimu. Kamu tetap menjadi dirimu yang baik, tapi dengan standar yang lebih sehat.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Bagaimana jika saya sedang jomblo?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Justru ini saat terbaik! Kamu bisa membersihkan 'program lama' di subconscious-mu SEBELUM menarik pria baru. Dengan begitu, kamu akan langsung menarik pria berkualitas tinggi, bukan mengulangi pola toxic yang lama.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apa bedanya dengan program motivasi lain?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Program lain biasanya fokus pada pikiran sadar (tips, trik, strategi). Pikiran sadar hanya mengontrol 5% hidupmu. Program kami langsung menyasar SUBCONSCIOUS (95% kontrol) menggunakan gelombang Theta. Itulah kenapa perubahannya terasa otomatis dan permanen.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Kapan waktu terbaik mendengarkan audio?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Audio 'Goddess Awakening' paling efektif didengarkan tepat sebelum tidur saat otak masuk ke kondisi rileks total. Audio 'Morning Radiance' didengarkan saat bangun tidur untuk menyetel frekuensi positifmu sepanjang hari.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-pink-200 shadow-2xl overflow-hidden rounded-2xl bg-white text-slate-900">
                <CountdownTimer />
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2 font-serif">FORMULIR PEMESANAN</h2>
                    <p className="opacity-90 text-lg">Investasi untuk kebahagiaan & cinta sejatimu</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10 bg-white">
                    {/* PRICING BOX */}
                    <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-slate-500 text-sm mb-1">Harga Normal</p>
                        <p className="text-xl text-slate-400 line-through decoration-rose-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-pink-900 font-bold mb-1">Harga Promo Spesial:</p>
                        <p className="text-4xl font-extrabold text-pink-600">{formatCurrency(productPrice)}</p>
                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-green-700 font-medium">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Hemat 67% • Akses Selamanya
                            </div>
                            <div className="flex items-center gap-1 text-blue-700">
                                <ShieldCheck className="w-4 h-4" /> Garansi Uang Kembali 100%
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* FORM INPUTS */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <User className="w-5 h-5 text-pink-600" /> Data Diri
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    autoComplete="name"
                                    placeholder="Contoh: Sarah Wijaya" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-slate-700 font-semibold mb-1 block">Alamat Email (PENTING)</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        autoComplete="email"
                                        placeholder="Untuk kirim akses produk" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-slate-700 font-semibold mb-1 block">Nomor WhatsApp</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        autoComplete="tel"
                                        placeholder="0812xxxx" 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* PAYMENT METHOD */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <CreditCard className="w-5 h-5 text-pink-600" /> Metode Pembayaran
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <Label key={method.code} className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-pink-600 bg-pink-50 shadow-md ring-1 ring-pink-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                    <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-pink-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 text-lg">{method.name}</div>
                                        <div className="text-sm text-slate-600">{method.description}</div>
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>

                </CardContent>

                <CardFooter className="p-8 bg-slate-50 flex flex-col gap-4 border-t border-slate-200">
                    <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-green-600 hover:bg-green-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white"
                        onClick={handleCreatePayment}
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : `BAYAR SEKARANG - ${formatCurrency(totalAmount)}`}
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" /> Secure Payment
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-blue-600" /> Instant Access
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2c1a32] text-white py-12 text-center text-sm">
        <p className="mb-4">© 2026 eL Vision Ecosystem. All Rights Reserved.</p>
        <p className="text-gray-500">
            Disclaimer: Program ini adalah alat bantu psikologis untuk pengembangan diri.<br/>Hasil dapat bervariasi untuk setiap individu.
        </p>
      </footer>
    </div>
  );
}
