import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from "./integrations/supabase/client";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp } from "./utils/fbpixel";
import qrisBcaImage from "./assets/qrisbca.jpeg";

// Asset Imports for ID
import df01Id from './assets/darkfem_id/df01_paradox.png';
import df02Id from './assets/darkfem_id/df02_2am_scroll.png';
import df03Id from './assets/darkfem_id/df03_nice_girl_dies.png';
import df04Id from './assets/darkfem_id/df04_teman_curhat.png';
import df05Id from './assets/darkfem_id/df05_comparison.png';
import df06Id from './assets/darkfem_id/df06_fuckboy_cycle.png';
import df07Id from './assets/darkfem_id/df07_drakor_fantasy.png';
import df08Id from './assets/darkfem_id/df08_secret_she_knows.png';
import df09Id from './assets/darkfem_id/df09_wake_up_call.png';
import df10Id from './assets/darkfem_id/df10_society_lie.png';
import video1Id from './assets/darkfem_id/video1.mp4';
import video2Id from './assets/darkfem_id/video2.mp4';
import video3Id from './assets/darkfem_id/video3.mp4';

// For English, fallback to ID if we don't have separate assets yet.
const assetsMap: any = {
    id: {
        df01: df01Id, df02: df02Id, df03: df03Id, df04: df04Id, df05: df05Id,
        df06: df06Id, df07: df07Id, df08: df08Id, df09: df09Id, df10: df10Id,
        video1: video1Id, video2: video2Id, video3: video3Id
    },
    en: {
        df01: df01Id, df02: df02Id, df03: df03Id, df04: df04Id, df05: df05Id,
        df06: df06Id, df07: df07Id, df08: df08Id, df09: df09Id, df10: df10Id,
        video1: video1Id, video2: video2Id, video3: video3Id
    }
};

const contentData: any = {
    id: {
        agitText: <>Lo diajarin dari kecil: jadi anak baik, jangan menggoda, tunggu dijemput bola. <strong>DAN APA HASILNYA?</strong> Lo jadi teman curhat favorit sementara dia milih yang lain.<br /><br /><ul className="agitation-list"><li>Yang setia → ditinggalin.</li><li>Yang sabar → diinjak.</li><li>Yang pengertian → dianggap lemah.</li></ul><br />Tapi cewek yang "biasa aja"? Dapat <span className="highlight">SEGALANYA</span>.<br /><br />Bukan karena dia cantik. Bukan karena dia beruntung.<br />Tapi karena dia <span className="highlight">PAHAM sesuatu yang TIDAK PERNAH lo pelajari.</span></>,
        solText: <>Panduan lengkap daya tarik wanita yang ditulis berdasarkan psikologi modern. Dari seni misteri, push-pull dynamics, sampai cara membangun aura yang bikin pria <strong>TIDAK BISA berhenti memikirkan kamu</strong>.<br /><br />Bukan tips murahan. Bukan saran "jadilah diri sendiri".<br />Tapi <strong>ILMU</strong> yang benar-benar <strong>MENGUBAH frekuensi kamu.</strong></>,
        checks: [
            <>Seni <strong>MISTERI</strong> — bagaimana jadi wanita yang tidak bisa ditebak</>,
            <><strong>PUSH-PULL</strong> Dynamics — menarik dan mendorong bersamaan</>,
            <>Bahasa tubuh yang bikin pria <strong>TIDAK BISA berpaling</strong></>,
            <>Kontrol emosi — kamu yang memegang kendali</>,
            <><strong>Abundance Mindset</strong> — berhenti mengejar, mulai MENARIK</>,
            <><strong>Silent Power</strong> — kekuatan dari DIAM</>,
            <><strong>Sexual Market Value</strong> — cara meningkatkan nilaimu</>,
            <><strong>Text Game</strong> — membuat dia ketagihan dari chat</>,
        ],
        checksPlus: "+ 44 jurus lainnya...",
        testis: [
            { text: "Demi allah sis, baru 2 minggu praktekin jurus 7... cowok yang dulu ghosting gue TIBA-TIBA nge-DM lagi. Padahal gue ga ngapa-ngapain. Cuma DIEM. Ternyata itu ilmunya 😭🔥", name: "Anisa, 24 thn", time: "2 hari lalu" },
            { text: "Suami gue yang tadinya cuek, sekarang GELISAH kalau gue keluar rumah. Bukan karena posesif. Tapi karena dia mulai TAKUT KEHILANGAN. Jurus 1 doang udah sedahsyat ini.", name: "Sari, 31 thn", time: "5 hari lalu" },
            { text: "Ex gue nikah sama cewek lain. 6 bulan kemudian gue apply dark feminine, gue dapet cowok yang 10x lebih ganteng dan kaya. Dan tau ga? Ex gue NGESTALK ig gue sekarang setiap hari. Karma is real 💅", name: "Rina, 27 thn", time: "1 minggu lalu" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 hal)", desc: "Rahasia membuat dia terobsesi — dari inner confidence sampai seni manipulasi halus yang LEGAL", price: "Rp97.000" },
            { icon: "💜", title: "Kursus Femme Fatale (68 hal)", desc: "Program transformasi dari nice girl ke dark feminine — step by step", price: "Rp127.000" },
            { icon: "📅", title: "Workbook 30 Hari (73 hal)", desc: "Tantangan harian untuk membangun daya tarikmu dalam 30 hari", price: "Rp97.000" },
            { icon: "🗡️", title: "Seni Merayu — Robert Greene (31 hal)", desc: "Ringkasan strategi rayuan paling legendary sepanjang sejarah", price: "Rp77.000" },
            { icon: "👑", title: "High Value Woman (22 hal)", desc: "Panduan cepat menjadi wanita bernilai tinggi", price: "Rp57.000" },
            { icon: "✨", title: "Simply Irresistible (272 hal)", desc: "Unleash your inner siren — panduan lengkap dari studi kasus wanita paling memikat dalam sejarah", price: "Rp147.000" },
            { icon: "🔥", title: "How to Please Your Man (29 hal)", desc: "Rahasia ranjang yang bikin dia TUNDUK dan KETAGIHAN", price: "Rp97.000" },
            { icon: "💋", title: "Selimut Ungu (61 hal)", desc: "Panduan puncak kenikmatan — teknik yang tidak diajarkan siapapun", price: "Rp97.000" },
        ],
        valueRows: [
            { title: "Ebook Utama: 52 Jurus Dark Feminine (156 hal)", price: "Rp199.000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 hal)", price: "Rp97.000" },
            { title: "Bonus 2: Kursus Femme Fatale (68 hal)", price: "Rp127.000" },
            { title: "Bonus 3: Workbook 30 Hari (73 hal)", price: "Rp97.000" },
            { title: "Bonus 4: Seni Merayu (31 hal)", price: "Rp77.000" },
            { title: "Bonus 5: High Value Woman (22 hal)", price: "Rp57.000" },
            { title: "Bonus 6: Simply Irresistible (272 hal)", price: "Rp147.000" },
            { title: "Bonus 7: How to Please Your Man (29 hal)", price: "Rp97.000" },
            { title: "Bonus 8: Selimut Ungu (61 hal)", price: "Rp97.000" },
        ],
        exclItems: [
            "Wanita yang masih percaya 'menunggu jodoh' itu cukup",
            "Yang tidak mau berubah dan hanya mau mengeluh",
            "Yang mencari cara instan tanpa effort",
            "Yang tidak siap meninggalkan 'nice girl' lama",
        ],
        faqs: [
            { q: "Bagaimana cara aksesnya?", a: "Setelah pembayaran, ebook dikirim ke WhatsApp kamu dalam 5 menit. Format HTML bisa dibaca di HP, tablet, atau komputer." },
            { q: "Apakah ini aman dan privat?", a: "100% privat. Tidak ada nama produk di bukti transfer. Semua dikirim digital, rahasia." },
            { q: "Apakah ini mengajarkan jadi pelakor?", a: "TIDAK. Dark Feminine mengajarkan kamu jadi HIGH VALUE WOMAN yang paham psikologi daya tarik. Bukan jadi orang jahat, tapi jadi BERHARGA." },
            { q: "Berapa lama sampai terasa hasilnya?", a: "Kebanyakan pembaca merasakan perubahan dalam 2-4 minggu setelah konsisten praktekkan. Jurus 1-7 sudah cukup powerful." },
            { q: "Apakah berlaku untuk yang berjilbab / religius?", a: "Ya. Dark Feminine bukan soal pakaian atau penampilan fisik. Ini tentang AURA, MISTERI, dan CARA BERPIKIR. Banyak pembaca kami yang berjilbab." },
        ],
        pains: [
            { icon: "😔", text: <>Selalu jadi "teman curhat" tapi bukan <strong>PILIHAN</strong> siapapun</> },
            { icon: "💔", text: <>Ditinggal atau diselingkuhi padahal sudah baik dan setia</> },
            { icon: "😤", text: <>Iri sama cewek yang "biasa aja" tapi dapat cowok impian</> },
            { icon: "📱", text: <>Nonton drama pelakor jam 2 pagi dan diam-diam pengen jadi <strong>DIA</strong></> },
            { icon: "🔄", text: <>Selalu attract cowok toxic — di-ghosted setelah 3 bulan</> },
            { icon: "😶", text: <>Diberi label "terlalu baik" yang artinya "terlalu <strong>BORING</strong>"</> },
        ],
        urgency: (t: React.ReactNode) => <>⚡ HARGA SPESIAL — Berakhir dalam {t} ⚡</>,
        heroBadge: "🌙 PANDUAN RAHASIA WANITA",
        heroH1a: "Jadilah Wanita yang",
        heroH1b: "Tidak Bisa Dilupakan",
        heroSub: "52 jurus rahasia daya tarik yang tidak pernah diajarkan ibu, guru, atau siapapun.",
        heroCta: "DAPATKAN 52 JURUS SEKARANG →",
        socialProof: "sudah membuktikan",
        socialProofNum: "4.200+ wanita",
        painLabel: "JUJUR SAMA DIRI SENDIRI",
        painH2a: "Kamu Pernah Merasakan",
        painH2b: "Ini Semua?",
        agitH2a: 'Kenapa yang "Rendah"',
        agitH2b: "Malah Dapat CEO?",
        solLabel: "JAWABANNYA",
        solH2a: "Dark Feminine",
        solH2b: "52 Jurus Rahasia",
        contentsLabel: "YANG AKAN KAMU PELAJARI",
        contentsH2: "52 Jurus Daya Tarik",
        contentsH2Span: "Lengkap",
        testiLabel: "MEREKA SUDAH BUKTIKAN",
        testiH2: "Hasil Nyata dari",
        testiH2Span: "4.200+ Wanita",
        bonusLabel: "BONUS EKSKLUSIF",
        bonusH2: "8 Bonus Senilai",
        bonusH2Span: "Rp795.000",
        priceLabel: "INVESTASI SEUMUR HIDUP",
        priceH2: "Dapatkan Semuanya",
        priceTodayLabel: "Harga Hari Ini",
        savingsBadge: "🎉 Hemat 80% — Penawaran Terbatas!",
        priceCta: "DAPATKAN SEKARANG — Rp199.000",
        priceSub: "📲 Dikirim INSTAN ke WhatsApp kamu",
        exclH2: "Dark Feminine BUKAN untuk:",
        exclCta: '"Ini HANYA untuk wanita yang SIAP mengambil kendali hidupnya."',
        faqLabel: "PERTANYAAN UMUM",
        faqH2: "Ada yang",
        faqH2Span: "Ditanyakan?",
        faqCta: "YA, SAYA SIAP BERUBAH →",
        faqSub: "�� Dikirim INSTAN ke WhatsApp kamu",
        stickyCta: "PESAN SEKARANG",
        stickyText: "🌙 52 Jurus —",
        stickyPrice: "Rp199.000",
        btnWa: "https://wa.me/6281234567890?text=Halo%20saya%20mau%20order%20Dark%20Feminine",
    },
    en: {
        agitText: <>You were taught from childhood: be nice, don't flirt, wait for Prince Charming. <strong>AND WHAT HAPPENED?</strong> You became everyone's favorite therapist while he chose someone else.<br /><br /><ul className="agitation-list"><li>The loyal one → left behind.</li><li>The patient one → walked over.</li><li>The understanding one → seen as weak.</li></ul><br />But the "average" girl? Gets <span className="highlight">EVERYTHING</span>.<br /><br />Not because she's pretty. Not because she's lucky.<br />Because she <span className="highlight">KNOWS something you were NEVER taught.</span></>,
        solText: <>A complete guide to feminine attraction based on modern psychology. From the art of mystery, push-pull dynamics, to building an aura that makes men <strong>UNABLE to stop thinking about you</strong>.<br /><br />Not cheap tips. Not "just be yourself" advice.<br />But <strong>KNOWLEDGE</strong> that truly <strong>CHANGES your frequency.</strong></>,
        checks: [
            <>The Art of <strong>MYSTERY</strong> — how to be unpredictable</>,
            <><strong>PUSH-PULL</strong> Dynamics — attract and repel simultaneously</>,
            <>Body language that makes him <strong>UNABLE to look away</strong></>,
            <>Emotional control — you hold the power</>,
            <><strong>Abundance Mindset</strong> — stop chasing, start ATTRACTING</>,
            <><strong>Silent Power</strong> — the strength of SILENCE</>,
            <><strong>Sexual Market Value</strong> — how to raise yours</>,
            <><strong>Text Game</strong> — make him addicted from texts</>,
        ],
        checksPlus: "+ 44 more moves...",
        testis: [
            { text: "I swear, just 2 weeks practicing move 7... the guy who ghosted me SUDDENLY DM'd again. I didn't do ANYTHING. Just stayed SILENT. Turns out that's the secret 😭🔥", name: "Anisa, 24", time: "2 days ago" },
            { text: "My husband who used to ignore me is now ANXIOUS when I leave the house. Not possessive. But because he's starting to FEAR LOSING ME. Just move 1 already this powerful.", name: "Sari, 31", time: "5 days ago" },
            { text: "My ex married someone else. 6 months later I applied dark feminine, I got a guy 10x more handsome and rich. And guess what? My ex now STALKS my IG every day. Karma is real 💅", name: "Rina, 27", time: "1 week ago" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 pages)", desc: "Secrets to making him obsessed — from inner confidence to the art of subtle (legal) influence", price: "Rp97,000" },
            { icon: "💜", title: "Femme Fatale Course (68 pages)", desc: "Transformation program from nice girl to dark feminine — step by step", price: "Rp127,000" },
            { icon: "📅", title: "30-Day Workbook (73 pages)", desc: "Daily challenges to build your attraction in 30 days", price: "Rp97,000" },
            { icon: "🗡️", title: "The Art of Seduction — Robert Greene (31 pages)", desc: "Summary of the most legendary seduction strategies in history", price: "Rp77,000" },
            { icon: "👑", title: "High Value Woman (22 pages)", desc: "Quick guide to becoming a high-value woman", price: "Rp57,000" },
            { icon: "✨", title: "Simply Irresistible (272 pages)", desc: "Unleash your inner siren — complete guide from case studies of history's most captivating women", price: "Rp147,000" },
            { icon: "🔥", title: "How to Please Your Man (29 pages)", desc: "Bedroom secrets that make him SUBMIT and ADDICTED", price: "Rp97,000" },
            { icon: "💋", title: "Purple Sheets (61 pages)", desc: "Guide to ultimate pleasure — techniques no one has taught you", price: "Rp97,000" },
        ],
        valueRows: [
            { title: "Main Ebook: 52 Dark Feminine Moves (156 pages)", price: "Rp199,000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 pages)", price: "Rp97,000" },
            { title: "Bonus 2: Femme Fatale Course (68 pages)", price: "Rp127,000" },
            { title: "Bonus 3: 30-Day Workbook (73 pages)", price: "Rp97,000" },
            { title: "Bonus 4: The Art of Seduction (31 pages)", price: "Rp77,000" },
            { title: "Bonus 5: High Value Woman (22 pages)", price: "Rp57,000" },
            { title: "Bonus 6: Simply Irresistible (272 pages)", price: "Rp147,000" },
            { title: "Bonus 7: How to Please Your Man (29 pages)", price: "Rp97,000" },
            { title: "Bonus 8: Purple Sheets (61 pages)", price: "Rp97,000" },
        ],
        exclItems: [
            "Women who still believe 'waiting for the right one' is enough",
            "Those who refuse to change and only complain",
            "Those looking for instant results with zero effort",
            "Those not ready to leave the old 'nice girl' behind",
        ],
        faqs: [
            { q: "How do I access it?", a: "After payment, the ebook is sent to your WhatsApp within 5 minutes. HTML format, readable on phone, tablet, or computer." },
            { q: "Is this safe and private?", a: "100% private. No product name on the payment receipt. Everything delivered digitally and discreetly." },
            { q: "Does this teach you to be a homewrecker?", a: "NO. Dark Feminine teaches you to be a HIGH VALUE WOMAN who understands the psychology of attraction. Not to be a bad person, but to be VALUABLE." },
            { q: "How long until I see results?", a: "Most readers feel a change within 2-4 weeks of consistent practice. Moves 1-7 are already powerful enough." },
            { q: "Does this apply for hijab-wearing / religious women?", a: "Yes. Dark Feminine is not about clothing or physical appearance. It's about AURA, MYSTERY, and MINDSET. Many of our readers wear hijab." },
        ],
        pains: [
            { icon: "😔", text: <>Always the 'best friend' but <strong>NEVER</strong> the first choice</> },
            { icon: "💔", text: <>Left or cheated on despite being loyal and good</> },
            { icon: "😤", text: <>Jealous of 'average' girls who get dream boyfriends</> },
            { icon: "📱", text: <>Watching drama at 2AM secretly wishing to <strong>BE her</strong></> },
            { icon: "🔄", text: <>Always attracting toxic guys — ghosted after 3 months</> },
            { icon: "😶", text: <>Labeled 'too nice' which really means 'too <strong>BORING</strong>'</> },
        ],
        urgency: (t: React.ReactNode) => <>⚡ SPECIAL PRICE — Ends in {t} ⚡</>,
        heroBadge: "🌙 SECRET WOMEN'S GUIDE",
        heroH1a: "Become the Woman",
        heroH1b: "He Can't Forget",
        heroSub: "52 secret attraction moves never taught by your mother, teachers, or anyone.",
        heroCta: "GET 52 SECRET MOVES NOW →",
        socialProof: "women have proven it",
        socialProofNum: "4,200+ women",
        painLabel: "BE HONEST WITH YOURSELF",
        painH2a: "Have You Ever",
        painH2b: "Felt All of This?",
        agitH2a: 'Why Does the "Average Girl"',
        agitH2b: "Get the CEO?",
        solLabel: "THE ANSWER",
        solH2a: "Dark Feminine",
        solH2b: "52 Secret Moves",
        contentsLabel: "WHAT YOU'LL LEARN",
        contentsH2: "52 Complete Attraction Moves",
        contentsH2Span: "Complete",
        testiLabel: "THEY'VE PROVEN IT",
        testiH2: "Real Results from",
        testiH2Span: "4,200+ Women",
        bonusLabel: "EXCLUSIVE BONUSES",
        bonusH2: "8 Bonuses Worth",
        bonusH2Span: "Rp795,000",
        priceLabel: "LIFETIME INVESTMENT",
        priceH2: "Get Everything",
        priceTodayLabel: "Today's Price",
        savingsBadge: "🎉 Save 80% — Limited Offer!",
        priceCta: "GET IT NOW — Rp199,000",
        priceSub: "📲 Delivered INSTANTLY to your WhatsApp",
        exclH2: "Dark Feminine is NOT for:",
        exclCta: '"This is ONLY for women READY to take control of their life."',
        faqLabel: "FAQ",
        faqH2: "Questions?",
        faqH2Span: "Anything?",
        faqCta: "YES, I'M READY TO CHANGE →",
        faqSub: "📲 Delivered INSTANTLY to your WhatsApp",
        stickyCta: "ORDER NOW",
        stickyText: "🌙 52 Moves —",
        stickyPrice: "Rp199,000",
        btnWa: "https://wa.me/6281234567890?text=Hello%20I%20want%20to%20order%20Dark%20Feminine",
    }
};

const DarkFeminineTSX = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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

    const priceID = addUpsell ? 249000 : 199000;
    const PIXEL_ID = '3319324491540889';

    const sendWAAlert = async (type: 'attempt' | 'success', details: any) => {
        try {
            const productDesc = `Dark Feminine Package`;
            const msg = type === 'attempt'
                ? `🔔 *Mencoba Checkout*\nProduk: ${productDesc}\nNama: ${details.name}\nWA: ${details.phone}\nMetode: ${details.method}`
                : `✅ *Checkout Sukses*\nRef: ${details.ref}\nProduk: ${productDesc}\nNama: ${details.name}\nWA: ${details.phone}\nTotal: Rp ${details.amount.toLocaleString('id-ID')}`;

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
        const productDesc = `Universal - Dark Feminine - ${name}`;

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
            amount: priceID, currency: 'IDR', quantity: 1, productName: addUpsell ? 'Universal - Dark Feminine + Love Magnet' : 'Universal - Dark Feminine',
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
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-df-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload) => {
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;
                        toast({ title: "🎉 Pembayaran Berhasil!", description: "Terima kasih! Pembayaran Anda telah kami terima. Link akses Ebook Dark Feminine akan dikirimkan ke Email dan WhatsApp.", duration: 0 });
                        // Note: Purchase tracking is handled by the backend tripay-callback, so we only track AddPaymentInfo and PageView/ViewContent on frontend.
                    }
                }
            ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData, PIXEL_ID, priceID, toast]);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
            const fbq = (window as any).fbq;
            fbq('init', PIXEL_ID); fbq('track', 'PageView'); fbq('track', 'ViewContent', { content_name: 'Universal - Dark Feminine', value: priceID, currency: 'IDR' });
        }
    }, [PIXEL_ID]);
    const hasEn = searchParams.has('en');
    const hasId = searchParams.has('id');
    const initLang = hasEn ? 'en' : (hasId ? 'id' : (searchParams.get('lang') === 'en' ? 'en' : 'id'));
    const [lang, setLang] = useState<'id' | 'en'>(initLang);

    const c = contentData[lang];
    const assets = assetsMap[lang];

    const [countdown, setCountdown] = useState("00:00:00");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showSticky, setShowSticky] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        document.title = "Dark Feminine — 52 Jurus Rahasia";
        const KEY = 'df_end_time';
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

            document.querySelectorAll('.df-fade-in:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLang = () => {
        const newLang = lang === 'id' ? 'en' : 'id';
        setLang(newLang);
        if (newLang === 'en') {
            setSearchParams({ en: '' });
        } else {
            setSearchParams({ id: '' });
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Toaster />
            {showPaymentInstructions && paymentData ? (
                <div style={{ minHeight: '100vh', background: '#EEE5C8', fontFamily: "'DM Sans', sans-serif", color: '#060A12' }}>
                    <style>{`.pay-btn-confirm { background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'DM Sans'; margin-top: 15px; }`}</style>
                    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '30px 20px' }}>
                        <button onClick={() => setShowPaymentInstructions(false)} style={{ background: 'none', border: 'none', color: '#060A12', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'DM Sans' }}>
                            <ArrowLeft size={20} /> Kembali
                        </button>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#060A12', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>Instruksi Pembayaran</h2>

                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
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
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '16px', fontWeight: 700 }}>Transfer Manual BCA</h3>
                                <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>7751146578</span>
                                    <button onClick={() => { navigator.clipboard.writeText('7751146578'); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                                </div>
                                <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: 16 }}>A.n Delia Mutia</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={qrisBcaImage} alt="QRIS BCA" style={{ width: '220px', height: '220px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '24px' }} />
                                </div>
                                <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah bayar Ebook Dark Feminine. Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                    <button className="pay-btn-confirm">Konfirmasi via WhatsApp</button>
                                </a>
                            </div>
                        )}

                        {paymentData.payCode && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                                <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#060A12' }}>{paymentData.payCode}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                                </div>
                            </div>
                        )}

                        {paymentData.qrUrl && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                                <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
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
                <div className="dark-feminine-container" style={{ background: '#0A0612', color: '#EEE5C8', fontFamily: "'DM Sans', sans-serif", fontSize: '17px', lineHeight: 1.75, position: 'relative', overflowX: 'hidden' }}>

                    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;700&display=swap');
        
        .dark-feminine-container {
          --bg-primary: #0A0612;
          --bg-card: #1A0A2E;
          --bg-section: #120820;
          --purple: #8B5CF6;
          --purple-light: #A78BFA;
          --gold: #C9991A;
          --gold-light: #F0C84A;
          --gold-dark: #9A7010;
          --cream: #EEE5C8;
          --muted: #7D6B9E;
          --white: #FFFFFF;
          --red: #EF4444;
          --green-wa: #25D366;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }
        
        .dark-feminine-container::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.4;
        }

        .df-wrap { max-width: 560px; margin: 0 auto; padding: 0 22px; }

        #df-progress-bar {
          position: fixed; top: 0; left: 0; height: 3px; width: 0%;
          background: linear-gradient(90deg, var(--purple), var(--gold-light));
          z-index: 10001; transition: width 0.1s;
        }

        #df-urgency-bar {
          position: sticky; top: 0; z-index: 10000;
          background: linear-gradient(90deg, #4C1D95, #7C3AED, #4C1D95);
          background-size: 200% 100%;
          animation: dfUrgencyMove 4s linear infinite;
          text-align: center; padding: 11px 22px;
          font-size: 14px; font-weight: 700; letter-spacing: 0.04em; color: #fff;
        }
        @keyframes dfUrgencyMove { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        
        #df-lang-btn {
          position: fixed; top: 52px; right: 16px; z-index: 9998;
          background: var(--bg-card); border: 1px solid var(--purple);
          color: var(--cream); font-size: 13px; font-weight: 700;
          padding: 6px 12px; border-radius: 20px; cursor: pointer;
          letter-spacing: 0.04em; transition: all 0.2s;
        }
        #df-lang-btn:hover { background: var(--purple); color: #fff; }

        #df-hero {
          min-height: 88vh; display: flex; align-items: center;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 70%), var(--bg-primary);
          position: relative; overflow: hidden; padding: 80px 0 60px;
        }
        #df-hero::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139,92,246,0.04) 40px, rgba(139,92,246,0.04) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139,92,246,0.04) 40px, rgba(139,92,246,0.04) 41px);
          pointer-events: none;
        }
        .df-hero-badge {
          display: inline-block; background: rgba(139,92,246,0.18);
          border: 1px solid rgba(139,92,246,0.4);
          color: var(--purple-light); font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; padding: 7px 16px; border-radius: 30px;
          margin-bottom: 22px; text-transform: uppercase;
        }
        .df-hero-h1 {
          font-family: var(--font-display); font-size: 44px; font-weight: 700;
          line-height: 1.1; color: var(--white); margin-bottom: 8px;
        }
        .df-hero-h1 .df-gold-italic { color: var(--gold-light); font-style: italic; display: block; }
        .df-hero-sub { font-size: 17px; color: var(--cream); opacity: 0.85; margin: 20px 0 32px; line-height: 1.75; }
        .df-img-box {
          width: 100%; border-radius: 18px; margin: 28px 0; overflow: hidden; border: 1px solid rgba(139,92,246,0.3);
        }
        .df-img-box img { width: 100%; aspect-ratio: 1 / 1; display: block; border-radius: 18px; object-fit: cover; }
        
        .df-video-player {
          width: 100%; border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(139,92,246,0.25); margin: 18px 0; background: #000;
          aspect-ratio: 1 / 1;
        }
        .df-video-player video { width: 100%; height: 100%; display: block; object-fit: contain; }
        .df-video-label { padding: 12px 16px; font-size: 15px; color: var(--muted); display: flex; align-items: center; justify-content: space-between; }
        .df-video-label strong { color: var(--cream); }
        
        .df-cta-btn {
          display: block; width: 100%;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold));
          background-size: 300% 100%; animation: dfShimmer 3s ease infinite;
          color: #000; font-size: 20px; font-weight: 700; text-align: center; text-decoration: none;
          padding: 17px 22px; border-radius: 13px; border: none; cursor: pointer; min-height: 52px;
          letter-spacing: 0.03em; position: relative; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s;
        }
        .df-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,153,26,0.4); }
        @keyframes dfShimmer { 0% { background-position: 100% 0%; } 100% { background-position: -100% 0%; } }
        
        .df-trust-badges {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 14px;
          font-size: 13px; color: var(--muted); font-weight: 700; letter-spacing: 0.04em;
        }

        .df-section-label {
          font-size: 13px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--purple-light); margin-bottom: 14px;
        }
        .df-section-h2 {
          font-family: var(--font-display); font-size: 34px; font-weight: 700; line-height: 1.15; color: var(--white); margin-bottom: 22px;
        }
        .df-section-h2 .df-gold { color: var(--gold-light); }
        .df-section-h2 .df-newline { display: block; }
        
        .df-pain-card {
          background: var(--bg-card); border-left: 3px solid #7C3AED; border-radius: 14px; padding: 18px 20px;
          margin-bottom: 14px; display: flex; gap: 14px; align-items: flex-start; font-size: 17px; line-height: 1.75;
        }
        .df-pain-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }

        .df-agitation-list li { list-style: none; padding: 6px 0 6px 16px; position: relative; }
        .df-agitation-list li::before { content: '→'; position: absolute; left: 0; color: var(--muted); }
        .highlight { color: var(--gold-light); font-weight: 700; }

        .df-check-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; font-size: 17px; line-height: 1.75; }
        .df-check-icon {
          width: 28px; height: 28px; flex-shrink: 0; margin-top: 3px; background: var(--purple); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700;
        }

        .df-testi-card {
           background: var(--bg-card); border-radius: 18px; padding: 22px 20px; margin-bottom: 20px;
           border: 1px solid rgba(139,92,246,0.2); position: relative;
        }
        .df-testi-card::before {
           content: '"'; position: absolute; top: -8px; left: 18px; font-family: var(--font-display); font-size: 60px; color: var(--purple); opacity: 0.4; line-height: 1;
        }
        .df-img-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; }
        .df-img-gallery img { width: 100%; aspect-ratio: 1 / 1; border-radius: 14px; border: 1px solid rgba(139,92,246,0.2); object-fit: cover; }

        .df-bonus-card {
          background: var(--bg-card); border-radius: 16px; padding: 20px; margin-bottom: 14px;
          border: 1px solid rgba(139,92,246,0.18); display: flex; gap: 16px; align-items: flex-start;
        }
        .df-value-card { background: var(--bg-card); border-radius: 18px; padding: 28px 22px; border: 1px solid rgba(201,153,26,0.3); }
        .df-value-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(139,92,246,0.12); }
        .df-value-row:last-of-type { border-bottom: none; }
        
        .df-final-row {
          margin-top: 16px; padding: 20px; background: linear-gradient(135deg, rgba(201,153,26,0.12), rgba(240,200,74,0.08));
          border-radius: 14px; border: 1px solid rgba(201,153,26,0.3); display: flex; justify-content: space-between; align-items: center;
        }
        .df-final-price {
          font-family: var(--font-display); font-size: 38px; font-weight: 700; color: var(--gold-light);
          animation: dfShimmer 3s ease infinite; background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold));
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .df-excl-item {
          display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; font-size: 17px; line-height: 1.6; border-bottom: 1px solid rgba(239,68,68,0.1);
        }

        .df-faq-item {
          background: var(--bg-card); border-radius: 14px; margin-bottom: 12px; overflow: hidden; border: 1px solid rgba(139,92,246,0.18);
        }
        .df-faq-q {
          padding: 18px 20px; font-size: 17px; font-weight: 700; color: var(--white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px;
        }
        .df-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 20px; font-size: 17px; color: var(--cream); line-height: 1.75; }
        .df-faq-item.open .df-faq-a { max-height: 300px; padding: 0 20px 18px; }
        
        #df-sticky-cta {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 9997;
          background: linear-gradient(0deg, #0A0612 70%, transparent); padding: 16px 22px 20px;
          transform: translateY(100%); transition: transform 0.4s ease; max-width: 560px; margin: 0 auto;
        }
        #df-sticky-cta.show { transform: translateY(0); }

        .df-pulse-ring { position: relative; display: inline-block; }
        .df-pulse-ring::before {
          content: ''; position: absolute; inset: -6px; border-radius: inherit; border: 2px solid var(--gold-light);
          animation: dfPulse 2s ease-out infinite; pointer-events: none;
        }
        @keyframes dfPulse { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(1.1); } }

        .df-fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .df-fade-in.visible { opacity: 1; transform: translateY(0); }

        @media(max-width:560px) { #df-sticky-cta { max-width: 100%; } .df-hero-h1 { font-size: 38px; } }

        .df-formsec { background: var(--bg-section); padding: 44px 0; }
        .df-privstrip { display: flex; justify-content: center; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
        .df-privbadge { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); }
        .df-flabel { font-size: 15px; font-weight: 600; color: var(--cream); margin-bottom: 5px; display: block; }
        .df-finput { width: 100%; padding: 13px 15px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); border-radius: 11px; color: var(--cream); font-size: 18px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
        .df-finput:focus { border-color: var(--purple-light); }
        .df-finput::placeholder { color: #5E7491; }
        .df-pwrap { display: flex; }
        .df-ppfx { background: rgba(139,92,246,.1); border: 1px solid rgba(255,255,255,.09); border-right: none; border-radius: 11px 0 0 11px; padding: 13px; font-size: 18px; font-weight: 600; color: var(--purple-light); white-space: nowrap; }
        .df-pwrap .df-finput { border-radius: 0 11px 11px 0; }
        .df-pmgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .df-pmopt { border: 1px solid rgba(255,255,255,.07); border-radius: 11px; padding: 11px; cursor: pointer; text-align: center; transition: all .2s; }
        .df-pmopt.sel { border-color: var(--purple-light); background: rgba(139,92,246,.07); }
        .df-pmname { font-size: 15px; font-weight: 600; color: var(--cream); }
        .df-pmsub { font-size: 12px; margin-top: 2px; }
        .df-sbtn { width: 100%; padding: 19px; background: linear-gradient(135deg, var(--gold-dark), var(--gold-light), var(--gold-dark)); background-size: 200%; border: none; border-radius: 14px; color: #000; font-size: 18px; font-weight: 700; cursor: pointer; font-family: var(--font-body); animation: dfShimmer 3s linear infinite; box-shadow: 0 10px 35px rgba(201,153,26,.4); transition: transform .2s; margin-top: 18px; }
        .df-sbtn:hover { transform: translateY(-2px); }
      `}</style>

                    <div id="df-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

                    <div id="df-urgency-bar">
                        <span>{c.urgency(<span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--gold-light)' }}>{countdown}</span>)}</span>
                    </div>

                    <button id="df-lang-btn" onClick={toggleLang}>
                        {lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                    </button>

                    {/* HERO */}
                    <section id="df-hero">
                        <div className="df-wrap">
                            <div className="df-hero-badge">{c.heroBadge}</div>
                            <h1 className="df-hero-h1">
                                <span>{c.heroH1a}</span>
                                <span className="df-gold-italic">{c.heroH1b}</span>
                            </h1>
                            <p className="df-hero-sub">{c.heroSub}</p>
                            <div className="df-img-box">
                                <img src={assets.df08} alt="Dark Feminine" />
                            </div>
                            <div className="df-pulse-ring">
                                <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{c.heroCta}</a>
                            </div>
                            <div className="df-trust-badges">
                                <span>🔒 100% Privasi</span><span>⚡ Instan</span><span>📱 Akses Seumur Hidup</span>
                            </div>
                            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--muted)' }}>
                                <span>🔥</span>
                                <span><strong>{c.socialProofNum}</strong> {c.socialProof}</span>
                            </div>
                        </div>
                    </section>

                    {/* PAIN SECTION */}
                    <section style={{ background: 'linear-gradient(180deg, var(--bg-section) 0%, var(--bg-primary) 100%)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.painLabel}</div>
                            <h2 className="df-section-h2">
                                <span>{c.painH2a}</span>
                                <span className="df-newline df-gold">{c.painH2b}</span>
                            </h2>
                            <div>
                                {c.pains.map((p: any, i: number) => (
                                    <div key={i} className="df-pain-card">
                                        <span className="df-pain-icon">{p.icon}</span>
                                        <span>{p.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '32px' }}>
                                <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{c.painLabel === 'JUJUR SAMA DIRI SENDIRI' ? 'UBAH SEGALANYA SEKARANG →' : 'CHANGE EVERYTHING NOW →'}</a>
                            </div>
                        </div>
                    </section>

                    {/* AGITATION */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <h2 className="df-section-h2">
                                <span>{c.agitH2a}</span>
                                <span className="df-newline df-gold">{c.agitH2b}</span>
                            </h2>
                            <div className="df-img-box" style={{ borderRadius: '16px' }}>
                                <img src={assets.df01} alt="Paradox" />
                            </div>
                            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>
                                <p>{c.agitText}</p>
                            </div>
                        </div>
                    </section>

                    {/* SOLUTION */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.solLabel}</div>
                            <h2 className="df-section-h2">
                                <span>{c.solH2a}</span>
                                <span className="df-newline df-gold">{c.solH2b}</span>
                            </h2>
                            <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>{c.solText}</p>
                            <div style={{ marginTop: '28px' }}>
                                <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{lang === 'id' ? 'PELAJARI ILMUNYA SEKARANG →' : 'LEARN THE SECRETS NOW →'}</a>
                            </div>
                            <div className="df-video-player">
                                <video controls playsInline preload="metadata" poster={assets.df03}>
                                    <source src={assets.video1} type="video/mp4" />
                                </video>
                                <div className="df-video-label"><strong>🎬 Video 1</strong><span>{lang === 'id' ? 'Kisah Transformasi' : 'Transformation Story'}</span></div>
                            </div>
                        </div>
                    </section>

                    {/* CONTENTS */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.contentsLabel}</div>
                            <h2 className="df-section-h2">{c.contentsH2} <span className="df-gold">{c.contentsH2Span}</span></h2>
                            <div>
                                {c.checks.map((t: any, i: number) => (
                                    <div key={i} className="df-check-item">
                                        <div className="df-check-icon">✦</div>
                                        <span>{t}</span>
                                    </div>
                                ))}
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', fontStyle: 'italic', marginTop: '4px' }}>{c.checksPlus}</p>
                            </div>
                        </div>
                    </section>

                    {/* TESTIMONIALS */}
                    <section style={{ background: 'linear-gradient(180deg, var(--bg-section) 0%, var(--bg-primary) 100%)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.testiLabel}</div>
                            <h2 className="df-section-h2">{c.testiH2} <span className="df-gold">{c.testiH2Span}</span></h2>
                            <div>
                                {c.testis.map((t: any, i: number) => (
                                    <div key={i} className="df-testi-card">
                                        <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)', marginBottom: '14px' }}>{t.text}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '15px' }}>
                                            <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>— {t.name}</span>
                                            <span style={{ color: 'var(--gold-light)', letterSpacing: '2px' }}>★★★★★</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'right', marginTop: '8px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--green-wa)', fontWeight: 700, background: 'rgba(37,211,102,0.1)', padding: '3px 8px', borderRadius: '10px' }}>✓ Verified</span> &nbsp; {t.time}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="df-video-player" style={{ marginTop: '28px' }}>
                                <video controls playsInline preload="metadata" poster={assets.df04}>
                                    <source src={assets.video2} type="video/mp4" />
                                </video>
                                <div className="df-video-label"><strong>🎬 Video 2</strong><span>{lang === 'id' ? 'Dari Diabaikan Jadi Dikagumi' : 'From Ignored to Admired'}</span></div>
                            </div>
                            <div className="df-video-player">
                                <video controls playsInline preload="metadata" poster={assets.df09}>
                                    <source src={assets.video3} type="video/mp4" />
                                </video>
                                <div className="df-video-label"><strong>🎬 Video 3</strong><span>{lang === 'id' ? 'Istri yang Dilupakan' : 'The Forgotten Wife'}</span></div>
                            </div>

                            <div style={{ marginTop: '32px' }}>
                                <div className="df-section-label">VISUAL STORIES</div>
                                <div className="df-img-gallery">
                                    <img src={assets.df02} alt="Visual" />
                                    <img src={assets.df05} alt="Visual" />
                                    <img src={assets.df06} alt="Visual" />
                                    <img src={assets.df07} alt="Visual" />
                                    <img src={assets.df10} alt="Visual" />
                                    <img src={assets.df03} alt="Visual" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BONUSES */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.bonusLabel}</div>
                            <h2 className="df-section-h2">{c.bonusH2} <span className="df-gold">{c.bonusH2Span}</span></h2>
                            <div>
                                {c.bonuses.map((b: any, i: number) => (
                                    <div key={i} className="df-bonus-card">
                                        <div style={{ fontSize: '28px', flexShrink: 0 }}>{b.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>{b.title}</div>
                                            <div style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</div>
                                            <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--green-wa)', fontWeight: 700 }}>
                                                <s style={{ color: 'var(--muted)', fontWeight: 400 }}>{b.price}</s> → GRATIS
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '28px' }}>
                                <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{lang === 'id' ? 'CLAIM SEMUA BONUS GRATIS →' : 'CLAIM ALL BONUSES FREE →'}</a>
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.priceLabel}</div>
                            <h2 className="df-section-h2">{c.priceH2} <span className="df-gold">{lang === 'id' ? 'Hari Ini' : 'Today'}</span></h2>
                            <div className="df-value-card">
                                <div>
                                    {c.valueRows.map((r: any, i: number) => (
                                        <div key={i} className="df-value-row">
                                            <span style={{ color: 'var(--cream)' }}>{r.title}</span>
                                            <span style={{ color: 'var(--muted)', fontWeight: 700 }}>{r.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '15px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'id' ? 'Total Nilai' : 'Total Value'}</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--red)', textDecoration: 'line-through' }}>Rp995.000</span>
                                </div>
                                <div className="df-final-row">
                                    <span style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.priceTodayLabel}</span>
                                    <span className="df-final-price">Rp199.000</span>
                                </div>
                                <div style={{ display: 'block', textAlign: 'center', marginTop: '14px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: 'var(--green-wa)', fontSize: '14px', fontWeight: 700, padding: '9px', borderRadius: '10px', letterSpacing: '0.06em' }}>
                                    {c.savingsBadge}
                                </div>
                            </div>
                            <div style={{ marginTop: '24px' }}>
                                <div className="df-pulse-ring">
                                    <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{c.priceCta}</a>
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', marginTop: '10px' }}>{c.priceSub}</p>
                                <div className="df-trust-badges">
                                    <span>🔒 100% Privasi</span><span>⚡ Instan</span><span>📱 Akses Seumur Hidup</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* EXCLUSIVITY */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'BUKAN UNTUK SEMUA ORANG' : 'NOT FOR EVERYONE'}</div>
                            <h2 className="df-section-h2">{c.exclH2}</h2>
                            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '26px 22px', border: '2px solid rgba(239,68,68,0.35)' }}>
                                <div>
                                    {c.exclItems.map((item: string, i: number) => (
                                        <div key={i} className="df-excl-item">
                                            <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✕</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ marginTop: '22px', textAlign: 'center', color: 'var(--gold-light)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: 1.4 }}>
                                    {c.exclCta}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CHECKOUT FORM */}
                    <section id="checkout" className="df-formsec">
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">LANGKAH TERAKHIR</div>
                            <h2 className="df-section-h2">Isi Data & <span className="df-gold">Dapatkan Akses</span></h2>
                            <div className="df-privstrip">
                                {[["🔒", "100% Privasi"], ["⚡", "Akses Instan"], ["��", "Bayar Aman"], ["📱", "Seumur Hidup"]].map(([ic, lb]) => (
                                    <div key={lb} className="df-privbadge"><span>{ic}</span><span>{lb}</span></div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label className="df-flabel">Nama Lengkap</label>
                                    <input className="df-finput" placeholder="Contoh: Sarah" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">No. WhatsApp</label>
                                    <div className="df-pwrap">
                                        <div className="df-ppfx">🇮🇩 +62</div>
                                        <input className="df-finput" placeholder="812345678" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="df-flabel">Email (untuk link download)</label>
                                    <input className="df-finput" type="email" placeholder="contoh@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">Metode Pembayaran</label>
                                    <div className="df-pmgrid">
                                        {[
                                            ["QRIS", "QRIS", "Shopee, OVO, GoPay, DANA"],
                                            ["BCAVA", "BCA Virtual Account", "Otomatis via BCA"],
                                            ["BNIVA", "BNI Virtual Account", "Otomatis via BNI"],
                                            ["BRIVA", "BRI Virtual Account", "Otomatis via BRI"],
                                            ["MANDIRIVA", "Mandiri Virtual Account", "Otomatis via Mandiri"],
                                            ["PERMATAVA", "Permata Virtual Account", "Otomatis via Permata"]
                                        ].map(([id, nm, sb]) => (
                                            <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => setPayment(id)}>
                                                <div className="df-pmname">{nm}</div>
                                                <div className="df-pmsub" style={{ color: (id === 'QRIS') ? 'var(--gold-light)' : 'var(--muted)' }}>{sb}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, marginBottom: 10 }}>
                                    <label className="df-flabel" style={{ marginBottom: 4 }}>Pilih Paket Anda</label>

                                    {/* Option 1: Base */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: !addUpsell ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', border: !addUpsell ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(false)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: !addUpsell ? '6px solid var(--purple-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: !addUpsell ? 'var(--cream)' : 'var(--muted)' }}>Paket Lengkap Dark Feminine + 8 Bonus</div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: !addUpsell ? 'var(--cream)' : 'var(--muted)' }}>
                                            Rp199.000
                                        </div>
                                    </div>

                                    {/* Option 2: Upsell */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: addUpsell ? 'rgba(240,200,74,0.1)' : 'rgba(255,255,255,0.03)', border: addUpsell ? '1px solid rgba(240,200,74,0.4)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(true)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell ? '6px solid var(--gold-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                                <div style={{ fontSize: '15px', fontWeight: 800, color: addUpsell ? 'var(--gold-light)' : 'var(--cream)' }}>Dark Feminine + 8 Bonus <br />+ Audio Love Magnet</div>
                                                <span style={{ fontSize: '10px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>PROMO KHUSUS</span>
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4 }}>Rahasia memikat pria idaman hanya lewat frekuensi suara. <span style={{ color: 'var(--red)', textDecoration: 'line-through' }}>(Senilai Rp250.000)</span></div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell ? 'var(--gold-light)' : 'var(--cream)' }}>
                                            Rp249.000
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: "rgba(139,92,246,.05)", border: "1px solid rgba(139,92,246,.13)", borderRadius: 11, padding: 14, marginTop: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13.5, color: addUpsell ? "var(--gold-light)" : "var(--muted)" }}>
                                        <span style={{ paddingRight: 10 }}>{addUpsell ? "Paket Lengkap + Audio Love Magnet" : "Paket Lengkap Dark Feminine + 8 Bonus"}</span>
                                        <span style={{ fontWeight: 600 }}>Rp{addUpsell ? "249.000" : "199.000"}</span>
                                    </div>
                                    <div style={{ height: 1, background: "rgba(139,92,246,.09)", marginBottom: 7 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 700 }}>
                                        <span style={{ color: "var(--cream)" }}>Total</span>
                                        <span style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)", fontSize: 24 }}>Rp{addUpsell ? "249.000" : "199.000"}</span>
                                    </div>
                                </div>
                                <button className="df-sbtn" onClick={submitOrder} disabled={loading}>
                                    {loading ? "Memproses..." : `🛒 Pesan Sekarang — Rp${addUpsell ? "249.000" : "199.000"}`}
                                </button>
                                <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.75 }}>🔒 Pembayaran aman & dienkripsi. Produk dikirim digital. Tidak ada tagihan mencurigakan.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.faqLabel}</div>
                            <h2 className="df-section-h2">{c.faqH2} <span className="df-gold">{c.faqH2Span}</span></h2>
                            <div>
                                {c.faqs.map((f: any, i: number) => (
                                    <div key={i} className={`df-faq-item ${openFaq === i ? 'open' : ''}`}>
                                        <div className="df-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                            <span>{f.q}</span>
                                            <span style={{ color: 'var(--purple-light)', fontSize: '20px', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                                        </div>
                                        <div className="df-faq-a">{f.a}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '32px' }}>
                                <a onClick={scrollToForm} className="df-cta-btn" style={{ cursor: "pointer", color: "#000" }}>{c.faqCta}</a>
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', marginTop: '10px' }}>{c.faqSub}</p>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer style={{ textAlign: 'center', padding: '32px 22px', fontSize: '13px', color: 'var(--muted)', borderTop: '1px solid rgba(139,92,246,0.12)' }}>
                        <strong style={{ color: 'var(--purple-light)' }}>Dark Feminine — eL Vision</strong><br />
                        <span style={{ display: 'block', marginTop: '6px' }}>© 2024 Semua Hak Dilindungi</span>
                        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <span>Privasi Terjamin</span><span>•</span>
                            <span>Digital Product</span><span>•</span>
                            <span>WhatsApp Support</span>
                        </div>
                    </footer>

                    {/* STICKY BOTTOM CTA */}
                    <div id="df-sticky-cta" className={showSticky ? 'show' : ''}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cream)', flex: 1 }}>
                                {c.stickyText} <span style={{ color: 'var(--gold-light)' }}>Rp{addUpsell ? '249.000' : '199.000'}</span>
                                {addUpsell && <span style={{ fontSize: '11px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>+ Love Magnet</span>}
                            </div>
                            <a onClick={scrollToForm} style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))', color: '#000', fontSize: '15px', fontWeight: 700, padding: '12px 18px', borderRadius: '11px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', minHeight: '44px', textDecoration: 'none', display: 'inline-block', textAlign: 'center', animation: 'dfShimmer 3s ease infinite', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold))' }}>{c.stickyCta}</a>
                        </div>
                    </div>

                    {/* FLOATING WHATSAPP BUTTON */}
                    <a
                        href={`https://wa.me/62895325633487?text=${encodeURIComponent("Halo Admin Dark Feminine, saya mau tanya...")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            position: 'fixed',
                            bottom: showSticky ? '90px' : '20px',
                            right: '20px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                            zIndex: 998,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
};

export default DarkFeminineTSX;
