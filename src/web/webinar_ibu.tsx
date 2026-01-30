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

const WebinarIbu = () => {
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
    
    // Product Config (Webinar Ibu)
    const productNameBackend = 'webinar_detoks_ibu'; 
    const displayProductName = 'Webinar Detoks Pikiran Ibu';
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
                  title: "PEMBAYARAN DITERIMA!",
                  description: "Akses sudah dikirim ke email Bunda. Sampai jumpa di Webinar!",
                  duration: 8000, 
              });
            }
          }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData]);

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
        {
          name: "Rina, 34th",
          title: "Istri Pengusaha",
          verified: true,
          text: "Dulu saya curigaan parah sama suami. Tiap dia telat pulang, saya telepon 20 kali. Rumah tangga hampir hancur. Setelah sesi sama Mas eL, rasanya kayak ada beban 100kg diangkat dari kepala. Sekarang saya tenang, suami malah jadi manja dan betah di rumah."
        },
        {
          name: "Sarah, 29th",
          title: "Ibu Baru",
          verified: true,
          text: "Saya kena baby blues parah. Merasa nggak becus jadi ibu. Audio terapi dari eL Vision menyelamatkan kewarasan saya. Sekarang saya bisa menikmati momen sama anak tanpa rasa bersalah."
        },
        {
          name: "Amanda, 42th",
          title: "Wanita Karir",
          verified: true,
          text: "Kerjaan kantor + urusan rumah bikin saya hampir gila. Saya sering migrain dan insomnia. Teknik 'Reset Bawah Sadar' Mas eL itu ajaib. Saya bisa tidur nyenyak lagi setelah 5 tahun!"
        },
        {
          name: "Felicia Quincy",
          title: "Instagram: @itsfelicia.quincy",
          verified: true,
          text: "Mengikuti program 6 minggu membuat saya dari cemas dan overthinking, awalnya semua keputusan saya kabur dan sangat sulit untuk maju, setelah program saya bisa melihat hal-hal lebih jelas."
        },
        {
          name: "David Sutanto",
          title: "CEO Tech Startup",
          verified: true,
          text: "Uang bukan lagi masalah, tapi masalah terus datang. Setelah 1:1 dengan eL Vision, saya paham: yang hilang bukan strategi, tapi kalibrasi energi. Sekarang bisnis berkembang tanpa drama."
        }
    ];

    if (showPaymentInstructions && paymentData) {
        return (
          <div className="min-h-screen bg-rose-50 pb-20 font-sans text-slate-900">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-rose-100">
              <div className="p-4 bg-rose-600 text-white flex items-center gap-2 sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentInstructions(false)} className="text-white hover:bg-rose-700">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg">Instruksi Pembayaran</h1>
              </div>
    
              <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-500">Total Tagihan</p>
                    <p className="text-3xl font-bold text-rose-600">{formatCurrency(paymentData.amount)}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium border border-rose-200">
                        Menunggu Verifikasi
                    </div>
                </div>
    
                <Card className="border-2 border-rose-100 bg-white">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2 border-b border-rose-50 pb-4 mb-4">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Ref. Transaksi</Label>
                        <div className="flex items-center justify-between bg-rose-50/50 p-2 rounded border border-rose-100">
                            <span className="font-mono text-sm text-rose-700">{paymentData.tripay_reference}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.tripay_reference)} className="h-8 w-8 p-0 text-rose-400">
                                <Copy className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {paymentData.qrUrl && (
                        <div className="flex flex-col items-center">
                            <img src={paymentData.qrUrl} alt="QRIS" className="w-64 h-64 object-contain border-2 border-rose-100 rounded-xl p-2 bg-white" />
                            <p className="text-sm text-slate-500 mt-4 text-center">Silakan scan QRIS di atas untuk membayar.</p>
                        </div>
                    )}
                    
                    {paymentData.payCode && (
                        <div className="space-y-2">
                            <Label className="text-slate-500">Kode VA / Nomor Bayar</Label>
                            <div className="flex items-center justify-between bg-rose-50 p-4 rounded-xl border border-rose-200">
                                <span className="font-mono text-2xl font-black text-rose-700">{paymentData.payCode}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(paymentData.payCode)} className="text-rose-600">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
    
                    <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-200">
                        <p><strong>PENTING:</strong> Bunda mohon selesaikan pembayaran agar link webinar segera terkirim otomatis ke email.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="w-full gap-2 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => window.open(`https://wa.me/62895325633487?text=Halo admin, saya sudah bayar untuk order Webinar Ibu ${paymentData.tripay_reference} tapi belum aktif.`, '_blank')}>
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
            background: "linear-gradient(135deg, #fdfbf7 0%, #fff1f2 100%)",
            color: "#2d2d2d",
            lineHeight: 1.6
        }}>
            <Toaster />
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "20px" }}>
                
                <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "20px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#be123c", letterSpacing: "2px" }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>Official Webinar Series</div>
                </div>

                <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: "25px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(190, 18, 60, 0.1)", border: "1px solid rgba(190, 18, 60, 0.1)" }}>
                    <span style={{ background: "#ffe4e6", color: "#be123c", padding: "10px 25px", borderRadius: "50px", fontSize: "20px", fontWeight: "900", marginBottom: "25px", display: "inline-block", letterSpacing: "1px", border: "2px solid #fecdd3" }}>
                        KHUSUS IBU YANG LELAH MENTAL
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1a1a1a", marginBottom: "15px", lineHeight: 1.3 }}>Bunda, Jujur... Sebenarnya Bunda Sedang Menunggu Bom Waktu Meledak, Kan?</h1>
                    <p style={{ fontSize: "16px", color: "#444", marginBottom: "0px", lineHeight: 1.6 }}>Badan ada di rumah, tapi pikiran keliling dunia mencari masalah yang belum tentu terjadi.</p>
                </div>

                <div style={{ background: "#fff", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", borderLeft: "5px solid #be123c" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#be123c", marginBottom: "20px" }}>Apakah Ini Suara di Kepala Bunda Setiap Malam?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>👻</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}><strong>"Anakku gimana masa depannya nanti?"</strong> padahal dia baru umur 5 tahun.</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>👻</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}><strong>"Suamiku kok dingin ya? Apa ada wanita lain?"</strong> padahal dia cuma capek kerja.</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>👻</div>
                            <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#334155' }}><strong>"Apa aku ibu yang gagal?"</strong> hanya karena melihat IG ibu lain yang sempurna.</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1a1a1a" }}>Banting Tulang Tapi Jalan di Tempat</h2>
                    <p style={{ marginBottom: "15px" }}>Bunda merasa sudah lari sekuat tenaga, tapi hidup rasanya seperti di atas <em>treadmill</em>.</p>
                    <div style={{ background: "#fff1f2", padding: "20px", borderRadius: "15px", textAlign: "center", border: "1px dashed #be123c", color: "#881337" }}>
                        <strong>Logika Bunda berteriak:</strong><br/><em>"Saya harus mikir keras biar selamat!"</em><br/><br/>
                        Tapi kenyataannya? Semakin Bunda mikir keras, semakin Bunda <strong>tenggelam</strong>.
                    </div>
                </div>

                <div style={{ background: "#1a1a1a", color: "white", padding: "40px 25px", borderRadius: "25px", marginBottom: "30px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#f43f5e" }}>HUKUM KECOA TERBANG</h2>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>Pernah perhatikan? Orang yang paling takut saat melihat kecoa, justru adalah orang yang <strong>dihinggapi</strong> kecoa itu.</p>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                        <p style={{ margin: 0 }}>Takut uang habis? 👉 <strong>Pengeluaran tak terduga datang.</strong></p>
                        <p style={{ margin: "10px 0" }}>Takut suami selingkuh? 👉 <strong>Suami makin menjauh.</strong></p>
                        <p style={{ margin: 0 }}>Takut anak sakit? 👉 <strong>Anak jadi rewel & lemah.</strong></p>
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "16px" }}>Mau sampai kapan Bunda jadi magnet masalah?</p>
                </div>

                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #eee" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg" alt="eL" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#be123c", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginTop: "20px", color: "#333", textAlign: "center" }}>Saya membongkar kabel yang korslet (trauma & overthinking), dan memasang instalasi baru (ketenangan & magnet rezeki).</p>
                </div>

                {/* 8. VIDEO TESTIMONIALS */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1a1a1a" }}>Mereka yang Sudah "Waras" Kembali</h2>
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

                {/* 9. TEXT TESTIMONIALS */}
                <div style={{ background: "white", padding: "30px 20px", borderRadius: "25px", marginBottom: "30px", border: "1px solid #ffe4e6" }}>
                     <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#be123c" }}>Kisah Perubahan Nyata</h2>
                     {testimonials.map((testi, idx) => (
                        <div key={idx} style={{ background: "#fff1f2", padding: "20px", borderRadius: "10px", marginBottom: "15px" }}>
                            <div style={{ fontWeight: 700, color: "#be123c", marginBottom: "5px" }}>{testi.name} {testi.verified && <span style={{color: '#15803d'}}>✓</span>}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>{testi.title}</div>
                            <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "#4b5563" }}>"{testi.text}"</p>
                        </div>
                     ))}
                </div>

                {/* 10. CURRICULUM */}
                <div style={{ background: "white", padding: "30px 25px", borderRadius: "25px", marginBottom: "30px", border: "2px solid #be123c" }}>
                    <div style={{ background: "#be123c", color: "white", display: "inline-block", padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" }}>MATERI EKSKLUSIF</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1a1a1a" }}>WEBINAR: "DETOKS PIKIRAN IBU"</h2>
                    <div style={{ marginBottom: "20px" }}>
                        {[
                            { title: 'Teknik "Sakelar Otak"', desc: 'Cara mematikan overthinking dalam 30 detik saat serangan panik datang.' },
                            { title: 'Reset Bawah Sadar', desc: 'Menghapus program "Saya Ibu Gagal" dan menggantinya dengan "Ibu Bahagia".' },
                            { title: 'Aura Magnet Keluarga', desc: 'Otomatis membuat anak nurut dan suami setia, tanpa Bunda perlu banyak bicara.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "#fff1f2", color: "#be123c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>{idx + 1}</div>
                                <div>
                                    <strong style={{ color: "#be123c" }}>{item.title}</strong>
                                    <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#444" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. STEP BY STEP GUIDE */}
                <div style={{ padding: "30px 10px", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "30px", color: "#1a1a1a", textAlign: "center" }}>Cara Bergabung</h2>
                    <div style={{ position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", background: "#fecdd3" }}></div>
                        
                        {[
                            { title: "Langkah 1: Amankan Slot", desc: "Isi data diri di bawah dan selesaikan investasi Rp 200.000,- (Harga Promo)." },
                            { title: "Langkah 2: Join Grup VIP", desc: "Bunda akan otomatis dimasukkan ke Grup WhatsApp khusus peserta webinar." },
                            { title: "Langkah 3: Live Webinar", desc: "Hadir via Zoom. Kita akan terapi bersama, tanya jawab, dan ada rekaman jika berhalangan." }
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "30px", position: "relative" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#be123c", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, zIndex: 2, border: "4px solid white" }}>{idx + 1}</div>
                                <div>
                                    <h3 style={{ color: "#be123c", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{step.title}</h3>
                                    <p style={{ color: "#4b5563", fontSize: "14px" }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 12. PRICING & PAYMENT FORM */}
                <div style={{ background: "white", color: "#1e293b", padding: "40px 25px", borderRadius: "30px", marginBottom: "40px", boxShadow: "0 10px 40px rgba(190, 18, 60, 0.1)", border: "1px solid #ffe4e6" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Ketentraman Bunda</h2>
                        <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#9ca3af" }}>Rp 5.000.000,-</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#be123c", marginBottom: "10px" }}>Rp 200.000,-</div>
                        <p style={{ fontSize: "13px", color: "#666", marginBottom: "30px" }}>(Setara harga sekali makan keluarga di mall)</p>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-rose-600">
                                <User className="w-5 h-5" /> Data Diri Bunda
                            </h3>
                            <div className="grid gap-4">
                                <Input 
                                    placeholder="Nama Lengkap" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-rose-500"
                                />
                                <Input 
                                    type="email" 
                                    placeholder="Email (Link akan dikirim ke sini)" 
                                    value={userEmail} 
                                    onChange={(e) => setUserEmail(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-rose-500"
                                />
                                <Input 
                                    placeholder="Nomor WhatsApp" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    className="bg-white text-slate-900 border-slate-200 h-12 focus:border-rose-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-rose-600">
                                <CreditCard className="w-5 h-5" /> Metode Pembayaran
                            </h3>
                            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-3">
                                {paymentMethods.map((method) => (
                                    <Label key={method.code} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === method.code ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                        <RadioGroupItem value={method.code} id={method.code} className="mt-1 mr-4 border-slate-300 text-rose-600" />
                                        <div>
                                            <div className="font-bold text-slate-800">{method.name}</div>
                                            <div className="text-xs text-slate-500">{method.description}</div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        <Button 
                            className="w-full text-lg py-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 font-black shadow-xl rounded-full text-white border-none"
                            onClick={handleCreatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "👉 SAYA MAU BOOK WEBINAR SEKARANG"}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600" /> Transaksi Aman</div>
                            <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-600" /> Verifikasi Otomatis</div>
                        </div>
                    </div>
                </div>

                {/* 13. FAQ SECTION */}
                <div style={{ marginBottom: "40px", padding: "0 10px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1a1a1a", textAlign: "center" }}>Pertanyaan Sering Diajukan</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {[
                            { q: "Saya gaptek, apa bisa ikut?", a: "Sangat bisa, Bun. Cukup pakai Zoom/WhatsApp, nanti tim admin bantu pandu sampai masuk." },
                            { q: "Apa ini ada hubungannya dengan klenik?", a: "Sama sekali tidak. Ini murni sains pikiran dan manajemen energi (psikologi modern)." },
                            { q: "Kalau saya sibuk urus anak saat live?", a: "Tenang, ada rekaman yang bisa Bunda tonton kapan saja saat santai." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "15px", border: "1px solid #e5e7eb" }}>
                                <div style={{ color: "#be123c", fontWeight: "bold", marginBottom: "10px", fontSize: "16px" }}>{item.q}</div>
                                <div style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.6 }}>{item.a}</div>
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
    );
};

export default WebinarIbu;