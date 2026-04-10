import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../integrations/supabase/client";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp, initFacebookPixelWithLogging, trackViewContentEvent, sha256, handleFbcCookieManager } from "../utils/fbpixel";
import imgRoas33 from '../assets/womenconsultant_jpg/roas3.3.jpeg';
import imgRoas38 from '../assets/womenconsultant_jpg/roas 3.8.jpeg';
import imgRoas52 from '../assets/womenconsultant_jpg/roas 5.2.jpeg';
import imgRoas9 from '../assets/womenconsultant_jpg/roas 9.jpeg';
import img1minggu from '../assets/womenconsultant_jpg/1minggu=3juta.jpeg';

const PIXEL_ID = '3319324491540889';
const PRODUCT_NAME = 'Women AI Consultant';
const PRODUCT_AMOUNT = 1500000;

const BONUSES = [
    { icon: "🤖", title: "Modul AI Auto-Respons WhatsApp", desc: "Setup AI yang merespons pelangganmu 24 jam — diprogramkan sesuai pengetahuan bisnismu", price: "Rp350.000" },
    { icon: "📦", title: "Sistem Notifikasi Pesanan Otomatis", desc: "Setiap pesanan masuk langsung dikirim ke Grup WhatsApp gudang atau admin — real-time", price: "Rp200.000" },
    { icon: "🚚", title: "Laporan Resi Otomatis ke Customer", desc: "AI melaporkan nomor resi secara otomatis — zero manual work, pengalaman belanja profesional", price: "Rp150.000" },
    { icon: "🎯", title: "Riset Persona Market Eksklusif", desc: "Teknik menemukan siapa yang akan beli produkmu — target market dengan urgency dan daya beli tinggi", price: "Rp250.000" },
    { icon: "📘", title: "Panduan Buat Ebook Digital Pertamamu", desc: "Dari konten hingga desain cover — dibantu AI step by step", price: "Rp197.000" },
    { icon: "🚀", title: "Template Landing Page & Desain Iklan", desc: "AI membuatkan landing page siap iklan. Mulai iklan Facebook dengan ROAS 3x", price: "Rp300.000" },
    { icon: "🎓", title: "Panduan Iklan Facebook ROAS 3x", desc: "Strategi yang sudah terbukti: keluar Rp1 juta, masuk Rp3 juta — step by step", price: "Rp250.000" },
    { icon: "💎", title: "Support 24 Jam Selama 1 Tahun Penuh", desc: "Tim kami siap bantu kapanpun kamu butuh — WhatsApp langsung ke tim ahli", price: "Rp600.000" },
];

const TESTIMONIALS = [
    { name: "Rina S.", city: "Surabaya", result: "Hemat 6 jam/hari", text: "Dulu saya chat customer dari pagi sampai malam. Sekarang AI yang handle, saya tinggal terima transferan. Alhamdulillah." },
    { name: "Dewi A.", city: "Jakarta", result: "ROAS 4x di bulan pertama", text: "Mulai dari nol, ga punya produk. Sekarang ebook saya laku tiap hari dari iklan FB. ROAS saya 4x bulan pertama." },
    { name: "Sari M.", city: "Bandung", result: "0 komplain keterlambatan respons", text: "Awalnya skeptis. Tapi setelah coba, sistem WhatsApp otomatisnya beneran jalan. Customer happy, saya happy." },
    { name: "Mega K.", city: "Semarang", result: "Omzet naik 3x dalam 2 bulan", text: "Saya punya toko online tapi struggle di CS. Sekarang AI yang jawab semua dan penjualan naik drastis." },
    { name: "Fitri L.", city: "Yogyakarta", result: "Ebook pertama laku 200 copy", text: "Dari nol, ikutin panduan riset persona, buat ebook, dan jalanin iklan. Bulan pertama 200 copy terjual." },
    { name: "Nadia R.", city: "Surabaya", result: "Waktu bebas 8 jam/hari", text: "Bisnis jalan, saya bisa fokus ke keluarga. Ini yang saya impikan dari dulu — bisnis autopilot beneran." },
];

const ROAS_PROOFS = [
    {
        img: imgRoas33,
        roas: "ROAS 3.3x",
        name: "Ibu Dian, Yogyakarta",
        niche: "Produk Parenting",
        text: "Fokus ke orang tua yang anaknya susah makan. Keluar Rp300rb, balik Rp990rb dalam 4 hari. Baru pertama kali iklan seumur hidup.",
    },
    {
        img: imgRoas38,
        roas: "ROAS 3.8x",
        name: "Ibu Rini, Bekasi",
        niche: "Buku Anak & Parenting",
        text: "Target ibu anak 2-7 tahun di FB. Pakai panduan persona dari modul ini, ROAS naik dari 1.8x ke 3.8x hanya dengan ganti angle iklan.",
    },
    {
        img: imgRoas52,
        roas: "ROAS 5.2x",
        name: "Ibu Lestari, Surabaya",
        niche: "Kursus Parenting Digital",
        text: "Jualan kursus untuk orang tua yang anaknya kecanduan gadget. AI bantu riset persona, iklan langsung nyangkut. ROAS 5.2x minggu pertama.",
    },
    {
        img: imgRoas9,
        roas: "ROAS 9x",
        name: "Ibu Wulan, Jakarta",
        niche: "Program Tumbuh Kembang Anak",
        text: "Niche orang tua anak speech delay. Karena masalahnya sangat spesifik dan urgency tinggi, iklan langsung meledak. 9x balik modal dari budget Rp500rb.",
    },
    {
        img: img1minggu,
        roas: "Rp 3 Juta dalam 1 Minggu",
        name: "Ibu Siska, Bandung",
        niche: "MPASI & Nutrisi Anak",
        text: "Modal Rp1 juta, dalam 7 hari dapat Rp3 juta bersih. Target ibu baru yang anaknya mulai MPASI. Pakai template landing page dari modul — tidak perlu coding sama sekali.",
    },
];

const FAQS = [
    { q: "Apakah ini hanya untuk yang sudah punya bisnis?", a: "Tidak. Ada dua jalur: untuk yang sudah punya bisnis (otomatisasi WhatsApp & pesanan), dan untuk yang belum punya produk sama sekali (riset persona, buat ebook digital, dan jalanin iklan)." },
    { q: "Saya tidak paham teknologi, apakah bisa?", a: "100% bisa. Modul dirancang dengan panduan interaktif langkah demi langkah. Plus support 24 jam jika ada yang kurang jelas." },
    { q: "Berapa lama sampai sistemnya berjalan otomatis?", a: "Banyak member bisa setup dalam 1–3 hari. Setelah itu sistem berjalan sendiri selama 1 tahun penuh." },
    { q: "Apakah ada jaminan?", a: "Kami memberikan support penuh selama 30 hari pertama untuk memastikan sistemmu berjalan. Hubungi tim kami jika ada kendala." },
    { q: "Apa bedanya dengan kursus online lainnya?", a: "Bukan sekadar video. Kamu mendapat sistem AI yang langsung bisa dipakai, berjalan otomatis, dan tim support yang standby 24 jam selama 1 tahun." },
];

export default function WomenConsultant() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState("QRIS");
    const [retailOpen, setRetailOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
    const [countdown, setCountdown] = useState("00:00:00");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showSticky, setShowSticky] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { toast } = useToast();
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        document.title = "Women AI Consultant — Mandiri Finansial dengan AI";
        const KEY = 'wc_end_time';
        let endTime = localStorage.getItem(KEY);
        if (!endTime || Date.now() > parseInt(endTime)) {
            endTime = (Date.now() + 3 * 60 * 60 * 1000).toString();
            localStorage.setItem(KEY, endTime);
        }
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, parseInt(endTime!) - now);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement;
            const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
            setScrollProgress(pct);
            setShowSticky(pct > 30);
            document.querySelectorAll('.wc-fade-in:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92) el.classList.add('visible');
            });
        };
        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        handleFbcCookieManager();
    }, []);

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackViewContentEvent(
            { content_name: PRODUCT_NAME, value: PRODUCT_AMOUNT, currency: 'IDR' },
            undefined,
            PIXEL_ID
        );
    }, []);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-wc-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload: any) => {
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;
                        toast({ title: "Pembayaran Berhasil!", description: "Terima kasih! Pembayaran Anda telah kami terima. Akses Women AI Consultant akan dikirimkan ke WhatsApp dan Email Anda.", duration: 0 });
                    }
                }
            ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData, toast]);

    const scrollToForm = useCallback(() => {
        document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const downloadQRIS = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QRIS-WomenConsultant-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(url, '_blank');
        }
    };

    const submitOrder = async () => {
        if (!name || !phone || !email) { alert('Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!'); return; }
        if (!payment) { alert('Silahkan pilih metode pembayaran!'); return; }

        setLoading(true);
        let cleanPhone = phone.trim().replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        } else if (!cleanPhone.startsWith('62')) {
            cleanPhone = '62' + cleanPhone;
        }

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();

        try {
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID, eventName: 'AddPaymentInfo', eventSourceUrl: window.location.href,
                    customData: { content_name: PRODUCT_NAME, value: PRODUCT_AMOUNT, currency: 'IDR' },
                    userData: { fbc, fbp, client_ip_address: clientIp, fn: name, ph: cleanPhone, em: email, external_id: await sha256(email) }
                }
            });
        } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

        let finalAmount = PRODUCT_AMOUNT;
        if (payment === 'BCA_MANUAL') {
            const uniqueCode = Math.floor(Math.random() * 900) + 100;
            finalAmount = PRODUCT_AMOUNT + uniqueCode;
        }

        const payload = {
            subscriptionType: 'universal', paymentMethod: payment,
            userName: name, userEmail: email, phoneNumber: cleanPhone,
            address: 'Digital', province: 'Digital', kota: 'Digital', kecamatan: 'Digital', kodePos: '00000',
            amount: finalAmount, currency: 'IDR', quantity: 1, productName: PRODUCT_NAME,
            fbc, fbp, clientIp,
            pageUrl: window.location.href
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });
            if (error) throw error;

            if (data?.success) {
                setPaymentData(data);
                const redirectMethods = ['DANA', 'OVO', 'SHOPEEPAY', 'LINKAJA', 'SAKUKU'];
                if (data.checkoutUrl && redirectMethods.includes(payment)) {
                    window.location.href = data.checkoutUrl;
                    return;
                }
                setShowPaymentInstructions(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(data?.error || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e: any) {
            console.error('Payment API Error:', e);
            const errorMessage = e?.message || e?.error?.message || e?.toString() || 'Unknown Error';
            alert(`Sistem mendeteksi error: ${errorMessage}\n\nMohon screenshot pesan ini dan hubungi admin via WhatsApp.`);
        } finally { setLoading(false); }
    };

    if (showPaymentInstructions && paymentData) {
        return (
            <div style={{ minHeight: '100vh', background: '#F5EFE0', fontFamily: "'DM Sans', sans-serif", color: '#060A12' }}>
                <style>{`.wc-pay-btn { background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; width: 100%; padding: 16px; borderRadius: 12px; border: none; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'DM Sans'; margin-top: 15px; }`}</style>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '30px 20px' }}>
                    <button onClick={() => setShowPaymentInstructions(false)} style={{ background: 'none', border: 'none', color: '#060A12', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                        <ArrowLeft size={20} /> Kembali
                    </button>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#060A12', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>Instruksi Pembayaran</h2>

                    <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(212,168,75,.3)', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                            <span style={{ color: '#5E7491', fontWeight: 600 }}>NOMOR REFERENSI</span>
                            <span style={{ fontWeight: 700, color: '#060A12' }}>{paymentData.tripay_reference}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                            <span style={{ color: '#5E7491', fontWeight: 600 }}>Total Pembayaran</span>
                            <span style={{ fontWeight: 700, fontSize: '19px', color: '#060A12' }}>Rp {paymentData.amount.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {paymentData.paymentMethod === 'BCA_MANUAL' && (
                        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(212,168,75,.3)', textAlign: 'center' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '16px', fontWeight: 700 }}>Transfer Manual BCA</h3>
                            <div style={{ background: '#F5EFE0', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>7751146578</span>
                                <button onClick={() => { navigator.clipboard.writeText('7751146578'); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#D4A84B" /></button>
                            </div>
                            <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: 16 }}>A.n Delia Mutia</p>
                            <p style={{ fontSize: '13px', color: '#5E7491', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.4 }}>
                                *Robot kami selalu cek per interval 10 menit, jadi maximal 10 menit setelah kk transfer paling lambat
                            </p>
                            <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hai Kak, saya sudah transfer untuk Women AI Consultant. Ini buktinya.. (upload bukti transfer anda) - Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                <button style={{ background: '#25D366', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'DM Sans', marginTop: '15px' }}>Konfirmasi via WhatsApp</button>
                            </a>
                        </div>
                    )}

                    {paymentData.payCode && (
                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(212,168,75,.3)', marginBottom: '16px' }}>
                            <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                            <div style={{ background: '#F5EFE0', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) ? '12px' : '0' }}>
                                <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#060A12' }}>{paymentData.payCode}</span>
                                <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#D4A84B" /></button>
                            </div>
                            {['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) && (
                                <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #D4A84B', fontSize: '14px', color: '#333', lineHeight: 1.5 }}>
                                    <strong>Langkah Pembayaran:</strong><br />
                                    Pergi ke <strong>{paymentData.paymentMethod === 'INDOMARET' ? 'Indomaret' : (paymentData.paymentMethod === 'ALFAMART' ? 'Alfamart' : 'Alfamidi')}</strong> terdekat, ke kasir berikan kode virtual ini untuk dibayar. Dalam 1 menit setelah dibayar, transaksi akan otomatis selesai dan akses dikirim ke WhatsApp dan email Anda.
                                </div>
                            )}
                        </div>
                    )}

                    {paymentData.qrUrl && (
                        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(212,168,75,.3)', textAlign: 'center' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                            <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee' }} />
                                <button onClick={() => downloadQRIS(paymentData.qrUrl)} style={{ background: '#F5EFE0', color: '#060A12', padding: '10px 20px', borderRadius: '8px', border: '1px solid #D4A84B', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                    <span>Download QRIS</span>
                                </button>
                            </div>
                            <p style={{ fontSize: '13px', color: '#5E7491', marginTop: '16px', lineHeight: 1.5 }}>
                                Setelah scan dan bayar, tunggu notifikasi konfirmasi. Akses akan dikirim ke WhatsApp dan email Anda dalam 5 menit.
                            </p>
                        </div>
                    )}

                    <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(212,168,75,.3)', marginTop: '16px', textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#5E7491', lineHeight: 1.6 }}>
                            Ada pertanyaan? Hubungi kami via WhatsApp:
                        </p>
                        <a href="https://wa.me/62895325633487" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '10px', background: '#25D366', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
                            Chat WhatsApp Support
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0D0A14', color: '#F5EFE0', minHeight: '100vh', overflowX: 'hidden' }}>
            <Toaster />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .wc-serif { font-family: 'Playfair Display', Georgia, serif; }
                .wc-gold { color: #D4A84B; }
                .wc-muted { color: #9A8B70; }
                .wc-section { max-width: 860px; margin: 0 auto; padding: 64px 24px; }
                .wc-wrap { max-width: 560px; margin: 0 auto; padding: 0 20px; }
                .wc-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(212,168,75,0.15); border-radius: 12px; padding: 24px; }
                .wc-btn-primary { background: linear-gradient(135deg, #D4A84B, #B8892E); color: #0D0A14; border: none; border-radius: 8px; padding: 18px 40px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 17px; cursor: pointer; letter-spacing: 0.3px; transition: all 0.2s; display: inline-block; text-decoration: none; width: 100%; text-align: center; box-shadow: 0 8px 30px rgba(212,168,75,0.35); }
                .wc-btn-primary:hover { background: linear-gradient(135deg, #E0B85A, #C9993E); transform: translateY(-1px); }
                .wc-divider { border: none; border-top: 1px solid rgba(212,168,75,0.12); margin: 60px 0; }
                .wc-ornament { display: block; text-align: center; color: #D4A84B; font-size: 22px; letter-spacing: 8px; margin: 12px 0; opacity: 0.6; }
                .wc-section-label { font-size: 11px; letter-spacing: 4px; color: #D4A84B; text-transform: uppercase; text-align: center; margin-bottom: 12px; }
                .wc-section-h2 { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; text-align: center; margin-bottom: 32px; line-height: 1.3; }
                .wc-fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
                .wc-fade-in.visible { opacity: 1; transform: translateY(0); }
                .wc-progress { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #D4A84B, #E0B85A); z-index: 9999; transition: width 0.1s linear; }
                .wc-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: rgba(13,10,20,0.97); border-top: 1px solid rgba(212,168,75,0.25); padding: 14px 20px; display: flex; gap: 12px; align-items: center; justify-content: space-between; backdrop-filter: blur(10px); transform: translateY(100%); transition: transform 0.3s ease; }
                .wc-sticky.show { transform: translateY(0); }
                .wc-bonus-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 18px; margin-bottom: 12px; border: 1px solid rgba(212,168,75,0.18); display: flex; gap: 14px; align-items: flex-start; transition: transform 0.2s; }
                .wc-bonus-card:hover { transform: translateY(-2px); }
                .wc-testi-card { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 20px; border: 1px solid rgba(212,168,75,0.15); }
                .wc-proof-card { background: rgba(255,255,255,0.04); border-radius: 14px; border: 1px solid rgba(212,168,75,0.2); overflow: hidden; transition: transform 0.2s; }
                .wc-proof-card:hover { transform: translateY(-3px); }
                .wc-proof-img-wrap { position: relative; width: 100%; padding-bottom: 100%; overflow: hidden; background: #1A1220; }
                .wc-proof-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; display: block; }
                .wc-proof-body { padding: 16px; }
                .wc-proof-roas { font-size: 13px; font-weight: 800; color: #4ADE80; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); display: inline-block; padding: 3px 10px; border-radius: 4px; margin-bottom: 10px; letter-spacing: 0.5px; }
                .wc-finput { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F5EFE0; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
                .wc-finput:focus { border-color: rgba(212,168,75,0.5); }
                .wc-flabel { display: block; font-size: 13px; color: #9A8B70; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
                .wc-pmgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
                .wc-pmopt { border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 11px; cursor: pointer; text-align: center; transition: all 0.2s; }
                .wc-pmopt.sel { border-color: #D4A84B; background: rgba(212,168,75,0.08); }
                .wc-pmname { font-size: 14px; font-weight: 600; color: #F5EFE0; }
                .wc-pmsub { font-size: 11px; margin-top: 2px; color: #9A8B70; }
                .wc-pmsub.gold { color: #D4A84B; }
                .wc-submit { width: 100%; padding: 19px; background: linear-gradient(135deg, #B8892E, #D4A84B, #B8892E); background-size: 200%; border: none; border-radius: 12px; color: #000; font-size: 17px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 10px 35px rgba(212,168,75,0.4); transition: transform 0.2s; margin-top: 18px; }
                .wc-submit:hover { transform: translateY(-2px); }
                .wc-faq-item { border-bottom: 1px solid rgba(212,168,75,0.1); padding: 20px 0; cursor: pointer; }
                .wc-faq-q { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #F5EFE0; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
                .wc-faq-a { font-size: 14px; color: #9A8B70; line-height: 1.7; margin-top: 12px; }
                @media (max-width: 600px) {
                    .wc-hero-title { font-size: 32px !important; }
                    .wc-hero-price { font-size: 48px !important; }
                }
            `}</style>

            {/* SCROLL PROGRESS */}
            <div className="wc-progress" style={{ width: `${scrollProgress}%` }} />

            {/* STICKY CTA */}
            <div className={`wc-sticky ${showSticky ? 'show' : ''}`}>
                <div>
                    <div style={{ fontSize: 13, color: '#9A8B70' }}>Harga promo:</div>
                    <div className="wc-serif wc-gold" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>Rp 1.500.000</div>
                </div>
                <button className="wc-btn-primary" style={{ width: 'auto', padding: '14px 28px', fontSize: 15 }} onClick={scrollToForm}>
                    Bergabung Sekarang
                </button>
            </div>

            {/* TOP BAR */}
            <div style={{ background: '#1A1425', borderBottom: '1px solid rgba(212,168,75,0.15)', padding: '10px 24px', textAlign: 'center', fontSize: 13, color: '#9A8B70' }}>
                <span className="wc-gold" style={{ fontWeight: 500 }}>PROMO TERBATAS</span> — Hanya untuk 50 wanita pertama. Harga naik dalam:{' '}
                <span className="wc-gold" style={{ fontWeight: 600 }}>{countdown}</span>
            </div>

            {/* HERO */}
            <div style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,75,0.09) 0%, transparent 65%)', borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
                <div className="wc-section" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
                    <div className="wc-fade-in" style={{ fontSize: 11, letterSpacing: 4, color: '#D4A84B', textTransform: 'uppercase', marginBottom: 20 }}>
                        Women AI Consultant
                    </div>
                    <span className="wc-ornament">— ✦ —</span>
                    <h1 className="wc-serif wc-fade-in" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2, margin: '24px 0 20px' }}>
                        Mandiri Finansial,<br />
                        <em className="wc-gold">Bebas dari Ketergantungan.</em>
                    </h1>
                    <p className="wc-fade-in wc-muted" style={{ fontSize: 17, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px' }}>
                        Sistem AI pertama yang dirancang khusus untuk wanita Indonesia — otomatis 100%, bekerja penuh selama <strong style={{ color: '#F5EFE0' }}>1 tahun penuh</strong>, tanpa perlu pengalaman teknis.
                    </p>

                    <div className="wc-fade-in" style={{ marginBottom: 40 }}>
                        <div className="wc-muted" style={{ fontSize: 14, textDecoration: 'line-through', marginBottom: 4 }}>Harga normal Rp 3.000.000</div>
                        <div className="wc-serif wc-gold wc-hero-price" style={{ fontSize: 64, fontWeight: 700, lineHeight: 1 }}>Rp 1.500.000</div>
                        <div className="wc-muted" style={{ fontSize: 13, marginTop: 8 }}>= Rp 125.000/bulan · Rp 4.000/hari · Support 24 jam</div>
                    </div>

                    <div className="wc-fade-in" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="wc-btn-primary" style={{ width: 'auto' }} onClick={scrollToForm}>
                            Mulai Sekarang — Rp 1.500.000
                        </button>
                    </div>

                    <div className="wc-fade-in" style={{ marginTop: 28, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: '#9A8B70' }}>
                        {['✓ 8 Bonus Eksklusif', '✓ AI Auto-Respons WhatsApp', '✓ Support 24 Jam', '✓ Berlaku 1 Tahun'].map(t => (
                            <span key={t}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* WHY WOMEN */}
            <div style={{ background: 'rgba(212,168,75,0.04)', borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
                <div className="wc-section" style={{ textAlign: 'center' }}>
                    <div className="wc-fade-in">
                        <span className="wc-ornament">— ✦ —</span>
                        <h2 className="wc-serif" style={{ fontSize: 30, fontWeight: 700, margin: '16px 0 16px' }}>Mengapa Khusus Wanita?</h2>
                        <p className="wc-muted" style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 640, margin: '0 auto 28px' }}>
                            Selama ini wanita selalu dikaitkan dengan kekangan dan ketergantungan. Kami hadir untuk mengubah narasi itu.
                            Wanita memiliki <span className="wc-gold">urgency dan intuisi bisnis yang lebih tinggi</span> — kami percaya itu, dan 100% mendedikasikan sistem ini untuk mendukung kemandirianmu.
                        </p>

                        {/* NOTE CARD */}
                        <div style={{
                            maxWidth: 560, margin: '0 auto',
                            background: 'rgba(239,68,68,0.07)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            borderLeft: '4px solid #EF4444',
                            borderRadius: 10,
                            padding: '18px 20px',
                            textAlign: 'left',
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#EF4444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>⚠ Perhatian Penting</div>
                            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#F5EFE0', margin: 0 }}>
                                Program ini <strong>khusus untuk wanita.</strong> Jika Anda pria, maaf — kami tidak bisa menerima pendaftaran Anda.
                            </p>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#9A8B70', marginTop: 10, marginBottom: 0 }}>
                                Bukan karena pria tidak mampu — tapi karena wanita memiliki tekad yang lebih serius dan selalu <em>underestimated</em> oleh lingkungan sekitarnya. Kami ada untuk membuktikan sebaliknya.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="wc-section">
                <div className="wc-fade-in">
                    <span className="wc-ornament">— ✦ —</span>
                    <h2 className="wc-serif" style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', margin: '16px 0 12px' }}>Bagaimana Cara Kerjanya?</h2>
                    <p className="wc-muted" style={{ textAlign: 'center', fontSize: 15, marginBottom: 40 }}>Ikuti langkah ini dari awal ke akhir — jangan skip.</p>

                    {/* STEP 1 */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(212,168,75,0.08)', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,75,0.12)', border: '1px solid rgba(212,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A84B', letterSpacing: 1 }}>01</div>
                            <div style={{ width: 1, height: 24, background: 'rgba(212,168,75,0.2)' }} />
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>📘</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700 }}>Baca Ebook Persona Finder</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Pelajari metode PersonaFinder — temukan SIAPA yang butuh solusi, bukan produk apa yang dijual. Setelah persona ketemu, putuskan: <strong style={{ color: '#F5EFE0' }}>ebook digital</strong> (margin tinggi, bisa dibuat 3–7 hari dengan AI) atau <strong style={{ color: '#F5EFE0' }}>produk fisik</strong> jika kamu sudah punya stok. Pilih satu — fokus eksekusi.
                            </div>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(212,168,75,0.08)', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,75,0.12)', border: '1px solid rgba(212,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A84B', letterSpacing: 1 }}>02</div>
                            <div style={{ width: 1, height: 24, background: 'rgba(212,168,75,0.2)' }} />
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>🌐</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700 }}>Buat Website dalam 10 Menit — Dibantu AI</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Minta AI kami buatkan landing page — cukup jelaskan produk dan personamu. Tidak tahu deskripsinya? Minta AI buatkan juga. Website langsung jadi. Upload ke <strong style={{ color: '#F5EFE0' }}>Server Elvision</strong> atau <strong style={{ color: '#F5EFE0' }}>Cloudflare Pages</strong> — gratis, tidak perlu coding, live dalam hitungan menit.
                            </div>
                            <div style={{ marginTop: 10, background: 'rgba(212,168,75,0.05)', border: '1px solid rgba(212,168,75,0.15)', borderLeft: '3px solid #D4A84B', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#9A8B70', lineHeight: 1.7 }}>
                                💡 <strong style={{ color: '#F5EFE0' }}>Setelah website jadi</strong> — masukkan gambar/foto creative sesuai persona. Tidak punya foto? Minta AI buat gambar berisi teks yang langsung menyentuh masalah market-mu.
                            </div>
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(212,168,75,0.08)', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,75,0.12)', border: '1px solid rgba(212,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A84B', letterSpacing: 1 }}>03</div>
                            <div style={{ width: 1, height: 24, background: 'rgba(212,168,75,0.2)' }} />
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>📡</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700 }}>Tanam Facebook Pixel — AI yang Urus</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Pixel adalah tracking untuk setiap penjualan. Cukup kirim Pixel ID kamu ke tim kami — AI kami yang tanam di landing page. Setiap ada penjualan, sistem <strong style={{ color: '#F5EFE0' }}>otomatis lapor ke WhatsApp kamu</strong>. Belum punya Pixel? Cari di YouTube: <em>"Cara buat Facebook Pixel"</em> — 5 menit selesai.
                            </div>
                        </div>
                    </div>

                    {/* STEP 4 */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(212,168,75,0.08)', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,75,0.12)', border: '1px solid rgba(212,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A84B', letterSpacing: 1 }}>04</div>
                            <div style={{ width: 1, height: 24, background: 'rgba(212,168,75,0.2)' }} />
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>📣</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700 }}>Mulai Iklan Meta — Budget Rp 100rb/hari · CBO · Sales</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Buat campaign dengan tujuan <strong style={{ color: '#F5EFE0' }}>Sales</strong>, tipe budget <strong style={{ color: '#F5EFE0' }}>CBO</strong>, dan pixel yang sudah ditanam. Mulai dengan <strong style={{ color: '#F5EFE0' }}>Rp 100.000/hari</strong>. Ingat prinsip terpenting:
                            </div>
                            <div style={{ marginTop: 12, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)', borderLeft: '3px solid #EF4444', borderRadius: 6, padding: '12px 14px', fontSize: 13, color: '#F5EFE0', lineHeight: 1.7 }}>
                                ⚠ <strong>Kesan pertama adalah segalanya.</strong> Jika Rp 100rb tidak convert — bukan budget-nya salah. <strong>Pesan di foto itu yang salah.</strong> Ganti foto, cari angle baru. Target minimal <strong>20 foto yang sudah ditest</strong> sebelum menyerah pada satu persona.
                            </div>
                            <div style={{ marginTop: 8, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.25)', borderLeft: '3px solid #4ADE80', borderRadius: 6, padding: '12px 14px', fontSize: 13, color: '#9A8B70', lineHeight: 1.7 }}>
                                ✓ <strong style={{ color: '#F5EFE0' }}>Setelah ada convert</strong> — tambah variasi foto lain ke adset yang sama. Naikkan budget secara bertahap. Scale yang winning, matikan yang tidak.
                            </div>
                        </div>
                    </div>

                    {/* STEP 5 — WORKBOOK */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(212,168,75,0.08)', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,75,0.12)', border: '1px solid rgba(212,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A84B', letterSpacing: 1 }}>05</div>
                            <div style={{ width: 1, height: 24, background: 'rgba(212,168,75,0.2)' }} />
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>📓</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700 }}>Jalankan Workbook Rezeki 30 Hari — Paralel dengan Bisnismu</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Selama kamu menjalankan bisnis ini, lakukan protokol <strong style={{ color: '#F5EFE0' }}>Kekacauan + Kedamaian</strong> setiap hari selama 30 hari. Olahraga intens (kekacauan) + ibadah/meditasi (kedamaian) = energi dan mental yang terjaga. Catat setiap tanda rezeki yang datang — sekecil apapun.
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' as const }}>
                                {[
                                    { label: 'Hari 7', note: 'Tubuh & pikiran mulai sinkron' },
                                    { label: 'Hari 14', note: 'Titik kritis — tanda pertama sering muncul' },
                                    { label: 'Hari 21', note: 'Jadi kebiasaan — momentum bergerak' },
                                    { label: 'Hari 30', note: 'Siklus selesai — mulai siklus berikutnya' },
                                ].map((m, i) => (
                                    <div key={i} style={{ background: 'rgba(212,168,75,0.06)', border: '1px solid rgba(212,168,75,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                                        <div style={{ color: '#D4A84B', fontWeight: 700 }}>{m.label}</div>
                                        <div style={{ color: '#9A8B70', marginTop: 2 }}>{m.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* STEP 6 — RESULT */}
                    <div style={{ display: 'flex', gap: 20, padding: '24px 0', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #D4A84B, #B8892E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏆</div>
                        </div>
                        <div style={{ flex: 1, paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 20 }}>📈</span>
                                <div className="wc-serif" style={{ fontSize: 17, fontWeight: 700, color: '#D4A84B' }}>ROAS 3x+++ Mengalir Masuk</div>
                            </div>
                            <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.75 }}>
                                Persona tepat + foto tepat + landing page yang convert = ROAS 3x, 5x, bahkan 9x. <strong style={{ color: '#F5EFE0' }}>Keluar Rp 1 juta — masuk Rp 3 juta ke atas.</strong> Sistem berjalan sendiri sementara kamu fokus scaling.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="wc-divider" />

            {/* VALUE BREAKDOWN */}
            <div className="wc-section" style={{ paddingTop: 0 }}>
                <div className="wc-fade-in" style={{ textAlign: 'center' }}>
                    <span className="wc-ornament">— ✦ —</span>
                    <h2 className="wc-serif" style={{ fontSize: 30, fontWeight: 700, margin: '16px 0 12px' }}>Harga yang Tidak Masuk Akal (Murahnya)</h2>
                    <p className="wc-muted" style={{ fontSize: 15, marginBottom: 36 }}>Bayangkan ini dihitung per hari:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 40 }}>
                        {[
                            { label: 'Per Tahun', value: 'Rp 1.500.000', sub: 'sekali bayar' },
                            { label: 'Per Bulan', value: 'Rp 125.000', sub: 'lebih murah dari kopi' },
                            { label: 'Per Hari', value: 'Rp 4.000', sub: 'setara parkir motor' },
                            { label: 'Support', value: '24 Jam', sub: 'selama 365 hari' },
                        ].map(item => (
                            <div key={item.label} className="wc-card" style={{ textAlign: 'center' }}>
                                <div className="wc-muted" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{item.label}</div>
                                <div className="wc-serif wc-gold" style={{ fontSize: 22, fontWeight: 700 }}>{item.value}</div>
                                <div className="wc-muted" style={{ fontSize: 12, marginTop: 4 }}>{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div style={{ background: 'rgba(212,168,75,0.03)', borderTop: '1px solid rgba(212,168,75,0.1)', borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
                <div className="wc-section">
                    <div className="wc-fade-in">
                        <span className="wc-ornament">— ✦ —</span>
                        <h2 className="wc-serif" style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', margin: '16px 0 36px' }}>Mereka Sudah Merasakannya</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className="wc-testi-card">
                                    <div style={{ fontSize: 12, color: '#D4A84B', background: 'rgba(212,168,75,0.1)', display: 'inline-block', padding: '4px 10px', borderRadius: 3, marginBottom: 14 }}>
                                        {t.result}
                                    </div>
                                    <p className="wc-muted" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(212,168,75,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#D4A84B' }}>
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                                            <div className="wc-muted" style={{ fontSize: 12 }}>{t.city}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ROAS PROOFS */}
            <div className="wc-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
                <div className="wc-fade-in">
                    <div className="wc-section-label">BUKTI NYATA</div>
                    <h2 className="wc-section-h2 wc-serif">Hasil Iklan Mereka Setelah<br /><span className="wc-gold">Memahami Market yang Dijual</span></h2>
                    <p className="wc-muted" style={{ textAlign: 'center', fontSize: 15, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
                        Fokus ke niche orang tua — urgency tinggi, daya beli ada. Ini hasil nyata dari member yang menerapkan riset persona sebelum iklan.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                        {ROAS_PROOFS.map((p, i) => (
                            <div key={i} className="wc-proof-card">
                                <div className="wc-proof-img-wrap">
                                    <img src={p.img} alt={p.roas} className="wc-proof-img" />
                                </div>
                                <div className="wc-proof-body">
                                    <div className="wc-proof-roas">{p.roas}</div>
                                    <div style={{ fontSize: 13, color: '#D4A84B', marginBottom: 6 }}>{p.niche}</div>
                                    <p className="wc-muted" style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>"{p.text}"</p>
                                    <div style={{ fontSize: 12, color: '#9A8B70', fontWeight: 600 }}>— {p.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BONUSES */}
            <div style={{ background: 'rgba(212,168,75,0.04)', borderBottom: '1px solid rgba(212,168,75,0.1)' }}>
                <div className="wc-section">
                    <div className="wc-fade-in">
                        <div className="wc-section-label">BONUS EKSKLUSIF</div>
                        <h2 className="wc-section-h2 wc-serif">8 Bonus Senilai <span className="wc-gold">Rp 2.297.000</span></h2>
                        <p className="wc-muted" style={{ textAlign: 'center', fontSize: 15, marginBottom: 28 }}>Semua ini sudah termasuk dalam harga Rp 1.500.000 yang kamu bayar:</p>
                        <div>
                            {BONUSES.map((b, i) => (
                                <div key={i} className="wc-bonus-card">
                                    <div style={{ fontSize: 26, flexShrink: 0 }}>{b.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: '#F5EFE0', marginBottom: 4 }}>{b.title}</div>
                                        <div className="wc-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{b.desc}</div>
                                        <div style={{ marginTop: 8, fontSize: 14 }}>
                                            <s className="wc-muted" style={{ fontWeight: 400 }}>{b.price}</s>
                                            <span style={{ color: '#4ADE80', fontWeight: 700, marginLeft: 8 }}>→ GRATIS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* WHAT YOU GET */}
            <div className="wc-section">
                <div className="wc-fade-in">
                    <span className="wc-ornament">— ✦ —</span>
                    <h2 className="wc-serif" style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', margin: '16px 0 36px' }}>Yang Kamu Dapatkan</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {[
                            ['📚', 'Ebook Lengkap: Riset Persona & Strategi Bisnis', 'Metode eksklusif menemukan market dengan daya beli tinggi'],
                            ['🤖', 'Modul AI Auto-Respons WhatsApp', 'Diprogram sesuai pengetahuan bisnismu, berjalan 24/7'],
                            ['📦', 'Sistem Notifikasi Pesanan Otomatis', 'Ke Grup WhatsApp gudang atau admin secara real-time'],
                            ['🚀', 'AI Pembuatan Landing Page & Desain', 'Dari ide produk sampai halaman siap iklan'],
                            ['🎓', 'Panduan Iklan Facebook (ROAS 3x)', 'Strategi yang sudah terbukti oleh member kami'],
                            ['💎', 'Support 24 Jam selama 1 Tahun Penuh', 'Tim kami siap membantu kapanpun kamu butuh'],
                            ['🎁', '8 Bonus Eksklusif', 'Semua modul tambahan senilai Rp 2.297.000 sudah termasuk'],
                        ].map(([icon, title, sub], i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderBottom: '1px solid rgba(212,168,75,0.08)' }}>
                                <div style={{ fontSize: 22, width: 36, textAlign: 'center', flexShrink: 0 }}>{icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="wc-serif" style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{title}</div>
                                    <div className="wc-muted" style={{ fontSize: 13 }}>{sub}</div>
                                </div>
                                <div style={{ color: '#D4A84B', fontSize: 18, flexShrink: 0 }}>✓</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CHECKOUT */}
            <div id="checkout" style={{ background: 'linear-gradient(180deg, #0D0A14 0%, #1A1220 50%, #0D0A14 100%)', borderTop: '1px solid rgba(212,168,75,0.15)', borderBottom: '1px solid rgba(212,168,75,0.15)' }}>
                <div className="wc-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
                    <div className="wc-fade-in" style={{ textAlign: 'center', marginBottom: 40 }}>
                        <span className="wc-ornament">— ✦ ✦ ✦ —</span>
                        <h2 className="wc-serif" style={{ fontSize: 34, fontWeight: 700, margin: '24px 0 16px' }}>
                            Waktunya Kamu Ambil Kendali<br />
                            <em className="wc-gold">Atas Hidupmu Sendiri.</em>
                        </h2>
                        <p className="wc-muted" style={{ fontSize: 15, lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>
                            Tidak ada lagi ketergantungan. Tidak ada lagi jam-jam habis hanya untuk chat customer.
                            Investasi sekali, hasilnya bekerja <strong style={{ color: '#F5EFE0' }}>365 hari</strong> untukmu.
                        </p>
                    </div>

                    <div style={{ maxWidth: 500, margin: '0 auto' }}>
                        <div className="wc-card wc-fade-in" style={{ background: 'rgba(212,168,75,0.06)', borderColor: 'rgba(212,168,75,0.3)', marginBottom: 24, textAlign: 'center' }}>
                            <div className="wc-muted" style={{ fontSize: 13, textDecoration: 'line-through', marginBottom: 4 }}>Rp 3.000.000</div>
                            <div className="wc-serif wc-gold" style={{ fontSize: 50, fontWeight: 700, lineHeight: 1 }}>Rp 1.500.000</div>
                            <div className="wc-muted" style={{ fontSize: 12, marginTop: 6 }}>Bayar sekali · Akses 1 tahun penuh · Support 24 jam</div>
                            <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', fontSize: 12, color: '#9A8B70' }}>
                                {['🔒 Aman & Terenkripsi', '📱 Akses Langsung Setelah Bayar', '💬 WA Support 24 Jam'].map(t => (
                                    <span key={t}>{t}</span>
                                ))}
                            </div>
                        </div>

                        <div className="wc-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="wc-flabel">Nama Lengkap</label>
                                <input className="wc-finput" type="text" placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="wc-flabel">No. WhatsApp</label>
                                <input className="wc-finput" type="tel" placeholder="08xxxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div>
                                <label className="wc-flabel">Email</label>
                                <input className="wc-finput" type="email" placeholder="email@contoh.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>

                            <div>
                                <label className="wc-flabel">Metode Pembayaran</label>
                                <div className="wc-pmgrid">
                                    {[
                                        ['QRIS', 'QRIS', 'Semua E-Wallet', true],
                                        ['DANA', 'DANA', 'E-Wallet DANA', true],
                                        ['OVO', 'OVO', 'E-Wallet OVO', true],
                                        ['SHOPEEPAY', 'ShopeePay', 'E-Wallet ShopeePay', true],
                                        ['BCA_MANUAL', 'Manual BCA', 'Dicek 1-10 Menit', false],
                                        ['BCAVA', 'BCA Virtual Account', 'Otomatis via BCA', false],
                                        ['BNIVA', 'BNI Virtual Account', 'Otomatis via BNI', false],
                                        ['BRIVA', 'BRI Virtual Account', 'Otomatis via BRI', false],
                                        ['MANDIRIVA', 'Mandiri Virtual Account', 'Otomatis via Mandiri', false],
                                        ['PERMATAVA', 'Permata Virtual Account', 'Otomatis via Permata', false],
                                        ['CIMBVA', 'CIMB Virtual Account', 'Otomatis via CIMB', false],
                                        ['SAMPOERNAVA', 'Sahabat Sampoerna VA', 'Otomatis via Sampoerna', false],
                                    ].map(([id, nm, sb, isGold], idx) => (
                                        <div key={idx} className={`wc-pmopt ${payment === id ? 'sel' : ''}`} onClick={() => { setPayment(id as string); setRetailOpen(false); }}>
                                            <div className="wc-pmname">{nm}</div>
                                            <div className={`wc-pmsub ${isGold ? 'gold' : ''}`}>{sb}</div>
                                        </div>
                                    ))}
                                    {/* Retail Dropdown */}
                                    <div className={`wc-pmopt ${['INDOMARET', 'ALFAMART', 'ALFAMIDI'].includes(payment) ? 'sel' : ''}`} onClick={() => setRetailOpen(!retailOpen)}>
                                        <div className="wc-pmname">Minimarket ▾</div>
                                        <div className="wc-pmsub">Indomaret, Alfamart, Alfamidi</div>
                                    </div>
                                </div>

                                {retailOpen && (
                                    <div className="wc-pmgrid" style={{ marginTop: 10, padding: '12px', background: 'rgba(212,168,75,0.04)', borderRadius: 10, border: '1px solid rgba(212,168,75,0.1)' }}>
                                        {[
                                            ['INDOMARET', 'Indomaret', 'Gerai Indomaret'],
                                            ['ALFAMART', 'Alfamart', 'Gerai Alfamart'],
                                            ['ALFAMIDI', 'Alfamidi', 'Gerai Alfamidi'],
                                        ].map(([id, nm, sb]) => (
                                            <div key={id} className={`wc-pmopt ${payment === id ? 'sel' : ''}`} onClick={() => setPayment(id)}>
                                                <div className="wc-pmname">{nm}</div>
                                                <div className="wc-pmsub">{sb}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ background: 'rgba(212,168,75,0.05)', border: '1px solid rgba(212,168,75,0.15)', borderRadius: 10, padding: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13, color: '#9A8B70' }}>
                                    <span>Women AI Consultant — Paket Lengkap + 8 Bonus</span>
                                    <span style={{ fontWeight: 600 }}>Rp1.500.000</span>
                                </div>
                                <div style={{ height: 1, background: 'rgba(212,168,75,0.09)', marginBottom: 7 }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 700 }}>
                                    <span style={{ color: '#F5EFE0' }}>Total</span>
                                    <span className="wc-serif wc-gold" style={{ fontSize: 22 }}>Rp 1.500.000</span>
                                </div>
                            </div>

                            <button className="wc-submit" onClick={submitOrder} disabled={loading}>
                                {loading ? 'Memproses...' : 'Bergabung Sekarang — Rp 1.500.000'}
                            </button>
                            <p style={{ fontSize: 12, color: '#9A8B70', textAlign: 'center', lineHeight: 1.75 }}>
                                🔒 Pembayaran aman & dienkripsi. Akses dikirim langsung ke WhatsApp & Email. Tidak ada tagihan mencurigakan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="wc-section">
                <div className="wc-fade-in">
                    <span className="wc-ornament">— ✦ —</span>
                    <h2 className="wc-serif" style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', margin: '16px 0 32px' }}>Pertanyaan Umum</h2>
                    <div>
                        {FAQS.map((faq, i) => (
                            <div key={i} className="wc-faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <div className="wc-faq-q">
                                    <span>{faq.q}</span>
                                    <span className="wc-gold" style={{ fontSize: 20, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                                </div>
                                {openFaq === i && <div className="wc-faq-a">{faq.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div style={{ background: 'rgba(212,168,75,0.04)', borderTop: '1px solid rgba(212,168,75,0.1)', padding: '48px 24px', textAlign: 'center' }}>
                <div className="wc-fade-in">
                    <h2 className="wc-serif" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                        Masih Ragu? <em className="wc-gold">Jangan Tunggu Lebih Lama.</em>
                    </h2>
                    <p className="wc-muted" style={{ fontSize: 15, lineHeight: 1.8, maxWidth: 480, margin: '0 auto 28px' }}>
                        Setiap hari yang kamu tunda adalah hari di mana wanita lain mengambil peluang yang harusnya milikmu.
                    </p>
                    <button className="wc-btn-primary" style={{ width: 'auto', maxWidth: 360 }} onClick={scrollToForm}>
                        Bergabung Sekarang — Rp 1.500.000
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <div style={{ borderTop: '1px solid rgba(212,168,75,0.1)', padding: '32px 24px', textAlign: 'center' }}>
                <div className="wc-serif wc-gold" style={{ fontSize: 20, marginBottom: 8 }}>Women AI Consultant</div>
                <div className="wc-muted" style={{ fontSize: 13 }}>Dedikasi 100% untuk kemandirian wanita Indonesia</div>
                <div className="wc-muted" style={{ fontSize: 12, marginTop: 16 }}>© 2025 Women AI Consultant · Semua hak dilindungi</div>
            </div>
        </div>
    );
}
