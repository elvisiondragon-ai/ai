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
import { ArrowLeft, Copy, CreditCard, User, CheckCircle, ShieldCheck, Loader2, Heart } from 'lucide-react';

const WebinarPriaSingle = () => {
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
    const productNameBackend = 'webinar_love_magnet'; 
    const displayProductName = 'Webinar: The Magnetic Gentleman';
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
                title: "Data Belum Lengkap",
                description: "Mohon lengkapi nama, email, dan nomor WhatsApp Anda.",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            toast({
                title: "Email Tidak Valid",
                description: "Mohon periksa kembali penulisan email Anda.",
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
                  title: "Gagal Memproses",
                  description: data?.error || "Terjadi kesalahan sistem, silakan coba lagi.",
                  variant: "destructive",
                });
                return;
            }

            if (data?.success) {
                setPaymentData(data);
                setShowPaymentInstructions(true);
                toast({
                  title: "Pendaftaran Diterima",
                  description: "Silakan selesaikan langkah terakhir.",
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error: any) {
            toast({
              title: "Error",
              description: "Gagal terhubung ke server.",
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
                  title: "SELAMAT DATANG DI ERA BARU!",
                  description: "Akses webinar telah dikirim ke email Anda.",
                  duration: 5000, 
                  variant: "default"
              });
            }
          }).subscribe();
    
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

    // ==========================================
    // 🌹 COPYWRITING: POLARISM (SOPAN - LOVE/RELATIONSHIP)
    // ==========================================
    const content = {
        // 1. TARGET BADGE
        targetBadge: "KHUSUS PRIA YANG LELAH MENUNGGU KEAJAIBAN CINTA",
        
        // 2. HERO SECTION
        headline: "Tahun Berganti, Usia Bertambah. Sampai Kapan Anda Mau Pulang ke Rumah yang Sepi?",
        subheadline: "Anda sudah mapan, sudah memperbaiki penampilan, dan berusaha menjadi pria baik. Tapi mengapa 'Dia' tak kunjung datang, sementara teman-teman Anda sudah mulai menggendong anak?",

        // 3. PAIN SECTION (POLARIZING - DEEP EMOTION)
        painTitle: "Jujur Pada Hati Kecil Anda...",
        painPoints: [
            { icon: "🎭", text: <span><strong>"Selalu Jadi 'Teman Baik'."</strong> Anda ada saat dia menangis, tapi dia memilih pria lain saat ingin tertawa dan bahagia. Anda terjebak dalam *Friendzone* abadi.</span> },
            { icon: "📱", text: <span><strong>"Hantu di Aplikasi Dating."</strong> Ratusan *swipe*, sedikit *match*, dan nol balasan. Rasanya seperti berteriak di ruang hampa. Tak ada yang melihat nilai diri Anda.</span> },
            { icon: "👪", text: <span><strong>"Teror Pertanyaan Keluarga."</strong> Setiap acara keluarga, senyum Anda palsu saat menjawab: <em>'Calonnya mana?'</em>. Hati Anda perih, tapi bibir tetap tersenyum.</span> }
        ],

        // 4. LOGIC TRAP
        logicTitle: "Jebakan 'Pria Terlalu Baik'",
        logicDescription: "Logika Anda berkata: <em>'Kalau saya kaya dan baik, wanita pasti datang.'</em><br/><br/><strong>MAAF, ITU SALAH.</strong><br/>Wanita tidak hanya mencari uang atau kebaikan. Wanita secara biologis mencari <strong>POLARITAS & ENERGI MASKULIN</strong>. Jika aura Anda 'memohon' (ngarep), wanita secantik apapun akan ilfeel secara instan.",

        // 5. AGITATION (THE VOID)
        agitationTitle: "THE INVISIBLE MAN SYNDROME",
        agitationText: [
            "Pernahkah Anda merasa seperti 'Manusia Transparan'? Anda hadir, tapi tidak dianggap sebagai opsi pasangan.",
            "Bayangkan 5 tahun lagi dari sekarang. Teman-teman Anda sibuk dengan keluarga kecilnya. Dan Anda? Masih sendiri, memesan makanan untuk satu orang, dan menghabiskan akhir pekan dengan keheningan.",
            "Kesepian itu bukan sekadar status. Itu adalah racun yang perlahan menggerogoti kepercayaan diri seorang pria."
        ],
        agitationBullets: [
            { trigger: "Anda Terlalu Mengejar?", result: "Wanita Semakin Menjauh." },
            { trigger: "Anda Ragu Memulai?", result: "Kehilangan Kesempatan Emas." },
            { trigger: "Anda Menyimpan Trauma?", result: "Menarik Pola yang Sama." }
        ],
        agitationClosing: "Ubah 'Sinyal' Anda, Atau Bersiaplah Sendiri Selamanya.",

        // 6. THE SHIFT (SOLUTION)
        shiftTitle: "Menjadi 'The Magnetic Gentleman'",
        shiftDescription: "Webinar ini bukan tentang trik murahan merayu wanita (*pick-up lines*). Ini tentang <strong>TRANSFORMASI INTERNAL</strong>. Kita akan mengubah frekuensi Anda dari 'Pencari' menjadi 'Penarik' (Magnet).",
        shiftResults: [
            "✨ Aura High Value: Wanita akan merasakan wibawa Anda tanpa Anda perlu pamer harta.",
            "✨ Seleksi Alam: Anda tidak lagi mengejar sembarang wanita, tapi menarik wanita yang *berkualitas*.",
            "✨ Soulmate Alignment: Membuka jalan bagi jodoh yang selaras dengan visi misi hidup Anda."
        ],

        // 7. WEBINAR DETAILS
        webinarTitle: 'WEBINAR: "THE MAGNETIC GENTLEMAN - REZEKI & JODOH JALUR LANGIT"',
        eventDate: "Minggu, 22 Februari 2026 | 17:00 WIB",
        curriculum: [
            { title: 'Clearing Heart Blockages', desc: 'Membersihkan trauma masa lalu, rasa minder, dan dendam pada mantan yang menghalangi jodoh baru masuk.' },
            { title: 'The Masculine Core', desc: 'Mengaktifkan energi maskulin yang tenang namun dominan, yang membuat wanita merasa aman dan tertarik secara alami.' },
            { title: 'Vibrasi "The Prize"', desc: 'Teknik mental agar Anda tidak lagi merasa butuh (needy), melainkan merasa sebagai "Hadiah Utama" yang layak diperjuangkan.' }
        ],

        // 8. PRICING & CTA
        priceAnchor: "Rp 3.500.000,-", // Harga kencan gagal berkali-kali
        priceReal: "Rp 200.000,-",
        ctaButton: "👉 SAYA SIAP MENJEMPUT JODOH",

        // 9. STEPS
        steps: [
            { title: "Langkah 1: Niatkan Berubah", desc: "Investasi Rp 200.000 ini adalah bukti keseriusan Anda pada diri sendiri dan masa depan Anda." },
            { title: "Langkah 2: Gabung Circle Baru", desc: "Masuk ke Grup VIP. Berkumpulah dengan pria-pria yang bervisi sama, bukan yang mengajak pada keputusasaan." },
            { title: "Langkah 3: Transformasi Live", desc: "Hadir 22 Februari jam 17:00 WIB. Siapkan hati yang terbuka untuk dibersihkan dan diisi energi baru." }
        ],

        // 10. FAQ
        faq: [
            { q: "Saya pemalu dan introvert, apa cocok?", a: "Justru sangat cocok. Metode ini bekerja di level energi (bawah sadar), bukan mengharuskan Anda jadi orang yang banyak omong atau 'sok asik'." },
            { q: "Apakah ini menjamin saya dapat jodoh instan?", a: "Kami memberikan kuncinya, Tuhan yang membukakan pintunya. Tapi dengan kunci yang tepat (diri yang pantas), pintu jodoh akan jauh lebih mudah terbuka." },
            { q: "Saya sudah berumur (35+), apakah terlambat?", a: "Pria itu seperti anggur, makin tua makin bernilai JIKA energinya benar. Tidak ada kata terlambat untuk menjadi versi terbaik." },
            { q: "Apakah diajarkan cara chat wanita?", a: "Kita belajar hal yang lebih dalam dari sekadar chat. Saat aura Anda berubah, isi chat Anda otomatis akan lebih berbobot dan menarik." }
        ]
    };

    // ==========================================
    // 🖼️ MEDIA ASSETS
    // ==========================================
    const founderImages = [
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg",
        "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg"
    ];

    const videoTestimonials = [
        { name: "Agus Mulyadi, SH., MH.", title: "Kepala Intelijen Pangandaran", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg", thumbnail: "🎖️" },
        { name: "Dr. Gumilar", title: "Hipnoterapist", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg", thumbnail: "⚕️" },
        { name: "Arif", title: "Klien eL Vision", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg", thumbnail: "👨‍💻" },
        { name: "Felicia", title: "Pengusaha", videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4", poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg", thumbnail: "👩‍💼" }
    ];

    const testimonials = [
        { name: "Rendra K.", title: "Karyawan Swasta, 32 Tahun", image: "💍", rating: 5, text: "Dulu saya pikir wanita cuma liat mobil. Setelah ikut eL Vision, saya sadar energi saya 'needy' banget. Setelah diperbaiki, sebulan kemudian saya ketemu calon istri saya di tempat yang gak disangka-sangka." },
        { name: "Bayu S.", title: "Wiraswasta", image: "🤝", rating: 5, text: "Saya jomblo 4 tahun. Trauma diselingkuhi. Bang eL bantu saya 'release' trauma itu. Rasanya plong. Sekarang saya jauh lebih percaya diri dan sudah mulai dekat dengan seseorang yang menghargai saya." },
        { name: "Dr. Gumilar", title: "Dokter & Hipnoterapis", verified: true, image: "⚕️", rating: 5, text: "Metode ini sangat ilmiah dan menyentuh akar masalah psikologis. Perubahan mindset adalah kunci utama menarik realitas baru, termasuk pasangan." }
    ];

    if (showPaymentInstructions && paymentData) {
        return (
          <div className="min-h-screen bg-slate-950 pb-20 font-sans text-slate-100">
            <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-2xl border-x border-slate-800">
              <div className="p-4 bg-rose-700 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-rose-800">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg tracking-wide">Selesaikan Langkah Ini</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-400 text-sm">Nilai Investasi Diri</p>
                    <p className="text-4xl font-bold text-rose-500">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-4 py-1 bg-rose-900/30 text-rose-300 rounded-full text-xs font-medium border border-rose-800 animate-pulse">
                        Menunggu Pembayaran
                    </div>
                </div>
    
                <Card className="border border-slate-800 bg-slate-950">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-slate-800 pb-4 mb-4">
                        <Label className="text-slate-500 text-xs uppercase">No. Referensi</Label>
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="font-mono text-sm text-rose-500 font-bold">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <div className="p-2 bg-white rounded-lg">
                                <img src={paymentData.qrUrl} alt="QRIS" className="w-56 h-56 object-contain" />
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center">Scan menggunakan e-wallet favorit Anda.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs uppercase">Kode Bayar / VA</Label>
                            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-rose-900/40">
                                <span className="font-mono text-2xl font-bold tracking-widest text-rose-500">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-slate-400 hover:text-white">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-rose-950/20 p-3 rounded text-sm text-rose-200 border border-rose-900/30 flex gap-2">
                        <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <p className="text-xs">Lakukan pembayaran sebelum waktu habis untuk mengamankan slot webinar Anda.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                   <Button variant="outline" className="w-full gap-2 border-slate-700 bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo Admin, saya mau konfirmasi pembayaran webinar Magnetic Gentleman dengan ref ${paymentData.tripay_reference}.`, '_blank')}>
                       Bantuan Admin (WhatsApp)
                   </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    return (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "#020617", // Slate-950 (Midnight Blue/Black)
            color: "#f8fafc", // Slate-50
            lineHeight: 1.6
        }}>
            <Toaster />
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                {/* 1. HEADER LOGO */}
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "3px", textTransform: "uppercase" }}>eL <span style={{color: "#f43f5e"}}>VISION</span></div>
                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>The Art of Vibration</div>
                </div>

                {/* 2. HERO SECTION */}
                <div style={{ textAlign: "center", padding: "40px 20px", background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)", borderRadius: "10px", marginBottom: "30px", border: "1px solid #1e293b", borderTop: "3px solid #f43f5e" }}>
                    <span style={{ background: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", padding: "8px 20px", borderRadius: "30px", fontSize: "12px", fontWeight: "700", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "1px solid rgba(244, 63, 94, 0.3)" }}>
                        {content.targetBadge}
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "15px", lineHeight: 1.3 }}>
                        {content.headline}
                    </h1>
                    <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "0px", lineHeight: 1.6 }}>{content.subheadline}</p>
                    <div style={{ marginTop: "25px", background: "#1e293b", display: "inline-block", padding: "10px 20px", borderRadius: "8px", border: "1px solid #334155" }}>
                        🗓️ Event: <strong style={{color: "#f43f5e"}}>{content.eventDate}</strong>
                    </div>
                </div>

                {/* 3. PAIN SECTION */}
                <div style={{ background: "#0f172a", padding: "30px 25px", borderRadius: "15px", marginBottom: "30px", borderLeft: "4px solid #f43f5e" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#f43f5e", marginBottom: "20px" }}>{content.painTitle}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {content.painPoints.map((pain, idx) => (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{pain.icon}</div>
                                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>{pain.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. LOGIC TRAP */}
                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "20px", textAlign: "center", color: "#fff" }}>{content.logicTitle}</h2>
                    <div style={{ background: "#1e1b4b", padding: "25px", borderRadius: "15px", textAlign: "center", border: "1px dashed #6366f1", color: "#e0e7ff" }}>
                        <p style={{ fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: content.logicDescription }} />
                    </div>
                </div>

                {/* 5. AGITATION (HIGHLIGHT) */}
                <div style={{ background: "#0f172a", color: "white", padding: "40px 25px", borderRadius: "15px", marginBottom: "30px", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid #1e293b" }}>
                    <div style={{position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: '#f43f5e', filter: 'blur(70px)', opacity: 0.15}}></div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#f43f5e", letterSpacing: "1px" }}>{content.agitationTitle}</h2>
                    {content.agitationText.map((text, idx) => (
                        <p key={idx} style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "20px", color: "#cbd5e1" }} dangerouslySetInnerHTML={{ __html: text }} />
                    ))}
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
                        {content.agitationBullets.map((bullet, idx) => (
                            <p key={idx} style={{ margin: idx === 1 ? "10px 0" : "0", color: "#94a3b8", fontSize: "14px" }}>{bullet.trigger} 👉 <strong style={{color: "#fff"}}>{bullet.result}</strong></p>
                        ))}
                    </div>
                    <p style={{ fontWeight: "700", fontSize: "16px", color: "#fff" }}>{content.agitationClosing}</p>
                </div>

                {/* 6. SOLUTION */}
                <div style={{ background: "#0f172a", padding: "30px 25px", borderRadius: "15px", marginBottom: "30px", border: "1px solid #334155" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "20px", textAlign: "center" }}>{content.shiftTitle}</h2>
                    <p style={{ marginBottom: "25px", textAlign: "center", color: "#cbd5e1", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: content.shiftDescription }} />
                    <div style={{ padding: "20px", background: "rgba(244, 63, 94, 0.05)", borderRadius: "10px", border: "1px solid rgba(244, 63, 94, 0.2)", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#f43f5e", marginBottom: "15px", textAlign: "center", fontSize: "13px", letterSpacing: "1px" }}>✨ TRANSFORMASI ANDA:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {content.shiftResults.map((res, idx) => (
                                <li key={idx} style={{ padding: "10px 0", borderBottom: idx !== 2 ? "1px dashed rgba(244, 63, 94, 0.2)" : "none", color: "#e2e8f0", fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: res }} />
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 7. AUTHORITY */}
                <div style={{ background: "#0f172a", padding: "30px 20px", borderRadius: "15px", marginBottom: "30px", border: "1px solid #1e293b" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                         {/* Slight sepia/warmth for approachable vibe */}
                        <img src={founderImages[0]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '9/16', filter: 'brightness(0.9)' }} />
                        <img src={founderImages[1]} alt="eL Reyzandra" style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', aspectRatio: '1/1', filter: 'brightness(0.9)' }} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "12px", color: "#f43f5e", letterSpacing: "2px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#cbd5e1", textAlign: "center" }}>Mengabdikan 16 tahun untuk memahami "Bahasa Bawah Sadar". Saya akan membantu Anda menyelaraskan frekuensi hati agar magnet jodoh Anda aktif secara alami.</p>
                </div>

                {/* 8. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px", textAlign: "center", color: "#fff" }}>Cerita Mereka</h2>
                    <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "15px", scrollSnapType: "x mandatory" }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ minWidth: "260px", background: "#0f172a", borderRadius: "10px", padding: "15px", scrollSnapAlign: "center", border: "1px solid #1e293b" }}>
                                <video controls poster={testi.poster} style={{ width: "100%", borderRadius: "8px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#000" }}>
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. TEXT TESTIMONIALS */}
                <div style={{ background: "#0f172a", padding: "30px 20px", borderRadius: "15px", marginBottom: "30px", border: "1px solid #1e293b" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "25px", textAlign: "center", color: "#fff" }}>Kisah Cinta Yang Berhasil</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "10px", marginBottom: "15px", borderLeft: "3px solid #f43f5e" }}>
                            <div style={{ fontWeight: 700, color: "#fff", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                                <span>{testi.name}</span>
                                {testi.verified && <span style={{color: '#f43f5e', fontSize: '10px'}}>VERIFIED</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px', textTransform: "uppercase" }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.6, fontStyle: "italic", color: "#cbd5e1" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 10. CURRICULUM */}
                <div style={{ background: "#0f172a", padding: "30px 25px", borderRadius: "15px", marginBottom: "30px", border: "1px solid #f43f5e" }}>
                    <div style={{ background: "#f43f5e", color: "#fff", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" }}>Materi Kelas</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "25px", color: "#fff", lineHeight: 1.3 }}>{content.webinarTitle}</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {content.curriculum.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                                <div style={{ background: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", width: "35px", height: "35px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0, border: "1px solid #f43f5e" }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#fff", fontSize: "16px" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#94a3b8" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "30px", color: "#fff", textAlign: "center" }}>Langkah Menuju Pertemuan</h2>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#334155" }}></div>
                        
                        {content.steps.map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f43f5e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid #020617" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 12. PRICING & PAYMENT FORM */}
                <div style={{ background: "#fff", color: "#0f172a", padding: "40px 25px", borderRadius: "15px", marginBottom: "40px" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ marginTop: "10px", fontSize: "22px", fontWeight: 700, marginBottom: "15px" }}>Investasi Jodoh Anda</h2>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "15px" }}>Nilai Personal Consultation:</p>
                        <div style={{ fontSize: "18px", textDecoration: "line-through", color: "#cbd5e1", marginBottom: "5px", fontWeight: "bold" }}>{content.priceAnchor}</div>
                        <div style={{ fontSize: "42px", fontWeight: 800, color: "#f43f5e", marginBottom: "10px" }}>{content.priceReal}</div>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "30px", fontStyle: "italic" }}>(Demi masa depan yang tidak sepi lagi)</p>
                    </div>

                    {/* FORM INPUTS */}
                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <User className="w-5 h-5 text-rose-500" /> Data Peserta
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-slate-700 font-medium mb-1 block">Nama Lengkap</Label>
                                    <Input 
                                        id="name" 
                                        autoComplete="name"
                                        placeholder="Nama Anda" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 border-slate-200 focus:border-rose-500 h-12"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email" className="text-slate-700 font-medium mb-1 block">Alamat Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            autoComplete="email"
                                            placeholder="contoh@email.com" 
                                            value={userEmail} 
                                            onChange={(e) => setUserEmail(e.target.value)} 
                                            className="bg-slate-50 text-slate-900 border-slate-200 focus:border-rose-500 h-12"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-slate-700 font-medium mb-1 block">WhatsApp</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            autoComplete="tel"
                                            placeholder="08xxxxxxxx" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)} 
                                            className="bg-slate-50 text-slate-900 border-slate-200 focus:border-rose-500 h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <CreditCard className="w-5 h-5 text-rose-500" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-400 text-rose-600" />
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-800 text-base">{method.name}</div>
                                            <div className="text-xs text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            size="lg" 
                            className="w-full text-lg py-8 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 font-bold shadow-lg transition-all text-white border-none mt-6"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : content.ctaButton}
                        </Button>
                        
                         <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium mt-4">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-slate-600" /> Privasi Dijaga
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-slate-600" /> Akses Instan
                            </div>
                        </div>
                    </div>
                </div>

                {/* 13. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "25px", color: "#fff", textAlign: "center" }}>Pertanyaan (FAQ)</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {content.faq.map((item, idx) => (
                            <div key={idx} style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", border: "1px solid #1e293b" }}>
                                <div style={{ color: "#f43f5e", fontWeight: "700", marginBottom: "10px", fontSize: "15px" }}>{item.q}</div>
                                <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#64748b", fontSize: "12px", borderTop: "1px solid #1e293b", paddingTop: "20px" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold", textTransform: "uppercase" }}>eL Vision Group &copy; 2026</p>
                    <p>"Jodoh Adalah Cerminan Diri"</p>
                </div>
            </div>
        </div>
    );
};

export default WebinarPriaSingle;