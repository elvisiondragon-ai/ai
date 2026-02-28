import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "../integrations/supabase/client";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp, initFacebookPixelWithLogging, trackViewContentEvent } from "../utils/fbpixel";
import qrisBcaImage from "../assets/qrisbca.jpeg";
import appImg1 from "../assets/coparenting_img/1.jpeg";
import appImg2 from "../assets/coparenting_img/2.jpeg";
import appImg3 from "../assets/coparenting_img/3.jpeg";
import appImg4 from "../assets/coparenting_img/4.jpeg";
import appImg5 from "../assets/coparenting_img/5.jpeg";
import appImg6 from "../assets/coparenting_img/6.jpeg";
import appImg7 from "../assets/coparenting_img/7.jpeg";
import appImg8 from "../assets/coparenting_img/8.jpeg";

const ParentingLanding: React.FC = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState("QRIS");
    const [addUpsell, setAddUpsell] = useState(false);
    const { toast } = useToast();

    // Payment States
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
    const purchaseFiredRef = useRef(false);

    const priceID = addUpsell ? 149000 : 99000;
    const PIXEL_ID = '869269557404494'; // We'll just use the default or a dummy one if not provided, but df uses one. 

    const sendWAAlert = async (type: 'attempt' | 'success', details: any) => {
        try {
            const productDesc = `Co-Parenting Tracker`;
            const msg = type === 'attempt'
                ? `🔔 *Mencoba Checkout*
Produk: ${productDesc}
Nama: ${details.name}
WA: ${details.phone}
Metode: ${details.method}`
                : `✅ *Checkout Sukses*
Ref: ${details.ref}
Produk: ${productDesc}
Nama: ${details.name}
WA: ${details.phone}
Total: Rp ${details.amount.toLocaleString('id-ID')}`;

            await fetch('https://watzapp.web.id/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': '23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8' },
                body: JSON.stringify({ phone: "62895325633487", message: msg, token: "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8" })
            });
        } catch (e) { console.error('WA API Error', e); }
    };

    const submitOrder = async () => {
        if (!name || !phone || !email) { alert('⚠️ Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!'); return; }
        if (!payment) { alert('⚠️ Silahkan pilih metode pembayaran!'); return; }

        setLoading(true);
        sendWAAlert('attempt', { name, phone, method: payment });

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();
        const productDesc = addUpsell ? `Universal - Co-Parenting Tracker + App Sync - ${name}` : `Universal - Co-Parenting Tracker - ${name}`;

        try {
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID, eventName: 'AddPaymentInfo', eventSourceUrl: window.location.href,
                    customData: { content_name: productDesc, value: priceID, currency: 'IDR' },
                    userData: { fbc, fbp, client_ip_address: clientIp, fn: name, ph: phone, em: email }
                }
            });
        } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

        const payload = {
            subscriptionType: 'universal', paymentMethod: payment,
            userName: name, userEmail: email, phoneNumber: phone,
            address: 'Digital', province: 'Digital', kota: 'Digital', kecamatan: 'Digital', kodePos: '00000',
            amount: priceID, currency: 'IDR', quantity: 1, productName: addUpsell ? 'universal_Id_parenting_paid_upsell' : 'universal_Id_parenting_paid',
            fbc, fbp, clientIp
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });
            if (error) { throw error; }

            if (data?.success) {
                setPaymentData(data); setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref: data.tripay_reference, name, phone, amount: priceID });
            } else if (payment === 'BCA_MANUAL') {
                const ref = `MANUAL-${Date.now()}`;
                setPaymentData({ paymentMethod: 'BCA_MANUAL', amount: priceID, status: 'UNPAID', tripay_reference: ref });
                setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref, name, phone, amount: priceID });
            } else {
                alert(data?.error || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e) { alert('Network Error. Silakan pesan via WhatsApp.'); console.error(e); } finally { setLoading(false); }
    };

    const scrollToForm = useCallback(() => { document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }); }, []);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-parenting-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload: any) => {
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;
                        toast({ title: "🎉 Pembayaran Berhasil!", description: "Terima kasih! Pembayaran Anda telah kami terima. Link akses akan dikirimkan ke Email dan WhatsApp.", duration: 0 });
                    }
                }
            ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData, PIXEL_ID, priceID, toast]);

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackViewContentEvent(
            { content_name: 'Universal - Co-Parenting Tracker', value: priceID, currency: 'IDR' },
            undefined,
            PIXEL_ID
        );
    }, [PIXEL_ID]);


    useEffect(() => {
        // Initialize variables first
        const notificationContainer = document.getElementById('notification-container');
        const stickyCTA = document.getElementById('sticky-cta');

        // Buyer names and cities data
        const buyerNames = [
            'Sari', 'Budi', 'Dewi', 'Andi', 'Rina', 'Tono', 'Maya', 'Agus',
            'Lina', 'Rudi', 'Siti', 'Wawan', 'Nina', 'Dodi', 'Ratna', 'Yudi'
        ];

        const cities = [
            'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
            'Palembang', 'Tangerang', 'Depok', 'Bekasi', 'Bogor', 'Malang',
            'Yogyakarta', 'Denpasar', 'Balikpapan', 'Pekanbaru'
        ];

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Scroll reveal
        function initScrollReveal() {
            const reveals = document.querySelectorAll('.reveal');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            reveals.forEach(el => observer.observe(el));
        }

        // Notification popup system
        let notificationCount = 0;
        const maxNotifications = 5;

        function playNotificationSound() {
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.08;

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.08);
            } catch (e) {
                // Silently fail if audio not supported
            }
        }

        function createNotification() {
            if (!notificationContainer || notificationCount >= maxNotifications) return;

            const name = buyerNames[Math.floor(Math.random() * buyerNames.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];

            const notification = document.createElement('div');
            notification.className = 'notification-popup bg-white rounded-xl shadow-2xl p-4 border border-border max-w-xs';
            notification.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-primaryLight rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-primary">${name} dari ${city}</p>
                        <p class="text-xs text-muted">baru saja membeli Co-Parenting Planner</p>
                    </div>
                </div>
            `;
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'text-muted hover:text-primary mt-1 ml-2';
            closeBtn.innerHTML = `
                <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            `;
            closeBtn.onclick = () => {
                if (notification.parentElement) notification.parentElement.removeChild(notification);
                notificationCount--;
            };
            const flexDiv = notification.querySelector('.flex');
            if (flexDiv) flexDiv.appendChild(closeBtn);

            notificationContainer.appendChild(notification);
            notificationCount++;

            if (!prefersReducedMotion) {
                playNotificationSound();
            }

            setTimeout(() => {
                if (notification.parentElement) {
                    notification.classList.add('hide');
                    setTimeout(() => {
                        if (notification.parentElement) notification.parentElement.removeChild(notification);
                        notificationCount--;
                    }, 300);
                }
            }, 5000);
        }

        // Sticky CTA on scroll
        function handleStickyCTA() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (stickyCTA) {
                if (scrollY > windowHeight * 0.5) {
                    stickyCTA.classList.remove('translate-y-full');
                } else {
                    stickyCTA.classList.add('translate-y-full');
                }
            }
        }

        initScrollReveal();

        let notificationInterval: any;
        let initialNotificationTimeout: any;

        if (!prefersReducedMotion) {
            initialNotificationTimeout = setTimeout(() => {
                createNotification();
                notificationInterval = setInterval(() => {
                    const delay = Math.random() * 15000 + 15000;
                    setTimeout(createNotification, delay);
                }, 20000);
            }, 3000);
        }

        window.addEventListener('scroll', handleStickyCTA, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleStickyCTA);
            clearInterval(notificationInterval);
            clearTimeout(initialNotificationTimeout);
        };
    }, []);


    const toggleFAQ = (button: EventTarget & HTMLButtonElement) => {
        const answer = button.nextElementSibling as HTMLElement;
        const icon = button.querySelector('.faq-icon') as HTMLElement;
        const isOpen = answer.classList.contains('open');

        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate'));

        if (!isOpen) {
            answer.classList.add('open');
            icon.classList.add('rotate');
            button.setAttribute('aria-expanded', 'true');
        } else {
            button.setAttribute('aria-expanded', 'false');
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Toaster />
            {showPaymentInstructions && paymentData ? (
                <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A1A' }}>
                    <style>{`.pay-btn-confirm { background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'Plus Jakarta Sans'; margin-top: 15px; }`}</style>
                    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '30px 20px' }}>
                        <button onClick={() => setShowPaymentInstructions(false)} style={{ background: 'none', border: 'none', color: '#1A1A1A', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Plus Jakarta Sans' }}>
                            <ArrowLeft size={20} /> Kembali
                        </button>
                        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', color: '#1A1A1A', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>Instruksi Pembayaran</h2>

                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #E8E8E8', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                                <span style={{ color: '#6B6B6B', fontWeight: 600 }}>NOMOR REFERENSI</span>
                                <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{paymentData.tripay_reference}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                                <span style={{ color: '#6B6B6B', fontWeight: 600 }}>{addUpsell ? "Total: Template + App Sync" : "Total Pembayaran"}</span>
                                <span style={{ fontWeight: 700, fontSize: '19px', color: '#1A1A1A' }}>Rp {paymentData.amount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {paymentData.paymentMethod === 'BCA_MANUAL' && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #E8E8E8', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', marginBottom: '16px', fontWeight: 700 }}>Transfer Manual BCA</h3>
                                <div style={{ background: '#F5F5F5', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>7751146578</span>
                                    <button onClick={() => { navigator.clipboard.writeText('7751146578'); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#1A1A1A" /></button>
                                </div>
                                <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: 16 }}>A.n Delia Mutia</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={qrisBcaImage} alt="QRIS BCA" style={{ width: '220px', height: '220px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '24px' }} />
                                </div>
                                <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah bayar Co-Parenting Tracker. Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                    <button className="pay-btn-confirm">Konfirmasi via WhatsApp</button>
                                </a>
                            </div>
                        )}

                        {paymentData.payCode && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #E8E8E8', marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                                <div style={{ background: '#F5F5F5', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#1A1A1A' }}>{paymentData.payCode}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#1A1A1A" /></button>
                                </div>
                            </div>
                        )}

                        {paymentData.qrUrl && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #E8E8E8', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                                <p style={{ fontSize: '14.5px', color: '#6B6B6B', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }} />
                                </div>
                                <div style={{ background: '#e8f5e9', padding: '14px', borderRadius: '10px', color: '#1b5e20', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
                                    ✅ Screenshot / Simpan gambar QRIS ini lalu upload dari galeri pada aplikasi pembayaran Anda.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-light bg-pattern min-h-screen font-body text-primary pt-[1px]">
                    <style>{`
                :root {
                    --primary: #1A1A1A;
                    --primary-light: #F5F5F5;
                    --accent: #2D2D2D;
                    --muted: #6B6B6B;
                    --light: #FAFAFA;
                    --border: #E8E8E8;
                }
                
        :root {
            --primary: #1A1A1A;
            --primary-light: #F5F5F5;
            --accent: #2D2D2D;
            --muted: #6B6B6B;
            --light: #FAFAFA;
            --border: #E8E8E8;
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--light);
            color: var(--primary);
        }

        .font-display {
            font-family: 'Fraunces', serif;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-100%);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes pulse-subtle {

            0%,
            100% {
                box-shadow: 0 0 0 0 rgba(26, 26, 26, 0.15);
            }

            50% {
                box-shadow: 0 0 0 10px rgba(26, 26, 26, 0);
            }
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-10px);
            }
        }

        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }

            100% {
                background-position: 200% 0;
            }
        }

        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in {
            animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-pulse-subtle {
            animation: pulse-subtle 2.5s ease-in-out infinite;
        }

        .animate-float {
            animation: float 3s ease-in-out infinite;
        }

        .stagger-1 {
            animation-delay: 0.1s;
            opacity: 0;
        }

        .stagger-2 {
            animation-delay: 0.2s;
            opacity: 0;
        }

        .stagger-3 {
            animation-delay: 0.3s;
            opacity: 0;
        }

        .stagger-4 {
            animation-delay: 0.4s;
            opacity: 0;
        }

        .stagger-5 {
            animation-delay: 0.5s;
            opacity: 0;
        }

        /* Reveal on scroll */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        /* Button effects */
        .btn-primary {
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
            transition: left 0.6s ease;
        }

        .btn-primary:hover::before {
            left: 100%;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(26, 26, 26, 0.25);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        /* Card hover */
        .card-hover {
            transition: all 0.3s ease;
        }

        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }

        /* Notification popup */
        .notification-popup {
            animation: slideInLeft 0.5s ease-out forwards;
        }

        .notification-popup.hide {
            animation: slideOutLeft 0.3s ease-in forwards;
        }

        @keyframes slideOutLeft {
            to {
                opacity: 0;
                transform: translateX(-100%);
            }
        }

        /* Background pattern */
        .bg-pattern {
            background-image:
                radial-gradient(circle at 20% 80%, rgba(26, 26, 26, 0.02) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(26, 26, 26, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(26, 26, 26, 0.02) 0%, transparent 30%);
        }

        /* Elegant divider */
        .divider-elegant {
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border), transparent);
        }

        /* Comparison badge */
        .comparison-badge {
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
        }

        /* FAQ accordion */
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .faq-answer.open {
            max-height: 500px;
        }

        .faq-icon {
            transition: transform 0.3s ease;
        }

        .faq-icon.rotate {
            transform: rotate(180deg);
        }

        /* Mockup shadow */
        .mockup-shadow {
            box-shadow:
                0 30px 60px -15px rgba(0, 0, 0, 0.12),
                0 15px 30px -10px rgba(0, 0, 0, 0.08);
        }

        /* Image container */
        .hero-image-container {
            position: relative;
        }

        .hero-image-container::before {
            content: '';
            position: absolute;
            inset: -20px;
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.03) 0%, transparent 50%);
            border-radius: 24px;
            z-index: -1;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Focus states */
        button:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--primary);
            outline-offset: 3px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }

        /* Price highlight */
        .price-highlight {
            position: relative;
            display: inline-block;
        }

        .price-highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: rgba(46, 125, 50, 0.2);
            z-index: -1;
        }
    
                .font-display { font-family: 'Fraunces', serif; }
                .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
                .bg-light { background-color: var(--light); }
                .text-primary { color: var(--primary); }
            `}</style>

                    {/* Fonts */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;900&display=swap" rel="stylesheet" />



                    {/* Order Notification Popup */}
                    <div id="notification-container" className="fixed bottom-4 left-4 z-50 flex flex-col gap-3 max-w-xs" aria-live="polite"
                        aria-label="Notifikasi pesanan"></div>

                    {/* Hero Section */}
                    <section className="pt-6 pb-12 px-4 md:pt-12 md:pb-20">
                        <div className="max-w-3xl mx-auto">
                            {/* Trust Badge */}
                            <div className="flex justify-center mb-5 animate-fade-in-up">
                                <div
                                    className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 shadow-sm">
                                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                    <span className="text-sm font-medium text-primary">Template Terlaris untuk Co-Parenting</span>
                                </div>
                            </div>

                            {/* Headline */}
                            <h1
                                className="font-display text-3xl md:text-5xl font-bold text-primary text-center leading-tight mb-5 animate-fade-in-up stagger-1">
                                Co-Parenting Tanpa <span className="text-muted">Ribet</span> dan <span className="text-muted">Drama</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg md:text-xl text-muted text-center mb-8 max-w-2xl mx-auto animate-fade-in-up stagger-2">
                                Atur jadwal anak, pengeluaran, dan child support dalam satu template. <strong className="text-primary">Semua
                                    tercatat rapi.</strong> Tidak ada lagi debat panjang di chat.
                            </p>

                            {/* Hero Image */}
                            <div className="hero-image-container mb-10 animate-fade-in-up stagger-3">
                                <div className="bg-white rounded-2xl p-2 md:p-3 mockup-shadow border border-border">
                                    <img src="https://i.ibb.co.com/4R0LcwS5/ccaf2a4a-0825-4905-98da-ae676662a3d0.png"
                                        alt="Co-Parenting Digital Planner - Template Google Sheets & Excel"
                                        className="w-full h-auto rounded-xl" loading="eager" />
                                </div>

                                {/* Floating badges */}
                                <div
                                    className="absolute -right-2 top-1/4 bg-white rounded-xl shadow-lg p-3 hidden md:flex items-center gap-2 animate-float border border-border">
                                    <div className="w-10 h-10 bg-primaryLight rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd"
                                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-primary">21 Tabs</p>
                                        <p className="text-xs text-muted">Lengkap</p>
                                    </div>
                                </div>

                                <div className="absolute -left-2 bottom-1/4 bg-white rounded-xl shadow-lg p-3 hidden md:flex items-center gap-2 animate-float border border-border"
                                    style={{ animationDelay: '1s' }}>
                                    <div className="w-10 h-10 bg-primaryLight rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-3-1a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                                                clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-primary">Google Sheets</p>
                                        <p className="text-xs text-muted">& Excel</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="text-center animate-fade-in-up stagger-4">
                                <button onClick={scrollToForm}
                                    className="btn-primary text-white font-bold text-lg px-8 py-4 rounded-xl inline-flex items-center gap-3 animate-pulse-subtle">
                                    <span>Beli Sekarang - Rp 99.000</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                                <p className="text-sm text-muted mt-3">Akses langsung setelah pembayaran. Tidak perlu menunggu.</p>
                            </div>

                            {/* Social Proof */}
                            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in-up stagger-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div
                                            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                            A</div>
                                        <div
                                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                            B</div>
                                        <div
                                            className="w-8 h-8 rounded-full bg-primaryLight flex items-center justify-center text-primary text-xs font-bold border-2 border-white">
                                            C</div>
                                        <div
                                            className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-primary text-xs font-bold border-2 border-white">
                                            +</div>
                                    </div>
                                    <span className="text-sm text-muted"><strong className="text-primary">2,400+</strong> orang tua sudah
                                        pakai</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex">
                                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-muted"><strong className="text-primary">4.9/5</strong> rating</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="divider-elegant max-w-3xl mx-auto"></div>

                    {/* Problem Section */}
                    <section className="py-14 px-4 bg-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <span
                                    className="inline-block bg-primaryLight text-primary text-sm font-medium px-4 py-1 rounded-full mb-4">Situasi
                                    yang Mungkin Anda Rasakan</span>
                                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary mb-8">
                                    Co-Parenting Harusnya Dewasa... Tapi Kenyataannya?
                                </h2>
                            </div>

                            <div className="space-y-4 reveal">
                                <div className="flex gap-4 items-start p-4 bg-primaryLight rounded-xl border border-border card-hover">
                                    <div
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Jadwal sering berubah tapi tidak dicatat</h3>
                                        <p className="text-muted text-sm">Akhirnya saling salah paham soal siapa yang jaga anak kapan.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start p-4 bg-primaryLight rounded-xl border border-border card-hover">
                                    <div
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Pengeluaran anak tidak jelas siapa bayar apa</h3>
                                        <p className="text-muted text-sm">Uang SPP, les, dokter... siapa yang tanggung? Jadi debat tiap
                                            bulan.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start p-4 bg-primaryLight rounded-xl border border-border card-hover">
                                    <div
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Child support telat atau lupa</h3>
                                        <p className="text-muted text-sm">Harusnya rutin, tapi jadi pengingat terus-menerus. Capek.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start p-4 bg-primaryLight rounded-xl border border-border card-hover">
                                    <div
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Chat panjang cuma untuk bahas hal yang sama berulang
                                        </h3>
                                        <p className="text-muted text-sm">Setiap minggu bahasannya itu lagi. Setiap bulan ribut soal uang
                                            lagi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Agitate Section */}
                    <section className="py-14 px-4 bg-gradient-to-b from-white to-primaryLight">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                                    <div className="text-center mb-6">
                                        <div
                                            className="w-16 h-16 bg-primaryLight rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">
                                            Dan yang Paling Capek?
                                        </h2>
                                    </div>

                                    <p className="text-lg text-center text-muted mb-6">
                                        Bukan cuma Anda yang merasakan dampaknya.
                                    </p>

                                    <div className="bg-primaryLight rounded-xl p-6 text-center">
                                        <p className="text-xl md:text-2xl font-semibold text-primary leading-relaxed">
                                            "Anak juga ikut merasakan tegangnya."
                                        </p>
                                        <p className="text-muted mt-3">
                                            Mereka dengar nada bicara yang tidak sedap. Mereka lihat ekspresi wajah yang tidak
                                            nyaman.<br />
                                            <strong className="text-primary">Padahal semua ini bisa dihindari dengan sistem yang
                                                jelas.</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Solution Section */}
                    <section className="py-14 px-4 bg-primaryLight">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <span
                                    className="inline-block bg-primary text-white text-sm font-medium px-4 py-1 rounded-full mb-4">Solusinya</span>
                                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary mb-4">
                                    Bagaimana Kalau Semua Terorganisir dalam Satu Tempat?
                                </h2>
                                <p className="text-lg text-muted mb-10">
                                    Bukan cuma catatan biasa. Tapi sistem lengkap yang bisa diakses kapan saja, di mana saja.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-border reveal">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">Co-Parenting Digital Planner</h3>
                                        <p className="text-muted text-sm">Google Sheets & Excel Template</p>
                                    </div>
                                </div>

                                <p className="text-primary text-lg mb-6">
                                    <strong>21 Tabs lengkap</strong> — All in One. Semua sudah disiapkan. Tinggal pakai.
                                </p>

                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Setup</strong> — Atur nama orang tua, anak, dan preferensi
                                            dasar</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Dashboard</strong> — Ringkasan cepat: jadwal, pembayaran,
                                            pengeluaran</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Recurring Schedule</strong> — Jadwal rutin mingguan (tiap
                                            weekend dengan ayah/ibu)</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Punctual Custody</strong> — Untuk jadwal khusus atau
                                            perubahan dadakan</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Year at a Glance</strong> — Lihat 1 tahun penuh dalam satu
                                            tampilan</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>12x Monthly Calendar</strong> — Kalender bulanan detail &
                                            mudah dibaca</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Expense Tracker</strong> — Catat semua pengeluaran anak,
                                            otomatis terakumulasi</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Child Support</strong> — Pantau kewajiban dan histori
                                            pembayaran</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Task Tracker</strong> — Tugas sekolah, janji dokter,
                                            aktivitas anak</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primaryLight rounded-lg">
                                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-primary"><strong>Notes & Reflection</strong> — Catatan penting tanpa harus
                                            scroll chat panjang</span>
                                    </div>
                                </div>

                                <p className="text-center text-muted mt-6 text-sm">
                                    Dan masih banyak tab pendukung lainnya...
                                </p>

                                <div className="bg-primaryLight rounded-xl p-4 mt-6 text-center border border-border">
                                    <p className="text-primary font-medium">
                                        Semua sudah terstruktur.<br />
                                        <strong>Anda tinggal isi.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Comparison Section */}
                    <section className="py-14 px-4 bg-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary text-center mb-4">
                                    Perbandingan Sebelum dan Sesudah
                                </h2>
                                <p className="text-muted text-center mb-10">Lihat sendiri bedanya</p>
                            </div>

                            <div className="reveal">
                                <div className="grid gap-6">
                                    {/* Before */}
                                    <div className="bg-primaryLight rounded-2xl p-6 border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-muted">Sebelum Pakai Template</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Chat WA panjang untuk bahas jadwal yang sama</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Lupa siapa bayar apa bulan ini</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Debat soal uang tiap akhir bulan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Tidak ada catatan resmi yang bisa dibuktikan</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* After */}
                                    <div className="bg-white rounded-2xl p-6 border-2 border-primary relative overflow-hidden shadow-md">
                                        <div className="absolute top-4 right-4">
                                            <span
                                                className="comparison-badge text-white text-xs font-bold px-3 py-1 rounded-full">Rekomendasi</span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-primaryLight rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-primary">Sesudah Pakai Template</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Semua jadwal terlihat jelas dalam satu dashboard</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Pengeluaran tercatat otomatis dengan detail</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Child support terpantau tanpa harus mengingat</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-primary">Dokumentasi rapi yang bisa dibagikan ke mantan
                                                    pasangan</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="py-14 px-4 bg-light">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary text-center mb-4">
                                    Kata Mereka yang Sudah Pakai
                                </h2>
                                <p className="text-muted text-center mb-10">Pengalaman nyata dari orang tua yang sudah menggunakan template
                                    ini</p>
                            </div>

                            <div className="space-y-6 reveal">
                                {/* Testimonial 1 */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-border card-hover">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            S
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 mb-2">
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <p className="text-primary mb-3">
                                                "Dulu tiap bulan pasti debat soal uang. Sekarang tinggal buka sheet, semua jelas.
                                                <strong>Mantanku juga bisa akses</strong> jadi gak ada yang ngerasa dirugikan."
                                            </p>
                                            <p className="text-sm text-muted">— Sari, Jakarta Selatan</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-border card-hover">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            B
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 mb-2">
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <p className="text-primary mb-3">
                                                "Sebagai ayah yang jarang ketemu anak, <strong>template ini bikin aku tetap bisa pantau
                                                    kebutuhan anak</strong>. Expense trackernya sangat membantu."
                                            </p>
                                            <p className="text-sm text-muted">— Budi, Surabaya</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 3 */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-border card-hover">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            D
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1 mb-2">
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <p className="text-primary mb-3">
                                                "Gak nyangka bisa secepat ini setup. <strong>15 menit udah beres</strong>, semua tab
                                                udah siap. Anak-anak juga senang karena gak ada lagi debat di depan mereka."
                                            </p>
                                            <p className="text-sm text-muted">— Dewi, Bandung</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    {/* CHECKOUT FORM */}

                    {/* APP GALLERY */}
                    <section className="py-14 px-4 bg-primaryLight">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">Lihat Bagaimana App Bekerja</h2>
                                <p className="text-muted text-lg">Intip fitur-fitur sinkronisasi kalender dan budget yang sangat mudah digunakan.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[appImg1, appImg2, appImg3, appImg4, appImg5, appImg6, appImg7, appImg8].map((img, idx) => (
                                    <div key={idx} className="rounded-xl overflow-hidden shadow-md border border-border">
                                        <img src={img} alt={`App feature ${idx + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="checkout" className="py-14 px-4 bg-white border-t border-border">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider">LANGKAH TERAKHIR</span>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Isi Data & <span className="text-muted">Akses Sekarang</span></h2>
                            </div>

                            <div className="bg-primaryLight rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Nama Lengkap</label>
                                        <input type="text" className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: Sarah" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">No. WhatsApp</label>
                                        <div className="flex">
                                            <div className="bg-border border border-border border-r-0 rounded-l-xl p-3 font-semibold text-primary">🇮🇩 +62</div>
                                            <input type="tel" className="w-full p-3 bg-white border border-border rounded-r-xl focus:outline-none focus:border-primary transition-colors" placeholder="812345678" value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Email (untuk link download)</label>
                                        <input type="email" className="w-full p-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="contoh@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>


                                    <div className="pt-4 border-t border-border mt-4">
                                        <label className="block text-sm font-semibold text-primary mb-3">Pilih Paket Anda</label>

                                        {/* Base */}
                                        <div onClick={() => setAddUpsell(false)} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all mb-3 ${!addUpsell ? 'bg-primary/5 border border-primary/50 ring-1 ring-primary/20' : 'bg-white border border-border'}`}>
                                            <div className="mr-3 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!addUpsell ? 'border-primary' : 'border-gray-300'}`}>
                                                    {!addUpsell && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold text-sm ${!addUpsell ? 'text-primary' : 'text-gray-600'}`}>Template Co-Parenting Sheets</div>
                                            </div>
                                            <div className={`font-bold ${!addUpsell ? 'text-primary' : 'text-gray-600'}`}>Rp 99.000</div>
                                        </div>

                                        {/* Upsell */}
                                        <div onClick={() => setAddUpsell(true)} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${addUpsell ? 'bg-amber-50 border border-amber-400 ring-1 ring-amber-200' : 'bg-white border border-border'}`}>
                                            <div className="mr-3 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${addUpsell ? 'border-amber-500' : 'border-gray-300'}`}>
                                                    {addUpsell && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <div className={`font-bold text-sm ${addUpsell ? 'text-amber-700' : 'text-gray-600'}`}>Template + App Sync Add-on</div>
                                                    <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900 px-2 py-0.5 rounded font-bold tracking-wider">REKOMENDASI</span>
                                                </div>
                                                <div className="text-xs text-gray-500">Akses App Sinkronisasi Kalender & Budget. <span className="text-red-500 line-through">(Senilai Rp250.000)</span></div>
                                            </div>
                                            <div className={`font-bold ${addUpsell ? 'text-amber-700' : 'text-gray-600'}`}>Rp 149.000</div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <label className="block text-sm font-semibold text-primary mb-3">Metode Pembayaran</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                ["QRIS", "QRIS", "Shopee, OVO, GoPay, DANA"],
                                                ["BCAVA", "BCA VA", "Otomatis via BCA"],
                                                ["BNIVA", "BNI VA", "Otomatis via BNI"],
                                                ["BRIVA", "BRI VA", "Otomatis via BRI"],
                                                ["MANDIRIVA", "Mandiri VA", "Otomatis via Mandiri"],
                                                ["PERMATAVA", "Permata VA", "Otomatis via Permata"]
                                            ].map(([id, nm, sb]) => (
                                                <div key={id} onClick={() => setPayment(id)} className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${payment === id ? 'border-primary bg-white shadow-sm ring-1 ring-primary' : 'border-border bg-white/50 hover:bg-white'}`}>
                                                    <div className="font-semibold text-sm text-primary">{nm}</div>
                                                    <div className="text-xs text-muted mt-1">{sb}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold text-primary">{addUpsell ? "Total: Template + App Sync" : "Total Pembayaran"}</span>
                                            <span className="font-display text-2xl font-bold text-primary">Rp {addUpsell ? "149.000" : "99.000"}</span>
                                        </div>

                                        <button onClick={submitOrder} disabled={loading} className="w-full btn-primary text-white font-bold text-lg p-4 rounded-xl flex items-center justify-center gap-2">
                                            {loading ? "Memproses..." : `🛒 Pesan Sekarang — Rp ${addUpsell ? "149.000" : "99.000"}`}
                                        </button>
                                        <p className="text-xs text-center text-muted mt-4">🔒 Pembayaran aman & dienkripsi. Produk dikirim instan.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Guarantee Section */}
                    <section className="py-14 px-4 bg-primaryLight">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-border text-center">
                                    <div className="w-20 h-20 bg-primaryLight rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>

                                    <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">
                                        Jaminan 7 Hari Uang Kembali
                                    </h2>

                                    <p className="text-muted text-lg mb-6 max-w-xl mx-auto">
                                        Jika setelah menggunakan template ini Anda merasa tidak sesuai kebutuhan, cukup hubungi kami
                                        dalam 7 hari. Kami akan mengembalikan pembayaran Anda tanpa pertanyaan rumit.
                                    </p>

                                    <div
                                        className="inline-flex items-center gap-2 bg-primaryLight text-primary px-4 py-2 rounded-full border border-border">
                                        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">Tanpa ribet, tanpa syarat tersembunyi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-14 px-4 bg-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary text-center mb-4">
                                    Pertanyaan yang Sering Diajukan
                                </h2>
                                <p className="text-muted text-center mb-10">Jawaban untuk keraguan Anda</p>
                            </div>

                            <div className="space-y-4 reveal">
                                {/* FAQ Item 1 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Apakah saya perlu mahir Google Sheets atau
                                            Excel?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Tidak perlu. Template ini sudah siap pakai. Kami juga menyediakan video tutorial yang
                                            menjelaskan cara mengisi setiap bagian. Cukup ikuti langkah-langkahnya.
                                        </p>
                                    </div>
                                </div>

                                {/* FAQ Item 2 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Apakah mantan pasangan saya bisa akses
                                            juga?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Bisa. Untuk Google Sheets, Anda tinggal share link ke mantan pasangan. Keduanya bisa melihat
                                            dan mengedit sesuai kesepakatan. Transparansi terjaga.
                                        </p>
                                    </div>
                                </div>

                                {/* FAQ Item 3 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Bagaimana cara mendapatkan template setelah
                                            bayar?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Link download dan akses akan dikirim otomatis ke email Anda dalam beberapa menit setelah
                                            pembayaran berhasil. Cek folder inbox atau spam.
                                        </p>
                                    </div>
                                </div>

                                {/* FAQ Item 4 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Apakah ada biaya bulanan atau tahunan?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Tidak ada. Pembayaran hanya sekali seumur hidup. Anda juga mendapat update gratis jika ada
                                            penambahan fitur baru di kemudian hari.
                                        </p>
                                    </div>
                                </div>

                                {/* FAQ Item 5 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Apakah data saya aman?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Data Anda tersimpan di akun Google pribadi Anda. Kami tidak memiliki akses ke data apapun.
                                            Keamanan mengikuti standar Google.
                                        </p>
                                    </div>
                                </div>

                                {/* FAQ Item 6 */}
                                <div className="bg-white rounded-xl border border-border overflow-hidden mt-4">
                                    <button onClick={(e) => toggleFAQ(e.currentTarget)} className="w-full flex items-center justify-between p-5 text-left"
                                        aria-expanded="false">
                                        <span className="font-semibold text-primary pr-4">Berapa lama pengiriman produk setelah pembayaran?</span>
                                        <svg className="faq-icon w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">
                                        <p className="px-5 pb-5 text-muted">
                                            Setelah status pembayaran Anda dinyatakan berhasil (Paid), dalam hitungan detik file Sheets dan link tutorial penggunaan akan otomatis dikirimkan ke nomor WhatsApp dan alamat Email Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trust Badges */}
                    <section className="py-12 px-4 bg-light">
                        <div className="max-w-3xl mx-auto">
                            <div className="reveal">
                                <p className="text-center text-muted text-sm mb-6">Dipercaya oleh orang tua di seluruh Indonesia</p>
                                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium text-primary">Pembayaran Aman</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                        </svg>
                                        <span className="text-sm font-medium text-primary">Data Terlindungi</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium text-primary">Garansi 7 Hari</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-14 px-4 bg-white border-t border-border">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="reveal">
                                <h2 className="font-display text-2xl md:text-4xl text-black font-black mb-4">
                                    Saatnya Co-Parenting yang Lebih Tenang
                                </h2>
                                <p className="text-black font-black text-lg mb-8 max-w-xl mx-auto">
                                    Tidak perlu lagi debat panjang soal jadwal atau uang. Semua terorganisir rapi dalam satu tempat.
                                </p>

                                <button onClick={scrollToForm}
                                    className="bg-primary text-black font-black text-lg px-10 py-4 rounded-xl inline-flex items-center gap-3 transition-all duration-300 hover:bg-primaryLight hover:shadow-xl border-2 border-black">
                                    <span>Mulai Sekarang</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>

                                <p className="text-black font-black text-sm mt-4">
                                    Akses langsung setelah pembayaran
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-8 px-4 bg-primaryDark border-t border-gray-800">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-gray-400 text-sm mb-2">
                                Co-Parenting Digital Planner
                            </p>
                            <p className="text-gray-600 text-xs">
                                Dibuat dengan penuh perhatian untuk keluarga Indonesia
                            </p>
                        </div>
                    </footer>

                    {/* Sticky Mobile CTA */}
                    <div id="sticky-cta"
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 md:hidden z-40 transform translate-y-full transition-transform duration-300">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted line-through">Rp 199.000</p>
                                <p className="text-xl font-bold text-primary">Rp 99.000</p>
                            </div>
                            <button onClick={scrollToForm} className="btn-primary text-white font-bold px-6 py-3 rounded-xl">
                                Beli Sekarang
                            </button>
                        </div>
                        <p className="text-xs text-muted text-center mt-2">Pembayaran aman via Midtrans</p>
                    </div>



                </div>
            )}
        </div>
    );
};

export default ParentingLanding;
