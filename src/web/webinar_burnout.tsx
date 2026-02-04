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
import { ArrowLeft, Copy, CreditCard, User, Loader2 } from 'lucide-react';

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

const WebinarPriaBurnout = () => {
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
    const displayProductName = 'Webinar Stress Management & Reset';
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

        const { fbc, fbp } = getFbcFbpCookies();
        const userData: any = { client_user_agent: navigator.userAgent };

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
        }

        const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
        if (fbIdentity) {
          userData.db_id = fbIdentity.id;
        }

        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;
        
        body.userData = userData;

        // IDENTICAL ENDPOINT AS REQUESTED
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
                  userId: null,
                  fbc,
                  fbp
                }
            });

            if (error || !data?.success) {
                let errorMessage = data?.error || error?.message || "Terjadi kesalahan sistem.";
                if (data?.details?.message) {
                     errorMessage = data.details.message;
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
                    description: "Pembayaran berhasil. Cek email Anda sekarang.",
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
    // 📝 COPYWRITING: PEKERJA MUDA BURNOUT
    // TONE: POLARISM SOPAN & MENGGUGAH
    // ==========================================
    const content = {
        targetBadge: "KHUSUS PEKERJA MUDA YANG SERASA 'MAU MATI' KARENA KERJAAN",
        
        headline: "Gaji Naik, Jabatan Naik... Tapi Kenapa Batin Anda Terasa Makin Kosong?",
        subheadline: "Anda berangkat saat matahari belum terbit, pulang saat dunia sudah gelap. Anda pikir kelelahan ini normal? Hati-hati, tubuh Anda sedang mengirim sinyal 'bahaya' yang selama ini Anda abaikan demi target perusahaan.",

        painTitle: "Apakah Anda Merasakan 'Kebisingan' Ini Setiap Hari?",
        painPoints: [
            { icon: "🔋", text: <span><strong>"Low-Battery Mental."</strong> Bangun tidur bukannya segar, malah merasa berat. Pekerjaan yang dulu Anda cintai, sekarang terasa seperti hukuman penjara.</span> },
            { icon: "🌋", text: <span><strong>"Emosi Meledak-ledak."</strong> Marah pada hal kecil di kantor, lalu merasa bersalah. Anda tidak jadi diri sendiri lagi. Anda hanya 'Zombi' pengincar tanggal gajian.</span> },
            { icon: "🧠", text: <span><strong>"Kepala Gak Bisa Berhenti."</strong> Mata lelah tapi pikiran tetap lari marathon memikirkan deadline besok. Anda sukses di karir, tapi gagal dalam ketenangan.</span> }
        ],

        logicTitle: "Jebakan 'Kerja Keras = Masa Depan'",
        logicDescription: "Logika Anda berteriak: <em>'Saya harus tahan, ini demi tabungan masa tua.'</em><br/><br/><strong>SALAH BESAR, PAK.</strong><br/>Apa gunanya tabungan miliaran jika di usia 40 tahun nanti tubuh Anda sudah rusak karena stress kronis? Burnout adalah tanda Anda butuh <strong>RESET</strong>, bukan sekadar cuti seminggu.",

        agitationTitle: "THE BURNOUT TRAP: Perangkap Kelelahan Jiwa",
        agitationText: [
            "Jujur, apakah Anda sedang menjalani hidup, atau sekadar bertahan hidup?",
            "Burnout bukan tanda Anda lemah. Itu tanda Anda sudah terlalu lama kuat dengan cara yang salah. Jika Anda terus memaksa mesin tanpa ganti oli, <strong>sebentar lagi Anda akan 'turun mesin' (Sakit Berat/Stroke).</strong>",
            "Jangan sampai Anda baru sadar saat terbaring di rumah sakit bahwa perusahaan akan mengganti posisi Anda dalam 24 jam, tapi keluarga Anda akan kehilangan Anda selamanya."
        ],
        agitationBullets: [
            { trigger: "Anda Abaikan Burnout?", result: "Kreativitas mati total." },
            { trigger: "Anda Terus Memaksa?", result: "Hubungan keluarga hancur." },
            { trigger: "Anda Gagal Reset?", result: "Depresi & Gangguan Kecemasan." }
        ],
        agitationClosing: "Mau sampai kapan Anda gadai nyawa demi kemajuan orang lain?",

        shiftTitle: "Solusinya Bukan Resign, Tapi 'Reset'",
        shiftDescription: "Di webinar ini, kami tidak menyuruh Anda keluar dari pekerjaan. Kami mengajarkan cara menginstal <strong>Software Anti-Stress</strong> di otak bawah sadar Anda agar Anda bisa bekerja dengan performa tinggi tanpa menghancurkan batin.",
        shiftResults: [
            "✅ Kembali memiliki 'Gairah Hidup' (Zest) yang sempat hilang bertahun-tahun.",
            "✅ Bekerja lebih efisien dengan energi 'Flow', bukan energi 'Stress'.",
            "✅ Memiliki kontrol penuh atas emosi sehingga pulang ke rumah menjadi 'Pahlawan', bukan 'Bom Waktu'."
        ],

        webinarTitle: 'WEBINAR: "RESET: KEMBALI BERGAIRAH & PRODUKTIF"',
        eventDate: "Setiap Minggu (Weekly - 4 Sesi), 17:00 WIB",
        curriculum: [
            { title: 'The Amygdala Hijack', desc: 'Cara mematikan tombol "Panic" di otak agar tetap tenang meski deadline menumpuk.' },
            { title: 'Energy Management', desc: 'Sains mengelola tenaga agar jam 5 sore Anda masih punya energi untuk bermain dengan keluarga.' },
            { title: 'Subconscious Reprogramming', desc: 'Menghapus pola pikir "Workaholic Toxic" dan menggantinya dengan mentalitas "High Performer".' }
        ],

        priceAnchor: "Rp 5.000.000,-",
        priceReal: "Rp 199.999,-",
        ctaButton: "👉 SAYA MAU RESET HIDUP SAYA",

        steps: [
            { title: "Langkah 1: Amankan Slot", desc: "Selesaikan investasi Rp 199.999,- (Lebih murah dari biaya berobat ke psikiater)." },
            { title: "Langkah 2: Join VIP Room", desc: "Anda akan masuk ke komunitas pria-pria berdaya yang sadar akan kesehatan mental." },
            { title: "Langkah 3: Live Reset", desc: "Hadir Setiap Minggu via Zoom selama 4 sesi. Kita lakukan pembersihan mental bersama." }
        ],

        faq: [
            { q: "Apakah saya harus resign setelah ikut ini?", a: "Sama sekali tidak. Justru Anda akan belajar cara mencintai pekerjaan Anda kembali dengan batas-batas (boundaries) yang sehat." },
            { q: "Saya tidak biasa meditasi atau hal seperti ini.", a: "Ini bukan klenik. Ini adalah manajemen energi sistem saraf. Logis, saintifik, dan sangat praktis untuk dilakukan di sela jam kantor." },
            { q: "Saya sangat sibuk, kalau ketinggalan?", a: "Hadir secara live sangat disarankan untuk energi kolektif. Namun jika terpaksa, rekaman akan tersedia di grup eksklusif." },
            { q: "Apakah ini akan membantu insomnia saya?", a: "Burnout dan Insomnia adalah saudara kembar. Saat pikiran bawah sadar Anda tenang, tidur nyenyak bukan lagi mimpi." }
        ]
    };

    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

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

    const testimonials = [
        { name: "Felicia Quincy", title: "Ibu & Pengusaha", verified: true, image: "👩‍💼", rating: 5, text: "Dulu saya pikir saya harus mengontrol semuanya agar berjalan lancar. Ternyata, saat saya melepaskan kontrol dan berserah, anak-anak dan bisnis justru tumbuh lebih baik." },
        { name: "Linda Permata", title: "Investor Real Estate", image: "👩‍💼", rating: 5, text: "Investasi terbaik bukan properti, tapi kedamaian pikiran. Saya tidak lagi membawa stress pekerjaan ke rumah." },
        { name: "Agus Mulyadi", title: "Klien eL Vision", verified: true, image: "👨‍💼", rating: 5, text: "Intuisi dan ketenangan meningkat tajam. Sangat berpengaruh dalam pengambilan keputusan besar dalam hidup." },
        { name: "Dr. Gumilar", title: "Dokter & Hipnoterapis", verified: true, image: "⚕️", rating: 5, text: "Program ini adalah detoksifikasi mental terbaik yang pernah saya temui selama berkarir." },
        { name: "Lena", title: "Klien eL Vision", verified: true, image: "💎", rating: 5, text: "Metode ini menyelamatkan kewarasan saya dari burnout parah tahun lalu." },
        { name: "Vio", title: "Klien eL Vision", verified: true, image: "✨", rating: 5, text: "Saya belajar untuk kembali mencintai diri sendiri sebelum mencintai pekerjaan saya." },
        { name: "Arif", title: "Klien eL Vision", verified: true, image: "👨‍💻", rating: 5, text: "Pikiran jauh lebih jernih, performa kerja justru meningkat setelah saya belajar cara reset energi." },
        { name: "Umi Jamilah", title: "Pemimpin Yayasan", verified: true, image: "🌟", rating: 5, text: "Ketenangan hati adalah kunci menghadapi segala tekanan pekerjaan." }
    ];

    return (
      <div className="relative">
        <Toaster />
        {showPaymentInstructions && paymentData ? (
          <div className="min-h-screen bg-orange-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-orange-100">
              <div className="p-4 bg-orange-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-orange-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Selesaikan Pembayaran</h1>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Tagihan</p>
                    <p className="text-3xl font-bold text-orange-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">Menunggu Pembayaran</div>
                </div>
                <Card className="border-2 border-slate-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                        <Label className="text-slate-500">Nomor Referensi</Label>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-mono text-sm text-orange-600">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-slate-400 hover:text-orange-600"><Copy className="w-3 h-3" /></Button>
                        </div>
                    </div>
                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border border-slate-200 rounded-lg bg-white" />
                            <p className="text-sm text-slate-500 mt-2 text-center">Scan QR di atas menggunakan aplikasi e-wallet Anda.</p>
                        </div>
                    )}
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-600">Kode Bayar / VA</Label>
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <span className="font-mono text-xl font-bold tracking-wider text-orange-600">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-orange-600"><Copy className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}
                    <div className="bg-orange-50 p-3 rounded text-sm text-orange-800 border border-orange-100">
                        <p><strong>PENTING:</strong> Sistem akan otomatis memverifikasi pembayaran Anda.</p>
                    </div>
                  </CardContent>
                </Card>
                <div className="text-center">
                   <Button variant="outline" className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Webinar Reset ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>Bantuan Admin</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #fffcf0 0%, #fffbeb 100%)",
            color: "#1e293b",
            lineHeight: 1.6
        }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#ea580c", letterSpacing: "2px" }}>eL VISION</div>
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

                <div style={{ textAlign: "center", padding: "40px 20px", background: "#ffffff", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(234, 88, 12, 0.1)", border: "1px solid rgba(234, 88, 12, 0.2)" }}>
                    <span style={{ background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", padding: "10px 25px", borderRadius: "50px", fontSize: "14px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "1px solid #ea580c" }}>{content.targetBadge}</span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "15px", lineHeight: 1.3 }}>{content.headline}</h1>
                    <p style={{ fontSize: "16px", color: "#475569", marginBottom: "0px", lineHeight: 1.6 }}>{content.subheadline}</p>
                    <div style={{ marginTop: "20px", background: "rgba(0,0,0,0.05)", display: "inline-block", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>🗓️ Event: <strong>{content.eventDate}</strong></div>
                </div>

                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #ea580c", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#ea580c", marginBottom: "20px" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: '#fff7ed', padding: '15px', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                                <div style={{ fontSize: '24px', marginBottom: '10px', color: '#ea580c' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#4b5563' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#9a3412" }}>{content.logicTitle}</h2>
                    <div style={{ background: "rgba(154, 52, 18, 0.05)", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #ea580c", color: "#9a3412" }}>
                        <p dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                <div style={{ background: "#ffffff", color: "#1e293b", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#ea580c" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px", color: "#475569" }} dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <div style={{ background: "rgba(234, 88, 12, 0.05)", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid rgba(234, 88, 12, 0.1)" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: idx === 1 ? "10px 0" : "0", color: "#475569" }}>{bullet.trigger} 👉 <strong style={{color: "#ea580c"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>{content.agitationClosing}</p>
                </div>

                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginBottom: "20px", textAlign: "center" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "20px", textAlign: "center", color: "#475569" }} dangerouslySetInnerHTML={{ __html: content.shiftDescription }} />
                    <div style={{ padding: "15px", background: "rgba(249, 115, 22, 0.1)", borderRadius: "15px", border: "1px solid rgba(249, 115, 22, 0.3)", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#ea580c", marginBottom: "10px", textAlign: "center" }}>✨ SETELAH WEBINAR INI:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "8px 0", borderBottom: idx !== 2 ? "1px dashed rgba(249, 115, 22, 0.3)" : "none", color: "#1e293b" }} dangerouslySetInnerHTML={{ __html: res }} />
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src={founderImages[0]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src={founderImages[1]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ea580c", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#334155", textAlign: "center" }}>Selama 16 tahun, saya meneliti bagaimana <strong>Alam Bawah Sadar</strong> mengendalikan 95% keputusan hidup kita. Saya bukan motivator. Saya adalah "Insinyur Pikiran".</p>
                </div>

                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Apa Kata Mereka?</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "#ffffff", borderRadius: "15px", padding: "15px", scrollSnapAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#f0f4f8" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#ea580c" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Kisah Perubahan Nyata</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
                            <div style={{ fontWeight: 700, color: "#ea580c", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#34d399'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#475569" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #ea580c", boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}>
                    <div style={{ background: "#ea580c", color: "#fff", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b" }}>{content.webinarTitle}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {content.curriculum.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, border: "1px solid #ea580c" }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#ea580c" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#475569" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#1e293b", textAlign: "center" }}>Cara Bergabung</h2>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#e2e8f0" }}></div>
                        {content.steps.map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ea580c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid #fffbeb" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#ea580c", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#475569", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW SECTION: Apa yang saya dapat */}
                <div style={{ background: "#fff7ed", padding: "35px 25px", borderRadius: "30px", marginBottom: "40px", border: "2px dashed #ea580c", textAlign: "center", boxShadow: "0 10px 25px rgba(234, 88, 12, 0.1)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", color: "#9a3412", textTransform: "uppercase", letterSpacing: "1px" }}>Apa yang saya dapat jika Ikut Protokol 4 sesi ini?</h2>
                    
                    <div style={{ fontSize: "17px", lineHeight: "1.7", color: "#c2410c", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <p><strong>Kamu akan mendapatkan kembali "Nyawa"-mu yang hilang ditelan pekerjaan.</strong></p>
                        
                        <p>Kita akan matikan mode "Survival" di otakmu dan nyalakan mode "Enjoy". Tidurmu akan kembali nyenyak tanpa dihantui deadline. Bangun pagi dengan senyum, bukan dengan helaan nafas berat.</p>
                        
                        <div style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #fdba74", marginTop: "10px" }}>
                            <p style={{ fontStyle: "italic", fontWeight: "600", color: "#ea580c", margin: 0 }}>
                                "Bayangkan rasanya punya energi berlimpah untuk main sama anak setelah pulang kerja. Bayangkan tidak lagi meledak marah pada hal sepele. Hidup cuma sekali, Pak. Jangan habiskan sisa umurmu cuma buat stress. Reset sekarang!"
                            </p>
                        </div>

                        <p style={{ fontSize: "14px", marginTop: "10px", color: "#c2410c", fontWeight: "bold" }}>👉 Kembalikan kendali atas hidup Anda hari ini.</p>
                    </div>
                </div>

                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Kewarasan Anda</h2>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#94a3b8", marginBottom: "5px" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#ea580c", marginBottom: "10px" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "30px" }}>(Setara harga 4 gelas kopi kekinian)</p>
                    </div>

                    <div style={{ background: "#fffbeb", border: "1px dashed #ea580c", padding: "15px", borderRadius: "15px", marginBottom: "30px", textAlign: "left" }}>
                        <p style={{ fontSize: "14px", color: "#9a3412", fontWeight: "bold", marginBottom: "5px" }}>🎁 BONUS EKSKLUSIF LANGSUNG:</p>
                        <p style={{ fontSize: "13px", color: "#c2410c", lineHeight: "1.5" }}>Anda juga mendapatkan <strong>Ebook eL Vision Pro + Audio Hipnosis Set</strong> selama menunggu Webinar yang bisa anda praktekan langsung untuk hasil instan.</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-orange-600"><User className="w-5 h-5" /> Data Diri</h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Nama Lengkap</Label>
                                    <Input id="name" placeholder="Andi Pratama" value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-white text-slate-900 border-slate-300 focus:border-orange-500 h-12" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email" className="text-slate-300 font-semibold mb-1 block">Email (PENTING)</Label>
                                        <Input id="email" type="email" placeholder="nama@email.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="bg-white text-slate-900 border-slate-300 focus:border-orange-500 h-12" />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-slate-300 font-semibold mb-1 block">Nomor WhatsApp</Label>
                                        <Input id="phone" type="tel" placeholder="0812xxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-white text-slate-900 border-slate-300 focus:border-orange-500 h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-orange-600"><CreditCard className="w-5 h-5" /> Metode Pembayaran</h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-orange-500 bg-orange-50 shadow-md ring-1 ring-orange-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-orange-600" />
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-800 text-lg">{method.name}</div>
                                            <div className="text-sm text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button size="lg" className="w-full text-lg py-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-white border-none mt-6" onClick={handleCreatePayment} disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : content.ctaButton}
                        </Button>
                    </div>
                </div>

                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b", textAlign: "center" }}>Pertanyaan Sering Diajukan</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {content.faq.map((item, idx) => (
                            <div key={idx} style={{ background: "#ffffff", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                                <div style={{ color: "#ea580c", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
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

export default WebinarPriaBurnout;