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

const WebinarBurnout = () => {
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
    
    // Product Config (Webinar Burnout)
    const productNameBackend = 'webinar_burnout_muda'; // ID Backend disesuaikan
    const displayProductName = 'Webinar Career Reset: Burnout to Breakout';
    const productPrice = 200000;
    const pixelId = '3319324491540889'; // Pixel ID tetap sama sesuai request

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
                  title: "PEMBAYARAN DITERIMA!",
                  description: "Akses sudah dikirim ke email Anda. Sampai jumpa di Webinar!",
                  duration: 8000, 
              });
            }
          }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Profesional", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Praktisi Kesehatan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Tokoh Masyarakat", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Pemilik Yayasan", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "👳‍♀️" },
        { name: "Felicia", title: "Pengusaha Muda", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Karyawan Swasta", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Freelancer", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "IT Professional", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];

    const testimonials = [
        {
          name: "Raka, 27th",
          title: "Creative Designer",
          verified: true,
          text: "Gue kira burnout itu wajar, ternyata itu sinyal bahaya. Dulu tiap Senin rasanya mau resign. Setelah ikut sesi eL Vision, gue nemu 'tombol reset'. Kerjaan sama beratnya, tapi energi gue gak abis-abis. Ajaib!"
        },
        {
          name: "Dimas, 30th",
          title: "Staff Perbankan",
          verified: true,
          text: "Gaji UMR Jakarta, cicilan banyak, stress pol. Saya pikir solusinya cari side job, eh malah makin sakit. Ternyata masalahnya di mindset 'Mental Miskin' saya. Sekarang karir malah nanjak tanpa harus jilat atasan."
        },
        {
          name: "Sarah, 25th",
          title: "Auditor Junior",
          verified: true,
          text: "Sering nangis di toilet kantor saking capeknya. Ikut webinar ini iseng doang, tapi efeknya gila. Saya jadi lebih assertif, berani negosiasi, dan anehnya... rezeki sampingan malah masuk sendiri."
        },
        {
          name: "Felicia Quincy",
          title: "Entrepreneur",
          verified: true,
          text: "Program ini mengubah cara saya memandang 'Hustle Culture'. Dulu kerja 18 jam sehari, hasil minim. Sekarang kerja cerdas, mental sehat, cuan lebih deras."
        },
        {
          name: "David Sutanto",
          title: "Tech Lead",
          verified: true,
          text: "Buat lo yang ngerasa 'stuck' di karir, wajib ikut. Ini bukan motivasi kosong, tapi teknik engineering pikiran yang logis. Lo bakal paham kenapa selama ini lo capek tapi dompet tipis."
        }
    ];

    if (showPaymentInstructions && paymentData) {
        return (
          <div className="min-h-screen bg-blue-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-blue-100">
              <div className="p-4 bg-blue-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-blue-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Instruksi Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Investasi</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium border border-orange-200">
                        Menunggu Verifikasi
                    </div>
                </div>
    
                <Card className="border-2 border-blue-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-blue-50 pb-4 mb-4">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Ref. Transaksi</Label>
                        <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded border border-blue-100">
                            <span className="font-mono text-sm text-blue-700">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-blue-400">
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border-2 border-blue-100 rounded-xl p-2 bg-white" />
                            <p className="text-sm text-slate-500 mt-4 text-center">Scan QRIS di atas untuk menyelesaikan pendaftaran.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-500">Kode VA / Nomor Bayar</Label>
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <span className="font-mono text-2xl font-black text-blue-700">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-blue-600">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-200">
                        <p><strong>PENTING:</strong> Segera selesaikan pembayaran agar slot webinar Anda tidak diambil peserta lain.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk Webinar Burnout ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
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
            background: "linear-gradient(135deg, #f0f9ff 0%, #fff7ed 100%)", // Light Blue to Light Orange
            color: "#1e293b",
            lineHeight: 1.6
        }}>
            <Toaster />
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#0284c7", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Official Career Reset Series</div>
                </div>

                {/* 2. HERO SECTION */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(2, 132, 199, 0.1)", border: "1px solid rgba(2, 132, 199, 0.1)" }}>
                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "10px 25px", borderRadius: "50px", fontSize: "14px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "2px solid #bae6fd" }}>
                        KHUSUS PEKERJA MUDA YANG HILANG ARAH
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "15px", lineHeight: 1.3 }}>
                        Jujur Saja, Apakah Anda Masih Muda Tapi Rasanya Sudah Mau Pensiun?
                    </h1>
                    <p style={{ fontSize: "16px", color: "#475569", marginBottom: "10px", lineHeight: 1.6 }}>
                        Fisik duduk di kantor, tapi jiwa kosong dan mental lelah. Menunggu <i>weekend</i> adalah satu-satunya alasan Anda bertahan hidup.
                    </p>
                    <div style={{ marginTop: "15px", fontWeight: "bold", color: "#f97316" }}>
                        📅 LIVE: Minggu, 22 Februari 2026, 17:00 WIB
                    </div>
                </div>

                {/* 3. PAIN POINTS */}
                <div style={{ background: "#fff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #f97316", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#c2410c", marginBottom: "20px" }}>Apakah Ini Siklus "Neraka" Anda?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>📉</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}>
                                <strong>"Gaji Numpang Lewat"</strong> — Kerja sebulan, habis dalam 3 hari untuk bayar hutang dan gaya hidup "penghibur lara".
                            </p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>😰</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}>
                                <strong>"Sunday Scaries"</strong> — Minggu malam dadanya sesak, cemas memikirkan hari Senin dan tumpukan deadline.
                            </p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>🤡</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}>
                                <strong>"Budak Korporat"</strong> — Anda kerja keras bagai kuda, tapi yang dapat promosi malah teman yang pintar "cari muka".
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Anda Tidak Malas, Anda Hanya "Salah Strategi"</h2>
                    <p style={{ marginBottom: "15px", color: "#475569" }}>Mungkin orang tua bilang: <em>"Kerja keraslah, nanti sukses."</em> Maaf, tapi di tahun 2026, nasihat itu sudah kadaluarsa.</p>
                    <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #3b82f6", color: "#1e40af" }}>
                        <strong>Realita Pahit:</strong><br/>
                        Kerja keras tanpa <em>Mindset Engineering</em> hanya akan membuat Anda menjadi:<br/>
                        <strong>"Orang Termiskin yang Paling Sibuk."</strong>
                    </div>
                </div>

                {/* 5. AGITATION & SOLUTION */}
                <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#fbbf24" }}>JEBAKAN TIKUS BERDASI</h2>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                        Pernahkah Anda bertanya: Kenapa ada orang kerjanya santai tapi rezekinya deras, sementara Anda lembur tiap hari tapi saldo tetap segitu saja?
                    </p>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                        <p style={{ margin: 0 }}>Fokus ke Gaji 👉 <strong>Terjebak Inflasi.</strong></p>
                        <p style={{ margin: "10px 0" }}>Fokus Cari Muka 👉 <strong>Hati Lelah & Palsu.</strong></p>
                        <p style={{ margin: 0 }}>Fokus <em>Healing</em> 👉 <strong>Tabungan Habis.</strong></p>
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#38bdf8" }}>
                        Mau sampai kapan jadi "Baterai" yang dibuang saat habis dayanya?
                    </p>
                </div>

                {/* 6. AUTHORITY */}
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0284c7", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginTop: "20px", color: "#334155", textAlign: "center" }}>
                        Saya bukan motivator yang menyuruh Anda teriak "Saya Pasti Bisa". Saya adalah teknisi yang membongkar <em>mental block</em> penyebab karir Anda mandek dan dompet Anda bocor halus.
                    </p>
                </div>

                {/* 7. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1e293b" }}>Mereka yang Sudah "Resign" dari Stress</h2>
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
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #bae6fd" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#0284c7" }}>Bukti Nyata Perubahan Karir</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#f0f9ff", padding: "20px", borderRadius: "10px", marginBottom: "15px" }}>
                            <div style={{ fontWeight: 700, color: "#0369a1", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#0ea5e9'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#334155" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 9. CURRICULUM */}
                <div style={{ background: "white", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #f97316" }}>
                    <div style={{ background: "#f97316", color: "white", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b" }}>WEBINAR: "BURNOUT TO BREAKOUT"</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {[
                            { title: 'Mental Detox 101', desc: 'Cara membuang "sampah pikiran" sisa pekerjaan kantor agar tidur nyenyak tanpa overthinking.' },
                            { title: 'The Energy Management', desc: 'Berhenti me-manage waktu, mulailah me-manage energi. Rahasia produktif tanpa merasa diperas.' },
                            { title: 'Magnet Karir & Rezeki', desc: 'Teknik bawah sadar agar peluang dan promosi datang sendiri tanpa perlu "menjilat" atasan.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "#fff7ed", color: "#c2410c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#c2410c" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#475569" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 10. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#1e293b", textAlign: "center" }}>Cara Bergabung</h2>
                    <div style={{ position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#bfdbfe" }}></div>
                        
                        {[
                            { title: "Langkah 1: Booking Kursi", desc: "Isi form di bawah. Investasi hanya Rp 200.000,- (Harga Promo Early Bird)." },
                            { title: "Langkah 2: Masuk Circle Baru", desc: "Anda akan diundang ke Grup WhatsApp eksklusif berisi orang-orang yang frekuensinya positif." },
                            { title: "Langkah 3: Live Reset", desc: "Hadir di Zoom pada 22 Feb 2026. Siapkan headset dan tempat tenang untuk sesi terapi." }
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0284c7", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid white" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#0369a1", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#64748b", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(2, 132, 199, 0.1)", border: "1px solid #bae6fd" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Masa Depan Anda</h2>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#94a3b8" }}>Rp 5.000.000,-</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#f97316", marginBottom: "10px" }}>Rp 200.000,-</div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "30px" }}>(Lebih murah dari harga sekali nongkrong di Coffee Shop)</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-blue-600">
                                <User className="w-5 h-5" /> Data Peserta
                            </h3>
                            <div className="grid gap-4">
                                <Input 
                                    placeholder="Nama Lengkap" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-blue-500"
                                />
                                <Input 
                                    type="email" 
                                    placeholder="Email (Link Zoom dikirim ke sini)" 
                                    value={userEmail} 
                                    onChange={(e) => setUserEmail(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-blue-500"
                                />
                                <Input 
                                    placeholder="Nomor WhatsApp" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-blue-600">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-300 text-blue-600" />
                                        <div>
                                            <div className="font-bold text-slate-800">{method.name}</div>
                                            <div className="text-xs text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            className="w-full text-lg py-8 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 font-black shadow-xl rounded-full text-white border-none"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "🚀 SAYA MAU UBAH NASIB SEKARANG"}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600" /> Secure Payment</div>
                            <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-600" /> Instant Access</div>
                        </div>
                    </div>
                </div>

                {/* 12. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1e293b", textAlign: "center" }}>Yang Sering Ditanyakan</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {[
                            { q: "Saya susah izin kerja/lembur, gimana?", a: "Acara hari Minggu sore, waktu yang tepat untuk recharge sebelum Senin. Kalau berhalangan, ada rekaman yang bisa diakses." },
                            { q: "Apa bedanya sama motivasi biasa?", a: "Kami tidak meneriakkan kata-kata semangat. Kami menggunakan teknik terapi bawah sadar untuk mencabut akar stress Anda secara permanen." },
                            { q: "Lagi bokek/akhir bulan, worth it gak?", a: "Justru karena bokek Anda harus ikut. Kalau pola pikir tidak diubah, bulan depan dan tahun depan Anda akan tetap bokek. Ini investasi leher ke atas." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
                                <div style={{ color: "#0284c7", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
                                <div style={{ color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
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

export default WebinarBurnout;