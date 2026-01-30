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
    
    // Product Config (Webinar Kesehatan Psikosomatis)
    const productNameBackend = 'webinar_senior_health'; 
    const displayProductName = 'Webinar Self-Healing: Sehat Tanpa Beban Pikiran';
    const productPrice = 200000;
    const pixelId = '3319324491540889';

    const paymentMethods = [
        { code: 'QRIS', name: 'QRIS', description: 'Gopay, OVO, Dana, ShopeePay, BCA Mobile, dll' },
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

    // Helper to send CAPI events
    const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {    
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
          testCode: 'TEST33364'
        };

        const userData: any = { client_user_agent: navigator.userAgent };

        if (userEmail) userData.email = userEmail;
        else if (session?.user?.email) userData.email = session.user.email;
        
        if (phoneNumber) userData.phone = phoneNumber;
        else if (session?.user?.user_metadata?.phone) userData.phone = session.user.user_metadata.phone;
        
        let rawName = userName;
        if (!rawName && session?.user?.user_metadata?.full_name) rawName = session.user.user_metadata.full_name;

        if (rawName) {
            const nameParts = rawName.trim().split(/\s+/);
            userData.fn = nameParts[0];
            if (nameParts.length > 1) userData.ln = nameParts.slice(1).join(' ');
        }

        if (session?.user?.id) userData.external_id = session.user.id;
        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;
        
        body.userData = userData;

        await supabase.functions.invoke('capi-universal', { body });
      } catch (err) {
        console.error('Failed to send CAPI event:', err);
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
          if (session?.user?.id) userData.external_id = session.user.id;
          if (fbc) userData.fbc = fbc;
          if (fbp) userData.fbp = fbp;

          initFacebookPixelWithLogging(pixelId, userData);

          const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'TEST33364');

          const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
                title: "Data Tidak Lengkap",
                description: "Mohon lengkapi nama, email, whatsapp, dan pilih metode bayar.",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            toast({ title: "Email Tidak Valid", variant: "destructive" });
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
                  title: "Gagal Memproses",
                  description: data?.error || "Terjadi kesalahan sistem.",
                  variant: "destructive",
                });
                return;
            }

            if (data?.success) {
                setPaymentData(data);
                setShowPaymentInstructions(true);
                toast({ title: "Order Berhasil Dibuat!" });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal menghubungi server.", variant: "destructive" });
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
          }, (payload: any) => {
            if (payload.new?.status === 'PAID') {
              if (purchaseFiredRef.current) return;
              purchaseFiredRef.current = true;
              toast({
                  title: "SEMOGA LEKAS SEMBUH!",
                  description: "Akses webinar sudah dikirim ke email Bapak/Ibu. Sampai jumpa di sesi terapi.",
                  duration: 8000, 
              });
            }
          }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Peserta Senior", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Dokter & Terapis", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Tokoh Agama", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Pensiunan Guru", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "👵" },
        { name: "Felicia", title: "Pengusaha", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Ibu Rumah Tangga", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Peserta", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "Wiraswasta", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];

    const testimonials = [
        {
          name: "Bu Hartini, 62th",
          title: "Pensiunan",
          verified: true,
          text: "Sudah 3 tahun saya insomnia parah dan asam lambung kronis. Bolak-balik dokter cuma dikasih obat penenang. Ternyata akar masalahnya 'Kepahitan Masa Lalu' yang saya pendam. Setelah sesi terapi eL Vision, malamnya saya tidur nyenyak seperti bayi."
        },
        {
          name: "Pak Budi, 58th",
          title: "Wiraswasta",
          verified: true,
          text: "Dulu tiap hari cemas, takut mati, takut anak susah. Tensi saya selalu tinggi. Mas eL mengajarkan saya 'Ikhlas' yang sesungguhnya. Sekarang tensi normal tanpa obat, hidup jadi enteng."
        },
        {
          name: "Ibu Sri, 65th",
          title: "Ibu Rumah Tangga",
          verified: true,
          text: "Saya pikir sakit sendi ini faktor umur (U). Tapi setelah ikut webinar, saya sadar ini karena saya terlalu kaku dan perfeksionis. Saat pikiran saya rileks, eh lutut saya kok jadi enak buat jalan pagi."
        },
        {
          name: "Felicia Quincy",
          title: "Praktisi Wellness",
          verified: true,
          text: "Kesehatan itu 80% pikiran, 20% makanan. Program ini wajib buat orang tua yang capek minum obat. Self-healing is real."
        },
        {
          name: "David Sutanto",
          title: "Anak Peserta",
          verified: true,
          text: "Saya daftarin Papa saya yang stroke ringan dan sering marah-marah. Ajaib, setelah ikut program, emosi Papa stabil, pemulihannya jadi cepat banget. Terima kasih eL Vision."
        }
    ];

    if (showPaymentInstructions && paymentData) {
        return (
          <div className="min-h-screen bg-emerald-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-emerald-100">
              <div className="p-4 bg-emerald-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-emerald-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Instruksi Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Investasi Kesehatan</p>
                    <p className="text-3xl font-bold text-emerald-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium border border-amber-200">
                        Menunggu Konfirmasi
                    </div>
                </div>
    
                <Card className="border-2 border-emerald-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-emerald-50 pb-4 mb-4">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Ref. Transaksi</Label>
                        <div className="flex items-center justify-between bg-emerald-50/50 p-2 rounded border border-emerald-100">
                            <span className="font-mono text-sm text-emerald-700">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-emerald-500">
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border-2 border-emerald-100 rounded-xl p-2 bg-white" />
                            <p className="text-sm text-slate-500 mt-4 text-center">Silakan scan QRIS di atas untuk membayar.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-500">Kode VA / Nomor Bayar</Label>
                            <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                <span className="font-mono text-2xl font-black text-emerald-700">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-emerald-600">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-200">
                        <p><strong>PENTING:</strong> Bapak/Ibu, mohon selesaikan pembayaran agar kami bisa segera mengirimkan link terapi via WhatsApp/Email.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk Webinar Kesehatan ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                    Chat Admin (Bantuan)
                </Button>
              </div>
            </div>
          </div>
        );
      }

    return (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)", // Mint/Emerald to White
            color: "#064e3b", // Dark Emerald Green Text
            lineHeight: 1.6
        }}>
            <Toaster />
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Official Health & Longevity Series</div>
                </div>

                {/* 2. HERO SECTION */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                    <span style={{ background: "#d1fae5", color: "#047857", padding: "10px 25px", borderRadius: "50px", fontSize: "14px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "2px solid #a7f3d0" }}>
                        KHUSUS ORANG TUA YANG INGIN SEHAT ALAMI
                    </span>
                    <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#064e3b", marginBottom: "15px", lineHeight: 1.4 }}>
                        Bapak/Ibu, Jujur... Apakah Lelah Minum Obat Terus, Tapi Penyakit Tidak Pergi Juga?
                    </h1>
                    <p style={{ fontSize: "16px", color: "#059669", marginBottom: "10px", lineHeight: 1.6, fontWeight: 500 }}>
                        Tubuh menua itu pasti, tapi sakit-sakitan itu pilihan. Jangan biarkan "pikiran" membuat masa tua Bapak/Ibu menderita.
                    </p>
                    <div style={{ marginTop: "15px", fontWeight: "bold", color: "#d97706" }}>
                        📅 LIVE: Minggu, 22 Februari 2026, 17:00 WIB
                    </div>
                </div>

                {/* 3. PAIN POINTS */}
                <div style={{ background: "#fff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #10b981", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#047857", marginBottom: "20px" }}>Apakah Ini Yang Bapak/Ibu Rasakan?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>💊</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#166534' }}>
                                <strong>"Apotek Berjalan"</strong> — Ke mana-mana harus bawa obat maag, obat tensi, obat tidur, obat nyeri sendi. Lelah rasanya bergantung pada kimia.
                            </p>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>😟</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#166534' }}>
                                <strong>"Takut Jadi Beban"</strong> — Sering merasa bersalah kalau sakit, takut merepotkan anak cucu. Akhirnya sakitnya dipendam sendiri.
                            </p>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>💭</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#166534' }}>
                                <strong>"Overthinking Malam Hari"</strong> — Susah tidur karena memikirkan masa lalu, penyesalan, atau cemas berlebihan soal kematian.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#064e3b" }}>"Namanya Juga Sudah Tua..."</h2>
                    <p style={{ marginBottom: "15px", color: "#334155", textAlign: "center" }}>Sering mendengar kalimat itu? Itu <strong>MITOS</strong>, Pak/Bu.</p>
                    <div style={{ background: "#fffbeb", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #f59e0b", color: "#b45309" }}>
                        <strong>Fakta Medis:</strong><br/>
                        70-90% penyakit di usia tua bukan karena fisik yang lemah,<br/>
                        tapi karena <strong>STRES (Pikiran)</strong> yang merusak sistem imun.
                    </div>
                </div>

                {/* 5. AGITATION & SOLUTION */}
                <div style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 100%)", color: "white", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", border: "2px solid #34d399" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#fcd34d" }}>TUBUH YANG MENJERIT</h2>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                        Maag Kronis seringkali adalah "Kemarahan yang Tak Tertelan".<br/>
                        Nyeri Sendi seringkali adalah "Kekakuan Hati/Keras Kepala".<br/>
                        Insomnia adalah "Ketakutan Kehilangan Kontrol".
                    </p>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                        <p style={{ margin: 0 }}>Bapak/Ibu tidak butuh lebih banyak obat.</p>
                        <p style={{ margin: "10px 0" }}>Bapak/Ibu butuh <strong>KEDAMAIAN PIKIRAN.</strong></p>
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#6ee7b7" }}>
                        Mari kita "Reset" pikiran agar tubuh bisa menyembuhkan dirinya sendiri (Self-Healing).
                    </p>
                </div>

                {/* 6. AUTHORITY */}
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #a7f3d0" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#059669", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#047857", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginTop: "20px", color: "#064e3b", textAlign: "center" }}>
                        Saya bukan Dokter yang memberi resep obat. Saya adalah "Insinyur Pikiran" yang membantu Bapak/Ibu membuang sampah emosi (dendam, sesal, cemas) yang selama ini menjadi racun bagi organ tubuh Bapak/Ibu.
                    </p>
                </div>

                {/* 7. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#064e3b" }}>Mereka yang Sehat Kembali</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "white", borderRadius: "15px", padding: "15px", scrollSnapAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#000" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1a1a1a" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 8. TEXT TESTIMONIALS */}
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #6ee7b7" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#059669" }}>Mukjizat Kesembuhan</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f0fdf4", padding: "20px", borderRadius: "10px", marginBottom: "15px" }}>
                            <div style={{ fontWeight: 700, color: "#047857", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#059669'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#064e3b" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 9. CURRICULUM */}
                <div style={{ background: "white", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #059669" }}>
                    <div style={{ background: "#059669", color: "white", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#064e3b" }}>WEBINAR: "SEHAT TANPA BEBAN"</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {[
                            { title: 'Emotional Detox', desc: 'Cara membuang "sampah batin" (kekecewaan & dendam) agar organ tubuh tidak tergerogoti dari dalam.' },
                            { title: 'Sleep of The Righteous', desc: 'Teknik tidur lelap tanpa obat penenang, bangun segar bugar.' },
                            { title: 'The Immuno-Mind', desc: 'Cara memerintahkan otak untuk memproduksi hormon penyembuh alami tubuh.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "#d1fae5", color: "#047857", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#047857" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#334155" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 10. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#064e3b", textAlign: "center" }}>Langkah Menuju Sehat</h2>
                    <div style={{ position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#a7f3d0" }}></div>
                        
                        {[
                            { title: "Langkah 1: Niat Sembuh", desc: "Daftar di bawah. Investasi Rp 200.000,- (Jauh lebih murah dari sekali ke Dokter Spesialis)." },
                            { title: "Langkah 2: Grup Keluarga", desc: "Bergabung ke Grup WhatsApp yang isinya saling mendoakan dan support, bukan sebar hoax." },
                            { title: "Langkah 3: Live Therapy", desc: "Hadir di Webinar 22 Feb 2026. Siapkan tempat duduk yang nyaman untuk sesi relaksasi." }
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid white" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#059669", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#475569", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(5, 150, 105, 0.1)", border: "1px solid #a7f3d0" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Masa Tua Bahagia</h2>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#94a3b8" }}>Rp 5.000.000,-</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#d97706", marginBottom: "10px" }}>Rp 200.000,-</div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "30px" }}>(Biaya ini sekali bayar, ilmunya untuk kesehatan seumur hidup)</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-700">
                                <User className="w-5 h-5" /> Data Diri Bapak/Ibu
                            </h3>
                            <div className="grid gap-4">
                                <Input 
                                    placeholder="Nama Lengkap" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-white text-slate-900 border-emerald-200 h-12 focus:border-emerald-500 placeholder:text-slate-400"
                                />
                                <Input 
                                    type="email" 
                                    placeholder="Email (Bisa pakai email anak jika tidak punya)" 
                                    value={userEmail} 
                                    onChange={(e) => setUserEmail(e.target.value)} 
                                    className="bg-white text-slate-900 border-emerald-200 h-12 focus:border-emerald-500 placeholder:text-slate-400"
                                />
                                <Input 
                                    placeholder="Nomor WhatsApp" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    className="bg-white text-slate-900 border-emerald-200 h-12 focus:border-emerald-500 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-700">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-300 text-emerald-600" />
                                        <div>
                                            <div className="font-bold text-slate-800">{method.name}</div>
                                            <div className="text-xs text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            className="w-full text-lg py-8 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 font-black shadow-xl rounded-full text-white border-none"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "🌿 SAYA MAU SEHAT & BAHAGIA"}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Data Aman</div>
                            <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-600" /> Garansi Kepuasan</div>
                        </div>
                    </div>
                </div>

                {/* 12. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#064e3b", textAlign: "center" }}>Pertanyaan Bapak/Ibu</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {[
                            { q: "Saya gaptek, takut salah pencet.", a: "Tidak perlu khawatir. Nanti ada tim admin kami yang sabar memandu Bapak/Ibu lewat WhatsApp sampai bisa masuk ke acara." },
                            { q: "Apakah saya harus berhenti minum obat dokter?", a: "JANGAN berhenti tanpa izin dokter. Terapi ini bersifat pendamping (komplementer) untuk mempercepat kesembuhan dari dalam." },
                            { q: "Saya sakitnya sudah tahunan, apa masih bisa?", a: "Selama masih bernapas, sel tubuh selalu berganti baru. Jika pikiran diperbaiki, sel baru yang tumbuh akan lebih sehat. Tidak ada kata terlambat." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
                                <div style={{ color: "#059669", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
                                <div style={{ color: "#334155", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#94a3b8", fontSize: "12px" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold" }}>eL Vision Group</p>
                    <p>"Bahagia Adalah Koentji"</p>
                </div>
            </div>
        </div>
    );
};

export default WebinarOrtuSakit;