
const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #2d1b4e;
        overflow-x: hidden;
    }

    .hero {
        background: linear-gradient(135deg, #1a0b2e 0%, #4a1e7c 50%, #7c3aed 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .hero::before {
        content: '';
        position: absolute;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(167, 139, 250, 0.3), transparent);
        border-radius: 50%;
        top: -100px;
        right: -100px;
        animation: float 6s ease-in-out infinite;
    }

    .hero::after {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(196, 181, 253, 0.2), transparent);
        border-radius: 50%;
        bottom: -150px;
        left: -150px;
        animation: float 8s ease-in-out infinite reverse;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-30px); }
    }

    .hero-content {
        text-align: center;
        padding: 2rem;
        max-width: 900px;
        position: relative;
        z-index: 2;
    }

    .hero h1 {
        font-size: 3.5rem;
        color: #ffffff;
        margin-bottom: 1.5rem;
        font-weight: 700;
        text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        animation: fadeInUp 1s ease;
    }

    .hero h2 {
        font-size: 1.5rem;
        color: #e9d5ff;
        margin-bottom: 2.5rem;
        font-weight: 400;
        animation: fadeInUp 1.2s ease;
    }

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

    .cta-button {
        background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
        color: #4a1e7c;
        padding: 1.2rem 3rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
        animation: fadeInUp 1.4s ease;
    }

    .cta-button:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(124, 58, 237, 0.6);
        background: linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%);
    }

    .section {
        padding: 5rem 2rem;
        position: relative;
    }

    .section-light {
        background: linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%);
    }

    .section-dark {
        background: linear-gradient(180deg, #2d1b4e 0%, #4a1e7c 100%);
        color: #ffffff;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    h2 {
        font-size: 2.5rem;
        margin-bottom: 3rem;
        text-align: center;
        font-weight: 700;
    }

    .struggle-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .struggle-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15);
        transition: transform 0.3s ease;
    }

    .struggle-card:hover {
        transform: translateY(-10px);
    }

    .struggle-card h3 {
        color: #6d28d9;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .struggle-card p {
        color: #4a1e7c;
        line-height: 1.8;
    }

    .quote {
        text-align: center;
        font-style: italic;
        font-size: 1.3rem;
        color: #7c3aed;
        margin-top: 3rem;
        padding: 2rem;
        background: rgba(167, 139, 250, 0.1);
        border-radius: 15px;
        border-left: 5px solid #7c3aed;
    }

    .solution-box {
        background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%);
        padding: 3rem;
        border-radius: 30px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(109, 40, 217, 0.4);
        margin-bottom: 2rem;
    }

    .solution-box h3 {
        font-size: 2.2rem;
        margin-bottom: 1.5rem;
        color: #ffffff;
    }

    .solution-box p {
        font-size: 1.2rem;
        color: #e9d5ff;
        line-height: 1.8;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2.5rem;
        margin-top: 3rem;
    }

    .feature-card {
        background: #ffffff;
        padding: 2.5rem;
        border-radius: 20px;
        text-align: center;
        transition: all 0.3s ease;
        border: 3px solid transparent;
    }

    .feature-card:hover {
        border-color: #7c3aed;
        transform: scale(1.05);
        box-shadow: 0 15px 40px rgba(124, 58, 237, 0.3);
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }

    .feature-card h4 {
        color: #6d28d9;
        font-size: 1.4rem;
        margin-bottom: 1rem;
    }

    .feature-card p {
        color: #4a1e7c;
        line-height: 1.7;
    }

    .audience-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .audience-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 15px;
        border-left: 5px solid #e9d5ff;
        transition: all 0.3s ease;
    }

    .audience-item:hover {
        background: rgba(255, 255, 255, 0.2);
        border-left-color: #ffffff;
    }

    .testimonials {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }

    .testimonial-card {
        background: #ffffff;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15);
    }

    .testimonial-card h4 {
        color: #6d28d9;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .testimonial-card p {
        color: #4a1e7c;
        line-height: 1.8;
        margin-bottom: 1rem;
    }

    .testimonial-author {
        color: #7c3aed;
        font-style: italic;
        font-size: 0.95rem;
    }

    .pricing-box {
        background: linear-gradient(135deg, #1a0b2e 0%, #4a1e7c 100%);
        padding: 4rem;
        border-radius: 30px;
        text-align: center;
        max-width: 600px;
        margin: 3rem auto;
        box-shadow: 0 20px 60px rgba(26, 11, 46, 0.5);
    }

    .price-old {
        color: #c4b5fd;
        text-decoration: line-through;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .price-new {
        font-size: 3.5rem;
        color: #ffffff;
        font-weight: 700;
        margin: 1rem 0;
    }

    .price-details {
        color: #e9d5ff;
        margin-top: 1.5rem;
        line-height: 1.8;
    }

    .faq-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .faq-item {
        background: #ffffff;
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 1.5rem;
        box-shadow: 0 5px 20px rgba(124, 58, 237, 0.1);
    }

    .faq-question {
        color: #6d28d9;
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .faq-answer {
        color: #4a1e7c;
        line-height: 1.8;
    }

    .phoenix {
        text-align: center;
        font-size: 5rem;
        margin-bottom: 2rem;
        animation: rise 3s ease-in-out infinite;
    }

    @keyframes rise {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
        50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2.2rem;
        }
        
        .hero h2 {
            font-size: 1.2rem;
        }
        
        .section {
            padding: 3rem 1rem;
        }
        
        h2 {
            font-size: 2rem;
        }
    }
`;

const htmlContent = `
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <div class="phoenix">🕊️</div>
            <h1>Kehilangan Itu Berat.<br>Dan Kamu Tidak Harus Menjalaninya Sendiri.</h1>
            <h2>Panduan terapi berduka untuk anak, remaja, & dewasa yang membantu memproses rasa kehilangan dengan cara aman & lembut 🤍</h2>
            <button class="cta-button" onclick="document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })">BANTU SAYA MEMPROSES DUKA</button>
        </div>
    </section>

    <!-- Struggle Section -->
    <section class="section section-light">
        <div class="container">
            <h2>Mungkin Ini yang Sedang Kamu Rasakan Saat Ini</h2>
            <div class="struggle-grid">
                <div class="struggle-card">
                    <h3>🌧️ Anak Berubah Drastis</h3>
                    <p>Tiba-tiba jadi pendiam, clingy, atau emosinya meledak-ledak tanpa sebab.</p>
                </div>
                <div class="struggle-card">
                    <h3>🌧️ Remaja Menutup Diri</h3>
                    <p>Mengurung diri di kamar, pakai earphone terus, dan susah diajak bicara dari hati ke hati.</p>
                </div>
                <div class="struggle-card">
                    <h3>🌧️ Kamu Sendiri Lelah</h3>
                    <p>Capek harus pura-pura "kuat terus" di depan keluarga, padahal hatimu juga hancur.</p>
                </div>
                <div class="struggle-card">
                    <h3>🌧️ Bingung Harus Mulai Dari Mana</h3>
                    <p>Niatnya mau menghibur, tapi takut salah ngomong malah bikin suasana makin sedih.</p>
                </div>
            </div>
            <div class="quote">
                "Duka itu tidak punya jadwal. Kadang hari ini baik-baik saja, besok rasanya berat sekali."
            </div>
        </div>
    </section>

    <!-- Solution Section -->
    <section class="section section-dark">
        <div class="container">
            <div class="phoenix">🌿</div>
            <div class="solution-box">
                <h3>Memperkenalkan: Grief Therapy Indonesia</h3>
                <p>Kumpulan workbook, question cards, & coping tools yang dirancang untuk menemani proses berduka tanpa memaksa cepat pulih (move on).</p>
                <br>
                <p>Ini bukan tentang melupakan. Ini tentang memberi ruang bagi rasa sedih agar bisa diproses dengan sehat.</p>
            </div>
            <p style="text-align: center; font-size: 1.2rem; color: #e9d5ff;">
                Semua materi dirancang <strong>Trauma-Informed</strong> (aman untuk psikologis) dan <strong>Age-Appropriate</strong> (sesuai usia).
            </p>
        </div>
    </section>

    <!-- Features Section -->
    <section class="section section-light">
        <div class="container">
            <h2>💡 Apa Aja Isinya? (Total 50+ Halaman PDF)</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📘</div>
                    <h4>Grief Workbook</h4>
                    <p>3 Versi: Anak, Remaja, Dewasa. Lembar aktivitas untuk mengekspresikan perasaan lewat tulisan dan gambar. Anak yang belum bisa bicara lancar bisa terbantu lewat drawing therapy.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🃏</div>
                    <h4>Conversation & Memory Cards</h4>
                    <p>Kartu pertanyaan lembut untuk memancing obrolan. Contoh: "Apa kenangan paling lucu yang kamu ingat tentang [Alm/Almh]?"</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧘</div>
                    <h4>Emotional Toolbox</h4>
                    <p>Teknik pernapasan dan visualisasi untuk meredakan kecemasan atau panik saat gelombang kesedihan datang tiba-tiba.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛡️</div>
                    <h4>Coping Skills Tracker</h4>
                    <p>Daftar kegiatan sederhana untuk membantu diri sendiri bertahan di hari-hari yang berat.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Target Audience Section -->
    <section class="section section-dark">
        <div class="container">
            <h2>Siapa yang Butuh Bundle Ini?</h2>
            <div class="audience-list">
                <div class="audience-item">
                    <strong>✔️ Orang Tua</strong><br>
                    yang ingin membantu anaknya paham konsep kematian.
                </div>
                <div class="audience-item">
                    <strong>✔️ Remaja</strong><br>
                    yang butuh ruang privat untuk menumpahkan perasaannya.
                </div>
                <div class="audience-item">
                    <strong>✔️ Individu Dewasa</strong><br>
                    yang sedang memproses kehilangan (pasangan, orang tua, sahabat, atau hewan peliharaan).
                </div>
                <div class="audience-item">
                    <strong>✔️ Konselor & Guru BK</strong><br>
                    sebagai alat bantu sesi konseling.
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section section-light">
        <div class="container">
            <h2>Kata Mereka yang Terbantu</h2>
            <div class="testimonials">
                <div class="testimonial-card">
                    <h4>"Akhirnya anakku mau cerita..."</h4>
                    <p>Sejak ayahnya meninggal, anakku (7 th) jadi sering marah-marah. Lewat workbook menggambar di bundle ini, dia akhirnya cerita kalau dia rindu tapi bingung cara ngomongnya. Terima kasih panduannya.</p>
                    <div class="testimonial-author">— Ibu Sarah (34 th)</div>
                </div>
                <div class="testimonial-card">
                    <h4>"Validasi banget buat aku yang lagi down"</h4>
                    <p>Sebagai remaja, aku sering dibilang 'jangan nangis terus'. Tapi baca workbook ini aku jadi sadar kalau sedih itu wajar. Affirmation cards-nya ngebantu banget pas lagi kumat sedihnya.</p>
                    <div class="testimonial-author">— Tiara (SMA, 16 th)</div>
                </div>
                <div class="testimonial-card">
                    <h4>"Alat bantu konseling yang sangat lengkap"</h4>
                    <p>Saya pakai printables ini untuk murid saya yang baru kehilangan ibunya. Sangat membantu mereka mengekspresikan emosi dengan cara yang tidak menakutkan.</p>
                    <div class="testimonial-author">— Ibu Ratna, Guru BK</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="section section-dark" id="pricing">
        <div class="container">
            <h2>💸 Harga Spesial untuk Ketenangan Hati</h2>
            <div class="pricing-box">
                <h3 style="color: #e9d5ff; margin-bottom: 1rem;">Bundle Terapi Lengkap<br>(3 Kategori Usia)</h3>
                <div class="price-old">Harga Normal: Rp 299.000</div>
                <div class="price-new">Rp 99.000,-</div>
                <p style="color: #c4b5fd; font-size: 1.1rem; margin-bottom: 2rem;">(Akses Seumur Hidup)</p>
                <div class="price-details">
                    📦 Format: Digital PDF (Langsung Download & Print)<br>
                    💌 Support: Bisa dipakai untuk seluruh anggota keluarga
                </div>
                <button class="cta-button" style="margin-top: 2rem;">DOWNLOAD SEKARANG - RP 99RB</button>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="section section-light">
        <div class="container">
            <h2>Pertanyaan yang Sering Ditanyakan</h2>
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">Q: Produk ini bentuknya apa?</div>
                    <div class="faq-answer">A: File digital (PDF). Setelah bayar, link download langsung masuk ke email/WA. Kamu bisa print sendiri di rumah sepuasnya. Tidak ada barang fisik yang dikirim.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">Q: Cocok untuk usia berapa?</div>
                    <div class="faq-answer">A: Bundle ini unik karena All-in-One. Di dalamnya sudah ada folder terpisah khusus untuk:<br><br>
                    • Anak-anak (4-10 tahun) - Banyak gambar<br>
                    • Remaja (11-17 tahun) - Jurnal & refleksi<br>
                    • Dewasa (18+ tahun)</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">Q: Apakah bisa digunakan oleh Guru/Psikolog?</div>
                    <div class="faq-answer">A: Bisa banget. Banyak konselor dan terapis yang menggunakan lembar kerja ini sebagai "take-home exercise" untuk klien mereka.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">Q: Apakah materinya sensitif agama tertentu?</div>
                    <div class="faq-answer">A: Tidak. Materi ini bersifat universal dan fokus pada psikologis emosi, jadi bisa masuk ke latar belakang agama apa pun.</div>
                </div>
            </div>
        </div>
    </section>
`;

export default function EbookGriefLanding() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}