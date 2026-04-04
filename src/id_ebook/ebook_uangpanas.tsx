import React, { useState, useEffect } from 'react';
import ssworkbook from '@/assets/ssworkbook.png';
import { Play, Check, X, Clock, Shield, ChevronDown, User, CreditCard, Copy, Zap, Gift, BookOpen, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { 
  initFacebookPixelWithLogging, 
  trackViewContentEvent, 
  getFbcFbpCookies,
  handleFbcCookieManager,
  sha256
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
const MOCK_REVIEWS_UANGPANAS = [
  {
    user_email: "deindaras***@gmail.com",
    rating: 5,
    comment: "Workbook 30 harinya yang bikin saya paling kagum. Hari ke-7 udah mulai kerasa beda — ada klien lama tiba-tiba hubungi lagi, deal Rp8 juta. Bukan kebetulan, karena saya udah 2 tahun nunggu dia balik. Ebook rezekinya ngebantu saya beneran PERCAYA dulu sebelum eksekusi.",
    is_verified: true,
    created_at: "2026-03-28"
  },
  {
    user_email: "rinaw91***@yahoo.co.id",
    rating: 5,
    comment: "Audio rezekinya... saya udah coba banyak meditasi, tapi yang ini beda. Setelah 10 hari dengerin tiap pagi-malam, rasanya tenang banget dan keputusan bisnis saya lebih jernih. Dalam 3 minggu omzet warung saya naik Rp2,3 juta per minggu. Kelihatan kecil tapi buat saya itu luar biasa!",
    is_verified: true,
    created_at: "2026-03-25"
  },
  {
    user_email: "guspratam***@outlook.com",
    rating: 4,
    comment: "Bonusnya banyaaaak banget, saya sampe kewalahan bacanya wkwk. Tapi yang paling ngena buat saya itu Gorilla Mindset dan Afirmasi 250+. Pas dikombinasikan sama workbook harian, mindset saya beneran berubah. Di hari ke-21 dapat proyek freelance Rp4,5 juta dari koneksi lama. Dikurangi 1 bintang karena harusnya ada versi video penjelasannya.",
    is_verified: true,
    created_at: "2026-03-22"
  },
  {
    user_email: "siti_nrh***@ymail.com",
    rating: 5,
    comment: "Saya ibu rumah tangga yang selama ini ngerasa rezeki seret terus. Beli ini awalnya skeptis. Tapi setelah ikut protokol workbook 30 hari — di hari ke-12 suami saya tiba-tiba dapet bonus kerja yang dia sendiri gak nyangka. Rp15 juta! Saya yakin ini bukan kebetulan, karena saya udah jalanin semua langkahnya.",
    is_verified: true,
    created_at: "2026-03-19"
  },
  {
    user_email: "dimsokta***@gmail.com",
    rating: 3,
    comment: "Jujur aja ya, di hari ke-14 baru dapet hasil — ada job masuk Rp300rb. Gak besar sih. Tapi realistis, masa modal 200 ribu bisa langsung dapet miliaran? Hahaha. Yang penting prosesnya udah bener, saya lanjut aja. Workbooknya memang butuh konsisten, bukan ajaib.",
    is_verified: true,
    created_at: "2026-03-17"
  },
  {
    user_email: "mlestari***@rocketmail.com",
    rating: 5,
    comment: "Ebooknya padat banget ilmunya. Saya udah baca Think & Grow Rich sebelumnya, tapi versi ringkasan yang ada di bonus sini jauh lebih mudah diaplikasikan. Ditambah workbook hariannya, saya jadi lebih terstruktur. Dalam 30 hari toko online saya naik penjualan 40%. Recommended!",
    is_verified: true,
    created_at: "2026-03-14"
  },
  {
    user_email: "rndferdi8***@yahoo.com",
    rating: 4,
    comment: "Audio hipnosisnya saya dengerin 30 menit tiap pagi sebelum kerja. Efeknya real — saya lebih fokus, less overthinking, dan kepala lebih jernih buat ambil keputusan. Di minggu ke-3, dapat order affiliate pertama saya Rp99.500. Kecil, tapi proof sistemnya jalan. Mau konsisten terus!",
    is_verified: true,
    created_at: "2026-03-11"
  },
  {
    user_email: "liasuc***@gmail.com",
    rating: 5,
    comment: "Workbook protokol kekacauan & kedamaiannya ini yang paling powerful buat saya. Saya nulis target, olahraga, kebaikan tiap hari — dan di hari ke-9 dapet telepon dari klien lama yang tiba-tiba transfer DP proyek Rp7 juta. Totalnya bulan ini naik Rp18 juta dari bulan kemarin. Ini bukan sulap, ini sistem.",
    is_verified: true,
    created_at: "2026-03-08"
  },
  {
    user_email: "hkurniaw***@outlook.com",
    rating: 4,
    comment: "Bonus 250 afirmasi-nya saya print dan tempel di kamar. Dibaca tiap pagi habis dengar audio. Efeknya perlahan tapi nyata. Dalam sebulan ada 2 peluang bisnis baru yang muncul — yang satu sudah jalan dan hasilkan Rp1,2 juta minggu pertama. Minus 1 bintang karena harusnya ada grup support yang lebih aktif.",
    is_verified: false,
    created_at: "2026-03-05"
  },
  {
    user_email: "fitrianggi***@gmail.com",
    rating: 5,
    comment: "Saya coba karena penasaran sama audio bio-energetiknya. Ternyata efeknya luar biasa. Tidur lebih nyenyak, pikiran lebih tenang, dan tiba-tiba banyak ide bisnis yang muncul sendiri. Workbook 30 harinya bantu saya eksekusi satu per satu. Bulan pertama naik Rp6,5 juta dari jualan produk sendiri. Paket ini worth every rupiah!",
    is_verified: true,
    created_at: "2026-03-02"
  }
];

const getYouTubeEmbedUrl = (url: string): string => {
  // Handle youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&playsinline=1`;
  // Handle youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&playsinline=1`;
  // Handle youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&playsinline=1`;
  return url;
};

const VideoModal = ({ video, onClose }: { video: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="relative w-full max-w-[400px] h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm"
      >
        <X size={24} />
      </button>
      <iframe
        src={getYouTubeEmbedUrl(video)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Testimoni"
      />
    </div>
  </div>
);

export default function UangPanasLanding() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 47
  });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(3847);

  const [searchParams] = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const { toast } = useToast();

  // Payment State
  const [selectedTier, setSelectedTier] = useState<'basic' | 'bundle'>('basic');
  const productNameBackend = selectedTier === 'bundle' ? 'ebook_uangpanas_bundle' : 'ebook_uangpanas';
  const displayProductName = selectedTier === 'bundle' ? 'Ebook Uang Panas + Audio Rezeki' : 'Ebook Uang Panas';
  const originalPrice = 500000;
  const productPrice = selectedTier === 'bundle' ? 299000 : 199000;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
  const [retailOpen, setRetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  // Free Ebook State
  const [freeFormName, setFreeFormName] = useState('');
  const [freeFormEmail, setFreeFormEmail] = useState('');
  const [freeFormPhone, setFreeFormPhone] = useState('');
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeSent, setFreeSent] = useState(false);

  // Reviews State
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [anonymousReviewEmail, setAnonymousReviewEmail] = useState('');
  const [showReviewsCount, setShowReviewsCount] = useState(10);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingReviewPayload, setPendingReviewPayload] = useState<any>(null);

  const isProcessingRef = React.useRef(false);


  const fetchDbReviews = async () => {
    const { data } = await (supabase as any).from('reviews_uangpanas').select('*').order('created_at', { ascending: false });
    if (data) setDbReviews(data);
  };

  const submitReview = async (confirmedEmail?: string) => {
    const emailToUse = confirmedEmail || anonymousReviewEmail.trim().toLowerCase();
    if (!emailToUse || !emailToUse.includes('@')) {
      toast({ title: 'Email tidak valid', description: 'Masukkan email yang benar.', variant: 'destructive' }); return;
    }
    if (!reviewRating) {
      toast({ title: 'Beri rating dulu', description: 'Klik bintang untuk memberi rating.', variant: 'destructive' }); return;
    }
    if (!reviewText.trim()) {
      toast({ title: 'Ulasan kosong', description: 'Tulis ulasan kamu terlebih dahulu.', variant: 'destructive' }); return;
    }
    setIsReviewLoading(true);
    try {
      const { data: existingReview } = await (supabase as any).from('reviews_uangpanas').select('*').eq('user_email', emailToUse).maybeSingle();
      if (existingReview && !confirmedEmail) {
        setPendingReviewPayload({ email: emailToUse, rating: reviewRating, comment: reviewText });
        setShowUpdateConfirm(true);
        setIsReviewLoading(false);
        return;
      }
      let isVerifiedFlag = false;
      if (existingReview?.is_verified) {
        isVerifiedFlag = true;
      } else {
        const { data: paidEntry } = await (supabase as any).from('global_product').select('status').eq('email', emailToUse).eq('status', 'PAID').maybeSingle();
        if (paidEntry) isVerifiedFlag = true;
      }
      const payload = {
        user_email: emailToUse,
        name: emailToUse.split('@')[0],
        rating: reviewRating,
        comment: reviewText,
        is_verified: isVerifiedFlag
      };
      if (existingReview) {
        await (supabase as any).from('reviews_uangpanas').update(payload).eq('id', existingReview.id);
        toast({ title: 'Review diupdate ✅' });
      } else {
        await (supabase as any).from('reviews_uangpanas').insert([payload]);
        toast({ title: 'Terima kasih! Review ditambahkan ✅' });
      }
      setShowUpdateConfirm(false);
      setPendingReviewPayload(null);
      setReviewText('');
      setReviewRating(0);
      fetchDbReviews();
    } catch (err: any) {
      toast({ title: 'Gagal submit', description: err.message, variant: 'destructive' });
    } finally {
      setIsReviewLoading(false);
    }
  };


  useEffect(() => {
    fetchDbReviews();
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

    return () => {
      clearInterval(timer);
      clearInterval(memberTimer);
    };
  }, []);

  // Eagerly capture fbclid before pixel loads
  useEffect(() => {
    handleFbcCookieManager();
  }, []);

  // Init pixel: PageView + ViewContent on mount
  useEffect(() => {
    const PIXEL_ID = '3319324491540889';
    initFacebookPixelWithLogging(PIXEL_ID);
    trackViewContentEvent(
      { content_name: 'Sistem Uang Panas', value: 199000, currency: 'IDR' },
      undefined,
      PIXEL_ID
    );
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

          // TEST MODE CHECK
          const isTestUser = userEmail === 'elvisiondragon@gmail.com';

          if (isTestUser) {
              console.log('🧪 TEST MODE DETECTED: Purchase recorded via Server CAPI');
          } else {
              console.log('💰 Purchase recorded via Server CAPI');
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
      video: "https://www.youtube.com/shorts/jD6XlkCL4sI",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg",
      quote: "Awalnya ragu, tapi setelah dengar audionya, rezeki datang dari arah tak disangka."
    },
    {
      name: "VIO",
      title: "Anak Muda",
      video: "https://www.youtube.com/shorts/cPwGC0NW8s4",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio.jpg",
      quote: "Modulnya gampang banget, tinggal copy paste. Sehari bisa dapat 300rb santai."
    },
    {
      name: "Dr Gumilar",
      title: "Hipnoterapis Certified",
      video: "https://www.youtube.com/shorts/U6NsL9RL9rY",
      poster: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg",
      quote: "Marketplace potongan gede, pindah ke sini malah lebih cuan tanpa stok barang."
    },
    {
      name: "Lena",
      title: "Member eL Vision",
      video: "https://www.youtube.com/shorts/-9u7v6vT5ds",
      poster: "https://img.youtube.com/vi/-9u7v6vT5ds/hqdefault.jpg",
      quote: "Dikejar rezeki saat tidak menginginkan apa-apa. Ajaib tapi nyata."
    },
    {
      name: "Orang Tua Inspiratif",
      title: "Member eL Vision",
      video: "https://www.youtube.com/watch?v=1ZNFxjPdFr8",
      poster: "https://img.youtube.com/vi/1ZNFxjPdFr8/hqdefault.jpg",
      quote: "Latih anak bersyukur sejak dini — karena mindset berlimpah harus dimulai dari keluarga."
    },
    {
      name: "Pak Agus SH., MH.",
      title: "Kepala Satuan Intelijen 2018–2025",
      video: "https://www.youtube.com/watch?v=kVgfxHX_GeY",
      poster: "https://img.youtube.com/vi/kVgfxHX_GeY/hqdefault.jpg",
      quote: "Sebagai mantan pejabat, saya kritis. Tapi pengalaman menjalani eL Vision mengubah pandangan saya."
    },
    {
      name: "Felicia",
      title: "Member eL Vision",
      video: "https://www.youtube.com/watch?v=Rs_UDalr8q8",
      poster: "https://img.youtube.com/vi/Rs_UDalr8q8/hqdefault.jpg",
      quote: "Dari gelisah jadi damai dalam 7 hari. Saya tidak menyangka perubahan bisa secepat ini."
    },
    {
      name: "Gen Z Speaks",
      title: "Generasi Muda",
      video: "https://www.youtube.com/watch?v=wQv7mHlE-5o",
      poster: "https://img.youtube.com/vi/wQv7mHlE-5o/hqdefault.jpg",
      quote: "Gen Z jangan sampai tau video ini — bahaya kalau sampai sadar betapa powerful-nya sistem ini!"
    }
  ];

  const ALL_PAYMENT_METHODS = [
    { code: 'QRIS', name: 'QRIS', description: 'GoPay, OVO, Dana, ShopeePay, BCA Mobile', highlight: true },
    { code: 'DANA', name: 'DANA', description: 'E-Wallet DANA', highlight: true },
    { code: 'OVO', name: 'OVO', description: 'E-Wallet OVO', highlight: true },
    { code: 'SHOPEEPAY', name: 'ShopeePay', description: 'E-Wallet ShopeePay', highlight: true },
    { code: 'BCA_MANUAL', name: 'Transfer Manual BCA', description: 'Dicek Manual 1-5 Menit', highlight: false },
    { code: 'BCAVA', name: 'BCA Virtual Account', description: 'Otomatis via BCA', highlight: false },
    { code: 'BNIVA', name: 'BNI Virtual Account', description: 'Otomatis via BNI', highlight: false },
    { code: 'BRIVA', name: 'BRI Virtual Account', description: 'Otomatis via BRI', highlight: false },
    { code: 'MANDIRIVA', name: 'Mandiri Virtual Account', description: 'Otomatis via Mandiri', highlight: false },
  ];
  const RETAIL_METHODS = [
    { code: 'INDOMARET', name: 'Indomaret', description: 'Gerai Indomaret' },
    { code: 'ALFAMART', name: 'Alfamart', description: 'Gerai Alfamart' },
    { code: 'ALFAMIDI', name: 'Alfamidi', description: 'Gerai Alfamidi' },
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

    isProcessingRef.current = true;
    setLoading(true);

    // 🎯 CAPI: AddPaymentInfo — backend-style clean call (no Purchase on frontend)
    const { fbc: apiFbc, fbp: apiFbp } = getFbcFbpCookies();
    const clientIpForPayment = await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => '');
    try {
      await supabase.functions.invoke('capi-universal', {
        body: {
          pixelId: '3319324491540889',
          eventName: 'AddPaymentInfo',
          eventSourceUrl: window.location.href,
          customData: { content_name: displayProductName, value: totalAmount, currency: 'IDR' },
          userData: {
            fbc: apiFbc, fbp: apiFbp,
            client_ip_address: clientIpForPayment,
            fn: userName,
            ph: phoneNumber,
            em: userEmail,
            external_id: await sha256(userEmail)
          }
        }
      });
    } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

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
                isProcessingRef.current = false;
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
        isProcessingRef.current = false;
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
      isProcessingRef.current = false;
    }
  };

  // --- RENDER ---
  return (
    <div className="relative overflow-x-hidden w-full">
      <Toaster />
      {showPaymentInstructions && paymentData ? (
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
      ) : (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white selection:bg-red-500 selection:text-white">
        {/* Toaster removed here as it is now in parent */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
            ⚠️ PROMO TERBATAS - HARGA NAIK DALAM {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Bayangkan Modal <span className="text-5xl md:text-7xl lg:text-8xl text-green-400 animate-pulse">199 RIBU</span>, Raih Ratusan Ribu Per Hari
          </h1>
          
          <div className="text-xl md:text-3xl mb-8 font-semibold space-y-4">
            <p className="text-yellow-400">📚 <span className="text-white">Ebook Rezeki</span> + <span className="text-green-400">Workbook 30 Hari</span> — Ubah Mindset, Ubah Nasib!</p>
            <p className="text-yellow-400">❌ Rezeki seret terus? <span className="text-white">Audio REZEKI Terbukti Narik Rezeki!</span></p>
            <p className="text-yellow-400">❌ Tidak Punya Konten? <span className="text-white">Semua Sudah Disiapkan &amp; Disuapin!</span></p>
            <p className="text-yellow-400">✅ Tugas Anda: <span className="text-green-400">Belajar, Terapkan, Tumbuh Bisnis Anda</span></p>
            <p className="text-gray-300">💰 Tidak Punya Usaha? Bisa Ikut <span className="text-white font-bold">Affiliate 50% Komisi</span> — Sebagai Bonus!</p>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
            ❌ SCAM? Lihat Anggota Kami Sudah <span className="text-green-400 font-bold">3.800++</span> Target <span className="text-yellow-400 font-bold">10.000</span> — Semua Orang Nyata &amp; Terkenal di Dalamnya. Ini Adalah Gerakan Masyarakat dari Founder Kami!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={scrollToCheckout}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xl md:text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
            >
              🔥 SAYA MAU AKSES SEKARANG - MULAI RP199RB
            </button>
            <button
              onClick={() => { const el = document.getElementById('free-ebook-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg font-bold py-6 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎁 Ambil Ebook GRATIS Dulu
            </button>
          </div>
          
          <p className="mt-2 text-sm text-gray-400">
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
            Bukan Jualan 'Strategi.' Tapi <span className="text-yellow-400 font-bold">SISTEM LENGKAP</span> untuk Bisnis &amp; Kehidupan Anda.
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
                  <span>Bikin stres &amp; burnout</span>
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
                  <span><strong>Ebook Rezeki</strong> — Mindset &amp; Sistem Internal Dulu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Workbook 30 Hari</strong> — Panduan harian terstruktur</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Audio Rezeki Bio-Energetik (Paket Bundle)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span>Modal HANYA Rp199.000 (sekali bayar)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>BONUS:</strong> Affiliate 50% — jika tak punya usaha sendiri</span>
                </li>
              </ul>
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
              <div key={idx} className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-yellow-500 transition-all cursor-pointer" onClick={() => setSelectedVideo(testimonial.video)}>
                <div className="relative">
                  <img src={testimonial.poster} alt={testimonial.name} className="w-full h-52 object-cover" />
                  {/* Always-visible play button */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm border-2 border-white/60 rounded-full p-4 hover:bg-white/30 transition-all">
                      <Play size={36} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">▶ VIDEO</div>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold mb-1">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs mb-1">{testimonial.title}</p>
                  <p className="text-gray-300 text-sm italic line-clamp-2">"{testimonial.quote}"</p>
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

      {/* Customer Reviews Section */}
      <section id="reviews-section" className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-purple-600/20 border border-purple-500/40 text-purple-300 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">ULASAN PELANGGAN</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Review Real Customer</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Berikan ulasan dengan memasukkan email kamu.<br />
              Ulasan disensor untuk privasi. Jika sudah membeli, review akan otomatis ditandai <span className="text-green-400 font-semibold">✓ Verified Buyer</span>.<br />
              <strong>Sudah punya ulasan? Masukkan email yang sama untuk mengupdate.</strong>
            </p>
          </div>

          {/* Average Rating Badge */}
          <div className="flex items-center gap-4 mb-8 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
            <div className="text-5xl font-bold text-yellow-400 leading-none">4.8</div>
            <div>
              <div className="flex text-yellow-400 gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= 4 ? 'currentColor' : 'none'} />)}
              </div>
              <div className="text-sm text-gray-300 mt-1">Rating rata-rata dari members Uang Panas</div>
            </div>
          </div>

          {/* Review Input Form */}
          <div className="bg-gray-900 border border-purple-800/40 rounded-2xl p-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Kamu:</label>
                <input
                  type="email"
                  value={anonymousReviewEmail}
                  onChange={e => setAnonymousReviewEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Beri Rating:</div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <Star
                      key={star}
                      size={30}
                      fill={reviewRating >= star ? '#f59e0b' : 'none'}
                      color={reviewRating >= star ? '#f59e0b' : '#6b7280'}
                      className="cursor-pointer transition-all hover:scale-110"
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Tulis pengalaman jujur kamu di sini..."
                className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-purple-500 transition-colors min-h-[100px] resize-none"
              />

              {showUpdateConfirm && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-300 mb-3">Email ini sudah memiliki ulasan. Ingin mengupdate ulasan kamu?</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => submitReview(pendingReviewPayload.email)} className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">Ya, Update</button>
                    <button onClick={() => { setShowUpdateConfirm(false); setPendingReviewPayload(null); }} className="border border-gray-600 text-gray-400 px-5 py-2 rounded-lg text-sm hover:border-gray-400 transition-colors">Batal</button>
                  </div>
                </div>
              )}

              {!showUpdateConfirm && (
                <button
                  onClick={() => submitReview()}
                  disabled={isReviewLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
                >
                  {isReviewLoading ? 'Memproses...' : '⭐ Kirim Ulasan'}
                </button>
              )}
            </div>
          </div>

          {/* Reviews Display */}
          <div className="space-y-4">
            {[...dbReviews, ...MOCK_REVIEWS_UANGPANAS]
              .filter(r => (r.comment || '').trim() !== '')
              .slice(0, showReviewsCount).map((r, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {(() => {
                        const email = r.user_email || r.name || '';
                        const parts = email.split('@');
                        if (parts.length === 2 && !email.includes('***')) {
                          const name = parts[0];
                          const show = Math.max(3, Math.floor(name.length / 2));
                          return `${name.slice(0, show)}***@${parts[1]}`;
                        }
                        return email || 'Member';
                      })()}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#6b7280'} />)}
                      {r.created_at && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    r.is_verified ? 'bg-green-900/40 text-green-400 border border-green-700/40' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {r.is_verified ? '✓ Verified Buyer' : 'Unverified'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mt-2">{r.comment}</p>
              </div>
            ))}

            {[...dbReviews, ...MOCK_REVIEWS_UANGPANAS].length === 0 && (
              <div className="text-center text-gray-600 py-10 border border-gray-800 rounded-xl">
                Belum ada ulasan. Jadilah yang pertama! ⭐
              </div>
            )}
          </div>

          {showReviewsCount < [...dbReviews, ...MOCK_REVIEWS_UANGPANAS].length && (
            <button
              onClick={() => setShowReviewsCount(prev => prev + 10)}
              className="w-full mt-6 border border-purple-700 text-purple-400 hover:bg-purple-900/20 py-3 rounded-xl font-bold transition-all"
            >
              ▾ Tampilkan Review Lainnya ({dbReviews.length - showReviewsCount} lagi)
            </button>
          )}
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
            <p className="text-xl mb-4">Harga Ebook akan NAIK menjadi Rp500.000 setelah timer habis.</p>
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

      {/* Bonus Summary — compact, before payment */}
      <section id="bonuses" className="py-12 px-4 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">APA YANG ANDA DAPAT</div>
            <h2 className="text-2xl font-bold">Total Paket Senilai <span className="text-yellow-400">Rp17.450.000</span></h2>
            <p className="text-gray-500 text-sm mt-1">Semua ini masuk hari ini dengan harga promo</p>
          </div>

          {/* 3 Pillars Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { num: '1', icon: '📚', title: 'Ebook Rezeki + Workbook 30 Hari', desc: 'Blueprint bisnis & protokol harian. Langsung eksekusi, bukan teori.', color: 'border-purple-600' },
              { num: '2', icon: '🎧', title: 'Audio Bio-Energetik (Bundle)', desc: 'Theta 4-7Hz reset frekuensi rezeki. Pagi & malam, 30 menit.', color: 'border-purple-500' },
              { num: '3', icon: '💰', title: 'Affiliate 50% Komisi', desc: 'Opsional — copy-paste 7 lead magnet, komisi langsung ke rekening.', color: 'border-yellow-600' },
            ].map((p, i) => (
              <div key={i} className={`bg-gray-900 border-2 ${p.color} rounded-xl p-4 flex flex-col gap-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon}</span>
                  <span className="font-bold text-white text-sm leading-tight">{p.title}</span>
                </div>
                <p className="text-gray-400 text-xs leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Workbook preview thumbnail */}
          <div className="mb-5 rounded-xl overflow-hidden border border-purple-700/40">
            <div className="bg-purple-900/30 px-3 py-1.5 text-xs font-bold text-purple-300 uppercase tracking-widest">📋 Preview Workbook 30 Hari</div>
            <img src={ssworkbook} alt="Preview Workbook 30 Hari" className="w-full object-cover max-h-56" />
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {[
              { icon: "📚", title: 'Ebook Sistem UANG PANAS', value: "Rp500rb", desc: "Bio-Energetic Calibration + 7 Strategi Affiliate" },
              { icon: "📓", title: "Workbook 30 Hari", value: "Rp350rb", desc: "Protokol Kekacauan & Kedamaian — HTML + Sheets" },
              { icon: "🎧", title: "Audio Bio-Energetik (3x)", value: "Rp3 juta", desc: "Theta 4-7Hz reprogram pikiran bawah sadar" },
              { icon: "🧲", title: "7 Lead Magnet Siap Pakai", value: "Rp5 juta", desc: "Copy-paste langsung — script iklan, TikTok, IG, WA" },
              { icon: "📱", title: "Modul Iklan Organik & Berbayar", value: "Rp2 juta", desc: "FB Ads proven + konten viral TikTok & IG" },
              { icon: "💬", title: "Grup Private Telegram 24/7", value: "Rp1,5 juta", desc: "Support mentor + update strategi terbaru" },
              { icon: "📊", title: "Affiliate Dashboard Selamanya", value: "Rp750rb", desc: "Komisi real-time, withdraw tiap Senin" },
              { icon: "🦍", title: "Gorilla Mindset", value: "Rp250rb", desc: "Mental strength & dominasi pikiran" },
              { icon: "💰", title: "Rahasia Orang Kaya Makin Kaya", value: "Rp200rb", desc: "Pola pikir tersembunyi orang kaya" },
              { icon: "📖", title: "Ringkasan Think & Grow Rich", value: "Rp150rb", desc: "Napoleon Hill — versi Bahasa Indonesia" },
              { icon: "✨", title: "250 Afirmasi Rezeki", value: "Rp150rb", desc: "Perkuat program rezeki bawah sadar" },
              { icon: "📊", title: "Workbook Google Sheets", value: "Rp100rb", desc: "Isi langsung dari HP atau laptop" },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm leading-tight">{b.title}</span>
                    <span className="text-yellow-500 text-xs font-bold flex-shrink-0">{b.value}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-700/50 rounded-2xl p-5 text-center">
            <p className="text-gray-400 text-sm line-through mb-1">Total Nilai: Rp17.450.000</p>
            <p className="text-3xl font-extrabold text-white">Harga Hari Ini: <span className="text-yellow-400">Mulai Rp199.000</span></p>
            <p className="text-green-400 font-semibold text-sm mt-1">Hemat 99% — Promo Terbatas</p>
          </div>
        </div>
      </section>

      {/* Free Ebook Section */}
      <section id="free-ebook-section" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Gift size={16} /> GRATIS — Tidak Perlu Bayar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Coba Dulu <span className="text-yellow-400">GRATIS</span>!
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Dapatkan <strong className="text-white">"3 Rahasia Rezeki yang Tidak Diajarkan di Sekolah"</strong> — ebook gratis eksklusif dari Founder eL Vision.
              <br /><span className="text-yellow-400 text-sm">Masukkan data kamu dan ebook langsung dikirim via WhatsApp &amp; Email.</span>
            </p>
          </div>

          {freeSent ? (
            <div className="bg-green-900/30 border-2 border-green-500 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Ebook Gratis Terkirim!</h3>
              <p className="text-gray-300">Cek WhatsApp dan Email kamu ya. Kalau belum masuk dalam 2 menit, hubungi admin kami.</p>
              <button
                onClick={scrollToCheckout}
                className="mt-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all"
              >
                🔥 Mau Akses Full — Mulai Rp199.000
              </button>
            </div>
          ) : (
            <Card className="border-2 border-yellow-600/50 shadow-2xl overflow-hidden rounded-2xl bg-gray-900 text-white">
              <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 text-white p-4 text-center">
                <p className="font-bold text-lg flex items-center justify-center gap-2">
                  <BookOpen size={20} /> Ebook Gratis: 3 Rahasia Rezeki
                </p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="free-name" className="text-gray-300 font-semibold mb-1 block">Nama Lengkap</Label>
                  <Input
                    id="free-name"
                    placeholder="Nama kamu..."
                    value={freeFormName}
                    onChange={(e) => setFreeFormName(e.target.value)}
                    className="text-white bg-black border-gray-700 focus:border-yellow-500 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="free-email" className="text-gray-300 font-semibold mb-1 block">Email</Label>
                  <Input
                    id="free-email"
                    type="email"
                    placeholder="email@kamu.com"
                    value={freeFormEmail}
                    onChange={(e) => setFreeFormEmail(e.target.value)}
                    className="text-white bg-black border-gray-700 focus:border-yellow-500 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="free-phone" className="text-gray-300 font-semibold mb-1 block">Nomor WhatsApp</Label>
                  <Input
                    id="free-phone"
                    type="tel"
                    placeholder="0812..."
                    value={freeFormPhone}
                    onChange={(e) => setFreeFormPhone(e.target.value)}
                    className="text-white bg-black border-gray-700 focus:border-yellow-500 h-12"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-black/50 border-t border-gray-800">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-xl transition-all hover:scale-[1.02]"
                  onClick={async () => {
                    if (!freeFormName || !freeFormEmail || !freeFormPhone) {
                      toast({ title: 'Data Kosong', description: 'Mohon isi nama, email, dan no. WhatsApp.', variant: 'destructive' });
                      return;
                    }
                    setFreeLoading(true);
                    try {
                      const { error } = await supabase.functions.invoke('send-ebooks-free', {
                        body: {
                          userEmail: freeFormEmail,
                          userName: freeFormName,
                          phone: freeFormPhone,
                          id: 'free_ebook_uangpanas'
                        }
                      });
                      if (error) throw error;
                      setFreeSent(true);
                      toast({ title: '🎉 Berhasil!', description: 'Ebook gratis sudah dikirim ke WhatsApp & Email kamu.' });
                    } catch (err: any) {
                      toast({ title: 'Gagal Kirim', description: err.message || 'Terjadi kesalahan, coba lagi.', variant: 'destructive' });
                    } finally {
                      setFreeLoading(false);
                    }
                  }}
                  disabled={freeLoading}
                >
                  {freeLoading ? 'Mengirim...' : '🎁 KIRIM EBOOK GRATIS SEKARANG'}
                </Button>
              </CardFooter>
            </Card>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Sudah baca ebook gratis? <button onClick={scrollToCheckout} className="text-purple-400 underline font-semibold hover:text-purple-300 transition-colors">Akses versi lengkap mulai Rp199rb →</button>
          </p>
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
              🔥 YA, SAYA MAU AKSES SEKARANG - MULAI RP199RB
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
                Saya beri Anda akses hari ini mulai Rp199rb, karena <span className="text-yellow-400 font-bold">REZEKI ANDA ADALAH REZEKI SAYA JUGA.</span>
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
                    {/* Tier Selector */}
                    <div className="space-y-3">
                        <p className="text-white font-bold text-lg text-center mb-2">Pilih Paket Anda:</p>
                        <div
                            onClick={() => setSelectedTier('basic')}
                            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${selectedTier === 'basic' ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-bold text-white text-lg">Ebook Uang Panas</p>
                                <p className="text-green-400 font-extrabold text-2xl">Rp199.000</p>
                            </div>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Ebook Sistem Uang Panas lengkap</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> 7 Lead Magnet siap pakai</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Workbook 30 Hari</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> Akses Affiliate 50% komisi</li>
                            </ul>
                        </div>
                        <div
                            onClick={() => setSelectedTier('bundle')}
                            className={`cursor-pointer rounded-xl border-2 p-5 transition-all relative ${selectedTier === 'bundle' ? 'border-yellow-500 bg-yellow-900/20' : 'border-gray-700 bg-gray-800 hover:border-yellow-600'}`}
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">PALING LARIS</div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-bold text-white text-lg">Ebook + Audio Rezeki</p>
                                <p className="text-yellow-400 font-extrabold text-2xl">Rp299.000</p>
                            </div>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400 flex-shrink-0" /> Semua isi paket Ebook</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400 flex-shrink-0" /> Audio Rezeki Pagi + Malam (Bio-Energetik)</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400 flex-shrink-0" /> Teknologi Brainwave Theta 4-7Hz</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400 flex-shrink-0" /> Garansi Uang Kembali jika tidak ada manfaat</li>
                            </ul>
                        </div>
                    </div>

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
                            <CreditCard className="w-5 h-5 text-purple-400" /> Metode Pembayaran
                        </h3>

                        {/* Main 9 methods grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ALL_PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method.code}
                                    onClick={() => { setSelectedPaymentMethod(method.code); setRetailOpen(false); }}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                                        selectedPaymentMethod === method.code
                                            ? 'border-purple-500 bg-purple-900/20'
                                            : 'border-gray-800 bg-black hover:border-gray-600'
                                    }`}
                                >
                                    <div className="font-bold text-white text-sm">{method.name}</div>
                                    <div className={`text-xs mt-0.5 ${method.highlight ? 'text-yellow-400' : 'text-gray-500'}`}>{method.description}</div>
                                </div>
                            ))}

                            {/* Retail Dropdown Trigger */}
                            <div
                                onClick={() => setRetailOpen(!retailOpen)}
                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all select-none col-span-1 ${
                                    ['INDOMARET','ALFAMART','ALFAMIDI'].includes(selectedPaymentMethod)
                                        ? 'border-purple-500 bg-purple-900/20'
                                        : 'border-gray-800 bg-black hover:border-gray-600'
                                }`}
                            >
                                <div className="font-bold text-white text-sm">Retail ▾</div>
                                <div className="text-xs mt-0.5 text-gray-500">Indomaret, Alfamart, Alfamidi</div>
                            </div>
                        </div>

                        {/* Retail sub-options */}
                        {retailOpen && (
                            <div className="grid grid-cols-3 gap-3 mt-2 p-3 bg-purple-900/10 border border-purple-800/30 rounded-xl">
                                {RETAIL_METHODS.map((method) => (
                                    <div
                                        key={method.code}
                                        onClick={() => setSelectedPaymentMethod(method.code)}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                                            selectedPaymentMethod === method.code
                                                ? 'border-purple-500 bg-purple-900/20'
                                                : 'border-gray-800 bg-black hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="font-bold text-white text-sm">{method.name}</div>
                                        <div className="text-xs mt-0.5 text-gray-500">{method.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
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
          🔥 BELI SEKARANG - MULAI RP199RB
        </button>
      </div>

      {/* Video Modal */}
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
    )}
    </div>
  );
}