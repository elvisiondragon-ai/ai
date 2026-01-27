import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Copy, CreditCard, User, CheckCircle, Star, ShieldCheck, PlayCircle, BookOpen, Headphones, Award } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 15, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 0, minutes: 15, seconds: 0 }; // Reset loop
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-red-600 text-white p-3 text-center font-bold text-sm md:text-base animate-pulse">
            🔥 Penawaran Berakhir Dalam: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
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
    <FaWhatsapp size={28} />
  </a>
);

export default function EbookPercayaDiriLP() {
  const [searchParams] = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  // Payment State
  const productNameBackend = 'ebook_percayadiri';
  const displayProductName = 'Paket Pria Alpha: Audio Hipnoterapi + Ebook';
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
  const purchaseFiredRef = useRef(false);

  // Pixel Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pixelId = '3319324491540889';
      
      initFacebookPixelWithLogging(pixelId);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);
      sendCapiEvent('PageView', {}, pageEventId);

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

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {
    try {
      // ⏳ Wait for FBP to be generated by browser pixel
      await waitForFbp();

      const { data: { session } } = await supabase.auth.getSession();
      const body: any = {
        pixelId: '3319324491540889',
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
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
      } else if (user?.id) {
        userData.external_id = user.id;
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

      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama, email, no. whatsapp, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    let currentUserId = user?.id;

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

      // Track AddPaymentInfo
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
          userId: currentUserId,
          affiliateRef: affiliateRef,
          fbc,
          fbp
        }
      });

      if (error || !data?.success) {
        toast({
          title: "Gagal Memproses",
          description: data?.error || error?.message || "Terjadi kesalahan sistem.",
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
          
          // Track Purchase with Advanced Matching and Deduplication
          trackPurchaseEvent({
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'IDR'
          }, eventId, pixelId, userData);

          // FIRST-WIN DEDUPLICATION CHECK
          const isBackendCapiSent = payload.new?.capi_purchase_sent === true;

          if (isBackendCapiSent) {
             console.log(`⏭️ CAPI Purchase Skipped (Backend already sent)`);
          } else {
             // Send CAPI (Frontend wins)
             sendCapiEvent('Purchase', {
               content_ids: [productNameBackend],
               content_type: 'product',
               value: totalAmount,
               currency: 'IDR'
             }, eventId);
          }
          
          // Optional: redirect to a thank you page or just show success state
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData]);

  // --- RENDER PAYMENT INSTRUCTIONS (Overlay/Page) ---
  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
          <div className="p-4 bg-primary text-white flex items-center gap-2 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-primary/80">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-500">Total Tagihan</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(paymentData.amount)}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    Menunggu Pembayaran
                </div>
            </div>

            <Card className="border-2 border-primary/20">
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
                        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border">
                            <span className="font-mono text-xl font-bold tracking-wider">{paymentData.payCode}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                    <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda dalam 1-2 menit.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
               <p className="text-sm text-gray-500 mb-4">Sudah bayar tapi status belum berubah?</p>
               <Button variant="outline" className="w-full gap-2" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                   <FaWhatsapp /> Hubungi Bantuan Admin
               </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE CONTENT ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <WhatsAppButton />
      <Toaster />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#1a2a3a] to-[#2c3e50] text-white pt-20 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            {/* Abstract Pattern */}
            <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 bg-yellow-500/20 border border-yellow-400 text-yellow-400 rounded-full text-sm font-bold tracking-wider mb-6">
            UNTUK PRIA YANG INGIN LEBIH
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Rahasia <span className="text-yellow-400">Kepercayaan Diri</span> yang Menarik Wanita Secara Instan
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Bukan sekadar teori. Ini adalah pemrograman ulang pikiran bawah sadar untuk mengubah Anda menjadi Pria Alpha dalam 21 hari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-[#1a2a3a] font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all transform hover:-translate-y-1" onClick={scrollToCheckout}>
              DAPATKAN AKSES SEKARANG
            </Button>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-sm text-gray-400">Garansi Uang Kembali 100%</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-16 px-6 bg-white border-y">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="flex-shrink-0">
                <ShieldCheck className="w-32 h-32 text-green-600" />
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Garansi Uang Kembali 100% Tanpa Tanya!</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    Kami sangat yakin dengan metode ini. Jika tidak ada perubahan dalam diri Anda setelah mengikuti proses selama 1 bulan rutin mendengar audio, hubungi kami dan kami akan kembalikan uang Anda sepenuhnya. Kami yang menanggung risikonya, Anda yang mendapatkan hasilnya.
                </p>
            </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1a2a3a]">
            Apakah Anda Sering Merasakan Ini?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Grogi di Depan Wanita", desc: "Lidah terasa kaku, jantung berdebar, dan bingung mau ngomong apa saat melihat wanita cantik." },
                { title: "Merasa Tidak Layak", desc: "Sering membandingkan diri dengan pria lain yang lebih kaya atau tampan, lalu merasa minder." },
                { title: "Selalu Jadi 'Nice Guy'", desc: "Selalu berakhir di friendzone karena terlalu baik dan takut menunjukkan ketertarikan seksual." }
            ].map((item, i) => (
                <Card key={i} className="border-none shadow-lg bg-white">
                    <CardHeader>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl text-slate-900">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-700">{item.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-12 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-lg font-medium text-red-800">
                Masalahnya BUKAN pada wajah atau dompet Anda. Masalahnya ada pada <span className="font-bold underline">Program Pikiran Bawah Sadar</span> Anda yang tersetting untuk "GAGAL".
            </p>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-[#1a2a3a] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl p-1 rotate-2 shadow-2xl">
                    <div className="bg-[#1a2a3a] rounded-xl p-8 h-full flex flex-col items-center justify-center text-center border border-white/10">
                        <Headphones className="w-24 h-24 text-yellow-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-2">AUDIO HIPNOTERAPI</h3>
                        <p className="text-gray-400">Teknologi Gelombang Otak Alpha & Theta</p>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Perkenalkan: <span className="text-yellow-400">PRIA ALPHA SYSTEM</span>
                </h2>
                <p className="text-lg text-gray-300">
                    Satu-satunya program audio yang dirancang untuk menembus 'Critical Factor' otak Anda dan menginstal ulang software kepercayaan diri yang permanen.
                </p>
                <ul className="space-y-4">
                    {[
                        "Menghapus trauma penolakan masa lalu",
                        "Mengaktifkan aura dominan yang tenang",
                        "Membuat Anda nyaman dengan kontak mata",
                        "Otomatis memancarkan karisma tanpa dibuat-buat"
                    ].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="text-green-400 w-6 h-6 flex-shrink-0" />
                            <span className="font-medium text-slate-100">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Apa Yang Anda Dapatkan?</h2>
        <div className="space-y-6">
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border hover:border-blue-500 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Headphones className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">1. Audio Hipnoterapi "Deep Alpha Reset"</h3>
                    <p className="text-slate-700">Audio berdurasi 15 menit dengan frekuensi Theta untuk didengarkan sebelum tidur. Menghapus mental block dan menginstal mindset pemenang.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border hover:border-blue-500 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <PlayCircle className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">2. Audio "Morning Glory" Booster</h3>
                    <p className="text-slate-700">Audio 5 menit untuk pagi hari. Membangkitkan energi maskulin dan fokus tajam untuk menaklukkan hari Anda.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border hover:border-blue-500 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">3. Ebook Panduan "The Alpha Code"</h3>
                    <p className="text-slate-700">Buku panduan strategi sosial, bahasa tubuh, dan cara membaca sinyal ketertarikan wanita.</p>
                </div>
            </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Mengapa Ini Investasi Terbaik Anda?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
                <Card className="bg-white border shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-600">Sesi Terapi Konvensional</h3>
                    <p className="text-2xl font-bold text-slate-400 mb-4 line-through">Rp 500.000</p>
                    <p className="text-sm text-slate-500">Per 1 sesi (butuh 5-10 sesi)</p>
                </Card>
                <Card className="bg-white border shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-600">Dating Coach / Workshop</h3>
                    <p className="text-2xl font-bold text-slate-400 mb-4 line-through">Rp 2.000.000+</p>
                    <p className="text-sm text-slate-500">Biaya transport & waktu</p>
                </Card>
                <Card className="bg-[#1a2a3a] text-white border-2 border-yellow-400 shadow-xl p-6 transform scale-105">
                    <h3 className="font-bold text-lg mb-2 text-yellow-400">Pria Alpha System</h3>
                    <p className="text-3xl font-extrabold mb-4">Rp 100.000</p>
                    <p className="text-sm text-gray-300">Sekali bayar, akses selamanya. <br/>Hasil permanen.</p>
                </Card>
            </div>
        </div>
      </section>

      {/* AUTHORITY SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center border-4 border-[#1a2a3a]">
                    <Award className="w-20 h-20 text-[#1a2a3a]" />
                </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
                <h3 className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-2">Developed By</h3>
                <h2 className="text-3xl font-bold text-[#1a2a3a] mb-4">eL Vision Group Ecosystem</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Kami adalah ekosistem global yang berfokus pada <strong>Human Mind Engineering</strong>. Metode kami menggabungkan psikologi modern, neuroscience, dan hipnoterapi klinis untuk meretas batasan mental manusia.
                </p>
                <p className="text-slate-700 leading-relaxed">
                    Setiap audio yang kami produksi telah melalui riset frekuensi otak untuk memastikan efek maksimal dalam menembus pikiran bawah sadar.
                </p>
            </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Transformasi Nyata</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Mereka yang dulunya ragu, minder, dan merasa tidak terlihat, kini menjadi pria yang mereka impikan.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        name: "Rian, 29th", role: "Sales Manager",
                        before: "Dulu saya 'badut' tongkrongan. Selalu ngelawak biar dianggap ada. Cewek cuma anggep temen curhat.",
                        after: "Sekarang saya lebih banyak diam & mendengar. Anehnya, mereka malah penasaran. Minggu lalu ada yang chat duluan ngajak jalan. Energy shift is real.",
                        avatar: "R"
                    },
                    {
                        name: "Bimo, 34th", role: "IT Specialist",
                        before: "Trauma diselingkuhi bikin saya paranoid. Tiap deket cewek, saya posesif & insecure parah. Akhirnya mereka ilfeel.",
                        after: "Audio 'Deep Alpha Reset' beneran ngerubah wiring otak. Saya ngerasa 'utuh'. Gak butuh validasi lagi. Pas saya stop ngejar, mantan malah nanya kabar.",
                        avatar: "B"
                    },
                    {
                        name: "Adit, 25th", role: "Freelancer",
                        before: "Saya pendek (160cm) dan kurus. Selalu minder kalau jalan sama temen yang tinggi. Ngerasa gak kelihatan.",
                        after: "Tinggi badan gak berubah, tapi POSTUR mental saya berubah. Orang-orang bilang aura saya 'besar'. Saya jalan tegak, tatapan tajam. Cewek notice itu.",
                        avatar: "A"
                    },
                    {
                        name: "Fajar, 31th", role: "Akuntan",
                        before: "Nice Guy parah. Selalu 'iya-iya' aja sama cewek karena takut ditinggal. Ujung-ujungnya dimanfaatin doang.",
                        after: "Belajar set boundaries. Berani bilang 'enggak'. Ajaibnya, cewek malah jadi respek dan lebih tertarik. Being Alpha is about respect, not arrogance.",
                        avatar: "F"
                    },
                    {
                        name: "Deni, 27th", role: "Mahasiswa S2",
                        before: "Social Anxiety. Kalau di pesta/event cuma main HP di pojokan. Takut salah ngomong.",
                        after: "Sekarang nyaman dalam keheningan. Kalau ngomong, orang dengerin. Gak perlu teriak-teriak. Calm confidence itu magnet terkuat.",
                        avatar: "D"
                    },
                    {
                        name: "Kevin, 30th", role: "Pengusaha",
                        before: "Sukses di bisnis tapi nol di asmara. Kaku banget kalau ngobrol sama lawan jenis. Kayak robot.",
                        after: "Lebih luwes, lebih playful. Audio ini ngebuka sisi 'maskulin' yang santai. Dating jadi fun, bukan beban interview kerja.",
                        avatar: "K"
                    },
                    {
                        name: "Yuda, 26th", role: "Designer",
                        before: "Sering ghosting victim. Ngejar-ngejar cewek, chat tiap jam, needy banget energinya.",
                        after: "Fokus ke diri sendiri & karir. Cewek yang dulu ghosting tiba-tiba reply story. Tapi maaf, standar saya udah naik.",
                        avatar: "Y"
                    },
                    {
                        name: "Hendra, 42th", role: "Duda",
                        before: "Ngerasa tua & expired setelah cerai. Mikir gak bakal ada yang mau lagi.",
                        after: "Ternyata kematangan emosional itu sexy. Audio ini balikin pride saya sebagai laki-laki. Sekarang malah deket sama yang umur 28.",
                        avatar: "H"
                    },
                    {
                        name: "Satria, 23th", role: "Fresh Grad",
                        before: "Gagap kalau nervous. Apalagi pas interview kerja atau kenalan sama cewek baru.",
                        after: "Bicara lebih pelan, tertata, dan berat. Nervous masih ada dikit, tapi saya bisa kontrol. Interview kemarin lolos nego gaji tinggi.",
                        avatar: "S"
                    },
                    {
                        name: "Eko, 35th", role: "Supervisor",
                        before: "Overthinking. Mau chat aja mikir 2 jam. Mau nyapa orang di gym takut ganggu.",
                        after: "Action oriented. Otak gak banyak mikir lagi, badan gerak otomatis. Hidup jadi jauh lebih ringan bro.",
                        avatar: "E"
                    }
                ].map((testi, i) => (
                    <Card key={i} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-xl">
                                    {testi.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{testi.name}</h4>
                                    <p className="text-xs text-slate-500">{testi.role}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                <p className="text-xs font-bold text-red-800 uppercase mb-1">Before:</p>
                                <p className="text-sm text-slate-700 italic">"{testi.before}"</p>
                            </div>
                            <div className="flex justify-center">
                                <ArrowLeft className="w-5 h-5 text-slate-300 rotate-[-90deg]" />
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                                <p className="text-xs font-bold text-green-800 uppercase mb-1">After:</p>
                                <p className="text-sm text-slate-800 font-medium">"{testi.after}"</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Pertanyaan Yang Sering Diajukan</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white px-4 rounded-lg border">
                    <AccordionTrigger className="text-slate-900 font-semibold">Berapa lama sampai terlihat hasilnya?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sebagian besar pengguna merasakan perubahan mental (lebih tenang & percaya diri) dalam 3-7 hari pertama. Perubahan perilaku nyata biasanya terjadi setelah 21 hari rutin mendengarkan.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white px-4 rounded-lg border">
                    <AccordionTrigger className="text-slate-900 font-semibold">Apakah ini hipnotis? Apakah aman?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Ini adalah hipnoterapi klinis, bukan hipnotis panggung. Anda tetap sadar dan memiliki kontrol penuh. Audio ini hanya membantu Anda masuk ke gelombang otak rileks (Theta) untuk menerima sugesti positif. 100% Aman.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white px-4 rounded-lg border">
                    <AccordionTrigger className="text-slate-900 font-semibold">Bisa didengar sambil kerja atau menyetir?</AccordionTrigger>
                    <AccordionContent className="text-slate-700 text-red-600 font-bold">
                        TIDAK BOLEH. Audio ini menyebabkan kantuk dan relaksasi dalam. Hanya dengarkan saat Anda dalam posisi istirahat atau sebelum tidur.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white px-4 rounded-lg border">
                    <AccordionTrigger className="text-slate-900 font-semibold">Saya gaptek, cara pakainya gimana?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Sangat mudah. Setelah bayar, link download dikirim ke email. Tinggal klik, download ke HP, dan putar pakai earphone. Ada panduan lengkapnya juga di dalam.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-blue-200 shadow-2xl overflow-hidden rounded-2xl bg-white text-slate-900">
                <CountdownTimer />
                <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">FORMULIR PEMESANAN</h2>
                    <p className="opacity-90 text-lg">Lengkapi data di bawah untuk akses instan</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10 bg-white">
                    {/* PRICING BOX */}
                    <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-slate-500 text-sm mb-1">Harga Normal</p>
                        <p className="text-xl text-slate-400 line-through decoration-red-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-blue-900 font-bold mb-1">Harga Promo Hari Ini:</p>
                        <p className="text-4xl font-extrabold text-blue-600">{formatCurrency(productPrice)}</p>
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
                            <User className="w-5 h-5 text-blue-600" /> Data Diri
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Contoh: Budi Santoso" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-blue-500 h-12"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-slate-700 font-semibold mb-1 block">Alamat Email (PENTING)</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Untuk kirim akses produk" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-blue-500 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-slate-700 font-semibold mb-1 block">Nomor WhatsApp</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        placeholder="0812xxxx" 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-blue-500 h-12"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* PAYMENT METHOD */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <CreditCard className="w-5 h-5 text-blue-600" /> Metode Pembayaran
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <Label key={method.code} className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-blue-600 bg-blue-50 shadow-md ring-1 ring-blue-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                    <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-blue-600" />
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
      <footer className="bg-[#1a2a3a] text-white py-12 text-center text-sm">
        <p className="mb-4">© 2026 eL Vision Ecosystem. All Rights Reserved.</p>
        <p className="text-gray-500">
            Disclaimer: Hasil setiap individu dapat bervariasi. Program ini adalah alat bantu psikologis,<br/>bukan pengganti saran medis profesional.
        </p>
      </footer>
    </div>
  );
}
