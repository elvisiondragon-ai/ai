import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoFacade } from '@/components/ui/video-facade';
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

const WebinarSopanMandiri = () => {
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
    
    // Product Config (Webinar Pria Mandiri/Pengangguran)
    const productNameBackend = 'webinar_zero_to_hero'; 
    const displayProductName = 'Webinar The Awakening: Dari Beban Jadi Andalan';
    const productPrice = 199999;
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
          testCode: 'testcode_indo'
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
          trackPageViewEvent({}, pageEventId, pixelId, userData, 'testcode_indo');

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
                  description: "Saatnya bangkit, Bro! Akses webinar sudah dikirim ke emailmu.",
                  duration: 8000, 
              });
            }
          }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Ex-Pengangguran", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Praktisi", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Habib Umar", title: "Tokoh Masyarakat", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg", thumbnail: "🕌" },
        { name: "Umi Jamilah", title: "Pendidik", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg", thumbnail: "👳‍♀️" },
        { name: "Felicia", title: "Pengusaha", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" },
        { name: "Lena", title: "Ibu Rumah Tangga", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg", thumbnail: "🌟" },
        { name: "Vio", title: "Freelancer Sukses", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg", thumbnail: "✨" },
        { name: "Arif", title: "IT Professional", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" }
    ];

    const testimonials = [
        {
          name: "Riko, 24th",
          title: "Fresh Graduate",
          verified: true,
          text: "Setahun nganggur, tiap hari cuma main game di kamar karena malu keluar rumah. Orang tua sering sindir halus, sakit banget rasanya. Setelah ikut webinar eL Vision, mental saya 'ditampar'. Seminggu kemudian saya berani lamar kerja door-to-door dan diterima!"
        },
        {
          name: "Bagas, 28th",
          title: "Freelancer",
          verified: true,
          text: "Dulu saya gengsi kerja kasar, maunya kerja kantoran AC tapi gak dapet-dapet. Mas eL ngajarin 'Buang Gengsi Makan Mimpi'. Sekarang saya jualan online, omsetnya malah lebih gede dari gaji temen yang kantoran."
        },
        {
          name: "Wahyu, 32th",
          title: "Korban PHK",
          verified: true,
          text: "Di-PHK pas istri lagi hamil. Dunia rasanya runtuh. Saya sempet depresi berat. Webinar ini ngebangunin 'Jiwa Petarung' saya yang tidur. Sekarang saya bangkit lagi buka usaha kuliner kecil-kecilan."
        },
        {
          name: "Felicia Quincy",
          title: "Entrepreneur",
          verified: true,
          text: "Laki-laki itu dinilai dari tanggung jawabnya. Program ini bagus banget buat cowok-cowok yang kehilangan arah (lost generation). Mindset is everything."
        },
        {
          name: "David Sutanto",
          title: "Business Owner",
          verified: true,
          text: "Saya sering interview anak muda yang lembek. Tapi alumni eL Vision beda. Mereka punya sorot mata tajam dan mental baja. Itu yang dicari dunia kerja sekarang."
        }
    ];

    return (
      <div className="relative">
        <Toaster />
        {showPaymentInstructions && paymentData ? (
          <div className="min-h-screen bg-red-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-red-100">
              <div className="p-4 bg-red-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-red-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Instruksi Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Modal Bangkit</p>
                    <p className="text-3xl font-bold text-red-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium border border-amber-200">
                        Menunggu Verifikasi
                    </div>
                </div>
    
                <Card className="border-2 border-red-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-red-50 pb-4 mb-4">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Ref. Transaksi</Label>
                        <div className="flex items-center justify-between bg-red-50/50 p-2 rounded border border-red-100">
                            <span className="font-mono text-sm text-red-700">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-red-400">
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border-2 border-red-100 rounded-xl p-2 bg-white" />
                            <p className="text-sm text-slate-500 mt-4 text-center">Scan QRIS di atas. Ini langkah pertamamu.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-500">Kode VA / Nomor Bayar</Label>
                            <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-200">
                                <span className="font-mono text-2xl font-black text-red-700">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-red-600">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-200">
                        <p><strong>PENTING:</strong> Bro, jangan tunda lagi. Bayar sekarang biar slot webinar gak diambil orang lain.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk Webinar Zero to Hero ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
                    Chat Admin (Bantuan)
                </Button>
              </div>
            </div>
          </div>
        ) : (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)", // Very Light Red to Warm White
            color: "#450a0a", // Dark Red/Brown Text
            lineHeight: 1.6
        }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#991b1b", textTransform: "uppercase", letterSpacing: "1px" }}>Official Independence Series</div>
                </div>

                {/* VSL Video Section */}
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "15px", color: "#7f1d1d" }}>Tonton Ini Selengkap nya !</h2>
                    <div style={{ 
                        width: "100%",
                        maxWidth: "320px",
                        margin: "0 auto",
                        aspectRatio: "9/16",
                        borderRadius: "20px", 
                        overflow: "hidden", 
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
                        border: "1px solid #fca5a5", 
                        backgroundColor: "#000" 
                    }}>
                        <VideoFacade 
                            src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/el_vsl1.mp4"
                            poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/el_vsl1.png"
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* 2. HERO SECTION */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.1)" }}>
                    <span style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 25px", borderRadius: "50px", fontSize: "14px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "2px solid #fca5a5" }}>
                        KHUSUS PRIA YANG MAU "BANGUN TIDUR"
                    </span>
                    <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#7f1d1d", marginBottom: "15px", lineHeight: 1.4 }}>
                        Bro, Jujur... Sampai Kapan Mau Jadi Penonton di Rumah Sendiri?
                    </h1>
                    <p style={{ fontSize: "16px", color: "#b91c1c", marginBottom: "10px", lineHeight: 1.6, fontWeight: 500 }}>
                        Umur terus bertambah, teman-teman sudah pamer karir & mobil, tapi kamu masih minta uang bensin sama Ibu?
                    </p>
                    <div style={{ marginTop: "15px", fontWeight: "bold", color: "#ea580c" }}>
                        📅 LIVE: Minggu, 22 Februari 2026, 17:00 WIB
                    </div>
                </div>

                {/* 3. PAIN POINTS */}
                <div style={{ background: "#fff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #ef4444", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#b91c1c", marginBottom: "20px" }}>Apakah Ini "Neraka" Kecilmu Tiap Hari?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>🤐</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#991b1b' }}>
                                <strong>"Pertanyaan Maut"</strong> — Tiap kumpul keluarga ditanya: "Kerja dimana sekarang?". Rasanya pengen menghilang ditelan bumi.
                            </p>
                        </div>
                        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>🎮</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#991b1b' }}>
                                <strong>"Pelarian Semu"</strong> — Tidur pagi, bangun sore. Main game atau scroll sosmed cuma buat melupakan fakta kalau hidupmu lagi <em>stuck</em>.
                            </p>
                        </div>
                        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>😔</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#991b1b' }}>
                                <strong>"Rasa Bersalah"</strong> — Liat rambut orang tua makin putih, tapi kamu belum bisa kasih apa-apa. Malah masih jadi beban listrik dan makan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#991b1b" }}>"Susah Cari Kerja Zaman Sekarang..."</h2>
                    <p style={{ marginBottom: "15px", color: "#4b5563", textAlign: "center" }}>Itu alasan klasik, Bro. Berhenti menyalahkan keadaan.</p>
                    <div style={{ background: "#fff7ed", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #f97316", color: "#c2410c" }}>
                        <strong>Realita Keras:</strong><br/>
                        Bukan kerjaan yang susah dicari,<br/>
                        tapi <strong>MENTALITASMU</strong> yang belum layak dibayar mahal.<br/>
                        Dunia tidak butuh orang yang jago ngeluh.
                    </div>
                </div>

                {/* 5. AGITATION & SOLUTION */}
                <div style={{ background: "linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)", color: "white", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center", border: "2px solid #f87171" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#fca5a5" }}>THE AWAKENING CALL</h2>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                        Laki-laki diciptakan untuk menjadi <strong>PUNGGUNG</strong>, bukan beban. Harga dirimu ada pada kemandirianmu.
                    </p>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                        <p style={{ margin: 0 }}>Berhenti Menunggu Peluang 👉 <strong>Ciptakan Peluang.</strong></p>
                        <p style={{ margin: "10px 0" }}>Berhenti Gengsi 👉 <strong>Gengsi Gak Bikin Kenyang.</strong></p>
                        <p style={{ margin: 0 }}>Mulai Dari Mana? 👉 <strong>RESET MINDSET.</strong></p>
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px", color: "#fee2e2" }}>
                        Ubah "Saya Butuh Kerja" menjadi "Saya Punya Nilai".
                    </p>
                </div>

                {/* 6. AUTHORITY */}
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #fca5a5" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#dc2626", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#991b1b", letterSpacing: "1px", textTransform: "uppercase" }}>The Mental Switcher</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginTop: "20px", color: "#7f1d1d", textAlign: "center" }}>
                        Saya pernah di posisi kamu. Dianggap remeh, direndahkan, dan tidak punya masa depan. Saya tahu tombol mana di kepalamu yang harus ditekan agar "Mesin Kesuksesan"-mu menyala.
                    </p>
                </div>

                {/* 7. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#991b1b" }}>Mereka yang Sudah Bangkit</h2>
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
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #fecaca" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#dc2626" }}>Bukti Bukan Janji</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#fef2f2", padding: "20px", borderRadius: "10px", marginBottom: "15px" }}>
                            <div style={{ fontWeight: 700, color: "#991b1b", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#ef4444'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#b91c1c', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#7f1d1d" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 9. CURRICULUM */}
                <div style={{ background: "white", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #ef4444" }}>
                    <div style={{ background: "#ef4444", color: "white", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#7f1d1d" }}>WEBINAR: "DARI NOL JADI HERO"</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {[
                            { title: 'Mental Baja 101', desc: 'Menghapus mental "korban" dan "pemalas" yang bikin kamu betah miskin.' },
                            { title: 'Opportunity Magnet', desc: 'Cara membuat orang lain percaya dan mau memberi peluang kerja/bisnis ke kamu.' },
                            { title: 'The First Rp 10 Million', desc: 'Blueprint praktis menghasilkan uang halal tanpa modal besar, asal mau capek.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "#fee2e2", color: "#dc2626", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#dc2626" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#4b5563" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 10. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#991b1b", textAlign: "center" }}>Langkah Menuju Mandiri</h2>
                    <div style={{ position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#fecaca" }}></div>
                        
                        {[
                            { title: "Langkah 1: Berani Mulai", desc: "Daftar di bawah. Investasi Rp 199.999,- (Mungkin uang terakhirmu, tapi jadikan ini yang paling berharga)." },
                            { title: "Langkah 2: Circle Pemenang", desc: "Masuk ke Grup WhatsApp berisi orang-orang yang satu frekuensi mau sukses, bukan ngeluh doang." },
                            { title: "Langkah 3: Live Reset", desc: "Hadir di Webinar 22 Feb 2026. Kita install ulang mindset kamu." }
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#dc2626", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid white" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#991b1b", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#4b5563", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(220, 38, 38, 0.1)", border: "1px solid #fecaca" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Harga Diri</h2>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#9ca3af" }}>Rp 5.000.000,-</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#ea580c", marginBottom: "10px" }}>Rp 199.999,-</div>
                        <p style={{ fontSize: "13px", color: "#666", marginBottom: "30px" }}>(Kalau gak punya uang, pinjam teman/saudara dengan janji "Ini terakhir kalinya gue pinjam, gue mau berubah")</p>
                    </div>

                    <div style={{ background: "#fff1f2", border: "1px dashed #dc2626", padding: "15px", borderRadius: "15px", marginBottom: "30px", textAlign: "left" }}>
                        <p style={{ fontSize: "14px", color: "#991b1b", fontWeight: "bold", marginBottom: "5px" }}>🎁 BONUS EKSKLUSIF LANGSUNG:</p>
                        <p style={{ fontSize: "13px", color: "#b91c1c", lineHeight: "1.5" }}>Anda juga mendapatkan <strong>Ebook eL Vision Pro + Audio Hipnosis Set</strong> selama menunggu Webinar yang bisa anda praktekan langsung untuk hasil instan.</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-red-700">
                                <User className="w-5 h-5" /> Data Calon Sukses
                            </h3>
                            <div className="grid gap-4">
                                <Input 
                                    placeholder="Nama Lengkap" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-white text-slate-900 border-red-200 h-12 focus:border-red-500 placeholder:text-slate-400"
                                />
                                <Input 
                                    type="email" 
                                    placeholder="Email (Link Zoom dikirim ke sini)" 
                                    value={userEmail} 
                                    onChange={(e) => setUserEmail(e.target.value)} 
                                    className="bg-white text-slate-900 border-red-200 h-12 focus:border-red-500 placeholder:text-slate-400"
                                />
                                <Input 
                                    placeholder="Nomor WhatsApp" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    className="bg-white text-slate-900 border-red-200 h-12 focus:border-red-500 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-red-700">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-red-500 bg-red-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-300 text-red-600" />
                                        <div>
                                            <div className="font-bold text-slate-800">{method.name}</div>
                                            <div className="text-xs text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            className="w-full text-lg py-8 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-black shadow-xl rounded-full text-white border-none"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "🔥 SAYA SIAP BERUBAH SEKARANG"}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600" /> Secure System</div>
                            <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-600" /> Life Changing</div>
                        </div>
                    </div>
                </div>

                {/* 12. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#991b1b", textAlign: "center" }}>Pertanyaan Bro-Bro Semua</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {[
                            { q: "Saya gak punya modal buat usaha, gimana?", a: "Usaha gak melulu soal modal uang. Di webinar ini kita bongkar cara pakai 'Modal Dengkul & Otak' buat hasilkan cuan." },
                            { q: "Saya pemalu dan introvert, apa bisa sukses?", a: "Bisa banget. Banyak miliarder itu introvert. Masalahnya bukan sifatmu, tapi keyakinanmu. Kita perbaiki itu." },
                            { q: "Kalau setelah ikut webinar saya masih gagal?", a: "Gagal itu kalau berhenti. Di sini kamu masuk komunitas. Kalau jatuh, ada yang nyemangatin buat bangkit lagi. Gak sendirian lagi." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
                                <div style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
                                <div style={{ color: "#334155", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#9ca3af", fontSize: "12px" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold" }}>eL Vision Group</p>
                    <p>"Bahagia Adalah Koentji"</p>
                </div>
            </div>
        </div>
        )}
      </div>
    );
};

export default WebinarSopanMandiri;