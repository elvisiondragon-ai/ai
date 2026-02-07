import { useEffect, useRef, useState } from 'react';
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
import { ArrowLeft, Copy, CreditCard, User, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

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

const WebinarIbuIstri = () => {
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('QRIS');
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
    
    // Hardcoded for this specific webinar (MUST REMAIN IDENTICAL)
    const productNameBackend = 'webinar_el'; 
    const displayProductName = 'Webinar Re-Ignite Marriage';
    const productPrice = 199999;
    const pixelId = '3319324491540889'; 

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

    // Helper to send CAPI events (IDENTICAL LOGIC)
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
          pixelId,
          eventName,
          customData: eventData,
          eventId: eventId,
          eventSourceUrl: window.location.href,
          testCode: 'testcode_indo'
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
        const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
        if (fbIdentity) {
          userData.db_id = fbIdentity.id;
        }

        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;
        
        body.userData = userData;

        console.log(`🚀 Sending CAPI Event: ${eventName}`, body);

        // IDENTICAL URL ENDPOINT
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

    // Pixel Tracking (PageView & ViewContent)
    useEffect(() => {
      const initPixel = async () => {
        if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
          hasFiredPixelsRef.current = true;
          
          const { data: { session } } = await supabase.auth.getSession();
          const { fbc, fbp } = getFbcFbpCookies();
          
          const userData: AdvancedMatchingData = {};
          
          if (session?.user?.id) {
            userData.external_id = session.user.id;
          }
          
          const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
          if (fbIdentity) {
            userData.db_id = fbIdentity.id;
          }
          
          if (fbc) userData.fbc = fbc;
          if (fbp) userData.fbp = fbp;

          initFacebookPixelWithLogging(pixelId, userData);

          // 1. PageView
          const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'testcode_indo');

          // 2. ViewContent
          const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          trackViewContentEvent({
            content_name: displayProductName,
            content_ids: [productNameBackend],
            content_type: 'product',
            value: productPrice,
            currency: 'IDR'
          }, viewContentEventId, pixelId, userData, 'testcode_indo');
        }
      };

      initPixel();
    }, []);

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
             // Track AddPaymentInfo (Only once) - IDENTICAL LOGIC
             if (!addPaymentInfoFiredRef.current) {
                addPaymentInfoFiredRef.current = true;
                const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                
                sendCapiEvent('AddPaymentInfo', {
                  content_ids: [productNameBackend],
                  content_type: 'product',
                  value: productPrice,
                  currency: 'IDR'
                }, addPaymentInfoEventId);
            }

            const { fbc, fbp } = getFbcFbpCookies();

            // IDENTICAL URL ENDPOINT
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
                body: {
                  subscriptionType: productNameBackend,
                  paymentMethod: selectedPaymentMethod,
                  userName: userName,
                  userEmail: userEmail,
                  phoneNumber: phoneNumber,
                  amount: productPrice,
                  quantity: 1,
                  productName: displayProductName,
                  userId: null, // No auth required
                  fbc,
                  fbp
                }
            });

            if (error || !data?.success) {
                let errorMessage = data?.error || error?.message || "Terjadi kesalahan sistem.";
                if (data?.details?.message) {
                     errorMessage = data.details.message;
                     if (errorMessage.includes("Invalid customer email")) {
                         errorMessage = "Format email tidak valid.";
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
                  description: "Pembayaran berhasil. Cek email Anda sekarang untuk akses Webinar.",
                  duration: 5000, 
                  variant: "default"
              });
            }
          }).subscribe();
    
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    // ==========================================
    // 📝 STRATEGI COPYWRITING: ISTRI KESEPIAN (ROOMMATE SYNDROME)
    // TONE: POLARISM YANG SOPAN, MENYENTUH, NAMUN TEGAS
    // ==========================================
    const content = {
        // 1. TARGET BADGE
        targetBadge: "KHUSUS ISTRI YANG MERASA SENDIRIAN DALAM PERNIKAHAN",
        
        // 2. HERO SECTION
        headline: "Satu Atap, Satu Ranjang, Tapi Terasa Asing... Apakah Pernikahan Anda Sudah Berubah Menjadi 'Teman Kost'?",
        subheadline: "Dulu dia mengejar Anda mati-matian. Sekarang? Bicara hanya seperlunya, sentuhan makin jarang, dan Anda mulai bertanya: 'Apakah dia masih mencintai saya, atau hanya bertahan demi anak?'",

        // 3. PAIN SECTION (THE VOICES)
        painTitle: "Bun, Jujur... Apakah Hati Kecil Anda Menjerit Seperti Ini?",
        painPoints: [
            { icon: "🧊", text: <span><strong>"Suami Dingin & Cuek."</strong> Pulang kerja langsung main HP atau tidur. Kalau diajak bicara, jawabnya singkat. Anda merasa tidak dianggap ada.</span> },
            { icon: "🏚️", text: <span><strong>"Roommate Syndrome."</strong> Hubungan terasa hambar. Urusan ranjang jadi kewajiban (atau malah jarang terjadi). Chemistry hilang entah kemana.</span> },
            { icon: "🤐", text: <span><strong>"Komunikasi Buntu."</strong> Setiap mau bahas perasaan, dia bilang 'Kamu drama banget' atau menghindar. Akhirnya Anda memendam sakit sendirian.</span> }
        ],

        // 4. LOGIC TRAP
        logicTitle: "Jebakan 'Istri Penurut & Sabar'",
        logicDescription: "Banyak istri berpikir: <em>'Kalau saya diam, sabar, dan melayani lebih baik, dia pasti sadar dan berubah.'</em><br/><br/><strong>MAAF BUN, ITU KELIRU.</strong><br/>Dalam psikologi pria, 'diam'-nya Anda seringkali diartikan sebagai 'semua baik-baik saja'. Semakin Anda pasif dan memendam, semakin dia nyaman dalam ketidakpeduliannya. Anda perlu 'Getaran Baru' untuk membangunkannya.",

        // 5. AGITATION (THE METAPHOR - PAINFUL TRUTH)
        agitationTitle: "BAHAYA TERSEMBUNYI: 'Silent Divorce'",
        agitationText: [
            "Tahukah Bunda? Perselingkuhan jarang dimulai dari nafsu, tapi dari <strong>KESEPIAN</strong> dan kebutuhan validasi yang tidak terpenuhi di rumah.",
            "Saat rumah terasa dingin, suami (dan istri) rentan mencari 'kehangatan' di luar. Bukan karena dia jahat, tapi karena manusia butuh merasa 'hidup' dan dihargai.",
            "Jika Anda terus membiarkan 'Roommate Syndrome' ini, pilihannya hanya dua: <strong>Bercerai secara hukum</strong>, atau <strong>'Mati Rasa' selamanya</strong> (Pernikahan Zombie)."
        ],
        agitationBullets: [
            { trigger: "Anda Terlalu Menuntut?", result: "Dia makin menjauh." },
            { trigger: "Anda Terlalu Pasrah?", result: "Dia meremehkan Anda." },
            { trigger: "Anda Diam Saja?", result: "Bom waktu siap meledak." }
        ],
        agitationClosing: "Sampai kapan Bunda mau menangis di balik bantal setiap malam?",

        // 6. THE SHIFT (SOLUTION)
        shiftTitle: "Jadilah Istri yang 'Dirindukan', Bukan Sekadar 'Dibutuhkan'",
        shiftDescription: "Webinar ini BUKAN tentang cara masak enak atau dandan heboh. Kita akan membongkar <strong>Psikologi Bawah Sadar Suami</strong> dan cara mengaktifkan kembali 'Hero Instinct' dia agar kembali mengejar dan memuja Anda.",
        shiftResults: [
            "✅ Mengubah aura 'Ngomel' menjadi aura 'Ratu' yang disegani suami.",
            "✅ Teknik komunikasi yang membuat suami mendengar & terbuka tanpa merasa dipojokkan.",
            "✅ Menyalakan kembali api gairah yang sempat padam, meski sudah bertahun-tahun menikah."
        ],

        // 7. WEBINAR DETAILS
        webinarTitle: 'WEBINAR: "RE-IGNITE MARRIAGE (MENYALAKAN KEMBALI API CINTA)"',
        eventDate: "Setiap Minggu (Weekly - 4 Sesi), 17:00 WIB", // Identical Date & Time
        curriculum: [
            { title: 'The Wife-Queen Energy', desc: 'Berhenti menjadi "pembantu" atau "ibu kedua" bagi suami. Jadilah Ratu yang ia banggakan.' },
            { title: 'Decoding Husband’s Silence', desc: 'Memahami arti diamnya suami dan cara masuk ke pikirannya tanpa drama.' },
            { title: 'Emotional Reconnection', desc: 'Teknik sederhana namun powerful untuk membuat dia kangen dan ingin cepat pulang ke rumah.' }
        ],

        // 8. PRICING & CTA
        priceAnchor: "Rp 5.000.000,-",
        priceReal: "Rp 199.999,-",
        ctaButton: "👉 SAYA INGIN RUMAH TANGGA HANGAT KEMBALI",

        // 9. STEPS
        steps: [
            { title: "Langkah 1: Amankan Hati", desc: "Daftar sekarang. Investasi Rp 199.999,- untuk menyelamatkan puluhan tahun masa depan pernikahan." },
            { title: "Langkah 2: Gabung Circle Istri", desc: "Masuk ke grup VIP, bertemu para istri yang saling menguatkan, bukan saling menjatuhkan." },
            { title: "Langkah 3: Live Terapi", desc: "Hadir Setiap Minggu via Zoom selama 4 sesi. Kita akan lakukan terapi massal untuk melepas beban hati Bunda." }
        ],

        // 10. FAQ
        faq: [
            { q: "Suami saya wataknya keras, apa bisa berubah?", a: "Bisa. Watak keras seringkali adalah benteng pertahanan. Saat Bunda mengubah frekuensi pendekatan (dari menyerang ke memikat), benteng itu akan runtuh dengan sendirinya." },
            { q: "Apa suami perlu ikut webinar ini?", a: "TIDAK PERLU. Perubahan satu orang (Bunda) sudah cukup untuk mengubah dinamika seluruh rumah tangga. Jadilah pionir perubahan itu." },
            { q: "Saya sudah mau menyerah, apakah ini berguna?", a: "Sangat. Sebelum mengambil keputusan besar (cerai), pastikan Bunda sudah mencoba metode yang 'benar'. Webinar ini akan memberi kejelasan arah." },
            { q: "Apakah ini diajari cara melayani suami?", a: "Bukan melayani secara fisik, tapi menyentuh EGO dan JIWA laki-laki. Ini jauh lebih powerful daripada sekadar pelayanan fisik." }
        ]
    };

    // ==========================================
    // 🖼️ MEDIA ASSETS (IDENTICAL LINKS AS REQUESTED)
    // ==========================================
    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

    // Full Video Testimonials (IDENTICAL ARRAY & LINKS)
    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Hipnoterapist", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Tokoh Masyarakat", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Yayasan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "👳‍♀️" },
        { name: "Felicia", title: "Pengusaha", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];

    // Full Text Testimonials (Contextualized for Wife/Family)
    const testimonials = [
        { name: "Ibu Arif (Via Suami)", title: "Ibu Rumah Tangga", verified: true, image: "👩‍❤️‍👨", rating: 5, text: "Istri saya ikut program ini, dan perubahannya luar biasa. Rumah tangga kami yang di ujung tanduk kini harmonis kembali. Saya merasa dihargai lagi sebagai suami." },
        { name: "Felicia Quincy", title: "Pengusaha & Istri", verified: true, image: "👩‍💼", rating: 5, text: "Dulu saya dominan dan suami jadi minder. Di sini saya belajar menjadi istri yang kuat tapi tetap lembut. Suami sekarang jadi lebih manja dan terbuka." },
        { name: "Umi Jamilah", title: "Pemimpin Yayasan", verified: true, image: "🌟", rating: 5, text: "Ketenangan hati seorang ibu adalah nyawa rumah tangga. Saat saya tenang, suami dan anak-anak pun ikut tenang. Terima kasih eL Vision." },
        { name: "Vio", title: "Klien eL Vision", verified: true, image: "✨", rating: 5, text: "Tadinya saya pikir suami saya selingkuh karena cuek. Ternyata dia cuma lelah mental. Setelah saya ubah pendekatan, dia kembali hangat seperti pengantin baru." },
        { name: "Lena", title: "Klien eL Vision", verified: true, image: "💎", rating: 5, text: "Metode yang sangat logis. Saya sadar selama ini saya 'menuntut' dengan cara yang salah. Sekarang komunikasi kami lancar tanpa urat leher tegang." },
        { name: "Linda Permata", title: "Investor Real Estate", image: "👩‍💼", rating: 5, text: "Saya belajar menyeimbangkan karir dan peran sebagai istri. Suami makin support karir saya karena saya tidak melupakan 'rasa' sebagai istrinya." },
        { name: "Dr. Gumilar", title: "Dokter & Hipnoterapis", verified: true, image: "⚕️", rating: 5, text: "Emosi istri adalah cuaca di rumah. Program ini membantu para istri mengelola cuaca itu agar selalu cerah dan menyejukkan." },
        { name: "Agus Mulyadi", title: "Klien eL Vision", verified: true, image: "👨‍💼", rating: 5, text: "Intuisi dan ketenangan meningkat tajam. Sangat berpengaruh dalam pengambilan keputusan besar dalam keluarga." }
    ];

    return (
      <div className="relative">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', padding: '20px' }}>Maaf Pendaftaran Tutup</div>
        <Toaster />
        {showPaymentInstructions && paymentData ? (
          <div className="min-h-screen bg-purple-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-purple-100">
              <div className="p-4 bg-violet-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-violet-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Tagihan</p>
                    <p className="text-3xl font-bold text-violet-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium border border-violet-200">
                        Menunggu Pembayaran
                    </div>
                </div>
    
                <Card className="border-2 border-slate-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                        <Label className="text-slate-500">Nomor Referensi</Label>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-mono text-sm text-violet-600">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-slate-400 hover:text-violet-600">
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
                                <span className="font-mono text-xl font-bold tracking-wider text-violet-600">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-violet-600">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-purple-50 p-3 rounded text-sm text-purple-800 border border-purple-100">
                        <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                   <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Webinar Re-Ignite ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                       Bantuan Admin
                   </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)", // Light Purple/Violet background (THEME CHANGE)
            color: "#334155", // Dark text
            lineHeight: 1.6
        }}>
            {/* Toaster removed here as it is now in parent */}
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER LOGO */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#7c3aed", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>eL Vision Perfect Reality Alignment protocol</div>
                </div>

                {/* Description Box */}
                <div style={{ 
                    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                    border: "2px solid #e2e8f0",
                    padding: "35px", 
                    borderRadius: "30px", 
                    marginBottom: "40px", 
                    textAlign: "left",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}>
                    <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", color: "#1e293b", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px" }}>The Perfect Reality Alignment Protocol</h3>
                    <p style={{ fontSize: "20px", fontWeight: 800, marginBottom: "15px", color: "#dc2626" }}>Apa itu?</p>
                    <div style={{ fontSize: "16px", lineHeight: "1.8", color: "#475569", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <p>Saya menghabiskan 16 tahun mencari tahu: <strong>"Kenapa makin kita ngoyo mengejar sesuatu, malah makin susah dapatnya?"</strong></p>
                        
                        <p style={{ padding: "15px", background: "#f1f5f9", borderRadius: "15px", borderLeft: "5px solid #3b82f6", fontStyle: "italic" }}>
                            Ini seperti kamu ingin pergi ke Taman Bermain, tapi kakimu malah berjalan ke arah Sekolah. Pasti nggak sampai-sampai, kan?
                        </p>

                        <p>Jawabannya satu: <strong>Karena Anda sedang perang batin, jadinya tidak akan pernah sampai, salah arah.</strong></p>

                        <p>Pikiran Anda ingin kaya, tapi hati Anda merasa kekurangan. Selama dua ini tidak akur, hidup akan terasa berat.</p>

                        <p>Di sesi mingguan ini, kita akan mendamaikan perang itu. Kita akan <strong>"reset"</strong> perasaan Anda dari yang tadinya cemas mengejar target, menjadi tenang and pasrah.</p>

                        <p style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>
                            Hasilnya? Beban di dada hilang seketika. Anda akan merasa bahagia seolah-olah impian itu sudah di tangan. Dan anehnya, saat Anda berhenti cemas, jalan sukses justru terbuka lebar dengan cepat.
                        </p>
                    </div>
                </div>

                {/* VSL Video Section */}
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "15px", color: "#1e293b" }}>Tonton Ini Selengkap nya !</h2>
                    <video 
                        controls 
                        playsInline 
                        poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/el_vsl1.png" 
                        style={{ 
                            width: "100%", 
                            maxWidth: "320px", 
                            margin: "0 auto", 
                            borderRadius: "20px", 
                            aspectRatio: "9/16", 
                            objectFit: "cover", 
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
                            border: "1px solid #e2e8f0", 
                            backgroundColor: "#000" 
                        }}
                    >
                        <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/el_vsl1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 2. HERO HEADLINE */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#ffffff", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                    <span style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "10px 25px", borderRadius: "50px", fontSize: "16px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "1px solid #7c3aed" }}>
                        {content.targetBadge}
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e293b", marginBottom: "15px", lineHeight: 1.3 }}>{content.headline}</h1>
                    <p style={{ fontSize: "16px", color: "#475569", marginBottom: "0px", lineHeight: 1.6 }}>{content.subheadline}</p>
                    <div style={{ marginTop: "20px", background: "rgba(0,0,0,0.05)", display: "inline-block", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>
                        🗓️ Event: <strong>{content.eventDate}</strong>
                    </div>
                </div>

                {/* 3. PAIN SECTION */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #8b5cf6", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#7c3aed", marginBottom: "20px" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: '#f5f3ff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
                                <div style={{ fontSize: '24px', marginBottom: '10px', color: '#7c3aed' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#4b5563' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#9333ea" }}>{content.logicTitle}</h2>
                    <div style={{ background: "rgba(220, 38, 38, 0.05)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #f43f5e", color: "#9f1239" }}>
                        <p dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                {/* 5. AGITATION (HIGHLIGHT) */}
                <div style={{ background: "#ffffff", color: "#1e293b", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#7c3aed" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px", color: "#475569" }} dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <div style={{ background: "rgba(124, 58, 237, 0.05)", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: idx === 1 ? "10px 0" : "0", color: "#475569" }}>{bullet.trigger} 👉 <strong style={{color: "#7c3aed"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>{content.agitationClosing}</p>
                </div>

                {/* 6. SOLUTION */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginBottom: "20px", textAlign: "center" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "20px", textAlign: "center", color: "#475569" }} dangerouslySetInnerHTML={{ __html: content.shiftDescription }} />
                    <div style={{ padding: "15px", background: "rgba(139, 92, 246, 0.1)", borderRadius: "15px", border: "1px solid rgba(139, 92, 246, 0.3)", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#7c3aed", marginBottom: "10px", textAlign: "center" }}>✨ SETELAH WEBINAR INI:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "8px 0", borderBottom: idx !== 2 ? "1px dashed rgba(139, 92, 246, 0.3)" : "none", color: "#1e293b" }} dangerouslySetInnerHTML={{ __html: res }} />
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 7. AUTHORITY */}
                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src={founderImages[0]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src={founderImages[1]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#7c3aed", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#334155", textAlign: "center" }}>Selama 16 tahun, saya meneliti bagaimana <strong>Alam Bawah Sadar</strong> mengendalikan 95% keputusan cinta kita. Saya bukan mak comblang. Saya adalah "Teknisi Pikiran" Anda.</p>
                    <div style={{ background: "#f5f3ff", color: "#7c3aed", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "14px", fontWeight: "bold", border: "1px solid #ddd6fe" }}>"Bahagia Adalah Pilihan, Bukan Kebetulan"</div>
                </div>

                {/* 8. VIDEO TESTIMONIALS (IDENTICAL AS REQUESTED) */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Apa Kata Mereka?</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "#ffffff", borderRadius: "15px", padding: "15px", scrollSnapAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#f0f4f8" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#7c3aed" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. TEXT TESTIMONIALS */}
                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Kisah Perubahan Nyata</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
                            <div style={{ fontWeight: 700, color: "#7c3aed", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#34d399'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#475569" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 10. CURRICULUM */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #7c3aed", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <div style={{ background: "#7c3aed", color: "#fff", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b" }}>{content.webinarTitle}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {content.curriculum.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, border: "1px solid #7c3aed" }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#7c3aed" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#475569" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#1e293b", textAlign: "center" }}>Cara Bergabung</h2>
                    <div style={{ position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#e2e8f0" }}></div>
                        
                        {content.steps.map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid #f5f3ff" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#7c3aed", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#475569", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW SECTION: Apa yang saya dapat */}
                <div style={{ background: "#fdf4ff", padding: "35px 25px", borderRadius: "30px", marginBottom: "40px", border: "2px dashed #7c3aed", textAlign: "center", boxShadow: "0 10px 25px rgba(124, 58, 237, 0.1)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", color: "#6d28d9", textTransform: "uppercase", letterSpacing: "1px" }}>Apa yang saya dapat jika Ikut Protokol 4 sesi ini?</h2>
                    
                    <div style={{ fontSize: "17px", lineHeight: "1.7", color: "#5b21b6", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <p><strong>Bunda akan menjadi Istri yang "Dicari" suami, bukan sekadar "Dibutuhkan".</strong></p>
                        
                        <p>Kita akan bangkitkan kembali "Goddess Energy" yang tertimbun rutinitas rumah tangga. Suami akan merasakan getaran hangat yang membuatnya betah di rumah. Bukan karena Bunda dandan menor, tapi karena aura Bunda memancarkan pesona yang tak bisa ditolak.</p>
                        
                        <div style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #c4b5fd", marginTop: "10px" }}>
                            <p style={{ fontStyle: "italic", fontWeight: "600", color: "#7c3aed", margin: 0 }}>
                                "Bayangkan suami pulang kerja langsung mencari Bunda untuk ngobrol, bukan main HP. Bayangkan tatapan matanya kembali berbinar seperti saat pacaran dulu. Jangan biarkan pernikahan menjadi 'kuburan cinta'. Hidupkan lagi apinya sekarang."
                            </p>
                        </div>

                        <p style={{ fontSize: "14px", marginTop: "10px", color: "#6d28d9", fontWeight: "bold" }}>👉 Selamatkan kehangatan rumah tangga Bunda hari ini.</p>
                    </div>
                </div>

                {/* 12. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ marginTop: "20px", fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Keselamatan Keluarga</h2>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>Harga normal untuk konsultasi private:</p>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#94a3b8", marginBottom: "5px" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#7c3aed", marginBottom: "10px" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "30px" }}>(Lebih murah dari sekali makan malam keluarga)</p>
                    </div>

                    <div style={{ background: "#fffbeb", border: "1px dashed #7c3aed", padding: "15px", borderRadius: "15px", marginBottom: "30px", textAlign: "left" }}>
                        <p style={{ fontSize: "14px", color: "#6d28d9", fontWeight: "bold", marginBottom: "5px" }}>🎁 BONUS EKSKLUSIF LANGSUNG:</p>
                        <p style={{ fontSize: "13px", color: "#7c3aed", lineHeight: "1.5" }}>Anda juga mendapatkan <strong>Ebook eL Vision Pro + Audio Hipnosis Set</strong> selama menunggu Webinar yang bisa anda praktekan langsung untuk hasil instan.</p>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-violet-600">
                                <User className="w-5 h-5" /> Data Diri
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        autoComplete="name"
                                        placeholder="Contoh: Bunda Sarah" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-violet-500 h-12"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email" className="text-slate-300 font-semibold mb-1 block">Alamat Email (PENTING)</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            autoComplete="email"
                                            placeholder="Untuk link webinar" 
                                            value={userEmail} 
                                            onChange={(e) => setUserEmail(e.target.value)} 
                                            className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-violet-500 h-12"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-slate-300 font-semibold mb-1 block">Nomor WhatsApp</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            autoComplete="tel"
                                            placeholder="0812xxxx" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)} 
                                            className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-violet-500 h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-violet-600">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-violet-500 bg-violet-50 shadow-md ring-1 ring-violet-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-violet-600" />
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-800 text-lg">{method.name}</div>
                                            <div className="text-sm text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            size="lg" 
                            className="w-full text-lg py-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white border-none mt-6"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : content.ctaButton}
                        </Button>
                        
                         <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium mt-4">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-600" /> Secure Payment
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-blue-600" /> Instant Access
                            </div>
                        </div>
                    </div>
                </div>

                {/* 13. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b", textAlign: "center" }}>Pertanyaan Sering Diajukan</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {content.faq.map((item, idx) => (
                            <div key={idx} style={{ background: "#ffffff", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                                <div style={{ color: "#7c3aed", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
                                <div style={{ color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Testimonials Grid */}
                <section className="py-20 px-4 bg-black border-t border-gray-900 rounded-[30px] mt-10 text-center">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Testimoni Komunitas</h2>
                        <p className="text-gray-400 mb-12">karena begitu banyak testimony, hanya sebagian kami selipkan disini</p>
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 text-left">
                            {communityTestimonials.map((img, idx) => (
                                <div key={idx} className="break-inside-avoid rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-colors bg-gray-900">
                                    <img src={img} alt={`Testimoni ${idx + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#64748b", fontSize: "12px", background: "transparent" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#334155" }}>eL Vision Group</p>
                    <p style={{ color: "#475569" }}>"Bahagia Adalah Koentji"</p>
                </div>
            </div>
        </div>
        )}
      </div>
    );
};

export default WebinarIbuIstri;