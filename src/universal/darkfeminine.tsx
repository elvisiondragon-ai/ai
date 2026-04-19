import React, { useState, useEffect, useCallback, useRef } from 'react';

const DEBUG_IMAGES = false; // const DEBUG_IMAGES = true;
const DbgImg = ({ src, alt, className, style, label }: { src: string; alt?: string; className?: string; style?: React.CSSProperties; label: string }) => (
    <div style={{ position: 'relative', display: 'block', lineHeight: 0 }}>
        <img src={src} alt={alt} className={className} style={{ display: 'block', width: '100%', ...style }} />
        {DEBUG_IMAGES && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
                <span style={{ background: 'rgba(0,0,0,0.72)', color: '#FFD700', fontSize: '22px', fontWeight: 900, padding: '8px 18px', borderRadius: '10px', letterSpacing: '0.5px', textAlign: 'center', wordBreak: 'break-all', maxWidth: '90%' }}>{label}</span>
            </div>
        )}
    </div>
);
import { useSearchParams } from 'react-router-dom';
import { supabase } from "../integrations/supabase/client";
import {
    ArrowLeft,
    Copy,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Star,
    Download
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp, initFacebookPixelWithLogging, trackViewContentEvent, trackPageViewEvent, trackAddPaymentInfoEvent, sha256, handleFbcCookieManager } from "../utils/fbpixel";

// Asset Imports for ID
import df01Id from '../assets/darkfem/indo_image/df01_paradox.png';
import df04Id from '../assets/darkfem/indo_image/df04_teman_curhat.png';
import df08Id from '../assets/darkfem/indo_image/df08_secret_she_knows.png';
import df09Id from '../assets/darkfem/indo_image/df09_wake_up_call.png';

// Istri Carousel Assets (?istri parameter)
import istriC1S1 from '../assets/darkfem/istri/c1/df_0413_c1_s1_1776094006614.png';
import istriC1S2 from '../assets/darkfem/istri/c1/df_0413_c1_s2_1776094060387.png';
import istriC1S3 from '../assets/darkfem/istri/c1/df_0413_c1_s3_1776094080684.png';
import istriC1S4 from '../assets/darkfem/istri/c1/df_0413_c1_s4_1776094099286.png';
import istriC2S1 from '../assets/darkfem/istri/c2/df_0413_c2_s1_1776094189631.png';
import istriC2S2 from '../assets/darkfem/istri/c2/df_0413_c2_s2_1776094206120.png';
import istriC2S3 from '../assets/darkfem/istri/c2/df_0413_c2_s3_1776094223527.png';
import istriC2S4 from '../assets/darkfem/istri/c2/df_0413_c2_s4_1776094241692.png';
import istriC3S1 from '../assets/darkfem/istri/c3/df_0413_sp_s1_1776094310773.png';
import istriC3S2 from '../assets/darkfem/istri/c3/df_0413_sp_s2_1776094328010.png';
import istriC3S3 from '../assets/darkfem/istri/c3/df_0413_sp_s3_1776094342928.png';
import istriC3S4 from '../assets/darkfem/istri/c3/df_0413_sp_s4_1776094363097.png';
import istriC4S1 from '../assets/darkfem/istri/c4/df_0413_sl_s1_1776094453410.png';
import istriC4S2 from '../assets/darkfem/istri/c4/df_0413_sl_s2_1776094469075.png';
import istriC4S3 from '../assets/darkfem/istri/c4/df_0413_sl_s3_1776094484568.png';
import istriC4S4 from '../assets/darkfem/istri/c4/df_0413_sl_s4_1776094503539.png';
import istriC5S1 from '../assets/darkfem/istri/c5/df_0413_jmp_s1_v2_1776172859297.png';
import istriC5S2 from '../assets/darkfem/istri/c5/df_0413_jmp_s2_v2_1776172873565.png';
import istriC5S3 from '../assets/darkfem/istri/c5/df_0413_jmp_s3_v2_1776172894595.png';
import istriC5S4 from '../assets/darkfem/istri/c5/df_0413_jmp_s4_v2_1776172913410.png';

// Single Carousel Assets (general page wifeSection)
import singleC2First from '../assets/darkfem/single/c2single/first.png';
import singleC2S2 from '../assets/darkfem/single/c2single/df_0413_c2_s2_1776094206120.png';
import singleC2S3 from '../assets/darkfem/single/c2single/df_0413_c2_s3_1776094223527.png';
import singleC2S4 from '../assets/darkfem/single/c2single/df_0413_c2_s4_1776094241692.png';
import singleC3First from '../assets/darkfem/single/c3single/first.png';
import singleC3S2 from '../assets/darkfem/single/c3single/df_0413_sp_s2_1776094328010.png';
import singleC3S3 from '../assets/darkfem/single/c3single/df_0413_sp_s3_1776094342928.png';
import singleC3S4 from '../assets/darkfem/single/c3single/df_0413_sp_s4_1776094363097.png';
import singleC4First from '../assets/darkfem/single/c4single/first.png';
import singleC4S2 from '../assets/darkfem/single/c4single/df_0413_sl_s2_1776094469075.png';
import singleC4S3 from '../assets/darkfem/single/c4single/df_0413_sl_s3_1776094484568.png';
import singleC4S4 from '../assets/darkfem/single/c4single/df_0413_sl_s4_1776094503539.png';
import singleC5S1 from '../assets/darkfem/single/c5single/df_0413_jmp_s1_v2_1776172859297.png';
import singleC5S2 from '../assets/darkfem/single/c5single/df_0413_jmp_s2_v2_1776172873565.png';
import singleC5S3 from '../assets/darkfem/single/c5single/df_0413_jmp_s3_v2_1776172894595.png';
import singleC5S4 from '../assets/darkfem/single/c5single/df_0413_jmp_s4_v2_1776172913410.png';

// Before/After Single Assets
import baS1 from '../assets/darkfem/singlebefore/df_0413_ba_single_s1_v2_1776175357782.png';
import baS2 from '../assets/darkfem/singlebefore/df_0413_ba_single_s2_v2_1776175376164.png';
import baS3 from '../assets/darkfem/singlebefore/df_0413_ba_single_s3_v2_1776175390825.png';
import baS4 from '../assets/darkfem/singlebefore/df_0413_ba_single_s4_v2_1776175411659.png';

// Before/After Istri Assets
import baI1 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s1_v2_1776175429720.png';
import baI2 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s2_v2_1776175446156.png';
import baI3 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s3_v2_1776175462649.png';
import baI4 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s4_v2_1776175479780.png';

// Angle Section Assets
import angle7 from '../assets/darkfem/indo_image/angle7-Sebelum_vs_Sesudah.png';

// Winner Section Assets
import winnerSatuPerubahan from '../assets/darkfem/indo_image/winner-Satu_Perubahan-SENT.jpg';
import winnerCrAd from '../assets/darkfem/indo_image/Cr_Ad_DarkFem_A1_MALAM_INI,_CEWEK_"TE_1773316980_2026-03-12-ca3ded6f710055046854af8069d5876f-SENT.jpg';

// Asset Imports for EN
import df01En from '../assets/darkfem/english_image/df01_paradox_en.png';
import df04En from '../assets/darkfem/english_image/df04_secret_she_knows_en.png';
import df08En from '../assets/darkfem/english_image/df08_fantasy_screen_en.png';
import df09En from '../assets/darkfem/english_image/df09_wake_up_en.png';

// Asset Imports for PH
import df01Ph from '../assets/darkfem/philippines_image/df01_ph_paradox.png';
import df04Ph from '../assets/darkfem/philippines_image/df04_ph_friendzone.png';
import df08Ph from '../assets/darkfem/philippines_image/df08_ph_secret.png';
import df09Ph from '../assets/darkfem/philippines_image/df09_ph_wakeup.png';

const assetsMap: any = {
    id: {
        df01: df01Id, df04: df04Id,
        df08: df08Id, df09: df09Id,
        istriC1S1, istriC1S2, istriC1S3, istriC1S4,
        istriC2S1, istriC2S2, istriC2S3, istriC2S4,
        istriC3S1, istriC3S2, istriC3S3, istriC3S4,
        istriC4S1, istriC4S2, istriC4S3, istriC4S4,
        istriC5S1, istriC5S2, istriC5S3, istriC5S4,
        singleC2First, singleC2S2, singleC2S3, singleC2S4,
        singleC3First, singleC3S2, singleC3S3, singleC3S4,
        singleC4First, singleC4S2, singleC4S3, singleC4S4,
        singleC5S1, singleC5S2, singleC5S3, singleC5S4,
        baS1, baS2, baS3, baS4,
        baI1, baI2, baI3, baI4,
        angle7,
        winnerSatuPerubahan, winnerCrAd
    },
    en: {
        df01: df01En, df04: df04En,
        df08: df08En, df09: df09En,
    },
    ph: {
        df01: df01Ph, df04: df04Ph,
        df08: df08Ph, df09: df09Ph,
    }
};

const contentData: any = {
    id: {
        agitText: <>Lo diajarin dari kecil: jadi anak baik, jangan menggoda, tunggu dijemput bola. <strong>DAN APA HASILNYA?</strong> Lo jadi teman curhat favorit sementara dia milih yang lain.<br /><br /><ul className="agitation-list"><li>Yang setia → ditinggalin.</li><li>Yang sabar → diinjak.</li><li>Yang pengertian → dianggap lemah.</li></ul><br />Tapi cewek yang "biasa aja"? Dapat <span className="highlight">SEGALANYA</span>.<br /><br />Bukan karena dia cantik. Bukan karena dia beruntung.<br />Tapi karena dia <span className="highlight">PAHAM sesuatu yang TIDAK PERNAH lo pelajari.</span></>,
        solText: <>Panduan lengkap daya tarik wanita yang ditulis berdasarkan psikologi modern. Dari seni misteri, push-pull dynamics, sampai cara membangun aura yang bikin pria <strong>TIDAK BISA berhenti memikirkan kamu</strong>.<br /><br />Bukan tips murahan. Bukan saran "jadilah diri sendiri".<br />Tapi <strong>ILMU</strong> yang benar-benar <strong>MENGUBAH frekuensi kamu.</strong><br /><br /><div style={{background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.25)',borderRadius:'16px',padding:'20px 18px',marginTop:'8px'}}><div style={{fontSize:'13px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--purple-light)',marginBottom:'12px'}}>Rahasia yang Tidak Pernah Diajarkan</div><p style={{marginBottom:'12px'}}>Otak pria secara biologis <strong>diprogram untuk mengejar</strong> — bukan untuk menghargai yang terlalu mudah didapat. Bukan salahmu. Bukan salah dia. Ini <strong>cara kerja otaknya.</strong></p><p style={{marginBottom:'12px'}}>Ketika kamu terlalu available, terlalu baik, terlalu predictable — otaknya secara otomatis <strong>mengkategorikan kamu sebagai "aman"</strong>. Dan yang aman tidak membuat jantungnya berdegup.</p><p style={{marginBottom:'0'}}>Dark Feminine bukan tentang menjadi jahat. Ini tentang memahami <strong>frekuensi yang mengaktifkan bagian otaknya</strong> yang paling dalam — bagian yang membuatnya <em>tidak bisa berhenti memikirkanmu</em>. Inilah yang selama ini kamu cari. Dan inilah yang kami ajarkan.</p></div></>,
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
            { text: "Gue introvert parah, bahkan ngomong sama barista aja gugup. Tapi setelah baca jurus 12 soal 'aura diam', cowok-cowok di kantor mulai NOTICE gue. Bos gue sendiri bilang 'ada yang beda dari lo'. Padahal gue cuma UBAH CARA DIAM gue 😭✨", name: "Dinda, 25 thn", time: "3 hari lalu" },
            { text: "Gue career woman yang selalu dibilang 'terlalu kuat' sama cowok. Setelah apply jurus push-pull, sekarang CEO tempat gue kerja yang ngejar-ngejar gue. Bukan gue yang berubah jadi lemah, tapi gue jadi TAU KAPAN harus lembut 🔥👠", name: "Mega, 32 thn", time: "4 hari lalu" },
            { text: "Single mom 2 anak. Udah pasrah ga bakal ada yang mau. Baca ebook ini, praktekin jurus mystery... dalam 3 bulan ada 4 cowok mapan yang serius approach. Yang gue pilih? Dokter. Dan dia SAYANG banget sama anak-anak gue 🥹💜", name: "Wulan, 34 thn", time: "1 minggu lalu" },
            { text: "Anak kuliahan yang selalu jadi 'sahabat'. Cowok yang gue suka malah curhat soal cewek lain ke gue. Setelah apply jurus 3 dan 7, DIA YANG NEMBAK DULUAN. Temen-temen gue sampe bingung 'lo ngapain sih?' 😂💅", name: "Tasya, 21 thn", time: "6 hari lalu" },
            { text: "Nikah 8 tahun, suami udah kayak robot. Pulang kerja langsung HP. Gue praktekin jurus hot-cold selama 2 minggu... dia PANIK. Sekarang tiap weekend dia yang PLAN date night. Bahkan mulai kirim bunga lagi kayak waktu pacaran 🌹😍", name: "Fitri, 36 thn", time: "2 minggu lalu" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 hal)", desc: "Rahasia membuat dia terobsesi — dari inner confidence sampai seni manipulasi halus yang LEGAL", price: "Rp97.000" },
            { icon: "💜", title: "Kursus Femme Fatale (68 hal)", desc: "Program transformasi dari nice girl ke dark feminine — step by step", price: "Rp127.000" },
            { icon: "📅", title: "Workbook 30 Hari (73 hal)", desc: "Tantangan harian untuk membangun daya tarikmu dalam 30 hari", price: "Rp97.000" },
            { icon: "🗡️", title: "Seni Merayu — Robert Greene (31 hal)", desc: "Ringkasan strategi rayuan paling legendary sepanjang sejarah", price: "Rp77.000" },
            { icon: "👑", title: "High Value Woman (22 hal)", desc: "Panduan cepat menjadi wanita bernilai tinggi", price: "Rp57.000" },
            { icon: "✨", title: "Simply Irresistible (272 hal)", desc: "Unleash your inner siren — panduan lengkap dari studi kasus wanita paling memikat dalam sejarah", price: "Rp147.000" },
            { icon: "🔥", title: "How to Please Your Man (29 hal)", desc: "Rahasia ranjang yang bikin dia TUNDUK dan KETAGIHAN", price: "Rp97.000", isHighlight: true, highlightText: "Buku tabu yang sungguh-sungguh gila yang seringkali dijual terpisah ratusan ribu, memberi tahu rahasia bagaimana memuaskan pria... di sini menjadi GRATIS sebagai bonus." },
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
        winningGallery: {
            title: "Winning Techniques",
            sub: "Strategi Psikologi yang Telah Membantu Ribuan Wanita Mengubah Takdir Cintanya",
            images: [
                "winnerSatuPerubahan",
                "winnerCrAd"
            ]
        },
        faqs: [
            { q: "Bagaimana cara aksesnya?", a: "Setelah pembayaran, ebook dikirim ke WhatsApp kamu dalam 5 menit. Format HTML bisa dibaca di HP, tablet, atau komputer." },
            { q: "Apakah ini aman dan privat?", a: "100% privat. Tidak ada nama produk di bukti transfer. Semua dikirim digital, rahasia." },
            { q: "Apakah ini mengajarkan jadi pelakor?", a: "TIDAK. Dark Feminine mengajarkan kamu jadi HIGH VALUE WOMAN yang paham psikologi daya tarik. Bukan jadi orang jahat, tapi jadi BERHARGA." },
            { q: "Berapa lama sampai terasa hasilnya?", a: "Kebanyakan pembaca merasakan perubahan dalam 2-4 minggu setelah konsisten praktekkan. Jurus 1-7 sudah cukup powerful." },
            { q: "Apakah berlaku untuk yang berjilbab / religius?", a: "Ya. Dark Feminine bukan soal pakaian atau penampilan fisik. Ini tentang AURA, MISTERI, dan CARA BERPIKIR. Banyak pembaca kami yang berjilbab." },
        ],
        pains: [
            { icon: "😔", text: <>Selalu jadi "teman curhat" tapi bukan <strong>PILIHAN</strong> siapapun</> },
            { icon: "💔", text: <>Ditinggal atau diselingkuhi padahal sudah <strong>baik dan setia</strong></> },
            { icon: "😤", text: <>Iri sama wanita yang "biasa aja" tapi hidupnya lebih <strong>diperhatikan</strong></> },
            { icon: "📱", text: <>Nonton drama pelakor jam 2 pagi dan diam-diam <strong>pengen jadi DIA</strong></> },
            { icon: "🔄", text: <>Selalu attract yang salah — di-ghosted, diabaikan, atau tidak dihargai</> },
            { icon: "😶", text: <>Diberi label "terlalu baik" — yang artinya <strong>terlalu BORING</strong></> },
            { icon: "🛏️", text: <>Tidur di samping seseorang tapi merasa <strong>lebih sendirian</strong> dari sebelumnya</> },
            { icon: "📵", text: <>Sadar HP-nya lebih dapat <strong>perhatian</strong> daripada kamu</> },
            { icon: "😞", text: <>Sudah lakukan segalanya dengan benar — tapi tetap <strong>tidak dilihat</strong></> },
            { icon: "🪞", text: <>Lupa kapan terakhir kali merasa seperti <strong>WANITA</strong> — bukan hanya ibu, istri, atau karyawan</> },
        ],
        stories: [
            {
                img: 'df04',
                title: 'Selalu Jadi Pelabuhan. Tidak Pernah Jadi Tujuan.',
                body: `Dia cerita soal masalah hidupnya ke kamu sampai jam 1 pagi. Kamu dengarkan. Kamu support. Kamu kasih saran terbaik.\n\nDan keesokan harinya? Dia nembak cewek lain.\n\nKamu bingung. Marah. Tapi kamu tetap reply chat-nya. Karena kamu pikir — mungkin kalau kamu cukup sabar, cukup baik, cukup setia... akhirnya dia akan sadar.\n\nTapi itu tidak pernah terjadi. Karena kebaikan tanpa STRATEGI hanya akan membuat kamu jadi opsi, bukan prioritas.`
            },
        ],
        wifeSection: {
            label: "Dan Jikapun anda memiliki Pasangan",
            title: "Apakah Ini Kehidupan Pernikahan Yang Kamu Hadapi?",
            items: [
                { imgs: ['singleC2First','singleC2S2','singleC2S3','singleC2S4'], title: "Dulu vs Sekarang", desc: "Mengingat masa pacaran yang penuh bunga, sementara sekarang hanya ada rutinitas yang membosankan dan hambar." },
                { imgs: ['singleC3First','singleC3S2','singleC3S3','singleC3S4'], title: "Bersaing dengan Layar HP", desc: "Lelah mencoba menarik perhatiannya, tapi dia lebih memilih scroll sosmed daripada menatap matamu." },
                { imgs: ['singleC4First','singleC4S2','singleC4S3','singleC4S4'], title: "Ibu vs Wanita", desc: "Terlalu fokus menjadi ibu yang sempurna sampai kamu lupa bagaimana caranya menjadi wanita yang memikat suami sendiri." },
                { imgs: ['singleC5S1','singleC5S2','singleC5S3','singleC5S4'], title: "Dia Pilih Segalanya, Kecuali Kamu", desc: "Hobi, teman, hingga pekerjaan selalu jadi prioritas. Kamu hanya ada di daftar terakhir waktu luangnya." },
            ],
            beforeAfterSingle: { imgs: ['baS1','baS2','baS3','baS4'], title: "", body: "" },
            beforeAfterIstri: { imgs: ['baI1','baI2','baI3','baI4'], title: "", body: "" },
        },
        angleSection: {

            title: "Siap Untuk Transformasi?",
            items: [
                { img: 'angle7', title: "Sebelum vs Sesudah", desc: "Transformasi mindset yang akan mengubah cara dunia — and pria — memperlakukanmu." }
            ]
        },
        hesitationBox: {
            title: "Tunggu sebentar.",
            subtitle: "Kamu masih di sini — berarti ada sesuatu yang menahan.",
            body: [
                "Boleh jujur?",
                "Harga ini bukan yang kamu takutkan.",
                "Yang kamu takutkan adalah — bagaimana kalau ini benar-benar berhasil?",
                "Bagaimana kalau selama ini bukan nasibmu yang salah, tapi hanya satu hal kecil yang belum kamu tahu?",
                "Karena kalau itu benar — berarti semua rasa sakit itu... bisa dicegah.",
                "Berarti semua malam yang kamu habiskan menunggu, semua hubungan yang berakhir tanpa alasan jelas, semua kali kamu bertanya \"kenapa bukan aku?\" —",
                "Semua itu tidak harus terjadi.",
                "Dan sekarang kamu berdiri di depan pintunya. Harga secangkir kopi per minggu.",
                "Di satu sisi: jawaban yang sudah kamu cari bertahun-tahun.",
                "Di sisi lain: kembali ke loop yang sama — dengan orang yang berbeda.",
                "Pilihannya ada di tanganmu."
            ],
            objection: "Kami mengerti kalau kamu masih ragu. Keraguan itu wajar — bahkan itu tanda kamu serius.\n\nTapi ragu bukan alasan untuk tidak bergerak. Ragu adalah alasan untuk mencari tahu lebih dulu.",
            cta1: "Ya, saya siap berubah — Selesaikan Pembayaran",
            cta2: "Lihat dulu apa kata mereka yang sudah baca →",
            cta3: "Belum yakin? Baca dulu versi gratisnya — tanpa risiko",
            micro: "Ribuan wanita Indonesia sudah membaca ini malam ini. Besok pagi mereka bangun dengan cara pandang yang berbeda. Kamu bisa ikut — atau kamu bisa scroll kembali ke atas dan lanjutkan hari seperti biasa.\n\nKeduanya adalah pilihan yang valid. Tapi hanya satu yang mengubah sesuatu.",
            sting: "Harga ilmu ini tidak akan pernah lebih murah dari rasa sakit yang sudah kamu tanggung gratis selama ini."
        },
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
        priceSub: "🚀 Dikirim INSTAN ke WhatsApp kamu",
        exclH2: "Dark Feminine BUKAN untuk:",
        exclCta: '"Ini HANYA untuk wanita yang SIAP mengambil kendali hidupnya."',
        faqLabel: "PERTANYAAN UMUM",
        faqH2: "Ada yang",
        faqH2Span: "Ditanyakan?",
        faqCta: "YA, SAYA SIAP BERUBAH →",
        faqSub: "🚀 Dikirim INSTAN ke WhatsApp kamu",
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
            { icon: "🔥", title: "How to Please Your Man (29 pages)", desc: "Bedroom secrets that make him SUBMIT and ADDICTED", price: "Rp97,000", isHighlight: true, highlightText: "A taboo book often sold separately for hundreds of thousands, teaching you bedroom secrets to please a man... included here for FREE as a bonus." },
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
        winningGallery: {
            title: "",
            sub: "",
            images: []
        },
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
    },
    ph: {
        agitText: <>Tinuruan ka mula bata pa: maging mabait, huwag lumandi, maghintay kay Prince Charming. <strong>AT ANO ANG NANGYARI?</strong> Naging paboritong therapist ka habang siya ay pumili ng iba.<br /><br /><ul className="agitation-list"><li>Ang tapat → iniwan.</li><li>Ang pasensyosa → tinapakan.</li><li>Ang maunawain → tinuring na mahina.</li></ul><br />Pero ang "ordinaryong" babae? Nakukuha ang <span className="highlight">LAHAT</span>.<br /><br />Hindi dahil maganda siya. Hindi dahil swerte siya.<br />Kundi dahil may <span className="highlight">ALAM SIYANG HINDI MO NATUTUNAN kailanman.</span></>,
        solText: <>Isang kumpletong gabay sa pambabaeng pang-akit batay sa modernong sikolohiya. Mula sa sining ng misteryo, push-pull dynamics, hanggang sa pagbuo ng aura na gagawing <strong>HINDI kana niya mawalay sa kanyang isip</strong>.<br /><br />Hindi murang tips. Hindi payong "maging totoo sa sarili".<br />Kundi isang <strong>KAALAMAN</strong> na tunay na <strong>MAGBABAGO sa iyong dalas (frequency).</strong></>,
        checks: [
            <>Ang Sining ng <strong>MISTERYO</strong> — paano maging hindi mahuhulaan</>,
            <><strong>PUSH-PULL</strong> Dynamics — mang-akit at magtulak nang sabay</>,
            <>Body language na gagawing <strong>HINDI siya makatingin sa iba</strong></>,
            <>Pagkontrol ng emosyon — ikaw ang may hawak ng kapangyarihan</>,
            <><strong>Abundance Mindset</strong> — tumigil sa paghahabol, magsimulang MANG-AKIT</>,
            <><strong>Silent Power</strong> — ang lakas ng KATAHIMIKAN</>,
            <><strong>Sexual Market Value</strong> — paano pataasin ang halaga mo</>,
            <><strong>Text Game</strong> — gawin siyang adik sa mga text mo</>,
        ],
        checksPlus: "+ 44 pang mga hakbang...",
        testis: [
            { text: "Grabe, 2 linggo ko palang pina-practice ang move 7... yung lalaking nag-ghost sakin BIGLANG nag-DM ulit. Wala akong ginawa. NANAHIMIK lang ako. Yun pala ang sikreto 😭🔥", name: "Anisa, 24", time: "2 araw ang nakalipas" },
            { text: "Ang asawa kong laging walang paki, ngayon ALIGAGA kapag aalis ako ng bahay. Hindi pagiging possessive. Kundi dahil nagsisimula siyang MATAKOT NA MAWALA AKO. Move 1 pa lang sobrang lakas na.", name: "Sari, 31", time: "5 araw ang nakalipas" },
            { text: "Kinabukasan ng ex ko, ikinasal siya sa iba. Makalipas ang 6 na buwan, sinubukan ko ang dark feminine, at nakakuha ako ng lalaking 10x na mas gwapo at mayaman. At alam niyo ba? Ini-ISTALK ako ngayon ng ex ko araw-araw. Karma is real 💅", name: "Rina, 27", time: "1 linggo ang nakalipas" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 pahina)", desc: "Mga sikreto para gawin siyang baliw sa iyo — mula sa kumpiyansa sa sarili hanggang sa sining ng banayad (na legal) na impluwensya", price: "Rp97,000" },
            { icon: "💜", title: "Femme Fatale Course (68 pahina)", desc: "Programa ng transpormasyon mula sa mabait na babae hanggang sa dark feminine — hakbang-hakbang", price: "Rp127,000" },
            { icon: "📅", title: "30-Day Workbook (73 pahina)", desc: "Pang-araw-araw na hamon upang buuin ang iyong pang-akit sa loob ng 30 araw", price: "Rp97,000" },
            { icon: "🗡️", title: "The Art of Seduction — Robert Greene (31 pahina)", desc: "Buod ng mga pinakalegendaryong estratehiya sa pang-aakit sa kasaysayan", price: "Rp77,000" },
            { icon: "👑", title: "High Value Woman (22 pahina)", desc: "Mabilisang gabay upang maging babaeng may mataas na halaga", price: "Rp57,000" },
            { icon: "✨", title: "Simply Irresistible (272 pahina)", desc: "Palabasin ang iyong angking pang-akit — kumpletong gabay mula sa mga case study ng mga pinakanakakabighaning babae sa kasaysayan", price: "Rp147,000" },
            { icon: "🔥", title: "How to Please Your Man (29 pahina)", desc: "Mga sikreto sa kwarto na magpapabaliw at magpapasuko sa kanya", price: "Rp97,000", isHighlight: true, highlightText: "Isang taboo na aklat na madalas ibinebenta nang hiwalay sa libu-libong halaga, nagtuturo ng mga sikreto sa kwarto upang mapasaya ang lalaki... isinama rito nang LIBRE bilang bonus." },
            { icon: "💋", title: "Selimut Ungu (61 pahina)", desc: "Gabay sa sukdulang sarap — mga teknik na hindi itinuro ninuman", price: "Rp97,000" },
        ],
        valueRows: [
            { title: "Main Ebook: 52 Dark Feminine Moves (156 pahina)", price: "Rp199,000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 pahina)", price: "Rp97,000" },
            { title: "Bonus 2: Femme Fatale Course (68 pahina)", price: "Rp127,000" },
            { title: "Bonus 3: 30-Day Workbook (73 pahina)", price: "Rp97,000" },
            { title: "Bonus 4: The Art of Seduction (31 pahina)", price: "Rp77,000" },
            { title: "Bonus 5: High Value Woman (22 pahina)", price: "Rp57,000" },
            { title: "Bonus 6: Simply Irresistible (272 pahina)", price: "Rp147,000" },
            { title: "Bonus 7: How to Please Your Man (29 pahina)", price: "Rp97,000" },
            { title: "Bonus 8: Purple Sheets (61 pahina)", price: "Rp97,000" },
        ],
        exclItems: [
            "Mga babaeng naniniwala pa rin na sapat na ang 'maghintay sa tamang tao'",
            "Mga taong tumatangging magbago at puro reklamo lamang",
            "Mga naghahanap ng instant na resulta na walang kasamang pagsisikap",
            "Mga hindi pa handang talikuran ang lumang pagiging 'mabait' at 'boring'",
        ],
        winningGallery: {
            title: "",
            sub: "",
            images: []
        },
        faqs: [
            { q: "Paano ko ito maa-access?", a: "Pagkatapos ng pagbabayad, ipapadala ang ebook sa iyong WhatsApp sa loob ng 5 minuto. Sa format na HTML, na mababasa sa telepono, tablet, o computer." },
            { q: "Ito ba ay ligtas at pribado?", a: "100% pribado. Walang pangalan ng produkto sa resibo ng pagbabayad. Ang lahat ay ihinahatid sa digital at pribadong paraan." },
            { q: "Tinuturuan ba nito akong manira ng relasyon?", a: "HINDI. Itinuturo ng Dark Feminine na maging isang HIGH VALUE WOMAN na nakakaintindi ng sikolohiya ng pang-akit. Hindi upang maging masamang tao, kundi upang maging MAHALAGA." },
            { q: "Gaano katagal bago ko makita ang resulta?", a: "Pansin ng karamihan sa aming mambabasa ang pagbabago sa loob ng 2-4 linggo ng tuloy-tuloy na pagsasanay. Ang Move 1-7 ay sapat na para makita ang malaking pagbabago." },
            { q: "Maaari ba itong gamitin ng mga relihiyosong babae?", a: "Oo. Ang Dark Feminine ay hindi tungkol sa damit o panlabas na anyo. Ito ay tungkol sa AURA, MISTERYO, at PANANAW SA BUHAY. Marami sa aming mga mambabasa ay nakahi-jab." },
        ],
        pains: [
            { icon: "😔", text: <>Laging 'best friend' pero <strong>HINDI</strong> kailanman ang unang pili</> },
            { icon: "💔", text: <>Iniwan o niloko kahit tapat at mabuti ka</> },
            { icon: "😤", text: <>Naiinggit sa mga 'ordinaryong' babae na nakukuha ang mga pangarap mong lalaki</> },
            { icon: "📱", text: <>Nanunuod ng drama ng 2AM at palihim na hinahangad na <strong>MAGING katulad niya</strong></> },
            { icon: "🔄", text: <>Laging nakakaakit ng toxic na lalaki — ghinost pagkatapos ng 3 buwan</> },
            { icon: "😶", text: <>Binansagang 'sobrang bait' na ang tunay na ibig sabihin ay 'sobrang <strong>NAKAKAINIP</strong>'</> },
        ],
        urgency: (t: React.ReactNode) => <>⚡ SPECIAL PRICE — Matatapos sa {t} ⚡</>,
        heroBadge: "🌙 SIKRETONG GABAY NG MGA BABAE",
        heroH1a: "Maging Babaeng",
        heroH1b: "Hindi Niya Makakalimutan",
        heroSub: "52 sikretong hakbang sa pang-aakit na hindi itinuro kailanman ng iyong ina, guro, o sinuman.",
        heroCta: "KUNIN ANG 52 SIKRETONG HAKBANG NGAYON →",
        socialProof: "na babae ang nagpatunay",
        socialProofNum: "4,200+ babae",
        painLabel: "MAGING TAPAT SA IYONG SARILI",
        painH2a: "Naranasan Mo Na Ba",
        painH2b: "Ang Lahat Nang Ito?",
        agitH2a: 'Bakit Yung "Ordinaryong Babae"',
        agitH2b: "Ang Nakakuha Ng CEO?",
        solLabel: "ANG SAGOT",
        solH2a: "Dark Feminine",
        solH2b: "52 Sikretong Hakbang",
        contentsLabel: "ANG IYONG MATUTUTUNAN",
        contentsH2: "52 Kumpletong Hakbang",
        contentsH2Span: "Pang-akit",
        testiLabel: "NAPATUNAYAN NA NILA",
        testiH2: "Tunay na Resulta Mula",
        testiH2Span: "Sa 4,200+ Babae",
        bonusLabel: "EKSKLUSIBONG BONUSES",
        bonusH2: "8 Bonus na Nagkakahalaga ng",
        bonusH2Span: "Rp795,000",
        priceLabel: "PANGHABAMBUHAY NA INVESTMENT",
        priceH2: "Kunin Ang Lahat",
        priceTodayLabel: "Presyo Ngayon",
        savingsBadge: "🎉 Makatipid ng 80% — Limitadong Alok!",
        priceCta: "KUNIN NA NGAYON — Rp199,000",
        priceSub: "📲 Ipapasa IMMEDIATELY sa iyong WhatsApp",
        exclH2: "Ang Dark Feminine ay HINDI para sa:",
        exclCta: '"Ito ay PARA LAMANG sa mga babaeng HANDA ng hawakan ang kontrol sa kanilang buhay."',
        faqLabel: "Mga Madalas Itanong",
        faqH2: "Mayroon Pa Bang",
        faqH2Span: "Tanong?",
        faqCta: "OO, HANDA NA AKONG MAGBAGO →",
        faqSub: "📲 Ipapasa IMMEDIATELY sa iyong WhatsApp",
        stickyCta: "UMORDER NGAYON",
        stickyText: "🌙 52 Hakbang —",
        stickyPrice: "Rp199,000",
        btnWa: "https://wa.me/6281234567890?text=Hello%20Gusto%20kong%20umorder%20ng%20Dark%20Feminine",
    }
};


const MOCK_REVIEWS = [
    { name: "nisa.ayu***@gmail.com", rating: 5, text: "Demi allah sis, baru 2 minggu praktekin jurus 7... cowok yang dulu ghosting gue TIBA-TIBA nge-DM lagi. Padahal gue ga ngapa-ngapain. Cuma DIEM. Ternyata itu ilmunya 😭🔥", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-12 10:20:00" },
    { name: "sari_19***@yahoo.co.id", rating: 4, text: "Suami gue yang tadinya cuek, sekarang GELISAH kalau gue keluar rumah. Bukan karena posesif. Tapi karena dia mulai TAKUT KEHILANGAN. Bintang 4 karena butuh waktu buat biasa nahan emosi, tapi ilmunya daging banget.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-03-11 15:45:00" },
    { name: "r.agustin***@hotmail.com", rating: 5, text: "Ex gue nikah sama cewek lain. 6 bulan kemudian gue apply dark feminine, gue dapet cowok yang 10x lebih ganteng dan kaya. Dan tau ga? Ex gue NGESTALK ig gue sekarang setiap hari. Karma is real 💅", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-03-10 09:12:00" },
    { name: "dindakh***@gmail.com", rating: 4, text: "Gue introvert parah, bahkan ngomong sama barista aja gugup. Tapi setelah baca jurus 12 soal 'aura diam', cowok-cowok di kantor mulai NOTICE gue. Bos gue sendiri bilang 'ada yang beda dari lo'. Padahal gue cuma UBAH CARA DIAM gue 😭✨", lang: "id", country: "PH", flag: "🇵🇭", created_at: "2026-03-10 21:30:00" },
    { name: "mega.wat***@gmail.com", rating: 3, text: "Ilmunya bagus, tapi prakteknya butuh mental baja buat yang terbiasa jadi people pleaser. Masih pelan-pelan nyoba nerapin push-pull, belum berani maksimal.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-09 18:05:00" },
    { name: "wulansari.***@gmail.com", rating: 5, text: "Single mom 2 anak. Udah pasrah ga bakal ada yang mau. Baca ebook ini, praktekin jurus mystery... dalam 3 bulan ada 4 cowok mapan yang serius approach. Yang gue pilih? Dokter. Dan dia SAYANG banget sama anak-anak gue 🥹💜", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-03-08 14:10:00" },
    { name: "tasya.luth***@yahoo.com", rating: 4, text: "Anak kuliahan yang selalu jadi 'sahabat'. Cowok yang gue suka malah curhat soal cewek lain ke gue. Setelah apply jurus 3 dan 7, DIA YANG NEMBAK DULUAN. Kurang satu bintang karena materinya lumayan panjang buat dibaca wkwk.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-03-08 08:22:00" },
    { name: "fitri.hiday***@gmail.com", rating: 5, text: "Nikah 8 tahun, suami udah kayak robot. Pulang kerja langsung HP. Gue praktekin jurus hot-cold selama 2 minggu... dia PANIK. Sekarang tiap weekend dia yang PLAN date night. Bahkan mulai kirim bunga lagi kayak waktu pacaran 🌹😍", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-07 19:33:00" },
    { name: "jessica.m***@gmail.com", rating: 5, text: "The abundance mindset chapter changed my life! I stopped chasing and now he's the one double texting.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-07 11:11:00" },
    { name: "maria.vic***@yahoo.com", rating: 4, text: "Push-pull dynamics is literally magic. Used it on a guy who was pulling away, and he asked me out the next day.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-06 16:20:00" },
    { name: "lucy_h***@hotmail.com", rating: 5, text: "Never thought psychology could be applied to dating this effectively. Highly recommend!", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-06 10:05:00" },
    { name: "tara.wil***@gmail.com", rating: 5, text: "I tried the mystery techniques and it drove my husband crazy in a good way. We feel like newlyweds again.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-05 22:45:00" },
    { name: "chloe.m***@gmail.com", rating: 3, text: "Good book, but some techniques take a lot of confidence to pull off. Still practicing. Not a magical overnight fix.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-05 08:12:00" },
    { name: "kathy.smit***@yahoo.com", rating: 5, text: "Worth every penny. The bonuses alone are worth more than the price.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-04 14:55:00" },
    { name: "emily.r***@gmail.com", rating: 5, text: "This actually works. I was skeptical but the text game examples are spot on.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-04 09:30:00" },
    { name: "sarah.b***@hotmail.com", rating: 4, text: "The Femme Fatale Secrets bonus is my favorite. Unleashed a side of me I didn't know existed.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-03 20:18:00" },
    { name: "amelia.col***@gmail.com", rating: 5, text: "My SMV definitely went up after reading this. Men treat me with so much more respect now.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-03 12:40:00" },
    { name: "maya.l***@yahoo.com", rating: 5, text: "I love how practical the 30-day workbook is. Keeps you accountable.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-02 18:22:00" },
    { name: "rachel.d***@gmail.com", rating: 3, text: "Informative, but I wish there were more video examples of the body language.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-02 09:12:00" },
    { name: "natalie.j***@hotmail.com", rating: 5, text: "This is the holy grail for women who are tired of being the 'nice girl'.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-01 16:45:00" },
    { name: "olivia.k***@gmail.com", rating: 5, text: "Great insights on emotional control. Helps not just in dating but in career too.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-02-28 11:30:00" },
    { name: "helen.p***@yahoo.com", rating: 5, text: "I read Robert Greene's book before, but this summarizes it perfectly for modern dating.", lang: "en", country: "PH", flag: "🇵🇵", created_at: "2026-02-27 15:20:00" },
    { name: "cindy.99***@gmail.com", rating: 4, text: "Bahasanya gampang dimengerti. Bonusnya banyak banget dan sangat membantu.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-27 10:05:00" },
    { name: "nadila.sd***@gmail.com", rating: 5, text: "Dari sekedar 'teman curhat' sekarang aku jadi prioritas utama. Nangis banget akhirnya ngerti cara mainnya.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-26 21:18:00" },
    { name: "bella.put***@yahoo.com", rating: 5, text: "Aku nerapin ilmu ini ke gebetan yang toxic, akhirnya aku yang pegang kendali sekarang.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-02-25 14:40:00" },
    { name: "viona.ri***@gmail.com", rating: 4, text: "Nyesel baru tau ilmu ini sekarang. Kalau aja dari dulu tau, gak bakal diselingkuhin.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-24 12:22:00" },
    { name: "putri.sar***@hotmail.com", rating: 3, text: "Gila sih ini dark feminine beneran bikin aura kita beda. Cuma menurut aku butuh waktu buat bener-bener nerapin, agak susah buat aku yang introvert murni.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-23 18:30:00" },
    { name: "gisel.t***@gmail.com", rating: 5, text: "Jurus hot-cold nya ampuh banget buat cowok yang suka ghosting.", lang: "id", country: "PH", flag: "🇵🇭", created_at: "2026-02-22 09:12:00" },
    { name: "yuni.w***@yahoo.com", rating: 5, text: "Bonus How to Please Your Man nya... wow. Suami makin lengket hahaha.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-21 15:45:00" },
    { name: "zahra.yu***@gmail.com", rating: 4, text: "Baru baca setengah tapi udah berasa perubahannya. Mantap pokoknya.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-02-20 10:20:00" },
    { name: "ulfa.z***@hotmail.com", rating: 5, text: "Sekarang aku ngerti kenapa cewek biasa aja bisa dapet cowok tajir. Ternyata ini rahasianya.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-19 19:30:00" },
    { name: "qonita.x***@gmail.com", rating: 5, text: "Gak bohong, ilmu ini bener-bener bikin cowok takut kehilangan kita.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-18 11:11:00" }
];

const getFlagForCountry = (countryCode: string) => {
    switch (countryCode?.toUpperCase()) {
        case 'ID': return '🇮🇩';
        case 'SG': return '🇸🇬';
        case 'MY': return '🇲🇾';
        case 'DE': return '🇩🇪';
        case 'KR': return '🇰🇷';
        case 'CN': return '🇨🇳';
        case 'US': return '🇺🇸';
        case 'GB': return '🇬🇧';
        case 'CA': return '🇨🇦';
        case 'AU': return '🇦🇺';
        default: return '🇮🇩';
    }
};

const IstriCarousel = ({ story, assets }: { story: any; assets: any }) => {
    const imgs: string[] = story.imgs ?? (story.img ? [story.img] : []);
    const [active, setActive] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const prev = () => setActive(a => (a - 1 + imgs.length) % imgs.length);
    const next = () => setActive(a => (a + 1) % imgs.length);

    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        touchStartX.current = null;
    };

    if (imgs.length === 0) return null;

    return (
        <div className="df-fade-in" style={{ marginBottom: '48px' }}>
            <div className="df-wife-card">
                <div style={{ position: 'relative' }}
                    onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    <DbgImg
                        src={assets[imgs[active]]}
                        alt={story.title}
                        className="df-wife-img"
                        style={{ transition: 'opacity 0.25s ease', display: 'block', width: '100%' }}
                        label={imgs[active]}
                    />
                    {/* Dot indicators — only show if more than 1 image */}
                    {imgs.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 20 }}>
                            {imgs.map((_: any, i: number) => (
                                <button key={i} onClick={() => setActive(i)} style={{
                                    width: i === active ? '20px' : '8px', height: '8px',
                                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                                    background: i === active ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                                    transition: 'all 0.2s ease', padding: 0
                                }} />
                            ))}
                        </div>
                    )}
                    {/* Arrow buttons — only show if more than 1 image */}
                    {imgs.length > 1 && <>
                        <button onClick={prev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(135deg, #e91e8c, #c2185b)', border: 'none', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 2px 12px rgba(233,30,140,0.5)' }}>‹</button>
                        <button onClick={next} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(135deg, #e91e8c, #c2185b)', border: 'none', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 2px 12px rgba(233,30,140,0.5)' }}>›</button>
                    </>}
                </div>
                <div className="df-wife-content">
                    <h3 className="df-wife-title" style={{ fontSize: '22px', lineHeight: 1.3 }}>{story.title}</h3>
                    <div style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--cream)', opacity: 0.92, whiteSpace: 'pre-line' }}>
                        {story.body}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DarkFeminineTSX = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const hasEn = searchParams.has('en');
    const hasSg = searchParams.has('sg');
    const hasId = searchParams.has('id');
    const hasPh = searchParams.has('ph');
    const hasIstri = searchParams.has('istri');
    const hasDisc = searchParams.has('disc');
    const segment = hasIstri ? 'istri' : 'default';
    const initLang = hasEn ? 'en' : (hasSg ? 'sg' : (hasPh ? 'ph' : (hasId ? 'id' : (searchParams.get('lang') === 'en' ? 'en' : 'id'))));
    const [lang, setLang] = useState<'id' | 'en' | 'sg' | 'ph'>(initLang as 'id' | 'en' | 'sg' | 'ph');

    const handleLangChange = (newLang: 'id' | 'en' | 'sg' | 'ph') => {
        setLang(newLang);
        setSearchParams({ [newLang]: '' });

        // Auto-select PayPal if English is chosen
        if (newLang === 'en' || newLang === 'sg' || newLang === 'ph') {
            setPayment("PAYPAL");
        } else {
            setPayment("QRIS");
        }
    };

    // Calculate base product name based on language/country parameter
    const getBaseProductName = () => {
        if (lang === 'en') return "Dark Feminine EN";
        if (lang === 'sg') return "Universal Dark Feminine SG";
        if (lang === 'ph') return "Universal Dark Feminine PH";
        return "Universal Dark Feminine ID"; // Default ID
    };

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState(initLang === 'en' || initLang === 'sg' || initLang === 'ph' ? "PAYPAL" : "QRIS");
    const [retailOpen, setRetailOpen] = useState(false);
    const [addUpsell, setAddUpsell] = useState(0); // 0=base, 1=+LoveMagnet, 2=Ultimate
    const { toast } = useToast();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [anonymousReviewEmail, setAnonymousReviewEmail] = useState("");
    const [showReviewsCount, setShowReviewsCount] = useState(10);
    const [dbReviews, setDbReviews] = useState<any[]>([]);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [pendingReviewPayload, setPendingReviewPayload] = useState<any>(null);
    const freeEbookNameRef = useRef<HTMLInputElement>(null);

    const fetchDbReviews = async () => {
        const { data } = await (supabase as any).from('reviews_darkfeminine').select('*').order('created_at', { ascending: false });
        if (data) setDbReviews(data);
    };

    const downloadQRIS = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QRIS-DarkFeminine-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            // Fallback for CORS
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        // Preload all carousel images into browser cache so clicks are instant
        const carouselImages = [
            istriC1S1, istriC1S2, istriC1S3, istriC1S4,
            istriC2S1, istriC2S2, istriC2S3, istriC2S4,
            istriC3S1, istriC3S2, istriC3S3, istriC3S4,
            istriC4S1, istriC4S2, istriC4S3, istriC4S4,
            istriC5S1, istriC5S2, istriC5S3, istriC5S4,
            singleC2First, singleC2S2, singleC2S3, singleC2S4,
            singleC3First, singleC3S2, singleC3S3, singleC3S4,
            singleC4First, singleC4S2, singleC4S3, singleC4S4,
            singleC5S1, singleC5S2, singleC5S3, singleC5S4,
            baS1, baS2, baS3, baS4,
            baI1, baI2, baI3, baI4,
        ];
        carouselImages.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    useEffect(() => {
        fetchDbReviews();

        // Consolidated Auto-scroll logic for ?free-ebook, ?reviews, or ?pay
        const hasFreeEbook = searchParams.has('free-ebook') || window.location.hash === '#free-ebook';
        const hasReviews = searchParams.has('reviews') || window.location.hash === '#reviews-section';
        const hasPay = searchParams.has('pay') || window.location.hash === '#checkout-button';

        if (hasFreeEbook || hasReviews || hasPay) {
            const scrollTimer = setTimeout(() => {
                let targetId = 'free-ebook';
                if (hasReviews) targetId = 'reviews-section';
                if (hasPay) targetId = 'checkout';
                
                const element = document.getElementById(targetId);
                
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: (hasFreeEbook || hasPay) ? 'start' : 'start' 
                    });

                    // Auto-focus logic
                    setTimeout(() => {
                        if (hasFreeEbook && freeEbookNameRef.current) {
                            freeEbookNameRef.current.focus();
                        } else if (hasPay) {
                            // Focus name field in checkout since we are paying
                            const nameField = document.querySelector('input[placeholder="Nama Lengkap"]') as HTMLInputElement;
                            if (nameField) nameField.focus();
                        }
                    }, 600);
                }
            }, 1200); // Longer delay for mobile layout stability
            return () => clearTimeout(scrollTimer);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoginLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail.trim().toLowerCase(),
                password: loginPassword,
            });
            if (error) throw error;
            if (data.user) {
                toast({ title: "Login Berhasil" });
                setShowLoginModal(false);
            }
        } catch (error: any) {
            toast({ title: "Login Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!loginEmail) {
            toast({ title: "Masukkan Email", description: "Isi email terlebih dahulu untuk reset password.", variant: "destructive" });
            return;
        }
        setIsLoginLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                loginEmail.trim().toLowerCase(),
                { redirectTo: 'https://app.elvisiongroup.com/reset-password?darkfemininereviews=https://ai.elvisiongroup.com/darkfeminine?reviews' }
            );
            if (error) throw error;
            toast({ title: "Reset Email Terkirim", description: "Silahkan Cek Inbox / Important anda." });
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const submitReview = async (confirmedEmail?: string) => {
        const emailToUse = confirmedEmail || anonymousReviewEmail.trim().toLowerCase();

        if (!emailToUse || !emailToUse.includes('@')) {
            toast({ title: "Oops!", description: "Silahkan masukkan email yang valid.", variant: "destructive" });
            return;
        }
        if (!reviewRating) {
            toast({ title: "Oops!", description: "Silahkan beri rating bintang terlebih dahulu.", variant: "destructive" });
            return;
        }
        if (!reviewText || reviewText.trim() === '') {
            toast({ title: "Oops!", description: "Ulasan tidak boleh kosong.", variant: "destructive" });
            return;
        }

        setIsLoginLoading(true);
        try {
            // Check if review already exists for this email
            const { data: existingReview } = await (supabase as any).from('reviews_darkfeminine').select('*').eq('user_email', emailToUse).maybeSingle();

            if (existingReview && !confirmedEmail) {
                setPendingReviewPayload({ email: emailToUse, rating: reviewRating, comment: reviewText });
                setShowUpdateConfirm(true);
                setIsLoginLoading(false);
                return;
            }

            // Optional: check if they are already verified in another way or if this is a privileged email
            let isVerifiedFlag = false;
            if (existingReview?.is_verified) {
                isVerifiedFlag = true;
            } else {
                // Quick check to global_product for PAID status to set is_verified immediately
                const { data: paidEntry } = await (supabase as any).from('global_product').select('status').eq('email', emailToUse).eq('status', 'PAID').maybeSingle();
                if (paidEntry) isVerifiedFlag = true;
            }

            const payload = {
                user_email: emailToUse,
                name: emailToUse.split('@')[0],
                rating: reviewRating,
                comment: reviewText,
                country: lang.toUpperCase(),
                is_verified: isVerifiedFlag
            };

            if (existingReview) {
                await (supabase as any).from('reviews_darkfeminine').update(payload).eq('id', existingReview.id);
                toast({ title: "Review diupdate" });
            } else {
                await (supabase as any).from('reviews_darkfeminine').insert([payload]);
                toast({ title: "Review ditambahkan" });
            }
            
            setShowUpdateConfirm(false);
            setPendingReviewPayload(null);
            fetchDbReviews();
        } catch (error: any) {
            toast({ title: "Gagal submit review", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    // Payment States
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

    // Free Ebook States
    const [nameFree, setNameFree] = useState("");
    const [waFree, setWaFree] = useState("");
    const [emailFree, setEmailFree] = useState("");
    const [loadingFree, setLoadingFree] = useState(false);
    const [successFree, setSuccessFree] = useState(false);

    const priceID = addUpsell === 2 ? 399000 : addUpsell === 1 ? (hasDisc ? 200000 : 249000) : 199000;
    const priceUSD = addUpsell === 2 ? 30 : addUpsell === 1 ? 19 : 15;
    const isEnglish = lang === 'en' || lang === 'sg' || lang === 'ph';
    const finalAmount = isEnglish ? priceUSD : priceID;
    const finalCurrency = isEnglish ? 'USD' : 'IDR';


    const PIXEL_ID = '3319324491540889';



    const submitOrder = async () => {
        if (!name || !phone || !email) { alert('⚠️ Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!'); return; }
        if (!payment) { alert('⚠️ Silahkan pilih metode pembayaran!'); return; }

        setLoading(true);
        // Robust phone sanitization
        let cleanPhone = phone.trim().replace(/\D/g, '');
        if (lang === 'id') {
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '62' + cleanPhone.slice(1);
            } else if (!cleanPhone.startsWith('62')) {
                cleanPhone = '62' + cleanPhone;
            }
        } else if (lang === 'ph') {
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '63' + cleanPhone.slice(1);
            } else if (!cleanPhone.startsWith('63')) {
                cleanPhone = '63' + cleanPhone;
            }
        }
        
        

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();
        const productDesc = `${getBaseProductName()} - ${name}`;

        try {
            trackAddPaymentInfoEvent(
                { content_name: productDesc, value: finalAmount, currency: finalCurrency },
                undefined,
                PIXEL_ID,
                { em: email, ph: cleanPhone, fn: name, fbc: fbc || undefined, fbp: fbp || undefined }
            );
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID, eventName: 'AddPaymentInfo', eventSourceUrl: window.location.href,
                    customData: { content_name: productDesc, value: finalAmount, currency: finalCurrency },
                    userData: { 
                        fbc, fbp, 
                        client_ip_address: clientIp, 
                        fn: name, 
                        ph: cleanPhone, 
                        em: email,
                        external_id: await sha256(email) // Boost match quality
                    }
                }
            });
        } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

        let finalBCAAmount = finalAmount;
        if (payment === 'BCA_MANUAL') {
            const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999
            finalBCAAmount = finalAmount + uniqueCode;
            console.log(`BCA Manual Unique Code: ${uniqueCode}, Total: ${finalBCAAmount}`);
        }

        const payload = {
            subscriptionType: 'universal', paymentMethod: payment,
            userName: name, userEmail: email, phoneNumber: cleanPhone,
            address: 'Digital', province: 'Digital', kota: 'Digital', kecamatan: 'Digital', kodePos: '00000',
            amount: finalBCAAmount, currency: finalCurrency, quantity: 1, productName: addUpsell === 2 ? `${getBaseProductName()} Ultimate (Blueprint + Workbook + Q&A)` : addUpsell === 1 ? `${getBaseProductName()} + Love Magnet` : getBaseProductName(),
            fbc, fbp, clientIp,
            pageUrl: window.location.href
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });
            if (error) { throw error; }

            if (data?.success) {
                if (data.userAlreadyExists) {
                    toast({
                        title: lang === 'id' ? "Akun sudah terdaftar" : "Account already registered",
                        description: lang === 'id' ? "Lanjutkan pakai akun asli anda secara otomatis." : "Continuing automatically with your original account.",
                        duration: 5000,
                    });
                }
                setPaymentData(data);
                
                // If it's an e-wallet (DANA, OVO, SHOPEEPAY) and we have a checkout URL, redirect to Tripay "The App"
                const redirectMethods = ['DANA', 'OVO', 'SHOPEEPAY', 'LINKAJA', 'SAKUKU'];
                if (data.checkoutUrl && redirectMethods.includes(payment)) {
                    window.location.href = data.checkoutUrl;
                    return;
                }

                // If PayPal, redirect to checkoutUrl directly
                if (payment === 'PAYPAL' && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return;
                }

                setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(data?.error || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e: any) {
            console.error('Payment API Error:', e);
            const errorMessage = e?.message || e?.error?.message || e?.toString() || 'Unknown Error';
            alert(`Sistem mendeteksi error: ${errorMessage}\n\nMohon screenshot pesan ini dan hubungi admin via WhatsApp.`);
        } finally { setLoading(false); }
    };

    const submitFreeEbook = async () => {
        if (!nameFree || !waFree || !emailFree) {
            alert('Harap isi Nama, WhatsApp, dan Email.');
            return;
        }

        let formattedWa = waFree.trim().replace(/\D/g, '');
        if (lang === 'id') {
            if (formattedWa.startsWith('0')) {
                formattedWa = '62' + formattedWa.slice(1);
            } else if (!formattedWa.startsWith('62')) {
                formattedWa = '62' + formattedWa;
            }
        } else if (lang === 'ph') {
            if (formattedWa.startsWith('0')) {
                formattedWa = '63' + formattedWa.slice(1);
            } else if (!formattedWa.startsWith('63')) {
                formattedWa = '63' + formattedWa;
            }
        }

        setLoadingFree(true);
        try {
            // 📝 Record lead in darkfeminine_free
            try {
                await (supabase.from('darkfeminine_free' as any) as any).insert({
                    user_email: emailFree,
                    phone: formattedWa
                } as any);
            } catch (leadErr) {
                console.error('⚠️ Lead recording error (non-fatal):', leadErr);
            }

            const payload = {
                userEmail: emailFree,
                userName: nameFree,
                phone: formattedWa,
                id: lang // parameter indonesia, etc.
            };

            const { data, error } = await supabase.functions.invoke('send-ebooks-free', {
                body: payload
            });

            if (error) throw error;

            if (data?.success) {
                setSuccessFree(true);

                // 📊 CAPI: Fire custom "FreeEbook" event to Meta
                try {
                    const { fbc, fbp } = getFbcFbpCookies();
                    const clientIp = await getClientIp();
                    await supabase.functions.invoke('capi-universal', {
                        body: {
                            pixelId: PIXEL_ID,
                            eventName: 'FreeEbook',
                            eventSourceUrl: window.location.href,
                            customData: {
                                content_name: `Free Ebook Dark Feminine (${lang.toUpperCase()})`,
                                value: 0,
                                currency: lang === 'id' ? 'IDR' : 'USD'
                            },
                            userData: {
                                fbc, fbp,
                                client_ip_address: clientIp,
                                fn: nameFree,
                                ph: formattedWa,
                                em: emailFree,
                                external_id: await sha256(emailFree) // Boost match quality
                            }
                        }
                    });
                    // console.log('✅ CAPI FreeEbook event sent');
                } catch (capiErr) {
                    console.error('⚠️ CAPI FreeEbook error (non-fatal):', capiErr);
                }
            } else {
                alert(data?.error || 'Gagal mengirim WhatsApp. Silahkan coba lagi nanti.');
            }
        } catch (error: any) {
            console.error('Free Ebook API Error:', error);
            const errorMsg = error?.message || error?.error?.message || error?.toString() || 'Kesalahan jaringan';
            alert(`Terjadi kesalahan: ${errorMsg}`);
        } finally {
            setLoadingFree(false);
        }
    };

    const scrollToForm = useCallback(() => { document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }); }, []);
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-df-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload: any) => {
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

    // Eagerly capture fbclid from URL before pixel loads, so fbc is available at payment time
    useEffect(() => {
        handleFbcCookieManager();
    }, []);

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackPageViewEvent({}, undefined, PIXEL_ID);
        trackViewContentEvent(
            { content_name: 'Universal - Dark Feminine', value: priceID, currency: 'IDR' },
            undefined,
            PIXEL_ID
        );
    }, [PIXEL_ID]);

    const contentLang = lang; // Since all 3 (id, en, ph) exist now, map directly OR map sg back to en
    const c = contentData[contentLang === 'sg' ? 'en' : contentLang];
    const assets = assetsMap[contentLang === 'sg' ? 'en' : contentLang];

    // === SEGMENT OVERRIDES (?istri / ?single) ===
    const segmentContent = segment === 'istri' ? {
        heroBadge: "🔥 KHUSUS UNTUK PARA ISTRI",
        heroH1a: "Kamu Sudah Memberikan Segalanya...",
        heroH1b: "Tapi Kenapa Masih Merasa Tidak Dilihat?",
        heroSub: "Untuk istri yang lelah berjuang sendirian. Yang tidur di samping seseorang tapi merasa ribuan kilometer jaraknya. Yang bertanya dalam diam — 'Kenapa dia tidak lagi memilihku?'",
        painLabel: "KISAH YANG TIDAK PERNAH KAMU CERITAKAN",
        painH2a: "Apakah Ini",
        painH2b: "Hidupmu Sekarang?",
        stories: [
            {
                imgs: ['istriC1S1', 'istriC1S2', 'istriC1S3', 'istriC1S4'],
                title: 'Jam 11 Malam. Lampu Kamar Sudah Mati.',
                body: `Kamu berbaring di samping orang yang dulu berjanji akan menemanimu selamanya. Tapi malam ini — seperti ratusan malam sebelumnya — dia membelakangimu. Cahaya HP-nya memantul di langit-langit kamar.\n\nKamu ingin menyentuhnya. Ingin bilang "aku kangen kamu." Tapi kamu sudah terlalu sering ditolak dengan cara yang paling halus — diam, atau "udah ya, capek."\n\nJadi kamu pilih diam juga. Memeluk bantal. Dan bertanya dalam hati: "Kapan terakhir kali dia memelukku duluan?"`
            },
            {
                imgs: ['istriC2S1', 'istriC2S2', 'istriC2S3', 'istriC2S4'],
                title: 'Dulu Dia Berlari Untukmu. Sekarang Kamu Mengejar Bayangan.',
                body: `Ingat waktu pacaran dulu? Dia yang chat duluan. Dia yang cemas kalau kamu belum balas. Dia yang rela hujan-hujanan cuma buat ketemu kamu 30 menit.\n\nSekarang? Kamu yang minta perhatian. Kamu yang inisiatif. Kamu yang "ngerti" kalau dia sibuk, capek, atau butuh waktu sendiri. Selalu kamu yang mengalah.\n\nDan pertanyaan yang paling menyakitkan bukan "kenapa dia berubah?" — tapi "apa aku yang membuatnya berhenti berusaha?"`
            },
            {
                imgs: ['istriC3S1', 'istriC3S2', 'istriC3S3', 'istriC3S4'],
                title: 'Ibu Yang Sempurna. Istri Yang Hancur.',
                body: `Pagi-pagi kamu sudah bangun siapkan sarapan. Antarkan anak sekolah. Beres-beres rumah. Kerja. Jemput anak. Masak makan malam. Mandiin anak. Temani PR.\n\nDi mata dunia, kamu ibu yang luar biasa. Di mata anak-anak, kamu superhero.\n\nTapi di dalam kamar mandi — satu-satunya tempat privasi yang kamu punya — kamu menangis tanpa suara dengan air shower menyala. Karena tidak ada seorang pun yang bertanya: "Kamu baik-baik saja?"`
            },
            {
                imgs: ['istriC4S1', 'istriC4S2', 'istriC4S3', 'istriC4S4'],
                title: 'Dia Punya Waktu Untuk Segalanya. Kecuali Kamu.',
                body: `Dia bisa scroll sosmed 2 jam. Bisa nonton bola sampai larut. Bisa ngobrol panjang lebar sama teman-temannya.\n\nTapi giliran kamu ajak ngobrol? "Nanti ya." Kamu minta dinner berdua? "Males keluar." Kamu pakai baju baru? Dia bahkan tidak melirik.\n\nDan yang paling pedih — kamu lihat dia like foto wanita lain di IG-nya. Sementara chat dari istrinya sendiri cuma di-read.`
            },
            {
                imgs: ['istriC5S1', 'istriC5S2', 'istriC5S3', 'istriC5S4'],
                title: 'Bertahan Demi Anak. Tapi Sampai Kapan?',
                body: `Kamu pernah googling "tanda-tanda pernikahan tidak sehat" jam 2 pagi. Hasilnya cocok semua. Tapi kamu tutup browser-nya karena kamu takut dengan jawabannya.\n\nKamu bertahan. Bukan karena bahagia — tapi karena anak-anak. Karena status. Karena "nanti orang bilang apa."\n\nDan setiap hari, kamu bangun dengan wajah yang sama, senyuman yang sama, dan kekosongan yang sama di dalam dada.\n\nTapi di dalam hati kamu tahu — ini bukan hidup. Ini survival.`
            },
        ],
        pains: [
            { icon: "🪞", text: <>Kapan terakhir kali kamu merasa seperti <strong>WANITA</strong> — bukan hanya ibu, istri, atau pekerja?</> },
            { icon: "💔", text: <>Bukan dia yang jahat. Tapi dia sudah <strong>berhenti melihatmu</strong> sebagai wanita yang perlu diperjuangkan.</> },
            { icon: "🤐", text: <>Kamu memilih <strong>diam</strong> — bukan karena tidak peduli, tapi karena bicara pun sudah tidak didengar.</> },
            { icon: "🌫️", text: <><strong>Sampai kapan?</strong> Pertanyaan itu muncul setiap malam, dan kamu tidak punya jawabannya.</> },
        ],
    } : null;

    // Merge: segment overrides on top of base content
    const sc: any = segmentContent ? { ...c, ...segmentContent } : c;

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

    return (
        <div style={{ position: 'relative' }}>
            <Toaster />
            {/* LOGIN MODAL */}
            {showLoginModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div style={{ background: '#251446', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '32px 24px', border: '1px solid rgba(139,92,246,0.5)', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,1)' }}>
                        <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--white)', fontSize: '20px', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>×</button>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'white', fontWeight: 700, marginBottom: '8px' }}>Login Akun</h3>                            <p style={{ fontSize: '14px', color: 'white' }}>Masuk untuk memberikan ulasan. Jika belum punya akun, akan otomatis dibuat saat Anda membeli.</p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'white' }} size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="email@anda.com"
                                        style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '15px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'white' }} size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '15px' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoginLoading} style={{ width: '100%', background: 'var(--purple)', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'background 0.2s', opacity: isLoginLoading ? 0.7 : 1 }}>
                                {isLoginLoading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Login Sekarang' : 'Login Now')}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button onClick={handleForgotPassword} disabled={isLoginLoading} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
                                Lupa Password? (Isi email lalu klik ini)
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: 16 }}>A.n Delia Mutia</p>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.4 }}>
                                    *Robot kami selalu cek per interval 10 menit, jadi maximal 10 menit setelah kk transfer paling lambat
                                </p>
                                <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hai Kak renata saya sudah transfer ini Buktinya.. (upload bukti transfer anda) - Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                    <button className="pay-btn-confirm">Konfirmasi via WhatsApp</button>
                                </a>
                            </div>
                        )}

                        {paymentData.payCode && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                                <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) ? '12px' : '0' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#060A12' }}>{paymentData.payCode}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                                </div>
                                {['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) && (
                                    <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #C9991A', fontSize: '14px', color: '#333', lineHeight: 1.5 }}>
                                        <strong>Langkah Pembayaran:</strong><br />
                                        Pergi ke <strong>{paymentData.paymentMethod === 'INDOMARET' ? 'Indomaret' : (paymentData.paymentMethod === 'ALFAMART' ? 'Alfamart' : 'Alfamidi')}</strong> terdekat, ke kasir berikan kode virtual ini untuk dibayar. Dalam 1 menit setelah dibayar, transaksi akan otomatis selesai dan produk ebook dikirim ke WhatsApp dan email Anda.
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentData.qrUrl && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                                <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee' }} />
                                    <button 
                                        onClick={() => downloadQRIS(paymentData.qrUrl)}
                                        style={{ 
                                            background: '#EEE5C8', 
                                            color: '#060A12', 
                                            padding: '10px 20px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #C9991A', 
                                            fontWeight: 700, 
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        <Download size={18} /> Download Gambar QRIS
                                    </button>
                                </div>
                                <div style={{ background: '#e8f5e9', padding: '14px', borderRadius: '10px', color: '#1b5e20', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
                                    ✅ Silahkan download/simpan foto ini lalu upload di Shopeepay, Qris Bank, Atau Dana, ovo, Gopay anda untuk menyelesaikan pembayaran.
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
          color: var(--cream); font-size: 14px; font-weight: 700;
          padding: 8px 14px; border-radius: 20px; cursor: pointer;
          letter-spacing: 0.04em; transition: all 0.2s; outline: none;
          appearance: none;
        }
        #df-lang-btn:focus { border-color: var(--gold-light); }

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
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .df-bonus-highlight {
          border: 1px solid rgba(239, 68, 68, 0.5);
          background: linear-gradient(135deg, rgba(26, 10, 46, 1), rgba(40, 10, 20, 0.8));
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
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
        
        .df-free-form {
          margin-top: 24px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .df-free-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--cream);
          padding: 12px 14px;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 15px;
          margin-bottom: 12px;
          outline: none;
        }
        .df-free-input:focus { border-color: var(--purple-light); }
        .df-free-pwrap { display: flex; margin-bottom: 12px; }
        .df-free-pwrap .df-free-input { margin-bottom: 0; border-radius: 0 8px 8px 0; }
        .df-free-ppfx { background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.1); border-right: none; border-radius: 8px 0 0 8px; padding: 12px 14px; font-size: 15px; font-weight: 600; color: var(--cream); white-space: nowrap; display: flex; align-items: center; }
        .df-free-btn {
          width: 100%;
          background: var(--purple);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-family: var(--font-body);
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s;
        }
        .df-free-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .df-free-btn:hover:not(:disabled) { background: var(--purple-light); }

        .df-integrity-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .df-integrity-row:last-child { border-bottom: none; }
        .df-integrity-icon {
          width: 28px; height: 28px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
          flex-shrink: 0; font-size: 13px; color: #22c55e; font-weight: 700;
        }

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

        .df-wife-card {
          background: var(--bg-card);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.22);
          margin-bottom: 24px;
        }
        .df-wife-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .df-wife-content {
          padding: 20px;
        }
        .df-wife-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .df-wife-desc {
          font-size: 16px;
          line-height: 1.6;
          color: var(--cream);
          opacity: 0.9;
        }

        .df-wife-card {
          background: var(--bg-card);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.22);
          margin-bottom: 24px;
        }
        .df-wife-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .df-wife-content {
          padding: 20px;
        }
        .df-wife-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .df-wife-desc {
          font-size: 16px;
          line-height: 1.6;
          color: var(--cream);
          opacity: 0.9;
        }

        .df-formsec { background: var(--bg-section); padding: 44px 0; }
        .df-privstrip { display: flex; justify-content: center; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
        .df-privbadge { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); }

        /* Hesitation Box Styles */
        .df-hesitation-box {
          background: linear-gradient(180deg, rgba(10,5,20,0.95) 0%, rgba(25,10,50,0.98) 100%);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 24px;
          padding: 32px 24px;
          margin: 40px auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }
        .df-hesitation-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(139,92,246,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .df-hesitation-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 8px;
          text-align: center;
        }
        .df-hesitation-subtitle {
          font-size: 18px;
          color: var(--gold-light);
          font-weight: 600;
          text-align: center;
          margin-bottom: 28px;
          line-height: 1.4;
        }
        .df-hesitation-body {
          font-size: 16px;
          line-height: 1.65;
          color: var(--cream);
          margin-bottom: 28px;
        }
        .df-hesitation-body p {
          margin-bottom: 12px;
        }
        .df-hesitation-objection {
          background: rgba(0,0,0,0.2);
          border-left: 3px solid var(--purple-light);
          padding: 16px;
          border-radius: 4px 12px 12px 4px;
          font-size: 15px;
          color: var(--white);
          opacity: 0.9;
          margin-bottom: 32px;
          white-space: pre-line;
        }
        .df-hesitation-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          margin-bottom: 12px;
          border: none;
          font-family: var(--font-body);
        }
        .df-hesitation-btn:active { transform: scale(0.98); }
        .df-hesitation-btn-primary {
          background: var(--purple-gold);
          color: white;
          box-shadow: 0 4px 15px rgba(139,92,246,0.3);
        }
        .df-hesitation-btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(139,92,246,0.3);
          color: var(--white);
        }
        .df-hesitation-btn-tertiary {
          background: transparent;
          color: var(--muted);
          font-size: 14px;
          text-decoration: underline;
        }
        .df-hesitation-micro {
          font-size: 13px;
          line-height: 1.5;
          color: var(--muted);
          text-align: center;
          margin-top: 24px;
          white-space: pre-line;
        }
        .df-hesitation-sting {
          font-size: 11px;
          color: var(--muted);
          opacity: 0.6;
          text-align: center;
          margin-top: 24px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
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

        /* Guarantee Card */
        #df-guarantee-card {
          background: linear-gradient(135deg, #0f0520 0%, #1a0630 50%, #0f0520 100%);
          border-top: 3px solid var(--gold);
          border-bottom: 3px solid var(--gold);
          padding: 28px 22px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        #df-guarantee-card::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(201,153,26,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        #df-guarantee-card::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .df-guarantee-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold-light));
          font-size: 36px;
          margin: 0 auto 16px;
          box-shadow: 0 0 0 6px rgba(201,153,26,0.18), 0 0 0 12px rgba(201,153,26,0.07);
        }
        .df-guarantee-headline {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--gold-light);
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .df-guarantee-body {
          font-size: 16px;
          line-height: 1.7;
          color: var(--cream);
          max-width: 480px;
          margin: 0 auto 18px;
        }
        .df-guarantee-body strong { color: var(--white); }
        .df-guarantee-cta-hint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }
        .df-guarantee-cta-hint:hover { color: var(--gold-light); }
      `}</style>

                    <div id="df-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

                    <div id="df-urgency-bar">
                        <span>{c.urgency(<span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--gold-light)' }}>{countdown}</span>)}</span>
                    </div>

                    <select id="df-lang-btn" value={lang} onChange={(e) => handleLangChange(e.target.value as any)}>
                        <option value="id">🇮🇩 Indonesia</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="ph">🇵🇭 Philippines</option>
                    </select>

                    {/* HERO */}
                    <section id="df-hero">
                        <div className="df-wrap">
                            <div className="df-hero-badge">{sc.heroBadge}</div>
                            <h1 className="df-hero-h1">
                                <span>{sc.heroH1a}</span>
                                <span className="df-gold-italic">{sc.heroH1b}</span>
                            </h1>
                            <p className="df-hero-sub">{sc.heroSub}</p>
                            {segment !== 'istri' && (
                                <div className="df-img-box">
                                    <DbgImg src={assets.df08} alt="Dark Feminine" label="df08" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="df-trust-badges">
                                <span>🔒 100% Privasi</span><span>⚡ Instan</span><span>📱 Akses Seumur Hidup</span>
                            </div>
                            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--muted)' }}>
                                <span>🔥</span>
                                <span><strong>{c.socialProofNum}</strong> {c.socialProof}</span>
                            </div>
                        </div>
                    </section>

                    {/* GUARANTEE CARD — Below Hero Social Proof */}
                    <div id="df-guarantee-card">
                        <div className="df-guarantee-badge">🛡️</div>
                        <h2 className="df-guarantee-headline">
                            Garansi Uang Kembali 100%
                        </h2>
                        <p className="df-guarantee-body">
                            Jika dalam <strong>30 hari</strong> setelah membaca ebook ini kamu tidak merasakan perubahan — tidak ada rasa <strong>tenang, lepas, dan tentram</strong> dalam menjalani hubungan dengan pasangan atau calon pasangan — kami kembalikan uangmu <strong>100%, tanpa pertanyaan.</strong>
                        </p>
                        <button
                            className="df-guarantee-cta-hint"
                            onClick={() => {
                                const el = document.getElementById('reviews-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Cek review di bawah ↓
                        </button>
                    </div>

                    {/* PAIN / STORYTELLING SECTION */}
                    <section style={{ background: 'linear-gradient(180deg, var(--bg-section) 0%, var(--bg-primary) 100%)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{sc.painLabel}</div>
                            <h2 className="df-section-h2">
                                <span>{sc.painH2a}</span>
                                <span className="df-newline df-gold">{sc.painH2b}</span>
                            </h2>

                            {/* STORYTELLING SCENES — Carousel per story */}
                            {sc.stories && sc.stories.map((story: any, si: number) => (
                                <IstriCarousel key={si} story={story} assets={assets} />
                            ))}

                            {/* Before/After Istri — shown on ?istri only */}
                            {segment === 'istri' && c.wifeSection?.beforeAfterIstri && (
                                <IstriCarousel story={c.wifeSection.beforeAfterIstri} assets={assets} />
                            )}

                            {/* Short final pain punches */}
                            <div>
                                {sc.pains.map((p: any, i: number) => (
                                    <div key={i} className="df-pain-card">
                                        <span className="df-pain-icon">{p.icon}</span>
                                        <span>{p.text}</span>
                                    </div>
                                ))}
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
                                <DbgImg src={assets.df01} alt="Paradox" label="df01" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>
                                <div>{c.agitText}</div>
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
                            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>{c.solText}</div>
                        </div>
                    </section>



                    {/* Winning Gallery */}
                    {c.winningGallery && c.winningGallery.images && c.winningGallery.images.length > 0 && (
                        <section style={{ padding: '44px 0', borderTop: '1px solid rgba(139, 92, 246, 0.2)', background: 'var(--bg-primary)' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{c.winningGallery.title}</div>
                                <h2 className="df-section-h2" style={{ marginBottom: '12px' }}>{c.winningGallery.title}</h2>
                                <p style={{ color: 'var(--cream)', opacity: 0.8, fontSize: '16px', marginBottom: '32px', textAlign: 'center' }}>{c.winningGallery.sub}</p>
                                
                                <div className="df-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    {c.winningGallery.images.map((imgKey: string, i: number) => (
                                        <div key={i} className="df-img-box" style={{ margin: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                            <DbgImg src={assets[imgKey]} alt={`Winning Technique ${i+1}`} style={{ width: '100%', display: 'block' }} label={imgKey} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    

                    {/* WIFE SECTION - general page only, hidden on ?istri */}
                    {lang === 'id' && segment === 'default' && c.wifeSection && (
                        <section style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-section) 100%)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                {c.wifeSection.items.map((item: any, idx: number) => (
                                    <IstriCarousel key={idx} story={item} assets={assets} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CONTENTS */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.contentsLabel}</div>
                            <h2 className="df-section-h2">{c.contentsH2} <span className="df-gold">{c.contentsH2Span}</span></h2>
                            <p style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--gold-light)', marginBottom: '22px', lineHeight: 1.4 }}>
                                Apa yang kamu dapatkan setelah mendapat ebook ini
                            </p>
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
                            {lang === 'id' && segment === 'default' && c.wifeSection?.beforeAfterSingle && (
                                <IstriCarousel story={c.wifeSection.beforeAfterSingle} assets={assets} />
                            )}
                            {lang === 'id' && segment === 'default' && c.wifeSection?.beforeAfterIstri && (
                                <IstriCarousel story={c.wifeSection.beforeAfterIstri} assets={assets} />
                            )}
                        </div>
                    </section>

                    {/* BONUSES */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.bonusLabel}</div>
                            <h2 className="df-section-h2">{c.bonusH2} <span className="df-gold">{c.bonusH2Span}</span></h2>
                            <div>
                                {c.bonuses.map((b: any, i: number) => (
                                    <div key={i} className={`df-bonus-card ${b.isHighlight ? 'df-bonus-highlight' : ''}`}>
                                        <div style={{ fontSize: '28px', flexShrink: 0 }}>{b.icon}</div>
                                        <div>
                                            {b.isHighlight && <div style={{ fontSize: '11px', background: 'linear-gradient(90deg, var(--red), #b91c1c)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', display: 'inline-block', marginBottom: '8px', textTransform: 'uppercase' }}>{lang === 'id' ? '🔥 BUKU TABU (DIJUAL TERPISAH)' : (lang === 'ph' ? '🔥 TABOO BOOK (AY BINEBENTA NANG HIWALAY)' : '🔥 TABOO BOOK (SOLD SEPARATELY)')}</div>}
                                            <div style={{ fontSize: '17px', fontWeight: 700, color: b.isHighlight ? 'var(--gold-light)' : 'var(--white)', marginBottom: '4px' }}>{b.title}</div>
                                            <div style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</div>
                                            {b.highlightText && <div style={{ fontSize: '14px', color: 'var(--cream)', fontStyle: 'italic', marginTop: '6px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--red)' }}>{b.highlightText}</div>}
                                            <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--green-wa)', fontWeight: 700 }}>
                                                <s style={{ color: 'var(--muted)', fontWeight: 400 }}>{b.price}</s> → GRATIS
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.priceLabel}</div>
                            <h2 className="df-section-h2">{c.priceH2} <span className="df-gold">{lang === 'id' ? 'Hari Ini' : (lang === 'ph' ? 'Ngayon' : 'Today')}</span></h2>
                            <div className="df-img-box">
                                <DbgImg src={assets.df08} alt="Pricing Visual" label="df08" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ marginTop: '24px' }}>
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
                            <div className="df-section-label">{lang === 'id' ? 'BUKAN UNTUK SEMUA ORANG' : (lang === 'ph' ? 'HINDI PARA SA LAHAT' : 'NOT FOR EVERYONE')}</div>
                            <h2 className="df-section-h2">{c.exclH2}</h2>
                            <div className="df-img-box">
                                <DbgImg src={assets.df09} alt="Exclusivity Visual" label="df09" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '26px 22px', border: '2px solid rgba(239,68,68,0.35)' }}>
                                <div>
                                    {c.exclItems.map((item: string, i: number) => (
                                        <div 
                                            key={i} 
                                            className="df-excl-item"
                                            id={item.includes("menunggu jodoh") ? "free-ebook" : undefined}
                                        >
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


                                    {/* TRANSPARANSI SECTION */}
                                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                                    <div className="df-wrap df-fade-in">
                                    <div style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                    borderRadius: '24px',
                                    padding: '28px 22px',
                                    }}>
                                    <div style={{ marginBottom: '32px' }}>
                                    <div className="df-section-label">Transparansi</div>
                                    <h2 className="df-section-h2" style={{ fontSize: '28px', color: 'var(--white)', marginBottom: '12px' }}>
                                        Kami Berintegritas
                                    </h2>
                                    <p style={{ color: 'var(--cream)', fontSize: '15px', lineHeight: 1.7 }}>
                                        Setiap produk yang dijual anggota <strong style={{ color: 'var(--gold-light)' }}>eL Vision</strong> menggunakan arsitektur kami diwajibkan untuk menampilkan review dari <em>verified buyer</em> — bukan testimoni anonim, bukan ulasan palsu. Review hanya bisa ditulis oleh akun yang sudah melakukan pembelian terverifikasi.
                                    </p>
                                    </div>

                                    <div>
                                    {[
                                        { title: 'Verified Buyer Only', desc: 'Review hanya bisa ditulis setelah pembelian dikonfirmasi. Tidak ada akun yang bisa review tanpa transaksi nyata.' },
                                        { title: 'Email Tersensor untuk Privasi', desc: 'Identitas reviewer ditampilkan dalam format email tersensor (contoh: senaditsr***@hotmail.com) untuk melindungi privasi sekaligus membuktikan keaslian.' },
                                        { title: 'Login untuk Tulis Review', desc: 'Hanya pengguna yang sudah login dengan akun terverifikasi yang bisa menulis review. Tidak bisa dimanipulasi dari luar.' },
                                        { title: '100% Privacy & Security', desc: 'Sistem kami tidak menyimpan data sensitif pembayaran Anda. Semua transaksi melalui payment gateway terenkripsi.' },
                                        { title: 'Trusted Architecture', desc: 'Arsitektur website kami dibuat oleh eL Vision Group untuk menjamin kecepatan, keamanan, dan keaslian data pelanggan.' },
                                    ].map(({ title, desc }) => (
                                        <div key={title} className="df-integrity-row">
                                            <div className="df-integrity-icon"><Star size={16} fill="currentColor" /></div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--white)', marginBottom: '4px' }}>{title}</div>
                                                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                    </div>
                                    </div>
                                    </section>


                                    {/* REVIEWS SECTION */}
                    <section id="reviews-section" style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'ULASAN PELANGGAN' : (lang === 'ph' ? 'MGA REVIEW NG CUSTOMER' : 'CUSTOMER REVIEWS')}</div>
                            <h2 className="df-section-h2" style={{ fontSize: '28px', marginBottom: '8px' }}>Review Real Customer</h2>
                            <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                                {lang === 'id' ? '(Berikan ulasan Anda dengan memasukkan email)' : (lang === 'ph' ? '(Maaari kang mag-iwan ng review gamit ang iyong email)' : '(You can leave a review using your email)')} <br />
                                {lang === 'id' ? 'Ulasan disensor untuk privasi anda. Jika anda sudah membeli sebelumnya, review anda akan otomatis ditandai sebagai Verified Buyer.' : (lang === 'ph' ? 'Siniserensura ang mga ulasan para sa iyong privacy.' : 'Reviews are censored for your privacy.')}<br/>
                                <strong> {lang === 'id' ? 'Anda sudah punya ulasan? Masukkan email yang sama untuk mengupdate ulasan anda.' : 'Have an existing review? Use the same email to update it.'} </strong>
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'rgba(201,153,26,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(201,153,26,0.3)' }}>
                                <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>4.8</div>
                                <div>
                                    <div style={{ display: 'flex', color: 'var(--gold-light)' }}>
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} style={{ opacity: 0.8 }} />
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)', marginTop: '4px' }}>Review 4.8++ from 2000 Ladies..</div>
                                </div>
                            </div>

                            {/* User Review Input Form */}
                            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(139,92,246,0.3)', marginBottom: '24px' }}>
                                    <div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Email Anda:</label>
                                            <input 
                                                type="email" 
                                                value={anonymousReviewEmail} 
                                                onChange={(e) => setAnonymousReviewEmail(e.target.value)}
                                                placeholder="contoh@gmail.com"
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '12px', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Beri Rating:</div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={28}
                                                        fill={reviewRating >= star ? "var(--gold-light)" : "transparent"}
                                                        color={reviewRating >= star ? "var(--gold-light)" : "var(--muted)"}
                                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setReviewRating(star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder={lang === 'id' ? 'Tulis ulasan jujur Anda di sini...' : (lang === 'ph' ? 'Isulat ang iyong tapat na pagsusuri dito...' : 'Write your honest review here...')}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '14px', borderRadius: '8px', minHeight: '100px', fontFamily: 'var(--font-body)', fontSize: '15px', outline: 'none', marginBottom: '12px' }}
                                        />

                                        {showUpdateConfirm && (
                                            <div style={{ background: 'rgba(201,153,26,0.1)', border: '1px solid rgba(201,153,26,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>
                                                <p style={{ color: 'var(--cream)', fontSize: '14px', marginBottom: '8px' }}>
                                                    {lang === 'id' ? 'Email ini sudah memiliki ulasan. Ingin mengupdate ulasan Anda?' : 'You have reviews already, want to update?'}
                                                </p>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button 
                                                        onClick={() => submitReview(pendingReviewPayload.email)} 
                                                        style={{ background: 'var(--gold-light)', color: 'var(--bg-primary)', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                                                    >
                                                        {lang === 'id' ? 'Ya, Update' : 'Yes, Update'}
                                                    </button>
                                                    <button 
                                                        onClick={() => { setShowUpdateConfirm(false); setPendingReviewPayload(null); }} 
                                                        style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--muted)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        {lang === 'id' ? 'Batal' : 'Cancel'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {!showUpdateConfirm && (
                                                <button onClick={() => submitReview()} disabled={isLoginLoading} style={{ flex: 1, background: 'var(--purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: isLoginLoading ? 0.7 : 1 }}>
                                                    {isLoginLoading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Kirim Ulasan' : (lang === 'ph' ? 'Isumite Ang Review' : 'Submit Review'))}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                            </div>

                            {/* Display Reviews */}
                            <div>
                                {[...dbReviews, ...MOCK_REVIEWS]
                                    .filter(r => (!r.lang || r.lang === (lang === 'sg' || lang === 'ph' ? 'en' : lang) || (lang === 'id' && r.lang === 'id')) && (r.comment || r.text) && (r.comment?.trim() !== '' || r.text?.trim() !== ''))
                                    .slice(0, showReviewsCount).map((r, i) => (
                                        <div key={i} style={{ background: 'var(--bg-section)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <div>
                                                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {(() => {
                                                            if (r.user_email) {
                                                                const parts = r.user_email.split('@');
                                                                if (parts.length === 2) {
                                                                    const namePart = parts[0];
                                                                    const showLen = Math.max(3, Math.floor(namePart.length / 2));
                                                                    return `${namePart.slice(0, showLen)}***@${parts[1]}`;
                                                                }
                                                            }
                                                            return r.name;
                                                        })()}
                                                        {r.country && <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px', color: 'var(--muted)' }}>{r.country} {(r.flag || getFlagForCountry(r.country))}</span>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                                        {Array.from({ length: 5 }).map((_, j) => (
                                                            <Star key={j} size={14} fill={j < r.rating ? "var(--gold-light)" : "transparent"} color={j < r.rating ? "var(--gold-light)" : "var(--muted)"} />
                                                        ))}
                                                        {r.created_at && (
                                                            <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '8px' }}>
                                                                {(() => {
                                                                    const datePart = r.created_at.includes('T') ? r.created_at.split('T')[0] : r.created_at.split(' ')[0];
                                                                    const [y, m, d] = datePart.split('-');
                                                                    const months: any = {
                                                                        '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
                                                                        '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
                                                                        '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
                                                                    };
                                                                    const dNum = parseInt(d);
                                                                    return isNaN(dNum) ? datePart : `${dNum} ${months[m] || m} ${y}`;
                                                                })()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: (r.comment === null || r.is_verified) ? 'var(--green-wa)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', background: (r.comment === null || r.is_verified) ? 'rgba(37,211,102,0.1)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                                                    {(r.comment === null || r.is_verified || r.rating === 5) ? '✓ Verified Buyer' : 'Not Verified'}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.6, marginTop: '8px' }}>{r.comment || r.text}</p>
                                        </div>
                                    ))}
                            </div>

                            {showReviewsCount < [...dbReviews, ...MOCK_REVIEWS].length && (
                                <button onClick={() => setShowReviewsCount(30)} style={{ width: '100%', background: 'transparent', border: '1px solid var(--purple-light)', color: 'var(--purple-light)', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'all 0.2s' }}>
                                    ▾ {lang === 'id' ? 'Buka Review Lain' : (lang === 'ph' ? 'Tingnan ang Ibang Review' : 'View More Reviews')}
                                </button>
                            )}

                        </div>
                    </section>
                    {/* VALUE STACK — before checkout */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0 0 0' }}>
                        <div className="df-wrap df-fade-in">
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
                                    <span style={{ fontSize: '15px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'id' ? 'Total Nilai' : (lang === 'ph' ? 'Kabuuan Na Halaga' : 'Total Value')}</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--red)', textDecoration: 'line-through' }}>Rp995.000</span>
                                </div>
                                <div className="df-final-row">
                                    <span style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.priceTodayLabel}</span>
                                    <span className="df-final-price">{isEnglish ? "$15" : "Rp199.000"}</span>
                                </div>
                                <div style={{ display: 'block', textAlign: 'center', marginTop: '14px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: 'var(--green-wa)', fontSize: '14px', fontWeight: 700, padding: '9px', borderRadius: '10px', letterSpacing: '0.06em' }}>
                                    {c.savingsBadge}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CHECKOUT FORM */}
                    <section id="checkout" className="df-formsec">
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'LANGKAH TERAKHIR' : (lang === 'ph' ? 'PANGHULING HAKBANG' : 'FINAL STEP')}</div>
                            <h2 className="df-section-h2">{lang === 'id' ? 'Isi Data &' : (lang === 'ph' ? 'Ilagay ang Detalye at' : 'Fill Details &')} <span className="df-gold">{lang === 'id' ? 'Dapatkan Akses' : (lang === 'ph' ? 'Kumuha ng Access' : 'Get Access')}</span></h2>
                            <div className="df-privstrip">
                                {[["🔒", lang === 'id' ? "100% Privasi" : (lang === 'ph' ? "100% Pribado" : "100% Privacy")], ["⚡", lang === 'id' ? "Akses Instan" : (lang === 'ph' ? "Instant Access" : "Instant Access")], ["💳", lang === 'id' ? "Bayar Aman" : (lang === 'ph' ? "Ligtas na Bayad" : "Secure Payment")], ["📱", lang === 'id' ? "Seumur Hidup" : (lang === 'ph' ? "Habambuhay Access" : "Lifetime Access")]].map(([ic, lb]) => (
                                    <div key={lb} className="df-privbadge"><span>{ic}</span><span>{lb}</span></div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'Nama Lengkap' : (lang === 'ph' ? 'Buong Pangalan' : 'Full Name')}</label>
                                    <input className="df-finput" placeholder={lang === 'id' ? "Contoh: Sarah" : (lang === 'ph' ? "Halimbawa: Sarah" : "e.g: Sarah")} value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'No. WhatsApp' : 'WhatsApp Number'}</label>
                                    <div className="df-pwrap">
                                        <div className="df-ppfx">{lang === 'id' ? '🇮🇩 +62' : (lang === 'ph' ? '🇵🇭 +63' : '🌐 +')}</div>
                                        <input className="df-finput" placeholder={lang === 'id' ? '812345678' : (lang === 'ph' ? '9123456789' : 'e.g. 628123456789 or 19291234567')} inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'Email (untuk link download)' : (lang === 'ph' ? 'Email (para sa link download)' : 'Email (for download link)')}</label>
                                    <input className="df-finput" type="email" placeholder={lang === 'id' ? 'contoh@gmail.com' : (lang === 'ph' ? 'halimbawa@gmail.com' : 'example@gmail.com')} value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">Metode Pembayaran</label>
                                    <div className="df-pmgrid">
                                        {isEnglish ? (
                                            <div className={`df-pmopt ${payment === "PAYPAL" ? "sel" : ""}`} onClick={() => setPayment("PAYPAL")}>
                                                <div className="df-pmname">PayPal</div>
                                                <div className="df-pmsub" style={{ color: 'var(--gold-light)' }}>Secure International Payment</div>
                                            </div>
                                        ) : (
                                            <>
                                                {[
                                                    ["QRIS", "QRIS", "Redirect ke Aplikasi"],
                                                    ["DANA", "DANA", "E-Wallet DANA"],
                                                    ["OVO", "OVO", "E-Wallet OVO"],
                                                    ["SHOPEEPAY", "ShopeePay", "E-Wallet ShopeePay"],
                                                    ["BCA_MANUAL", "Manual Transfer BCA", "Dicek Manual 1-5 Menit"],
                                                    ["BCAVA", "BCA Virtual Account", "Otomatis via BCA"],
                                                    ["BNIVA", "BNI Virtual Account", "Otomatis via BNI"],
                                                    ["BRIVA", "BRI Virtual Account", "Otomatis via BRI"],
                                                    ["MANDIRIVA", "Mandiri Virtual Account", "Otomatis via Mandiri"]
                                                ].map(([id, nm, sb]) => (
                                                    <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => { setPayment(id); setRetailOpen(false); }}>
                                                        <div className="df-pmname">{nm}</div>
                                                        <div className="df-pmsub" style={{ color: (['QRIS', 'DANA', 'OVO', 'SHOPEEPAY'].includes(id)) ? 'var(--gold-light)' : 'var(--muted)' }}>{sb}</div>
                                                    </div>
                                                ))}
                                                {/* Retail Dropdown Trigger */}
                                                <div className={`df-pmopt ${['INDOMARET', 'ALFAMART', 'ALFAMIDI'].includes(payment) ? "sel" : ""}`} onClick={() => setRetailOpen(!retailOpen)}>
                                                    <div className="df-pmname">Retail / Indomart ▾</div>
                                                    <div className="df-pmsub">Indomaret, Alfamart, Alfamidi</div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!isEnglish && retailOpen && (
                                        <div className="df-pmgrid" style={{ marginTop: '10px', padding: '12px', background: 'rgba(139,92,246,0.05)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.1)' }}>
                                            {[
                                                ["INDOMARET", "Indomaret", "Gerai Indomaret"],
                                                ["ALFAMART", "Alfamart", "Gerai Alfamart"],
                                                ["ALFAMIDI", "Alfamidi", "Gerai Alfamidi"]
                                            ].map(([id, nm, sb]) => (
                                                <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => setPayment(id)}>
                                                    <div className="df-pmname">{nm}</div>
                                                    <div className="df-pmsub">{sb}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, marginBottom: 10 }}>
                                    <label className="df-flabel" style={{ marginBottom: 4 }}>{lang === 'id' ? 'Pilih Paket Anda' : (lang === 'ph' ? 'Piliin ang Iyong Package' : 'Choose Your Package')}</label>

                                    {/* Option 1: Base */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: addUpsell === 0 ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', border: addUpsell === 0 ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(0)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 0 ? '6px solid var(--purple-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: addUpsell === 0 ? 'var(--cream)' : 'var(--muted)' }}>{lang === 'id' ? 'Paket Lengkap Dark Feminine + 8 Bonus' : (lang === 'ph' ? 'Kumpletuhang Package ng Dark Feminine + 8 Bonus' : 'Dark Feminine Complete Package + 8 Bonuses')}</div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 0 ? 'var(--cream)' : 'var(--muted)' }}>
                                            {isEnglish ? "$15.00" : "Rp199.000"}
                                        </div>
                                    </div>

                                    {/* Option 2: +Love Magnet */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: addUpsell === 1 ? 'rgba(240,200,74,0.1)' : 'rgba(255,255,255,0.03)', border: addUpsell === 1 ? '1px solid rgba(240,200,74,0.4)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(1)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 1 ? '6px solid var(--gold-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                                <div style={{ fontSize: '15px', fontWeight: 800, color: addUpsell === 1 ? 'var(--gold-light)' : 'var(--cream)' }}>Dark Feminine + 8 Bonus<br />+ Audio Love Magnet</div>
                                                <span style={{ fontSize: '10px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{lang === 'id' ? 'PROMO KHUSUS' : (lang === 'ph' ? 'Espesyal Na Promo' : 'SPECIAL PROMO')}</span>
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4 }}>{lang === 'id' ? 'Rahasia memikat pria idaman hanya lewat frekuensi suara.' : (lang === 'ph' ? 'Sikreto para akitin ang iyong pangarap na lalaki sa pamamagitan lamang ng dalas ng boses.' : 'Secret to captivating your dream man just through voice frequency.')} <span style={{ color: 'var(--red)', textDecoration: 'line-through' }}>{lang === 'id' ? '(Senilai Rp250.000)' : (lang === 'ph' ? '(Nagkakahalagang P850)' : '(Worth $19)')}</span></div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 1 ? 'var(--gold-light)' : 'var(--cream)' }}>
                                            {isEnglish ? "$19.00" : (hasDisc ? "Rp200.000" : "Rp249.000")}
                                        </div>
                                    </div>

                                    {/* Option 3: Ultimate */}
                                    {lang === 'id' && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', background: addUpsell === 2 ? 'rgba(233,30,140,0.12)' : 'rgba(255,255,255,0.03)', border: addUpsell === 2 ? '2px solid rgba(233,30,140,0.7)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }} onClick={() => setAddUpsell(2)}>
                                            <div style={{ marginRight: '14px', marginTop: '2px' }}>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 2 ? '6px solid #e91e8c' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                    <div style={{ fontSize: '15px', fontWeight: 800, color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>👑 Ultimate Dark Feminine</div>
                                                    <span style={{ fontSize: '10px', background: 'linear-gradient(90deg, #e91e8c, #c2185b)', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>TERLENGKAP</span>
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                                                    <div>✦ Semua isi paket + 8 Bonus + Audio Love Magnet</div>
                                                    <div>✦ Blueprint + Workbook 30 hari yang kamu isi & lakukan</div>
                                                    <div>✦ <strong style={{ color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>Q&A unlimited dengan admin</strong> — seperti punya terapis sendiri</div>
                                                    <div>✦ <strong style={{ color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>Garansi uang kembali</strong> jika tidak merasakan perubahan setelah selesai workbook</div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 2 ? '#f472b6' : 'var(--cream)', marginLeft: '10px', whiteSpace: 'nowrap' }}>Rp399.000</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: "rgba(139,92,246,.05)", border: "1px solid rgba(139,92,246,.13)", borderRadius: 11, padding: 14, marginTop: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13.5, color: addUpsell > 0 ? "var(--gold-light)" : "var(--muted)" }}>
                                        <span style={{ paddingRight: 10 }}>
                                            {addUpsell === 2 ? "👑 Ultimate Dark Feminine" : addUpsell === 1 ? (lang === 'id' ? "Paket Lengkap + Audio Love Magnet" : (lang === 'ph' ? "Kumpletuhang Package + Audio Love Magnet" : "Complete Package + Audio Love Magnet")) : (lang === 'id' ? "Paket Lengkap Dark Feminine + 8 Bonus" : (lang === 'ph' ? "Kumpletuhang Package ng Dark Feminine + 8 Bonus" : "Dark Feminine Complete Package + 8 Bonuses"))}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>{isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}</span>
                                    </div>
                                    <div style={{ height: 1, background: "rgba(139,92,246,.09)", marginBottom: 7 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 700 }}>
                                        <span style={{ color: "var(--cream)" }}>Total</span>
                                        <span style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)", fontSize: 24 }}>{isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}</span>
                                    </div>
                                </div>
                                <button id="checkout-button" className="df-sbtn" onClick={submitOrder} disabled={loading}>
                                    {loading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : `🛒 ${lang === 'id' ? 'Pesan Sekarang' : (lang === 'ph' ? 'Mag-order Ngayon' : 'Order Now')} — ${isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}`}
                                </button>
                                <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.75 }}>🔒 {lang === 'id' ? 'Pembayaran aman & dienkripsi. Produk dikirim digital. Tidak ada tagihan mencurigakan.' : (lang === 'ph' ? 'Ligtas at naka-encrypt ang pagbabayad. Ipinadala nang digital ang produkto. Walang kahina-hinalang singil.' : 'Secure & encrypted payment. Product delivered digitally. No suspicious billing.')}</p>
                            </div>
                        </div>
                    </section>

                    {/* HESITATION BOX - Indonesia Only */}
                    {lang === 'id' && c.hesitationBox && (
                        <section style={{ padding: '0 0 44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-hesitation-box">
                                    <div className="df-hesitation-header">
                                        <h2 className="df-hesitation-title">{c.hesitationBox.title}</h2>
                                        <p className="df-hesitation-subtitle">{c.hesitationBox.subtitle}</p>
                                    </div>
                                    <div className="df-hesitation-body">
                                        {c.hesitationBox.body.map((p: string, i: number) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                    <div className="df-hesitation-objection">
                                        {c.hesitationBox.objection}
                                    </div>
                                    <div className="df-hesitation-ctas">
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-primary"
                                            onClick={() => {
                                                const el = document.getElementById('checkout');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta1}
                                        </button>
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-secondary"
                                            onClick={() => {
                                                const el = document.getElementById('reviews-section');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta2}
                                        </button>
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-tertiary"
                                            onClick={() => {
                                                const el = document.getElementById('free-ebook');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta3}
                                        </button>
                                    </div>
                                    <p className="df-hesitation-micro">{c.hesitationBox.micro}</p>
                                    <p className="df-hesitation-sting">{c.hesitationBox.sting}</p>
                                    <div id="free-ebook" className="df-free-form" style={{ marginTop: '32px' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                                            <span style={{ color: 'var(--purple-light)', fontSize: '18px', fontWeight: 700 }}>🎁 {lang === 'id' ? 'Dapatkan Free Ebook' : (lang === 'ph' ? 'Kumuha ng Libreng Ebook' : 'Get a Free Ebook')}</span>
                                        </div>
                                        {successFree ? (
                                            <div style={{ textAlign: 'center', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '16px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                                                <strong style={{ display: 'block', color: 'var(--green-wa)', marginBottom: '4px' }}>{lang === 'id' ? 'Berhasil!' : (lang === 'ph' ? 'Tagumpay!' : 'Success!')}</strong>
                                                <span style={{ fontSize: '14px', color: 'var(--cream)' }}>{lang === 'id' ? 'Silahkan Periksa whatsapp anda,, Ketik Ya jika anda ingin menerima Free ebook..' : (lang === 'ph' ? 'Mangyaring suriin ang iyong WhatsApp, Mag-type ng Oo kung gusto mong matanggap ang Libreng ebook..' : 'Please check your WhatsApp, Type Yes if you want to receive the Free ebook..')}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    ref={freeEbookNameRef}
                                                    className="df-free-input"
                                                    placeholder={lang === 'id' ? "Nama Kamu" : (lang === 'ph' ? "Pangalan Mo" : "Your Name")}
                                                    value={nameFree}
                                                    onChange={(e) => setNameFree(e.target.value)}
                                                />
                                                <div className="df-free-pwrap">
                                                    <div className="df-free-ppfx">{lang === 'id' ? '🇮🇩 +62' : (lang === 'ph' ? '🇵🇭 +63' : '🌐')}</div>
                                                    <input
                                                        type="tel"
                                                        className="df-free-input"
                                                        placeholder={lang === 'id' ? "812345678" : (lang === 'ph' ? "9123456789" : "e.g. 628123456789 or 19291234567")}
                                                        value={waFree}
                                                        onChange={(e) => setWaFree(e.target.value)}
                                                    />
                                                </div>
                                                <input
                                                    type="email"
                                                    className="df-free-input"
                                                    placeholder={lang === 'id' ? "Email Aktif" : (lang === 'ph' ? "Aktibong Email" : "Active Email")}
                                                    value={emailFree}
                                                    onChange={(e) => setEmailFree(e.target.value)}
                                                    style={{ marginBottom: '16px' }}
                                                />
                                                <button
                                                    className="df-free-btn"
                                                    onClick={submitFreeEbook}
                                                    disabled={loadingFree}
                                                >
                                                    {loadingFree ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Kirim Sekarang →' : (lang === 'ph' ? 'Ipadala Ngayon →' : 'Send Now →'))}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

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
                                {c.stickyText} <span style={{ color: 'var(--gold-light)' }}>{isEnglish ? (addUpsell === 1 ? '$19.00' : '$15.00') : (addUpsell === 2 ? 'Rp399.000' : addUpsell === 1 ? (hasDisc ? 'Rp200.000' : 'Rp249.000') : 'Rp199.000')}</span>
                                {addUpsell === 2 && <span style={{ fontSize: '11px', background: 'linear-gradient(90deg, #e91e8c, #c2185b)', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>👑 Ultimate</span>}
                                {addUpsell === 1 && <span style={{ fontSize: '11px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>+ Love Magnet</span>}
                            </div>
                            <a id="sticky-checkout-trigger" onClick={(name && phone && email && payment) ? submitOrder : scrollToForm} style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))', color: '#000', fontSize: '15px', fontWeight: 700, padding: '12px 18px', borderRadius: '11px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', minHeight: '44px', textDecoration: 'none', display: 'inline-block', textAlign: 'center', animation: 'dfShimmer 3s ease infinite', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold))' }}>{loading ? (lang === 'id' ? 'Memproses...' : 'Processing...') : c.stickyCta}</a>
                        </div>
                    </div>

                    {/* FLOATING WHATSAPP BUTTON */}
                    <a
                        href={`https://wa.me/62895325633487?text=${encodeURIComponent(lang === 'ph' ? "Hello Dark Feminine Admin, may tanong ako..." : (lang === 'id' ? "Halo Admin Dark Feminine, saya mau tanya..." : "Hello Dark Feminine Admin, I have a question..."))}`}
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
