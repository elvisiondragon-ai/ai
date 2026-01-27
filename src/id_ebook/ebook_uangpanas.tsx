import React, { useState, useEffect } from 'react';
import { Play, Check, X, Clock, Shield, ChevronDown, User, CreditCard, Copy, Zap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
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

const communityTestimonials = [
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_15taun.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_17juli.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_28juli.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_2jt.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_3minggu.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_agustinus.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_audio1.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_audio2.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_damai.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_depres.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_eldi3.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_jahit.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testI_jahitan.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_jauh.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_JOE.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_karimah.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_kelas1.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_marah.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_muklas.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pelakor.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pesantren.png",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_pesantreren01.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_proyek.jpg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_santet.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi_santri.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi01.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi03.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi05.jpeg",
  "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi_jpg/testi09.png"
];
const VideoModal = ({ video, onClose }: { video: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative w-full max-w-[400px] h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
      >
        <X size={24} />
      </button>
      <video 
        controls 
        autoPlay 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  </div>
);

export default function UangPanasLanding() {
  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 47
  });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(2847);

  const [searchParams] = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  // Payment State
  const productNameBackend = 'ebook_uangpanas';
  const displayProductName = 'Ebook Uang Panas';
  const originalPrice = 500000;
  const productPrice = 100000;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const hasFiredPixelsRef = React.useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    const memberTimer = setInterval(() => {
      setMemberCount(prev => prev + 1);
    }, 45000);

    if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
      hasFiredPixelsRef.current = true;
      const pixelId = '3319324491540889';
      
      initFacebookPixelWithLogging(pixelId);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);

      const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackViewContentEvent({
        content_name: 'Sistem Uang Panas',
        content_ids: ['ebook_uangpanas'],
        content_type: 'product',
        value: 100000,
        currency: 'IDR'
      }, viewContentEventId, pixelId);
    }

    return () => {
      clearInterval(timer);
      clearInterval(memberTimer);
    };
  }, []);

  const purchaseFiredRef = React.useRef(false);

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
          
          // Optional: redirect to a thank you page or just show success state
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showPaymentInstructions, paymentData]);

  const testimonials = [
    {
      name: "Habib Umar",
      title: "Ustadz",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg",
      quote: "Awalnya ragu, tapi setelah dengar audionya, rezeki datang dari arah tak disangka."
    },
    {
      name: "VIO",
      title: "Anak Muda",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.jpg",
      quote: "Modulnya gampang banget, tinggal copy paste. Sehari bisa dapat 300rb santai."
    },
    {
      name: "Dr Gumilar",
      title: "Hipnoterapis Certified",
      video: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.mp4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg",
      quote: "Marketplace potongan gede, pindah ke sini malah lebih cuan tanpa stok barang."
    }
  ];

  const paymentMethods = [
    { code: 'QRIS', name: 'QRIS', description: 'Scan pakai GoPay, OVO, Dana, ShopeePay, BCA Mobile, dll' },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Transfer otomatis via BCA' },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Transfer otomatis via BNI' },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Transfer otomatis via BRI' },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Transfer otomatis via Mandiri' },
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
        testCode: 'TEST9597' // ADDED FOR VISUAL VERIFICATION
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

  const handleCreatePayment = async () => {
    if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod || !password || !confirmPassword) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi nama, email, no. whatsapp, password, dan metode pembayaran.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Konfirmasi password harus sama dengan password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

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

    let currentUserId = null;

    // AUTO AUTH LOGIC
    if (!currentUserId) {
      try {
        console.log("Starting auto-registration for:", userEmail);
        // 1. Try Sign Up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: {
            data: {
              display_name: userName,
              phone_number: phoneNumber,
            },
          },
        });

        if (signUpError) {
           if (signUpError.message.includes("already registered")) {
              console.log("User exists, trying to login...");
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: password,
              });

              if (signInError) {
                console.error("Sign in error:", signInError);
                toast({
                  title: "Login Gagal",
                  description: "Email sudah terdaftar. Silakan gunakan password yang benar.",
                  variant: "destructive",
                });
                setLoading(false);
                return;
              }

              if (signInData.user) {
                currentUserId = signInData.user.id;
                console.log("User auto-logged in:", currentUserId);
              }
           } else {
             throw signUpError;
           }
        } else if (signUpData.user) {
          currentUserId = signUpData.user.id;
          console.log("User auto-registered:", currentUserId);

          // Ensure profile is created (Manual backup if trigger fails)
          try {
            const { error: profileError } = await supabase.from('profiles').upsert({
              user_id: currentUserId as string,
              user_email: userEmail,
              display_name: userName,
              experience_points: 0,
              level: 1,
              streak_days: 0,
              updated_at: new Date().toISOString()
            } as any, { onConflict: 'user_id' });
            
            if (profileError) {
               console.warn("Profile sync note (non-fatal):", profileError.message);
            } else {
               console.log("Profile successfully ensured in database");
            }
          } catch (err) {
            console.warn("Manual profile creation skipped/handled by trigger:", err);
          }
        }
      } catch (authErr: any) {
        console.error("Auto-auth failed:", authErr);
        toast({
          title: "Gagal Mendaftarkan Akun",
          description: authErr.message || "Terjadi kesalahan saat pendaftaran.",
          variant: "destructive",
        });
        setLoading(false);
        return; // Don't proceed if auth failed and it was intended
      }
    } else {
      console.log("Using existing session for user:", currentUserId);
    }

    const { fbc, fbp } = getFbcFbpCookies();

    try {
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
          userId: currentUserId, // Use the verified user ID
          affiliateRef: affiliateRef,
          commissionRate: 0.50, // Set commission rate to 50% for Uang Panas
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

  if (showPaymentInstructions && paymentData) {
    return (
      <div className="min-h-screen bg-black pb-20 font-sans text-white">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen shadow-2xl border-x border-gray-800">
          <div className="p-4 bg-red-600 text-white flex items-center gap-2 sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-red-700">
              <X className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-gray-400">Total Tagihan</p>
                <p className="text-4xl font-bold text-green-500">{formatCurrency(paymentData.amount)}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                    Menunggu Pembayaran
                </div>
            </div>

            <Card className="bg-gray-800 border-gray-700 border-2">
              <CardContent className="pt-6 space-y-4">
                {paymentData.qrUrl && (
                    <div className="flex flex-col items-center">
                        <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain bg-white p-2 rounded-lg" />
                        <p className="text-sm text-gray-400 mt-4 text-center">Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda.</p>
                    </div>
                )}
                
                {paymentData.payCode && (
                    <div className="space-y-2">
                        <Label className="text-gray-300">Kode Bayar / Virtual Account</Label>
                        <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-700">
                            <span className="font-mono text-xl font-bold tracking-wider text-yellow-400">{paymentData.payCode}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-gray-400 hover:text-white">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-red-900/20 p-3 rounded text-sm text-red-300 border border-red-900/50">
                    <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda dalam 1-2 menit.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
               <p className="text-sm text-gray-500 mb-4">Sudah bayar tapi status belum berubah?</p>
               <Button variant="outline" className="w-full gap-2 border-green-600 text-green-500 hover:bg-green-600 hover:text-white" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                   <FaWhatsapp /> Hubungi Bantuan Admin
               </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white selection:bg-red-500 selection:text-white">
      <Toaster />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
            ⚠️ PROMO TERBATAS - HARGA NAIK DALAM {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Bayangkan Modal <span className="text-5xl md:text-7xl lg:text-8xl text-green-400 animate-pulse">100 RIBU</span>, Raih Ratusan Ribu Per Hari
          </h1>
          
          <div className="text-2xl md:text-4xl mb-8 text-yellow-400 font-semibold space-y-4">
            <p>❌ Tidak Punya Konten? <span className="text-white">Semua Sudah Disiapkan & Disuapin!</span></p>
            <p>❌ Rezeki anda seret terus? <span className="text-white">Audio REZEKI Terbukti Narik Rezeki!</span></p>
            <p>✅ Tugas Anda: <span className="text-green-400">Copy-Paste Video/Foto Lalu Sebar ke Sosmed</span></p>
            <p>💰 Dapatkan <span className="text-white font-bold">50% Komisi</span> — Mudah Kan!?</p>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
            ❌ SCAM? Lihat Anggota Kami Sudah <span className="text-green-400 font-bold">3.800++</span> Target <span className="text-yellow-400 font-bold">10.000</span> — Semua Orang Nyata & Terkenal di Dalamnya. Ini Adalah Gerakan Masyarakat dari Founder Kami!
          </p>
          
          <button 
            onClick={scrollToCheckout}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xl md:text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            🔥 SAYA MAU AKSES SEKARANG - RP100RB SAJA
          </button>
          
          <p className="mt-6 text-sm text-gray-400">
            🔒 Garansi 30 Hari Uang Kembali | ⚡ Akses Instant | 💳 Sekali Bayar
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={48} className="text-gray-400" />
        </div>
      </section>

      {/* The Enemy Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
                      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                      Kenapa Kerja Keras Anda <span className="text-purple-500">TIDAK</span> Menghasilkan Uang?          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800 p-8 rounded-xl border-2 border-purple-500">
              <div className="text-5xl mb-4">📉</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">UMKM Tercekik</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Potongan marketplace 20-30%</li>
                <li>• Ongkir mahal, margin tipis</li>
                <li>• Pajak UMKM naik terus</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border-2 border-purple-500">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Karyawan Terancam</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• PHK gelombang 2025</li>
                <li>• Gaji stagnan, inflasi naik</li>
                <li>• Tabungan terkuras</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl border-2 border-purple-500">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Sudah Coba Semua, Gagal Terus</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Belajar dropship → zonk</li>
                <li>• Ikut MLM → rugi</li>
                <li>• Jualan online → sepi</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900/50 to-black/50 p-8 rounded-xl border-2 border-purple-500">
            <p className="text-xl md:text-2xl text-center leading-relaxed">
              Masalahnya BUKAN strategi Anda. Masalahnya adalah <span className="text-yellow-400 font-bold">ENERGI INTERNAL</span> Anda masih di frekuensi <span className="text-purple-400 font-bold">SCARCITY (kekurangan).</span>
              <br /><br />
              Otak sadar bilang 'Saya mau sukses,' tapi 95% pikiran bawah sadar Anda BERTERIAK: <span className="italic">'Uang itu sulit. Saya tidak pantas.'</span>
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Inilah Kenapa <span className="text-purple-500">UANG PANAS</span> Berbeda:
          </h2>
          <p className="text-2xl text-center mb-16 text-gray-300">
            Kami Tidak Jualan 'Strategi.' Kami Reset <span className="text-yellow-400 font-bold">SISTEM INTERNAL</span> Anda.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border-2 border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                <X className="text-purple-500" /> Metode Lain (Yang Gagal)
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="text-purple-500 flex-shrink-0 mt-1" />
                  <span>Fokus di strategi/taktik saja</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-500 flex-shrink-0 mt-1" />
                  <span>Butuh modal besar</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-500 flex-shrink-0 mt-1" />
                  <span>Harus jago jualan</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-500 flex-shrink-0 mt-1" />
                  <span>Hasil tidak konsisten</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-500 flex-shrink-0 mt-1" />
                  <span>Bikin stres & burnout</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-black/50 p-8 rounded-xl border-2 border-purple-500">
              <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                <Check className="text-purple-500" /> Metode UANG PANAS
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="text-purple-500 flex-shrink-0 mt-1" />
                  <span><strong>Kalibrasi Bio-Energetik</strong> (Metode eL Vision)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Modal HANYA Rp100.000 (sekali bayar)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Sistem sudah siap pakai (tinggal copy-paste)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Komisi 50% otomatis (bukan rekrut-rekrutan)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>2 jam/hari = Rp500rb/hari</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            3 Langkah Sederhana Yang Akan Mengubah Hidup Anda<br />
            <span className="text-yellow-400">Dalam 7 Hari</span>
          </h2>
          
          <div className="space-y-12">
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 rounded-xl border-2 border-purple-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center">1</div>
                <h3 className="text-3xl font-bold">RESET FREKUENSI REZEKI (1 Jam/Hari)</h3>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🎧</div>
                <div>
                  <h4 className="text-2xl font-bold text-purple-300 mb-2">Audio Hipnosis Bio-Energetik eL Vision</h4>
                  <ul className="space-y-2 text-lg text-gray-300">
                    <li>• 30 menit pagi (saat bangun tidur)</li>
                    <li>• 30 menit malam (sebelum tidur)</li>
                    <li>• Akses gelombang Theta (4-7Hz) untuk reprogram pikiran bawah sadar</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/50 p-6 rounded-lg mt-4 italic text-gray-300 border-l-4 border-yellow-500">
                "Di agama kita sebut SYUKUR, YAKIN, TAWAKAL. Tapi eL Vision membuatnya TERUKUR, TERPREDIKSI, dan TERBUKTI oleh 10.000+ pengguna."
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-black/50 p-8 rounded-xl border-2 border-purple-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center">2</div>
                <h3 className="text-3xl font-bold">COPY-PASTE MODUL LEAD MAGNET (30 Menit/Hari)</h3>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">📱</div>
                <div>
                  <h4 className="text-2xl font-bold text-purple-300 mb-2">Anda dapat:</h4>
                  <ul className="space-y-2 text-lg text-gray-300">
                    <li>• 7 Lead Magnet siap pakai (nilai Rp5 juta)</li>
                    <li>• Script iklan yang sudah convert</li>
                    <li>• Template posting organik (TikTok, IG, FB)</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/50 p-6 rounded-lg mt-4 italic text-gray-300 border-l-4 border-purple-500">
                "Tidak perlu pusing jualan APA. Tidak perlu mikir jualan KEMANA. Tinggal IKUTI MODUL."
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-black/50 p-8 rounded-xl border-2 border-purple-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center">3</div>
                <h3 className="text-3xl font-bold">TERIMA KOMISI 50% SEUMUR HIDUP (Pasif)</h3>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">💰</div>
                <div>
                  <h4 className="text-2xl font-bold text-purple-300 mb-2">Setiap orang yang beli lewat link Anda:</h4>
                  <ul className="space-y-2 text-lg text-gray-300">
                    <li>• Komisi 50% langsung masuk rekening</li>
                    <li>• Sistem affiliate otomatis tracking</li>
                    <li>• Withdraw setiap senin, minimal Rp50.000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Dengar Sendiri Buktinya:
          </h2>
          <p className="text-xl md:text-2xl text-center mb-16 text-gray-300">
            Mereka Yang Tadinya Skeptis, Sekarang Menghasilkan Hingga <span className="text-green-400 font-bold">Rp15 Juta/Bulan</span>
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-yellow-500 transition-all cursor-pointer transform hover:scale-105" onClick={() => setSelectedVideo(testimonial.video)}>
                <div className="relative group">
                  <img src={testimonial.poster} alt={testimonial.name} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={64} className="text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    VIDEO
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{testimonial.name}</h4>
                  <p className="text-gray-400 mb-3">{testimonial.title}</p>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-8 rounded-xl border-2 border-yellow-600">
            <p className="text-center text-xl text-gray-300">
              <span className="text-yellow-400 font-bold">Ini bukan screenshot edit.</span> Ini REAL PEOPLE, REAL RESULTS.
            </p>
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Apa Yang Anda Dapat Hari Ini
          </h2>
          <p className="text-2xl text-center mb-16 text-yellow-400 font-bold">
            (Total Nilai: Rp12.750.000)
          </p>
          
          <div className="space-y-6 mb-12">
            {[
              { icon: "📚", title: 'Ebook "Sistem UANG PANAS"', value: "Rp500.000", desc: "Metode lengkap step-by-step" },
              { icon: "🧲", title: "7 Lead Magnet Siap Pakai", value: "Rp5.000.000", desc: "Tinggal copy-paste, langsung jualan" },
              { icon: "🎧", title: "Audio Hipnosis Bio-Energetik eL Vision", value: "Rp3.000.000", desc: "2 audio premium (Rezeki Pagi + Rezeki Malam) - Teknologi brainwave entrainment" },
              { icon: "📱", title: "Modul Iklan Organik & Berbayar", value: "Rp2.000.000", desc: "Script Facebook Ads yang proven + Template konten viral TikTok & IG" },
              { icon: "💬", title: "Grup Private Telegram 24/7", value: "Rp1.500.000", desc: "Support langsung dari mentor + Update strategi terbaru" },
              { icon: "📊", title: "Akses Affiliate Dashboard Selamanya", value: "Rp750.000", desc: "Track komisi real-time + Withdraw otomatis" }
            ].map((bonus, idx) => (
              <div key={idx} className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl border-2 border-yellow-600 flex items-start gap-4">
                <div className="text-5xl">{bonus.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-yellow-400">{bonus.title}</h3>
                    <span className="text-purple-400 font-bold text-xl">{bonus.value}</span>
                  </div>
                  <p className="text-gray-300">{bonus.desc}</p>
                </div>
                <Check className="text-purple-500 flex-shrink-0" size={32} />
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-12 rounded-2xl text-center">
            <p className="text-3xl mb-4">TOTAL NILAI: <span className="line-through">Rp12.750.000</span></p>
            <p className="text-6xl font-bold mb-6">HARGA HARI INI: Rp100RB</p>
            <p className="text-2xl font-semibold">Hemat 99% - Tapi Tidak Untuk Lama!</p>
          </div>
        </div>
      </section>

      {/* Urgency */}
      <section className="py-20 px-4 bg-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Clock size={64} className="mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">⏰ PROMO INI BERAKHIR DALAM:</h2>
            <div className="flex justify-center gap-4 text-center mb-8">
              <div className="bg-black p-6 rounded-xl min-w-[100px]">
                <div className="text-5xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-sm text-gray-400 mt-2">JAM</div>
              </div>
              <div className="text-5xl font-bold flex items-center">:</div>
              <div className="bg-black p-6 rounded-xl min-w-[100px]">
                <div className="text-5xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-sm text-gray-400 mt-2">MENIT</div>
              </div>
              <div className="text-5xl font-bold flex items-center">:</div>
              <div className="bg-black p-6 rounded-xl min-w-[100px]">
                <div className="text-5xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-sm text-gray-400 mt-2">DETIK</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-8 rounded-xl border-4 border-yellow-500 mb-8">
            <p className="text-2xl mb-4">⚠️ <strong>PERHATIAN:</strong></p>
            <p className="text-xl mb-4">Harga akan NAIK menjadi Rp500.000 setelah timer habis.</p>
            <p className="text-xl mb-4">Saat ini sudah <span className="text-green-400 font-bold">{memberCount.toLocaleString()} orang</span> bergabung.</p>
            <p className="text-2xl font-bold text-purple-400">Slot terbatas: {(10000 - memberCount)} orang lagi.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-gray-700 italic">
            <p className="text-lg text-gray-300">
              "Kemarin ada yang chat: 'Mas, saya telat 2 jam. Harganya udah naik jadi 500rb. Bisa diskon ga?'
              <br /><br />
              Maaf, sistem otomatis. Kami tidak bisa kecualikan siapapun. <span className="text-yellow-400 font-bold">Jangan sampai Anda yang menyesal.</span>"
            </p>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            100% GARANSI UANG KEMBALI<br />
            <span className="text-purple-400">Tanpa Ribet, Tanpa Pertanyaan</span>
          </h2>
          
          <div className="bg-gradient-to-r from-purple-900/50 to-black/50 p-10 rounded-2xl border-4 border-purple-500">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <Shield size={80} className="text-purple-400 flex-shrink-0" />
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-6 text-purple-400">🛡️ JAMINAN IRON-CLAD:</h3>
                <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                  Coba sistem UANG PANAS selama 30 hari. Jika Anda tidak menghasilkan minimal Rp500.000, tunjukkan bukti Anda sudah ikuti 3 langkah kami—<span className="text-yellow-400 font-bold">UANG ANDA KEMBALI 100%.</span>
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Bahkan, Anda tetap boleh <strong>SIMPAN semua bonus & akses affiliate.</strong>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-2xl text-gray-300 italic">
              "Karena kami YAKIN sistem ini work. Sudah {memberCount.toLocaleString()} orang buktikan.<br />
              <span className="text-yellow-400 font-bold">Risiko ada di KAMI, bukan di Anda.</span>"
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Pertanyaan Yang Sering Ditanyakan
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Ini MLM / Skema Piramid?",
                a: "BUKAN. Anda tidak perlu rekrut siapapun. Komisi dari penjualan produk REAL (ebook + audio), bukan dari rekrutan."
              },
              {
                q: "Saya tidak punya skill jualan, bisa?",
                a: "BISA. Semua script, template, lead magnet sudah kami siapkan. Anda tinggal copy-paste."
              },
              {
                q: "Butuh modal besar untuk iklan?",
                a: "TIDAK. Modul kami ada strategi ORGANIK (gratis) dan berbayar (mulai Rp20rb/hari)."
              },
              {
                q: "Saya sudah coba banyak metode, gagal terus.",
                a: "Karena metode lain hanya fokus di STRATEGI. UANG PANAS reset ENERGI INTERNAL Anda dulu (audio hipnosis). Tanpa ini, strategi apapun akan sabotase sendiri."
              },
              {
                q: "Berapa lama baru menghasilkan?",
                a: "Member tercepat: 4 jam. Rata-rata: 3-7 hari. Yang lambat: 14 hari. (Bergantung konsistensi Anda dengar audio + ikuti modul)."
              },
              {
                q: "Audio hipnosis itu aman? Bukan sihir/klenik?",
                a: "AMAN & ILMIAH. Teknologi brainwave entrainment (gelombang Theta 4-7Hz) sudah dipakai di dunia medis & terapi. Tidak ada unsur spiritual/klenik."
              },
              {
                q: "Kalau tidak manfaat, gimana?",
                a: "GARANSI 30 HARI UANG KEMBALI 100%. No drama."
              },
              {
                q: "Kenapa harganya murah banget?",
                a: "Karena misi kami BANTU SEBANYAK MUNGKIN ORANG di masa ekonomi sulit. Tapi harga ini TIDAK BERLAKU LAMA. Setelah 10.000 member, naik jadi Rp500rb."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-800 p-6 rounded-xl border-2 border-gray-700 hover:border-yellow-500 transition-all">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Q: {faq.q}</h3>
                <p className="text-gray-300 text-lg">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Pilihan Anda Hari Ini Akan Menentukan<br />
            <span className="text-yellow-400">6 Bulan Ke Depan</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-purple-900/50 to-emerald-900/50 p-8 rounded-xl border-4 border-green-500">
              <h3 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                <Check size={40} /> JIKA ANDA KLIK "BELI SEKARANG":
              </h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" />
                  <span>30 menit dari sekarang, Anda sudah download ebook & audio</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" />
                  <span>2 jam dari sekarang, Anda sudah dengar audio pertama & mulai shift energi</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" />
                  <span>3 hari dari sekarang, komisi pertama Rp50rb masuk rekening</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" />
                  <span>30 hari dari sekarang, income Anda naik Rp5-15 juta/bulan</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" />
                  <span className="font-bold">6 bulan dari sekarang, hidup Anda TOTALLY DIFFERENT</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 p-8 rounded-xl border-4 border-red-500">
              <h3 className="text-3xl font-bold mb-6 text-red-400 flex items-center gap-3">
                <X size={40} /> JIKA ANDA KLIK "TUTUP HALAMAN":
              </h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" />
                  <span>Besok harga naik jadi Rp500rb (Anda rugi Rp400rb)</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" />
                  <span>3 hari dari sekarang, Anda masih stress mikirin uang</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" />
                  <span>30 hari dari sekarang, tagihan menumpuk, tabungan makin tipis</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" />
                  <span className="font-bold italic">6 bulan dari sekarang, Anda menyesal: "Kenapa kemarin saya tidak ambil kesempatan itu?"</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={scrollToCheckout}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-purple-700 text-white text-2xl md:text-3xl font-bold py-8 px-16 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 animate-pulse"
            >
              🔥 YA, SAYA MAU AKSES SEKARANG - RP100RB SAJA
            </button>
            
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <p className="flex items-center gap-2">
                <Shield size={20} /> Pembayaran 100% aman (SSL Encrypted)
              </p>
              <p className="flex items-center gap-2">
                💳 Terima: Transfer Bank, E-wallet, QRIS
              </p>
              <p className="flex items-center gap-2">
                <Zap size={20} /> Akses langsung setelah pembayaran
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-10 rounded-2xl border-2 border-yellow-600">
            <h3 className="text-3xl font-bold mb-6 text-yellow-400">Dari eL Reyzandra (Founder eL Vision):</h3>
            
            <div className="space-y-4 text-lg text-gray-200 leading-relaxed">
              <p>
                Saya dulu seorang motivator terkenal. Tapi saya BERHENTI karena sadar: motivasi itu sementara.
              </p>
              
              <p>
                2% klien saya gagal—bukan karena malas, tapi karena SISTEM INTERNAL mereka tidak support.
              </p>
              
              <p>
                Sejak itu, saya kembangkan metode Bio-Energetic Calibration yang sekarang jadi fondasi UANG PANAS.
              </p>
              
              <p>
                Ini bukan janji kosong. Ini SISTEM yang sudah terbukti di 10.000+ orang untuk kesehatan, hubungan, dan keuangan.
              </p>
              
              <p>
                Ekonomi 2025 memang berat. Tapi ada CARA keluar—tanpa kerja 18 jam/hari, tanpa modal besar, tanpa jadi sales dadakan.
              </p>
              
              <p>
                Saya beri Anda akses hari ini dengan harga Rp100rb, karena <span className="text-yellow-400 font-bold">REZEKI ANDA ADALAH REZEKI SAYA JUGA.</span>
              </p>
              
              <p>
                Ketika energi Anda naik, energi saya juga naik. Ini bukan charity. Ini SIMBIOSIS.
              </p>
              
              <p className="text-2xl font-bold text-yellow-400 mt-6">
                Saya tunggu Anda di dalam.
              </p>
              
              <p className="text-xl italic mt-4">
                — eL Reyzandra
              </p>
            </div>
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-black gap-2"
                onClick={() => window.open('https://cirebon.inews.id/read/204537/ini-sosok-el-reyzandra-mentor-bisnis-yang-sukseskan-ratusan-pengusaha-muda/2', '_blank')}
              >
                Klik Mengetahui Founder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-black">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-red-900 shadow-2xl overflow-hidden rounded-2xl bg-gray-900 text-white">
                <div className="bg-purple-600 text-white p-3 text-center font-bold animate-pulse">
                    🔥 PROMO BERAKHIR DALAM: {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="bg-gradient-to-r from-purple-800 to-black text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">FORMULIR PEMESANAN</h2>
                    <p className="opacity-90 text-lg">Lengkapi data di bawah untuk akses instan</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10">
                    <div className="bg-gray-800 border-2 border-gray-700 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-gray-400 text-sm mb-1">Harga Normal</p>
                        <p className="text-xl text-gray-500 line-through decoration-red-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-white font-bold mb-1">Harga Promo Hari Ini:</p>
                        <p className="text-5xl font-extrabold text-green-500">{formatCurrency(productPrice)}</p>
                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-300 font-medium">
                            <div className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-green-500" /> Akses Selamanya • Sekali Bayar
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <User className="w-5 h-5 text-purple-500" /> Data Diri
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-gray-300 font-semibold mb-1 block">Nama Lengkap</Label>
                                <Input
                                                                    id="name"
                                                                    autoComplete="name"
                                                                    placeholder="Nama Anda"
                                                                    value={userName}
                                                                    onChange={(e) => setUserName(e.target.value)}
                                                                    className={`text-white border-gray-700 focus:border-red-500 h-12 ${userName ? 'bg-purple-700 placeholder:text-yellow-400' : 'bg-black placeholder:text-gray-500'}`}
                                                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-gray-300 font-semibold mb-1 block">Email</Label>
                                    <Input
                                                                            id="email"
                                                                            type="email"
                                                                            autoComplete="email"
                                                                            placeholder="email@anda.com"
                                                                            value={userEmail}
                                                                            onChange={(e) => setUserEmail(e.target.value)}
                                                                    className={`text-white border-gray-700 focus:border-red-500 h-12 ${userName ? 'bg-purple-700 placeholder:text-yellow-400' : 'bg-black placeholder:text-gray-500'}`}
                                                                        />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-gray-300 font-semibold mb-1 block">WhatsApp</Label>
                                    <Input
                                                                            id="phone"
                                                                            type="tel"
                                                                            autoComplete="tel"
                                                                            placeholder="0812..."
                                                                            value={phoneNumber}
                                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                                    className={`text-white border-gray-700 focus:border-red-500 h-12 ${userName ? 'bg-purple-700 placeholder:text-yellow-400' : 'bg-black placeholder:text-gray-500'}`}
                                                                        />                                </div>
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-gray-300 font-semibold mb-1 block">Password (Untuk Login Member Area)</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="Buat password rahasia..." 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                                                    className={`text-white border-gray-700 focus:border-red-500 h-12 ${userName ? 'bg-purple-700 placeholder:text-yellow-400' : 'bg-black placeholder:text-gray-500'}`}
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword" className="text-gray-300 font-semibold mb-1 block">Konfirmasi Password</Label>
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    placeholder="Ulangi password rahasia..." 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                                                    className={`text-white border-gray-700 focus:border-red-500 h-12 ${userName ? 'bg-purple-700 placeholder:text-yellow-400' : 'bg-black placeholder:text-gray-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <CreditCard className="w-5 h-5 text-red-500" /> Metode Pembayaran
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                                <Label key={method.code} className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-red-600 bg-red-900/10' : 'border-gray-800 bg-black hover:border-gray-700'}`}>
                                    <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-gray-600 text-red-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-white text-lg">{method.name}</div>
                                        <div className="text-sm text-gray-400">{method.description}</div>
                                    </div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>

                <CardFooter className="p-8 bg-black/50 flex flex-col gap-4 border-t border-gray-800">
                    <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-green-600 hover:bg-green-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white"
                        onClick={handleCreatePayment}
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : `BELI SEKARANG - ${formatCurrency(totalAmount)}`}
                    </Button>
                    <p className="text-center text-gray-500 text-xs mt-2">
                        Promo ini hanya berlangsung sebentar, harga akan naik!
                    </p>
                </CardFooter>
            </Card>
        </div>
      </section>

      {/* Community Testimonials Grid */}
      <section className="py-20 px-4 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Testimoni Komunitas
          </h2>
          <p className="text-gray-400 mb-12">
            karena begitu banyak testimony, hanya sebagian kami selipkan disini
          </p>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 text-left">
            {communityTestimonials.map((img, idx) => (
               <div key={idx} className="break-inside-avoid rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-colors bg-gray-900">
                  <img src={img} alt={`Testimoni ${idx + 1}`} className="w-full h-auto object-cover" loading="lazy" />
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-800 p-4 shadow-2xl z-50 md:hidden">
        <button 
          onClick={scrollToCheckout}
          className="w-full bg-white text-purple-600 font-bold text-lg py-4 rounded-full hover:bg-gray-100 transition-all"
        >
          🔥 BELI SEKARANG - RP100RB
        </button>
      </div>

      {/* Video Modal */}
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
}