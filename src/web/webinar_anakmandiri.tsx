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
import { ArrowLeft, Copy, CreditCard, User, CheckCircle, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';

const WebinarPemuda = () => {
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
    
    // Product Details
    const productNameBackend = 'webinar_youth_awakening'; 
    const displayProductName = 'Webinar: The Awakening (Rezeki Jalur Langit)';
    const productPrice = 200000;
    const pixelId = '3319324491540889'; 

    const paymentMethods = [
        { code: 'QRIS', name: 'QRIS', description: 'Scan pakai GoPay, OVO, Dana, ShopeePay, Mobile Banking' },
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
            description: "Kode pembayaran telah disalin.",
        });
    };

    // Helper to send CAPI events (Standard)
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
          testCode: 'TEST33364'
        };

        const { fbc, fbp } = getFbcFbpCookies();

        const userData: any = {
          client_user_agent: navigator.userAgent,
        };

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

    // Pixel Tracking
    useEffect(() => {
      const initPixel = async () => {
        if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
          hasFiredPixelsRef.current = true;
          
          const { data: { session } } = await supabase.auth.getSession();
          const { fbc, fbp } = getFbcFbpCookies();
          const userData: AdvancedMatchingData = {};
          
          if (session?.user?.id) userData.external_id = session.user.id;
          if (fbc) userData.fbc = fbc;
          if (fbp) userData.fbp = fbp;

          initFacebookPixelWithLogging(pixelId, userData);

          const pageEventId = `pageview-${Date.now()}`;
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'TEST33364');

          const viewContentEventId = `viewcontent-${Date.now()}`;
          trackViewContentEvent({
            content_name: displayProductName,
            content_ids: [productNameBackend],
            content_type: 'product',
            value: productPrice,
            currency: 'IDR'
          }, viewContentEventId, pixelId, userData, 'TEST33364');
        }
      };

      initPixel();
    }, []);

    const handleCreatePayment = async () => {
        if (isProcessingRef.current) return;

        if (!userName || !userEmail || !phoneNumber || !selectedPaymentMethod) {
            toast({
                title: "Woy, Isi Data Dulu!",
                description: "Nama, Email, WA, Metode Bayar. Jangan malas!",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            toast({
                title: "Email Ngawur",
                description: "Masukin email yang bener.",
                variant: "destructive",
            });
            return;
        }

        isProcessingRef.current = true;
        setLoading(true);

        try {
             if (!addPaymentInfoFiredRef.current) {
                addPaymentInfoFiredRef.current = true;
                sendCapiEvent('AddPaymentInfo', {
                  content_ids: [productNameBackend],
                  content_type: 'product',
                  value: productPrice,
                  currency: 'IDR'
                }, `api-${Date.now()}`);
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
                  userId: null,
                  fbc,
                  fbp
                }
            });

            if (error || !data?.success) {
                toast({
                  title: "Gagal",
                  description: data?.error || "Sistem error, coba refresh.",
                  variant: "destructive",
                });
                return;
            }

            if (data?.success) {
                setPaymentData(data);
                setShowPaymentInstructions(true);
                toast({
                  title: "Order Dibuat",
                  description: "Segera bayar sebelum expired.",
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error: any) {
            toast({
              title: "Error",
              description: "Koneksi bermasalah.",
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
                  title: "LUNAS! KAMU SUDAH AMAN.",
                  description: "Cek email sekarang. Jangan ditunda lagi.",
                  duration: 5000, 
                  variant: "default"
              });
            }
          }).subscribe();
    
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    // ==========================================
    // 💀 COPYWRITING: POLARISM (YOUTH/UNEMPLOYED)
    // ==========================================
    const content = {
        // 1. TARGET BADGE
        targetBadge: "KHUSUS LO YANG MUAK JADI BEBAN KELUARGA",
        
        // 2. HERO SECTION
        headline: "Sarjana atau Lulusan Sekolah Tapi Masih Minta Duit Orang Tua? MEMALUKAN.",
        subheadline: "Ijazahmu cuma kertas sampah kalau mentalmu masih mental pengemis. Teman-temanmu sudah lari kencang, kamu masih 'ngesot' meratapi nasib.",

        // 3. PAIN SECTION (POLARIZING)
        painTitle: "Cek Diri Lu Sendiri, Jangan Denial!",
        painPoints: [
            { icon: "🤡", text: <span><strong>"Minder Setengah Mati."</strong> Liat Story IG temen udah pamer kerjaan/healing, lu cuma bisa scroll HP di kamar bau apek.</span> },
            { icon: "📉", text: <span><strong>"Lamaran Ditolak Terus."</strong> Udah sebar CV kayak sebar brosur sedot WC, tapi gak ada yang manggil. Lu mulai ngerasa gak guna.</span> },
            { icon: "🤬", text: <span><strong>"Omongan Tetangga/Saudara."</strong> 'Kapan kerja? Sayang ya kuliah mahal-mahal nganggur'. Sakit, tapi lu gak bisa jawab.</span> }
        ],

        // 4. LOGIC TRAP
        logicTitle: "Lu Pikir Lu Pinter?",
        logicDescription: "Lu pikir IPK tinggi atau sekolah favorit menjamin duit? <strong>SALAH GOBLOK.</strong><br/><br/>Di dunia nyata, gak ada yang peduli nilai lu. Yang mereka peduli: <strong>ENERGI LU.</strong> Kalau aura lu suram, miskin, dan pemalas, rezeki akan LARI menjauh.",

        // 5. AGITATION (THE PARASITE)
        agitationTitle: "THE PARASITE SYNDROME: Sindrom Parasit",
        agitationText: [
            "Maaf kalau kasar. Tapi kalau umur 20+ masih disuapin ortu, lu itu PARASIT.",
            "Orang tua lu makin tua. Punggung mereka makin bungkuk. Lu tega masih nambah beban di pundak mereka? Mereka gak bilang, tapi dalam hati mereka <strong>kecewa</strong>.",
            "Jangan sampai ortu 'pergi' duluan sebelum lu bisa beliin mereka beras pakai duit sendiri."
        ],
        agitationBullets: [
            { trigger: "Lu Males?", result: "Masa depan hancur." },
            { trigger: "Lu Gengsi Usaha?", result: "Dompet kosong melompong." },
            { trigger: "Lu Banyak Alasan?", result: "Siap-siap jadi gembel elite." }
        ],
        agitationClosing: "Mau terus jadi SAMPAH atau berubah jadi EMAS?",

        // 6. THE SHIFT (SOLUTION)
        shiftTitle: "Dari 'Pecundang' Jadi 'Pemenang'",
        shiftDescription: "Webinar ini bukan seminar motivasi 'ayo semangat' basi. Ini adalah **TAMPERAN KERAS** untuk install ulang otak lu. Kita bongkar 'Mental Miskin' lu sampai ke akar.",
        shiftResults: [
            "🔥 Dikejar Peluang: Bukan lu yang ngemis kerjaan, tapi rezeki yang nyari lu.",
            "🔥 Dominasi Total: Punya aura 'Alpha' yang bikin orang segan, bukan kasihan.",
            "🔥 Balas Dendam Terbaik: Sukses sampai mulut tetangga yang nyinyir terkunci rapat."
        ],

        // 7. WEBINAR DETAILS
        webinarTitle: 'WEBINAR: "THE AWAKENING - BANGKIT DARI KEMATIAN NASIB"',
        eventDate: "Minggu, 22 Februari 2026 | 17:00 WIB",
        curriculum: [
            { title: 'Vibrasi Penarik Uang', desc: 'Kenapa orang bodoh bisa kaya raya dan lu yang pinter malah miskin? Ini rahasianya.' },
            { title: 'Kill The Loser Within', desc: 'Membunuh mentalitas korban, males, mager, dan kecanduan game/bokep yang bikin lu tumpul.' },
            { title: 'Fast Track Rezeki', desc: 'Jalur pintas (cheat code) menarik keberuntungan tanpa harus menjilat atasan atau orang dalam.' }
        ],

        // 8. PRICING & CTA
        priceAnchor: "Rp 1.500.000,-", // Harga skin game lu
        priceReal: "Rp 200.000,-",
        ctaButton: "👉 GUA SIAP BERUBAH SEKARANG!",

        // 9. STEPS
        steps: [
            { title: "Step 1: Bayar Harga Diri Lu", desc: "Investasi receh Rp 200rb. Kalau ini aja lu pelit, jangan harap kaya." },
            { title: "Step 2: Masuk Kandang Singa", desc: "Join Grup VIP. Isinya pemuda-pemuda lapar sukses, bukan kaum rebahan." },
            { title: "Step 3: Eksekusi Mati", desc: "Hadir 22 Februari jam 17:00 WIB. Kita bantai rasa malas lu live via Zoom." }
        ],

        // 10. FAQ
        faq: [
            { q: "Gua gak punya duit kak, lagi nganggur.", a: "Lu punya kuota buat baca ini kan? Lu punya duit buat rokok/kopi/game? Ini soal PRIORITAS. Pinjem, jual barang gak guna, usaha! Mental gratisan bikin lu miskin permanen." },
            { q: "Apa jaminan bakal dapet kerja/uang?", a: "Gak ada jaminan kalau lu cuma dengerin tapi gak praktek. Tapi kalau lu ikutin 'Cheat Code' di sini, mustahil hidup lu gak berubah." },
            { q: "Gua gaptek/pemalu.", a: "Justru itu lu harus ikut. Kita hancurkan rasa malu lu yang gak pada tempatnya itu. Zoom itu gampang." },
            { q: "Kalau gak cocok bisa refund?", a: "GAK BISA. Kalau lu masuk sini cuma buat coba-coba terus minta balik duit, mending lu pake duitnya buat beli seblak. Kita cari PEJUANG, bukan PEDAGANG." }
        ]
    };

    // ==========================================
    // 🖼️ ASSETS
    // ==========================================
    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Kepala Intelijen Pangandaran", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Hipnoterapist & Pemimpin Yayasan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Pemimpin Pondok Pesantren Atsaqofah", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Pemimpin Yayasan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "👳‍♀️" },
        { name: "Felicia", title: "Pengusaha", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];



    const testimonials = [
        { name: "Rizky A.", title: "Ex-Pengangguran 2 Tahun", image: "🔥", rating: 5, text: "Gila. Dulu gua minder parah, tiap hari dimarahin bokap. Abis ikut eL Vision, mental gua dibongkar. Bulan depannya gua nekat usaha, sekarang omzet ngalahin gaji manajer. Thank you Bang eL!" },
        { name: "Dimas P.", title: "Fresh Graduate", image: "🎓", rating: 5, text: "IPK 3.8 tapi ngelamar kerja ditolak 50x. Ternyata vibrasi gua 'ngemis'. Abis dibenerin di sini, tiba-tiba tawaran dateng sendiri. Aneh tapi nyata." },
        { name: "Arif", title: "Klien eL Vision", verified: true, image: "👨‍💻", rating: 5, text: "Saya didiagnosis penyakit parah, hidup berantakan. Tehnik ini nyelamatin nyawa & masa depan saya. Gak lebay, ini real." }
    ];

    if (showPaymentInstructions && paymentData) {
        return (
          <div className="min-h-screen bg-neutral-900 pb-20 font-sans text-neutral-100">
            <div className="max-w-md mx-auto bg-black min-h-screen shadow-2xl border-x border-neutral-800">
              <div className="p-4 bg-red-700 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-red-800">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg uppercase tracking-wider">Bayar Sekarang!</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-neutral-400 text-sm uppercase">Total Investasi Masa Depan</p>
                    <p className="text-4xl font-black text-red-500">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-4 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-bold border border-red-900 animate-pulse">
                        JANGAN SAMPAI HANGUS
                    </div>
                </div>
    
                <Card className="border border-neutral-800 bg-neutral-900">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-neutral-800 pb-4 mb-4">
                        <Label className="text-neutral-500 text-xs uppercase">No. Referensi</Label>
                        <div className="flex items-center justify-between bg-black p-3 rounded border border-neutral-800">
                            <span className="font-mono text-sm text-red-500 font-bold">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-neutral-400 hover:text-white">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <div className="p-2 bg-white rounded-lg">
                                <img src={paymentData.qrUrl} alt="QRIS" className="w-56 h-56 object-contain" />
                            </div>
                            <p className="text-xs text-neutral-500 mt-3 text-center">Scan pake GoPay/Dana/ShopeePay/Mobile Banking lu.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-neutral-500 text-xs uppercase">Kode Bayar / VA</Label>
                            <div className="flex items-center justify-between bg-black p-4 rounded-lg border border-red-900/50">
                                <span className="font-mono text-2xl font-bold tracking-widest text-red-500">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-neutral-400 hover:text-white">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-red-950/40 p-3 rounded text-sm text-red-200 border border-red-900/50 flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-xs">Transfer sesuai nominal. Gak usah buang waktu, sistem otomatis ngecek.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                   <Button variant="outline" className="w-full gap-2 border-neutral-700 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white" onClick={() => window.open(`https://wa.me/62895325633487?text=Min, saya mau konfirmasi order ${paymentData.tripay_reference}.`, '_blank')}>
                       Hubungi Admin (WhatsApp)
                   </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    return (
        <div style={{
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            backgroundColor: "#09090b", // Zinc-950 (Deep Black)
            color: "#fafafa", // Zinc-50 (White)
            lineHeight: 1.5
        }}>
            <Toaster />
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER LOGO */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#fff", letterSpacing: "4px", textTransform: "uppercase" }}>eL <span style={{color: "#ef4444"}}>VISION</span></div>
                    <div style={{ fontSize: "10px", color: "#52525b", textTransform: "uppercase", letterSpacing: "3px" }}>Gen-Z Awakening Protocol</div>
                </div>

                {/* 2. HERO SECTION */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "linear-gradient(180deg, #18181b 0%, #000000 100%)", borderRadius: "0px", marginBottom: "30px", border: "1px solid #27272a", borderTop: "4px solid #ef4444" }}>
                    <span style={{ background: "#ef4444", color: "#fff", padding: "6px 15px", borderRadius: "2px", fontSize: "12px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", textTransform: "uppercase" }}>
                        {content.targetBadge}
                    </span>
                    <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginBottom: "15px", lineHeight: 1.1, textTransform: "uppercase" }}>
                        {content.headline.split('?')[0]}?<br/><span style={{color: "#ef4444"}}>{content.headline.split('?')[1]}</span>
                    </h1>
                    <p style={{ fontSize: "16px", color: "#a1a1aa", marginBottom: "0px", lineHeight: 1.6 }}>{content.subheadline}</p>
                    <div style={{ marginTop: "25px", background: "#27272a", display: "inline-block", padding: "10px 20px", borderRadius: "4px", border: "1px solid #3f3f46" }}>
                        🔥 Event: <strong style={{color: "#fff"}}>{content.eventDate}</strong>
                    </div>
                </div>

                {/* 3. PAIN SECTION */}
                <div style={{ background: "#000", padding: "30px 25px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #27272a" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ef4444", marginBottom: "20px", textTransform: "uppercase" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: '#18181b', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #52525b' }}>
                                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '15px', color: '#d4d4d8' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "20px", textAlign: "center", color: "#fff", textTransform: "uppercase" }}>{content.logicTitle}</h2>
                    <div style={{ background: "#000", padding: "25px", borderRadius: "0px", textAlign: "center", border: "2px solid #ef4444", color: "#fff", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)" }}>
                        <p style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                {/* 5. AGITATION (HIGHLIGHT) */}
                <div style={{ background: "#18181b", color: "white", padding: "40px 25px", borderRadius: "10px", marginBottom: "30px", textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid #3f3f46" }}>
                    <div style={{position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: '#ef4444', filter: 'blur(60px)', opacity: 0.2}}></div>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "20px", color: "#ef4444", textTransform: "uppercase", letterSpacing: "-0.5px" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "20px", color: "#d4d4d8" }} dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <div style={{ background: "#000", padding: "20px", borderRadius: "5px", marginBottom: "25px", border: "1px dashed #52525b" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: idx === 1 ? "12px 0" : "0", color: "#a1a1aa", fontSize: "15px" }}>{bullet.trigger} 👉 <strong style={{color: "#fff", textTransform: "uppercase"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "900", fontSize: "18px", color: "#fff", textTransform: "uppercase" }}>{content.agitationClosing}</p>
                </div>

                {/* 6. SOLUTION */}
                <div style={{ background: "#000", padding: "30px 25px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #27272a" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "20px", textAlign: "center", textTransform: "uppercase" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "25px", textAlign: "center", color: "#a1a1aa", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: content.shiftDescription }} />
                    <div style={{ padding: "20px", background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)", borderRadius: "5px", border: "1px solid #3f3f46", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#22c55e", marginBottom: "15px", textAlign: "center", textTransform: "uppercase", fontSize: "12px", letterSpacing: "2px" }}>⚡ HASIL SETELAH WEBINAR:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "10px 0", borderBottom: idx !== 2 ? "1px solid #27272a" : "none", color: "#fff", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: res }} />
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 7. AUTHORITY */}
                <div style={{ background: "#18181b", padding: "30px 20px", borderRadius: "10px", marginBottom: "30px", borderLeft: "4px solid #fff" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                         {/* Grayscale filter for edgy look */}
                        <img src={founderImages[0]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '5px', objectFit: 'cover', aspectRatio: '9/16', filter: 'grayscale(100%) contrast(120%)' }} />
                        <img src={founderImages[1]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '5px', objectFit: 'cover', aspectRatio: '1/1', filter: 'grayscale(100%) contrast(120%)' }} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "5px", textTransform: "uppercase" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "12px", color: "#ef4444", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "bold" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#d4d4d8", textAlign: "center" }}>16 Tahun riset Alam Bawah Sadar. Saya bukan motivator yang bakal elus-elus ego lu. Saya adalah arsitek yang bakal ngeruntuhin mental miskin lu dan bangun ulang dari nol.</p>
                </div>

                {/* 8. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#fff", textTransform: "uppercase" }}>Bukti, Bukan Janji</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "#18181b", borderRadius: "5px", padding: "15px", scrollSnapAlign: "center", border: "1px solid #27272a" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "5px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#000" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. TEXT TESTIMONIALS */}
                <div style={{ background: "#000", padding: "30px 20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #27272a" }}>
                     <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", textAlign: "center", color: "#fff", textTransform: "uppercase" }}>Mereka Yang Sudah "Sadar"</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#18181b", padding: "20px", borderRadius: "5px", marginBottom: "15px", borderLeft: "3px solid #ef4444" }}>
                            <div style={{ fontWeight: 700, color: "#fff", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                                <span>{testi.name}</span>
                                {testi.verified && <span style={{color: '#ef4444', fontSize: '10px'}}>VERIFIED</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '10px', textTransform: "uppercase" }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.6, fontStyle: "italic", color: "#d4d4d8" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 10. CURRICULUM */}
                <div style={{ background: "#000", padding: "30px 25px", borderRadius: "10px", marginBottom: "30px", border: "2px solid #ef4444", boxShadow: "0 0 20px rgba(239, 68, 68, 0.1)" }}>
                    <div style={{ background: "#ef4444", color: "#fff", display: "inline-block", padding: "5px 15px", borderRadius: "0px", fontSize: "12px", fontWeight: "900", marginBottom: "20px", textTransform: "uppercase" }}>Kurikulum Brutal</div>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "25px", color: "#fff", lineHeight: 1.2 }}>{content.webinarTitle}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {content.curriculum.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                                <div style={{ background: "#18181b", color: "#ef4444", width: "35px", height: "35px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", flexShrink: 0, border: "1px solid #ef4444" }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#fff", fontSize: "18px", textTransform: "uppercase" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#a1a1aa" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "30px", color: "#fff", textAlign: "center", textTransform: "uppercase" }}>Protokol Bangkit</h2>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#27272a" }}></div>
                        
                        {content.steps.map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "0px", background: "#ef4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2 }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "bold", marginBottom: "5px", textTransform: "uppercase" }}>{step.title}</h3>
                                    <p style={{ color: "#a1a1aa", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 12. PRICING & PAYMENT FORM */}
                <div style={{ background: "#fff", color: "#000", padding: "40px 25px", borderRadius: "10px", marginBottom: "40px" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ marginTop: "10px", fontSize: "24px", fontWeight: 900, marginBottom: "15px", textTransform: "uppercase" }}>Harga Sebuah Perubahan</h2>
                        <p style={{ fontSize: "14px", color: "#52525b", marginBottom: "15px" }}>Nilai aslinya (Setara Top Up Game 1 Tahun):</p>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#ef4444", marginBottom: "5px", fontWeight: "bold" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "48px", fontWeight: 900, color: "#000", marginBottom: "10px", letterSpacing: "-2px" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "13px", color: "#52525b", marginBottom: "30px", fontStyle: "italic" }}>(Cuma seharga kuota sebulan)</p>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-black text-lg flex items-center gap-2 text-black border-b-2 border-black pb-2">
                                <User className="w-5 h-5" /> 1. ISI IDENTITAS LU
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-black font-bold mb-1 block">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        autoComplete="name"
                                        placeholder="Nama Asli Lu" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        className="bg-neutral-100 text-black border-2 border-neutral-300 focus:border-black h-12 font-bold"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email" className="text-black font-bold mb-1 block">Email (Jangan Typo)</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            autoComplete="email"
                                            placeholder="buat kirim link zoom" 
                                            value={userEmail} 
                                            onChange={(e) => setUserEmail(e.target.value)} 
                                            className="bg-neutral-100 text-black border-2 border-neutral-300 focus:border-black h-12"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-black font-bold mb-1 block">WhatsApp Aktif</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            autoComplete="tel"
                                            placeholder="08xxxxxxxx" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)} 
                                            className="bg-neutral-100 text-black border-2 border-neutral-300 focus:border-black h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-lg flex items-center gap-2 text-black border-b-2 border-black pb-2">
                                <CreditCard className="w-5 h-5" /> 2. PILIH CARA BAYAR
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-black bg-neutral-100' : 'border-neutral-200 bg-white hover:border-neutral-400'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-black text-black" />
                                        <div className="flex-1">
                                            <div className="font-bold text-black text-base">{method.name}</div>
                                            <div className="text-xs text-neutral-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            size="lg" 
                            className="w-full text-xl py-8 bg-red-600 hover:bg-red-700 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none text-white border-2 border-black mt-6 uppercase"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> LOADING...</> : content.ctaButton}
                        </Button>
                        
                         <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 font-bold mt-4">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4 text-black" /> 100% SECURE
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-black" /> DATA AMAN
                            </div>
                        </div>
                    </div>
                </div>

                {/* 13. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "25px", color: "#fff", textAlign: "center", textTransform: "uppercase" }}>Jawab Jujur (FAQ)</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {content.faq.map((item, idx) => (
                            <div key={idx} style={{ background: "#18181b", padding: "20px", borderRadius: "5px", border: "1px solid #3f3f46" }}>
                                <div style={{ color: "#ef4444", fontWeight: "900", marginBottom: "10px", fontSize: "16px", textTransform: "uppercase" }}>{item.q}</div>
                                <div style={{ color: "#d4d4d8", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#52525b", fontSize: "12px", borderTop: "1px solid #27272a", paddingTop: "20px" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold", textTransform: "uppercase" }}>eL Vision Group &copy; 2026</p>
                    <p>"Bangun atau Mati Tertidur"</p>
                </div>
            </div>
        </div>
    );
};

export default WebinarPemuda;
