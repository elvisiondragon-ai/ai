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

const WebinarOrtuAnak = () => {
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
    
    // Hardcoded for this specific webinar (MUST REMAIN IDENTIC)
    const productNameBackend = 'webinar_el'; 
    const displayProductName = 'Webinar Parenting: Memulihkan Hati yang Tersekat';
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

    // Helper to send CAPI events (ONLY FOR ADDPAYMENTINFO AS REQUESTED)
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

    // Pixel Tracking (PageView & ViewContent ONLY)
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

          // 1. PageView (PIXEL ONLY)
          const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'testcode_indo');

          // 2. ViewContent (PIXEL ONLY)
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
             // Track AddPaymentInfo (CAPI ONLY - As Requested)
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

    // Realtime Payment Listener (Polling Fallback)
    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        
        const checkStatus = async () => {
            const { data } = await supabase
                .from('global_product')
                .select('status')
                .eq('tripay_reference', paymentData.tripay_reference)
                .maybeSingle();
            
            if (data && (data as any).status === 'PAID') {
                if (purchaseFiredRef.current) return;
                purchaseFiredRef.current = true;

                toast({
                    title: "LUNAS! Akses Dikirim.",
                    description: "Pembayaran berhasil. Cek email Anda sekarang untuk akses Webinar.",
                    duration: 5000, 
                    variant: "default"
                });
            }
        };

        // Check immediately
        checkStatus();

        // Check every 5 seconds
        const intervalId = setInterval(checkStatus, 5000);

        return () => clearInterval(intervalId);
    }, [showPaymentInstructions, paymentData]);

    // ==========================================
    // 📝 STRATEGI COPYWRITING: PARENTING (HEALING/CONNECTION)
    // ==========================================
    const content = {
        // 1. TARGET BADGE
        targetBadge: "KHUSUS ORANG TUA YANG MERASA 'KEHILANGAN' ANAKNYA",
        
        // 2. HERO SECTION
        headline: "Sudah Berkorban Segalanya, Tapi Kenapa Di Mata Anak Anda Tetap 'Salah'?",
        subheadline: "Anda memberi makan, rumah, dan pendidikan terbaik. Tapi balasannya hanya pintu kamar yang tertutup, kebisuan yang menyakitkan, dan tatapan seperti orang asing.",

        // 3. PAIN SECTION (THE VOICES)
        painTitle: "Apakah Kebisuan Ini Terjadi di Rumah Anda?",
        painPoints: [
            { icon: "🚪", text: <span><strong>"Anak Jadi Orang Asing."</strong> Dulu manja dan ceria, sekarang pulang sekolah langsung masuk kamar. Ditanya sepatah, dijawab 'terserah'.</span> },
            { icon: "💥", text: <span><strong>"Setiap Ngobrol Jadi Perang."</strong> Niat hati menasehati demi kebaikan, ujung-ujungnya dibentak atau dibilang 'Papa/Mama gak ngerti aku!'.</span> },
            { icon: "😢", text: <span><strong>"Merasa Gagal Jadi Orang Tua."</strong> Melihat anak orang lain bisa dekat dengan orang tuanya, hati Anda hancur. <em>'Salah saya di mana?'</em></span> }
        ],

        // 4. LOGIC TRAP
        logicTitle: "Jebakan 'Saya Orang Tua, Saya Pasti Benar'",
        logicDescription: "Ego kita berkata: <em>'Saya yang cari uang, saya yang membesarkan, saya yang berhak mengatur!'</em><br/><br/><strong>HATI-HATI, PAK/BU.</strong><br/>Semakin keras Anda menggenggam pasir, semakin cepat pasir itu habis. Semakin keras Anda memaksa anak dengan 'otoritas', semakin cepat mereka menyusun rencana untuk meninggalkan Anda selamanya.",

        // 5. AGITATION (THE METAPHOR)
        agitationTitle: "THE SILENT WALL: Tembok Kebisuan",
        agitationText: [
            "Tahukah Anda? Anak yang 'memberontak' sebenarnya sedang berteriak minta tolong. Tapi jika teriakan itu tidak didengar, mereka akan membangun <strong>Tembok Kebisuan</strong>.",
            "Saat tembok itu sudah tinggi, tidak ada lagi akses masuk. Anda akan menjadi orang asing yang hanya dibutuhkan dompetnya, tapi tidak dibutuhkan hatinya.",
            "Bayangkan 5 tahun lagi, anak Anda menikah, dan Anda hanya jadi 'tamu undangan' karena batin mereka masih menyimpan luka pengasuhan."
        ],
        agitationBullets: [
            { trigger: "Anda Terlalu Mengatur?", result: "Anak jadi pembohong ulung." },
            { trigger: "Anda Sering Membandingkan?", result: "Anak kehilangan rasa percaya diri." },
            { trigger: "Anda Jarang Mendengar?", result: "Anak mencari pendengar di lingkungan yang salah." }
        ],
        agitationClosing: "Mau menunggu sampai mereka benar-benar pergi dan melupakan Anda?",

        // 6. THE SHIFT (SOLUTION)
        shiftTitle: "Memulihkan Jembatan Hati",
        shiftDescription: "Di webinar ini, kita tidak membahas teknik parenting yang ribet. Kita akan melakukan <strong>Deep Healing</strong> untuk membersihkan 'sampah emosi' orang tua agar frekuensi kasih sayang bisa sampai ke hati anak tanpa terhalang ego.",
        shiftResults: [
            "✅ Anak mulai terbuka dan mau bercerita tanpa perlu dipaksa.",
            "✅ Suasana rumah yang 'panas' berubah menjadi sejuk dan penuh tawa.",
            "✅ Anda berhenti menjadi 'polisi' di rumah, dan kembali menjadi 'sahabat' bagi anak.",
            "✅ Memutus rantai trauma pengasuhan agar tidak menurun ke cucu."
        ],

        // 7. WEBINAR DETAILS
        webinarTitle: 'WEBINAR: "MEMULIHKAN HATI YANG TERSEKAT"',
        eventDate: "Setiap Minggu (Weekly - 4 Sesi)", 
        eventTime: "17:00 WIB",
        curriculum: [
            { title: 'The Parent\'s Mirror', desc: 'Memahami bagaimana perilaku "nakal" anak sebenarnya adalah cerminan dari kecemasan & luka batin orang tua yang tak terucap.' },
            { title: 'Vibrasi Penerimaan', desc: 'Teknik berkomunikasi via gelombang otak (telepati hati) untuk melunakkan hati anak yang keras tanpa banyak bicara.' },
            { title: 'Re-Parenting Yourself', desc: 'Anda tidak bisa memberi apa yang tidak Anda miliki. Kita sembuhkan dulu "Anak Kecil" dalam diri Anda, baru Anda bisa mengasuh anak Anda.' }
        ],

        // 8. PRICING & CTA
        priceAnchor: "Rp 3.500.000,-",
        priceReal: "Rp 199.999,-",
        ctaButton: "👉 SAYA MAU ANAK SAYA BERUBAH",

        // 9. STEPS
        steps: [
            { title: "Langkah 1: Daftar Sekarang", desc: "Amankan kursi Anda. Kesempatan memperbaiki hubungan tidak datang dua kali." },
            { title: "Langkah 2: Masuk Grup VIP", desc: "Anda akan dipandu admin untuk masuk ke grup khusus materi persiapan." },
            { title: "Langkah 3: Sesi Pemulihan", desc: "Hadir Setiap Minggu via Zoom selama 4 sesi. Siapkan tisu, kita akan banyak melepas emosi (Healing)." }
        ],

        // 10. FAQ
        faq: [
            { q: "Anak saya sudah dewasa/sudah menikah, apa belum terlambat?", a: "Tidak ada kata terlambat untuk orang tua. Ikatan batin orang tua dan anak bersifat abadi secara energi. Perubahan frekuensi Anda akan dirasakan mereka di manapun mereka berada." },
            { q: "Apakah webinar ini mengajarkan cara menghukum anak?", a: "Sama sekali TIDAK. Hukuman menciptakan rasa takut, bukan rasa hormat. Kita belajar membangun Wibawa Kasih Sayang, bukan Wibawa Ketakutan." },
            { q: "Suami/Istri saya tidak mau ikut, boleh sendirian?", a: "Sangat boleh. Perubahan dalam keluarga seringkali dimulai dari SATU orang yang sadar (The Cycle Breaker). Ketika energi Anda berubah, seisi rumah akan merespon." },
            { q: "Apakah ada rekamannya?", a: "Ada, tapi sesi Live mengandung energi pemulihan kolektif yang sangat kuat. Sangat disarankan hadir langsung." }
        ]
    };

    // ==========================================
    // 🖼️ MEDIA ASSETS (CONSTANTS)
    // ==========================================
    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

    // Full Video Testimonials (Identic Amount as requested, context adapted via UI mostly)
    const videoTestimonials = [
        { name: "Agus Mulyadi", title: "Ayah 3 Anak", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "👨‍👩‍👦" },
        { name: "Dr. Gumilar", title: "Praktisi Kesehatan Mental", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Tokoh Agama & Pendidik", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Ibu Yayasan Yatim", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "🧕" },
        { name: "Felicia", title: "Ibu Pekerja", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Alumni Program", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Alumni Program", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "Alumni Program", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];

    // Full Text Testimonials (Rewritten for Parenting Context)
    const testimonials = [
        { name: "Siti Aminah", title: "Ibu Rumah Tangga (Anak Remaja)", image: "🧕", rating: 5, text: "Saya nangis kejer pas sesi healing. Ternyata selama ini saya 'keras' ke anak karena dulu orang tua saya juga keras. Setelah saya lepas traumanya, MasyaAllah, anak saya yang tadinya pendiam tiba-tiba meluk saya duluan." },
        { name: "Pak Hendra", title: "Karyawan Swasta (Anak Dewasa)", image: "👨‍💼", rating: 5, text: "Hubungan saya dan putra sulung putus 3 tahun. Gengsi saya terlalu tinggi. Setelah ikut webinar eL Vision, saya turunkan ego. Minggu lalu dia datang ke rumah bawa cucu. Terima kasih Coach." },
        { name: "Dr. Rina Sp.A", title: "Dokter Anak", verified: true, image: "⚕️", rating: 5, text: "Banyak pasien saya sakit fisik karena stres di rumah. Metode eL Vision ini menyentuh akar masalahnya: koneksi batin orang tua. Sangat ilmiah dan menyentuh." },
        { name: "Dewi Sartika", title: "Single Mom", verified: true, image: "👩‍👧", rating: 5, text: "Menjadi single mom itu berat, saya sering lampiaskan emosi ke anak. Webinar ini menampar saya dengan halus. Sekarang rumah jadi surga kecil kami, bukan medan perang lagi." },
        { name: "Budi Santoso", title: "Pengusaha", image: "👔", rating: 5, text: "Saya pikir uang cukup buat anak. Ternyata mereka butuh 'hadir'nya saya. Teknik vibrasi yang diajarkan benar-benar mind-blowing. Anak jadi lebih respek tanpa saya perlu marah-marah." },
        { name: "Arif", title: "Alumni Program", verified: true, image: "👨‍💻", rating: 5, text: "Dulu saya pembangkang. Setelah saya paham ilmunya, saya yang mengajak orang tua saya berubah. Hubungan keluarga kami sekarang harmonis luar biasa." },
        { name: "Maya", title: "Ibu 2 Anak", verified: true, image: "👩", rating: 5, text: "Awalnya ragu, masa iya webinar bisa ubah karakter anak? Ternyata yang diubah KITA-nya. Pas kitanya tenang, anak otomatis tenang. Ajaib." },
        { name: "Rudi Hartono", title: "Pensiunan", verified: true, image: "👴", rating: 5, text: "Menyesal baru tahu ilmu ini di usia senja. Tapi alhamdulillah, sisa umur ini bisa saya pakai untuk memperbaiki hubungan dengan anak-anak yang sempat renggang." }
    ];

    return (
      <div className="relative">
        <Toaster />
        {showPaymentInstructions && paymentData ? (
          <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-slate-200">
              <div className="p-4 bg-teal-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-teal-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Tagihan</p>
                    <p className="text-3xl font-bold text-teal-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium border border-teal-200">
                        Menunggu Pembayaran
                    </div>
                </div>
    
                <Card className="border-2 border-slate-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                        <Label className="text-slate-500">Nomor Referensi</Label>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-mono text-sm text-teal-600">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-slate-400 hover:text-teal-600">
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
                                <span className="font-mono text-xl font-bold tracking-wider text-teal-600">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-teal-600">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-teal-50 p-3 rounded text-sm text-teal-800 border border-teal-100">
                        <p><strong>PENTING:</strong> Lakukan pembayaran sebelum waktu habis. Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                   <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Webinar Parenting ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                       Bantuan Admin
                   </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)", // Light Teal background
            color: "#334155", // Dark text
            lineHeight: 1.6
        }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER LOGO */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f766e", letterSpacing: "2px" }}>eL VISION</div>
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

                <div style={{ textAlign: "center", padding: "40px 20px", background: "#ffffff", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
                    <span style={{ background: "rgba(20, 184, 166, 0.1)", color: "#0f766e", padding: "10px 25px", borderRadius: "50px", fontSize: "16px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "1px solid #0f766e" }}>
                        {content.targetBadge}
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e293b", marginBottom: "15px", lineHeight: 1.3 }}>{content.headline}</h1>
                    <p style={{ fontSize: "16px", color: "#475569", marginBottom: "0px", lineHeight: 1.6 }}>{content.subheadline}</p>
                    <div style={{ marginTop: "20px", background: "rgba(0,0,0,0.05)", display: "inline-block", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>
                        🗓️ Jadwal: <strong>{content.eventDate} | {content.eventTime}</strong>
                    </div>
                </div>

                {/* 3. PAIN SECTION */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #0d9488", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f766e", marginBottom: "20px" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: '#f0fdfa', padding: '15px', borderRadius: '10px', border: '1px solid #ccfbf1' }}>
                                <div style={{ fontSize: '24px', marginBottom: '10px', color: '#0d9488' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#4b5563' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>{content.logicTitle}</h2>
                    <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #ef4444", color: "#991b1b" }}>
                        <p dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                {/* 5. AGITATION (HIGHLIGHT) */}
                <div style={{ background: "#ffffff", color: "#1e293b", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#0f766e" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px", color: "#475569" }} dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <div style={{ background: "rgba(20, 184, 166, 0.05)", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid rgba(20, 184, 166, 0.1)" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: idx === 1 ? "10px 0" : "0", color: "#475569" }}>{bullet.trigger} 👉 <strong style={{color: "#0f766e"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>{content.agitationClosing}</p>
                </div>

                {/* 6. SOLUTION */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginBottom: "20px", textAlign: "center" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "20px", textAlign: "center", color: "#475569" }} dangerouslySetInnerHTML={{ __html: content.shiftDescription }} />
                    <div style={{ padding: "15px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "15px", border: "1px solid rgba(16, 185, 129, 0.3)", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#059669", marginBottom: "10px", textAlign: "center" }}>✨ MANFAAT WEBINAR INI:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "8px 0", borderBottom: idx !== 3 ? "1px dashed rgba(16, 185, 129, 0.3)" : "none", color: "#1e293b" }} dangerouslySetInnerHTML={{ __html: res }} />
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
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f766e", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#334155", textAlign: "center" }}>Selama 16 tahun, saya meneliti bagaimana <strong>Luka Batin Masa Kecil</strong> membentuk takdir seseorang. Misi saya adalah membantu orang tua memutus rantai trauma, agar anak-anak tumbuh bahagia, bukan tumbuh memendam luka.</p>
                    <div style={{ background: "#f0fdfa", color: "#0f766e", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "14px", fontWeight: "bold", border: "1px solid #ccfbf1" }}>"Anak Bahagia Dimulai dari Orang Tua yang Sembuh"</div>
                </div>

                {/* 8. VIDEO TESTIMONIALS (IDENTIC AMOUNT) */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Cerita Alumni eL Vision</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "#ffffff", borderRadius: "15px", padding: "15px", scrollSnapAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#f0f4f8" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f766e" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. TEXT TESTIMONIALS (REWRITTEN FOR PARENTING) */}
                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Kisah Keluarga yang Pulih</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
                            <div style={{ fontWeight: 700, color: "#0f766e", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#34d399'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#475569" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 10. CURRICULUM */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #0d9488", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <div style={{ background: "#0d9488", color: "#fff", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b" }}>{content.webinarTitle}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {content.curriculum.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "rgba(20, 184, 166, 0.1)", color: "#0d9488", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, border: "1px solid #0d9488" }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#0f766e" }}>{item.title}</strong>
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
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#cbd5e1" }}></div>
                        
                        {content.steps.map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0f766e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid #f8fafc" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#0f766e", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#475569", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW SECTION: Apa yang saya dapat */}
                <div style={{ background: "#f0fdfa", padding: "35px 25px", borderRadius: "30px", marginBottom: "40px", border: "2px dashed #0f766e", textAlign: "center", boxShadow: "0 10px 25px rgba(15, 118, 110, 0.1)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", color: "#0d9488", textTransform: "uppercase", letterSpacing: "1px" }}>Apa yang saya dapat jika Ikut Protokol 4 sesi ini?</h2>
                    
                    <div style={{ fontSize: "17px", lineHeight: "1.7", color: "#115e59", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <p><strong>Bapak/Ibu akan memegang "Remote Control" hati anak, bukan dengan paksaan, tapi dengan koneksi batin.</strong></p>
                        
                        <p>Kita akan sambung kembali "kabel rasa" yang putus antara orang tua dan anak. Anak akan mulai mendengarkan dan kooperatif karena mereka merasa DIMENGERTI, bukan dihakimi. Rumah yang tadinya medan perang akan kembali menjadi tempat pulang yang dirindukan.</p>
                        
                        <div style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #5eead4", marginTop: "10px" }}>
                            <p style={{ fontStyle: "italic", fontWeight: "600", color: "#0f766e", margin: 0 }}>
                                "Bayangkan anak memeluk Bapak/Ibu dengan erat dan berkata 'Terima kasih sudah mengerti aku'. Bayangkan tawa renyah kembali terdengar di ruang keluarga. Jangan biarkan anak mencari rumah di tempat lain. Pulangkan hatinya sekarang."
                            </p>
                        </div>

                        <p style={{ fontSize: "14px", marginTop: "10px", color: "#0d9488", fontWeight: "bold" }}>👉 Selamatkan masa depan anak dan keluarga Anda hari ini.</p>
                    </div>
                </div>

                {/* 12. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ marginTop: "20px", fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Keharmonisan Keluarga</h2>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>Harga normal untuk konsultasi keluarga & terapi:</p>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#94a3b8", marginBottom: "5px" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#0f766e", marginBottom: "10px" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "30px" }}>(Lebih murah dari sekali makan di restoran keluarga)</p>
                    </div>

                    <div style={{ background: "#fffbeb", border: "1px dashed #0d9488", padding: "15px", borderRadius: "15px", marginBottom: "30px", textAlign: "left" }}>
                        <p style={{ fontSize: "14px", color: "#0f766e", fontWeight: "bold", marginBottom: "5px" }}>🎁 BONUS EKSKLUSIF LANGSUNG:</p>
                        <p style={{ fontSize: "13px", color: "#0d9488", lineHeight: "1.5" }}>Anda juga mendapatkan <strong>Ebook eL Vision Pro + Audio Hipnosis Set</strong> selama menunggu Webinar yang bisa anda praktekan langsung untuk hasil instan.</p>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-teal-600">
                                <User className="w-5 h-5" /> Data Diri
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        autoComplete="name"
                                        placeholder="Contoh: Budi Santoso" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-teal-500 h-12"
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
                                            className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-teal-500 h-12"
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
                                            className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-teal-500 h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-teal-600">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-teal-600" />
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
                            className="w-full text-lg py-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white border-none mt-6"
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
                                <div style={{ color: "#0f766e", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
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

export default WebinarOrtuAnak;