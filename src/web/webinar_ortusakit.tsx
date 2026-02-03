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
import { ArrowLeft, Copy, User, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

const WebinarOrtuSakit = () => {
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
    
    // Hardcoded for this specific webinar
    const productNameBackend = 'webinar_el'; 
    const displayProductName = 'Webinar Rezeki Jalur Langit: Healing Masa Tua';
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

    // Helper to send CAPI events (ONLY for AddPaymentInfo based on instructions)
    const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
      if (eventName !== 'AddPaymentInfo') return; // Restriction applied

      try {
        if (eventId && sentEventIdsRef.current.has(eventId)) return;
        if (eventId) sentEventIdsRef.current.add(eventId);

        await waitForFbp();
        const { data: { session } } = await supabase.auth.getSession();
        const { fbc, fbp } = getFbcFbpCookies();

        const body: any = {
          pixelId,
          eventName,
          customData: eventData,
          eventId: eventId,
          eventSourceUrl: window.location.href,
          testCode: 'testcode_indo',
          userData: {
            client_user_agent: navigator.userAgent,
            email: userEmail || session?.user?.email,
            phone: phoneNumber || session?.user?.user_metadata?.phone,
            fbc,
            fbp
          }
        };

        await supabase.functions.invoke('capi-universal', { body });
      } catch (err) {
        console.error('CAPI Error:', err);
      }
    };

    // Pixel Tracking (PageView & ViewContent ONLY)
    useEffect(() => {
      const initPixel = async () => {
        if (typeof window !== 'undefined' && !hasFiredPixelsRef.current) {
          hasFiredPixelsRef.current = true;
          const { fbc, fbp } = getFbcFbpCookies();
          const userData: AdvancedMatchingData = { 
            fbc: fbc || undefined, 
            fbp: fbp || undefined 
          };

          initFacebookPixelWithLogging(pixelId, userData);

          // 1. PageView (Allowed)
          const pageEventId = `pageview-${Date.now()}`;
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'testcode_indo');

          // 2. ViewContent (Allowed)
          const viewContentEventId = `viewcontent-${Date.now()}`;
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
        toast({
            title: "Pendaftaran Ditutup",
            description: "Maaf pendaftaran batch ditutup, tunggu batch selanjutnya",
            variant: "destructive",
        });
        return;

        if (isProcessingRef.current) return;
        if (!userName || !userEmail || !phoneNumber) {
            toast({ title: "Mohon lengkapi data diri Anda.", variant: "destructive" });
            return;
        }

        isProcessingRef.current = true;
        setLoading(true);

        try {
             if (!addPaymentInfoFiredRef.current) {
                addPaymentInfoFiredRef.current = true;
                const eventId = `addpaymentinfo-${Date.now()}`;
                sendCapiEvent('AddPaymentInfo', {
                  content_ids: [productNameBackend],
                  content_type: 'product',
                  value: productPrice,
                  currency: 'IDR'
                }, eventId);
            }

            const { fbc, fbp } = getFbcFbpCookies();
            const { data } = await supabase.functions.invoke('tripay-create-payment', {
                body: {
                  subscriptionType: productNameBackend,
                  paymentMethod: selectedPaymentMethod,
                  userName,
                  userEmail,
                  phoneNumber,
                  amount: productPrice,
                  quantity: 1,
                  productName: displayProductName,
                  fbc,
                  fbp
                }
            });

            if (data?.success) {
                setPaymentData(data);
                setShowPaymentInstructions(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast({ title: "Gagal memproses pembayaran.", description: data?.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Koneksi Bermasalah", variant: "destructive" });
        } finally {
            setLoading(false);
            isProcessingRef.current = false;
        }
    };

    // Realtime Payment Listener (No CAPI/Pixel Purchase as per request)
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
            if (payload.new?.status === 'PAID' && !purchaseFiredRef.current) {
              purchaseFiredRef.current = true;
              toast({ title: "Pembayaran Lunas!", description: "Akses webinar telah dikirim ke WhatsApp/Email Anda." });
            }
          }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    const content = {
        targetBadge: "KHUSUS ORANG TUA YANG MERASA TUBUH SERING SAKIT",
        headline: "Kenapa Sudah Berobat Ke Mana-Mana, Tapi Sakit Tak Kunjung Reda?",
        subheadline: "Bapak/Ibu, mungkin masalahnya bukan di organ tubuh, tapi di 'Beban Batin' yang selama belasan tahun ini Bapak/Ibu simpan sendiri tanpa pernah dilepaskan.",
        painTitle: "Apakah Tubuh Bapak/Ibu Mulai Mengirimkan Sinyal Ini?",
        painPoints: [
            { icon: "🩺", text: <span><strong>"Sakit yang Berpindah-pindah."</strong> Kadang lambung perih, kadang pinggang kaku, kadang kepala berat. Hasil lab normal, tapi rasa sakitnya nyata.</span> },
            { icon: "🛌", text: <span><strong>"Tidur Tak Pernah Nyenyak."</strong> Badan lelah tapi pikiran terus berputar. Bangun pagi bukannya segar, malah merasa makin berat memikul hari.</span> },
            { icon: "😔", text: <span><strong>"Takut Menjadi Beban."</strong> Rasa sedih melihat anak cucu repot mengurus kita yang sakit-sakitan. Inginnya sehat dan bahagia di masa tua.</span> }
        ],
        logicTitle: "Bahaya 'Meredam' Luka Batin",
        logicDescription: "Bapak/Ibu sering berkata <em>'Tidak apa-apa'</em> padahal batin menangis. Tubuh tidak bisa berbohong. Luka batin yang diredam berubah menjadi racun (Kortisol) yang merusak sel tubuh.<br/><br/><strong>INGAT BAPAK/IBU:</strong><br/>Selama sumber 'Stres' di pikiran bawah sadar tidak dibersihkan, obat apapun hanya akan menjadi penawar sementara.",
        agitationTitle: "LINGKARAN SETAN PENYAKIT",
        agitationText: [
            "Penyakit fisik adalah cara tubuh 'berteriak' karena Bapak/Ibu tidak mau mendengarkan batin sendiri.",
            "Jika Bapak/Ibu terus menunda untuk 'membereskan' akar stres ini, organ tubuh akan terus meradang. Jangan tunggu sampai kondisi menjadi permanen baru Bapak/Ibu menyesal.",
            "Melewatkan webinar ini berarti membiarkan bom waktu di dalam sel tubuh Bapak/Ibu terus berdetak setiap hari."
        ],
        agitationBullets: [
            { trigger: "Banyak Khawatir?", result: "Asam Lambung & Maag Kronis." },
            { trigger: "Sering Memendam Marah?", result: "Tekanan Darah & Jantung." },
            { trigger: "Terlalu Keras Memaksa Diri?", result: "Saraf Terjepit & Sendi Kaku." }
        ],
        agitationClosing: "Bapak/Ibu berhak menikmati masa tua dengan senyum, bukan dengan rintihan.",
        shiftTitle: "Keadilan Untuk Tubuh Bapak/Ibu",
        shiftDescription: "Webinar ini bukan sekadar motivasi. Kami akan memandu Bapak/Ibu melakukan 'Self-Healing' untuk melepaskan beban emosi masa lalu yang terjebak di jaringan saraf.",
        shiftResults: [
            "✅ Nafas terasa lebih plong dan badan jauh lebih ringan.",
            "✅ Tidur pulas berkualitas tanpa perlu obat tidur.",
            "✅ Ketenangan batin yang membuat hormon kebahagiaan (Dopamin) memperbaiki sel tubuh secara alami."
        ],
        webinarTitle: 'WEBINAR: "REZEKI JALUR LANGIT: HEALING & KESEHATAN BATIN"',
        eventDate: "Minggu, 22 Februari 2026 | 17:00 WIB",
        curriculum: [
            { title: 'The Body Keep the Score', desc: 'Memahami organ tubuh mana yang sedang memikul beban emosi Bapak/Ibu.' },
            { title: 'Teknik Lepas Beban', desc: 'Metode sederhana melepas dendam, kecewa, dan trauma tanpa perlu cerita ke siapapun.' },
            { title: 'Vibrasi Kesembuhan', desc: 'Menaikkan level energi tubuh agar sistem imun bekerja maksimal menyembuhkan diri sendiri.' }
        ],
        priceAnchor: "Rp 5.000.000,-",
        priceReal: "Rp 199.999,-",
        ctaButton: "👉 SAYA MAU ORANG TUA SAYA PULIH",
        steps: [
            { title: "Langkah 1: Pilih Metode", desc: "Isi data dan amankan kursi Bapak/Ibu sebelum slot habis." },
            { title: "Langkah 2: Persiapan Diri", desc: "Masuk ke grup VIP untuk mendapatkan panduan awal sebelum hari-H." },
            { title: "Langkah 3: Sesi Live Healing", desc: "Hadir via Zoom jam 17:00 WIB. Kita akan praktek melepaskan beban batin bersama-sama." }
        ],
        faq: [
            { q: "Saya sudah tua dan tidak paham teknologi, bagaimana?", a: "Jangan khawatir, Bapak/Ibu. Kami akan bantu lewat WhatsApp langkah demi langkah sampai Bapak/Ibu bisa masuk ke ruangan Zoom." },
            { q: "Apakah ini menggantikan pengobatan medis?", a: "Sama sekali tidak. Ini melengkapi medis dengan cara menyembuhkan faktor psikologisnya (Psikosomatis)." },
            { q: "Saya sangat sibuk dengan cucu/pekerjaan, apakah ada rekaman?", a: "Sangat disarankan hadir live untuk energi healing yang lebih kuat, namun rekaman akan kami berikan jika Bapak/Ibu berhalangan." },
            { q: "Apakah boleh diikuti oleh orang yang sedang sakit parah?", a: "Justru sangat disarankan. Selama Bapak/Ibu masih bisa mendengarkan suara, sesi ini akan sangat membantu ketenangan batin." }
        ]
    };

    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Sembuh dari Insomnia Akut", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg" },
        { name: "Dr. Gumilar", title: "Pandangan Medis & Psikologi", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg" },
        { name: "Habib Umar", title: "Ketenangan Spiritual", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg" },
        { name: "Umi Jamilah", title: "Melepas Beban Masa Lalu", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg" },
        { name: "Felicia", title: "Transformasi Kesehatan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg" },
        { name: "Lena", title: "Bebas dari Maag Kronis", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg" },
        { name: "Vio", title: "Energi Baru Masa Tua", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg" }
    ];

    const testimonials = [
        { name: "Hj. Ratna Sari", title: "Pensiunan, 64 Thn", verified: true, text: "Dulu kaki saya kaku sekali, jalan saja susah. Ternyata saya memendam kecewa pada anak saya bertahun-tahun. Setelah ikut eL Vision, beban itu lepas, kaki saya sekarang enteng sekali. Ajaib." },
        { name: "Bpk. Subandrio", title: "Wiraswasta, 58 Thn", verified: true, text: "Jantung sering berdebar dan tensi naik terus. Ternyata stres kerjaan yang saya simpan. Sekarang saya jauh lebih tenang, obat tensi dikurangi dosisnya oleh dokter karena sudah stabil." },
        { name: "Ibu Kartini", title: "Ibu Rumah Tangga", verified: true, text: "Saya pikir sakit kepala saya karena faktor usia. Ternyata karena saya tidak pernah memaafkan diri sendiri. Terima kasih eL Vision, saya merasa lahir kembali." },
        { name: "Suryadi", title: "Mengelola Yayasan", verified: true, text: "Membimbing orang banyak buat saya lelah batin. Meditasi ini membuat energi saya penuh lagi. Tubuh tidak lagi terasa pegal-pegal setiap bangun tidur." },
        { name: "Linda", title: "Lansia Aktif", verified: true, text: "Investasi kesehatan terbaik. Bukan beli suplemen mahal, tapi beli 'ketenangan pikiran'. Sakit punggung saya hilang setelah sesi melepaskan trauma masa kecil." },
        { name: "Bpk. Arif", title: "Pejuang Kesembuhan", verified: true, text: "Metode ini logis dan sangat masuk akal bagi kami yang sudah berumur. Tidak ada mistis, murni manajemen emosi untuk kesembuhan sel tubuh." },
        { name: "Dr. Gumilar", title: "Tenaga Medis", verified: true, text: "Sebagai dokter, saya melihat metode ini membantu mempercepat proses pemulihan pasien secara psikis. Sangat direkomendasikan untuk lansia." },
        { name: "Felicia Quincy", title: "Pengusaha", verified: true, text: "Ketegangan di wajah dan leher saya hilang total. Kualitas hidup meningkat drastis karena batin sudah damai." }
    ];

    return (
      <div className="relative">
        <Toaster />
        {showPaymentInstructions && paymentData ? (
          <div className="min-h-screen bg-teal-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-teal-100">
              <div className="p-4 bg-teal-700 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-teal-800">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Konfirmasi Pembayaran</h1>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Investasi Kesehatan</p>
                    <p className="text-3xl font-bold text-teal-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium border border-teal-200">
                        Menunggu Transaksi
                    </div>
                </div>
                <Card className="border-2 border-teal-50 bg-white shadow-sm">
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
                    {paymentData.qrUrl ? (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border border-teal-200 rounded-lg" />
                            <p className="text-xs text-slate-500 mt-2 text-center">Silakan scan kode di atas menggunakan HP Bapak/Ibu.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label className="text-slate-600">Nomor Rekening / Virtual Account</Label>
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <span className="font-mono text-xl font-bold tracking-wider text-teal-600">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-teal-600">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="bg-teal-50 p-3 rounded text-sm text-teal-800 border border-teal-100">
                        <p><strong>PETUNJUK:</strong> Setelah membayar, sistem akan langsung mengenali identitas Bapak/Ibu. Mohon tunggu sejenak.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2f1 100%)",
            color: "#1e293b",
            lineHeight: 1.6
        }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* HEADER LOGO */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#0d9488", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Healing & Mindfulness Center</div>
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

                <div style={{ textAlign: "center", padding: "40px 20px", background: "#ffffff", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(13, 148, 136, 0.1)", border: "1px solid rgba(13, 148, 136, 0.1)" }}>
                    <span style={{ background: "rgba(13, 148, 136, 0.1)", color: "#0d9488", padding: "10px 25px", borderRadius: "50px", fontSize: "15px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px" }}>
                        {content.targetBadge}
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "15px", lineHeight: 1.3 }}>{content.headline}</h1>
                    <p style={{ fontSize: "17px", color: "#475569", marginBottom: "0px", fontStyle: 'italic' }}>{content.subheadline}</p>
                    <div style={{ marginTop: "25px", background: "rgba(13, 148, 136, 0.05)", display: "inline-block", padding: "10px 20px", borderRadius: "12px", border: "1px solid #0d9488", color: "#0d9488", fontWeight: "bold" }}>
                        🗓️ {content.eventDate}
                    </div>
                </div>

                {/* PAIN SECTION */}
                <div style={{ background: "#ffffff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "6px solid #0d9488", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ fontSize: "21px", fontWeight: 700, color: "#0d9488", marginBottom: "20px" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: '#f0fdfa', padding: '18px', borderRadius: '15px', border: '1px solid #ccfbf1' }}>
                                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '15px', color: '#334155' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <div style={{ background: "rgba(220, 38, 38, 0.05)", padding: "25px", borderRadius: "20px", textAlign: "center", border: "1px dashed #ef4444", color: "#991b1b" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "15px" }}>{content.logicTitle}</h2>
                        <p style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                {/* AGITATION */}
                <div style={{ background: "#ffffff", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#b91c1c" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "16px", lineHeight: 1.8, marginBottom: "20px", color: "#475569" }}>{text}</p>
                    ))}
                    <div style={{ background: "#fff1f2", padding: "20px", borderRadius: "15px", marginBottom: "25px", border: "1px solid #fecdd3" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: "10px 0", color: "#1e293b", fontSize: "15px" }}>{bullet.trigger} 👉 <strong style={{color: "#be123c"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "18px", color: "#0f172a" }}>{content.agitationClosing}</p>
                </div>

                {/* SOLUTION */}
                <div style={{ background: "#0d9488", color: "#ffffff", padding: "35px 25px", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(13, 148, 136, 0.3)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "20px", textAlign: "center" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "25px", textAlign: "center", fontSize: "16px", color: "#ccfbf1" }}>{content.shiftDescription}</p>
                    <div style={{ padding: "20px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                        <p style={{ fontWeight: "bold", color: "#5eead4", marginBottom: "15px", textAlign: "center" }}>🌿 HASIL YANG BAPAK/IBU RASAKAN:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "10px 0", borderBottom: idx !== 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>{res}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FEATURED TESTIMONY: ARIF (CANCER STAGE 4) */}
                <div style={{ background: "#ffffff", padding: "35px 25px", borderRadius: "25px", marginBottom: "30px", border: "3px solid #0d9488", boxShadow: "0 10px 30px rgba(13, 148, 136, 0.2)" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <span style={{ background: "#0d9488", color: "#ffffff", padding: "5px 15px", borderRadius: "50px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Kisah Paling Menginspirasi
                        </span>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginTop: "15px" }}>Sembuh Dari Kanker Stadium 4</h2>
                        <p style={{ fontSize: "14px", color: "#475569", marginTop: "5px" }}>Keajaiban Sel Tubuh & Kekuatan Pikiran Bawah Sadar</p>
                    </div>
                    <video 
                        controls 
                        playsInline 
                        poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg" 
                        style={{ 
                            width: "100%", 
                            borderRadius: "15px", 
                            aspectRatio: "9/16", 
                            objectFit: "cover", 
                            backgroundColor: "#000" 
                        }}
                    >
                        <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div style={{ marginTop: "15px", textAlign: "center" }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px", color: "#0d9488" }}>Arif</div>
                        <div style={{ fontSize: "13px", color: "#64748b" }}>Survivor Kanker Stadium 4</div>
                    </div>
                </div>

                {/* AUTHORITY */}
                <div style={{ background: "#ffffff", padding: "35px 25px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                        <img src={founderImages[0]} alt="eL" style={{ width: '100%', borderRadius: '20px', aspectRatio: '16/9', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0d9488", marginBottom: "5px" }}>eL Reyzandra</h2>
                        <div style={{ fontSize: "12px", color: "#64748b", letterSpacing: "2px", textTransform: "uppercase" }}>Master Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", textAlign: "center", color: "#475569" }}>"Saya telah mendampingi ribuan orang tua menemukan kembali kesehatannya melalui pembersihan energi dan batin. Penyakit fisik seringkali hanyalah 'tamu' yang ingin memberi tahu ada sesuatu yang belum selesai di hati."</p>
                </div>

                {/* VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "21px", fontWeight: 800, marginBottom: "25px", textAlign: "center" }}>Kisah Kesembuhan Nyata</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "240px", background: "#ffffff", borderRadius: "18px", padding: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "12px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "12px" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0d9488" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TEXT TESTIMONIALS */}
                <div style={{ background: "#ffffff", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #f1f5f9" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "25px", textAlign: "center" }}>Apa Kata Mereka?</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px", marginBottom: "15px", border: '1px solid #edf2f7' }}>
                            <div style={{ fontWeight: 700, color: "#0d9488", marginBottom: "5px" }}>{testi.name} {testi.verified && "✓"}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", fontStyle: "italic", color: "#334155" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* CURRICULUM */}
                <div style={{ background: "#ffffff", padding: "35px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #0d9488" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", textAlign: "center" }}>Materi Pembelajaran</h2>
                    {content.curriculum.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                            <div style={{ background: "#0d9488", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{idx + 1}</div>
                            <div>
                                <strong style={{ color: "#0d9488", fontSize: "17px" }}>{item.title}</strong>
                                <p style={{ fontSize: "14px", color: "#64748b", marginTop: "5px" }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PRICING & FORM */}
                <div style={{ background: "white", padding: "45px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "10px" }}>Investasi Kesehatan Masa Tua</h2>
                        <div style={{ fontSize: "18px", textDecoration: "line-through", color: "#94a3b8" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "48px", fontWeight: 900, color: "#0d9488", margin: "10px 0" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "30px" }}>*Hanya untuk 50 pendaftar pertama hari ini</p>
                    </div>

                    <div style={{ background: "#fffbeb", border: "1px dashed #0d9488", padding: "15px", borderRadius: "15px", marginBottom: "30px", textAlign: "left" }}>
                        <p style={{ fontSize: "14px", color: "#0f766e", fontWeight: "bold", marginBottom: "5px" }}>🎁 BONUS EKSKLUSIF LANGSUNG:</p>
                        <p style={{ fontSize: "13px", color: "#0d9488", lineHeight: "1.5" }}>Anda juga mendapatkan <strong>Ebook eL Vision Pro + Audio Hipnosis Set</strong> selama menunggu Webinar yang bisa anda praktekan langsung untuk hasil instan.</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-teal-700 flex items-center gap-2">
                                <User className="w-5 h-5" /> Data Diri Bapak/Ibu
                            </h3>
                            <Input placeholder="Nama Lengkap" value={userName} onChange={(e) => setUserName(e.target.value)} className="h-12 border-slate-200" />
                            <Input placeholder="Email (Untuk akses webinar)" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="h-12 border-slate-200" />
                            <Input placeholder="Nomor WhatsApp (0812...)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="h-12 border-slate-200" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-teal-700">Pilih Metode Pembayaran</h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid gap-3">
                                {paymentMethods.map((m) => (
                                    <Label key={m.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === m.code ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                        <RadioGroupItem value={m.code} className="mt-1 mr-3" />
                                        <div>
                                            <div className="font-bold">{m.name}</div>
                                            <div className="text-xs text-slate-500">{m.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            className="w-full py-8 text-xl bg-teal-600 hover:bg-teal-700 font-bold shadow-lg mt-4 text-white" 
                            onClick={handleCreatePayment} 
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : content.ctaButton}
                        </Button>
                        <div className="flex justify-center gap-4 text-[10px] text-slate-400 mt-4 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Pembayaran Aman</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verifikasi Otomatis</span>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div style={{ marginBottom: "50px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", textAlign: "center" }}>Tanya Jawab</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {content.faq.map((f, i) => (
                            <div key={i} style={{ background: "#ffffff", padding: "20px", borderRadius: "15px", border: "1px solid #f1f5f9" }}>
                                <div style={{ color: "#0d9488", fontWeight: "bold", marginBottom: "8px" }}>{f.q}</div>
                                <div style={{ color: "#475569", fontSize: "14px" }}>{f.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: "center", paddingBottom: "40px", color: "#94a3b8", fontSize: "12px" }}>
                    <p>© 2026 eL Vision Group. Seluruh Hak Cipta Dilindungi.</p>
                    <p>"Bahagia Adalah Koentji Sehat"</p>
                </div>
            </div>
        </div>
        )}
      </div>
    );
};

export default WebinarOrtuSakit;