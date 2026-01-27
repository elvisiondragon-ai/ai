
const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        overflow-x: hidden;
    }

    .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/></svg>');
        opacity: 0.3;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        position: relative;
        z-index: 1;
    }

    h1 {
        font-size: 2.5em;
        margin-bottom: 20px;
        animation: fadeInDown 1s ease;
    }

    .hero p {
        font-size: 1.2em;
        margin-bottom: 30px;
        opacity: 0.95;
        animation: fadeInUp 1s ease 0.2s both;
    }

    .cta-btn {
        display: inline-block;
        background: #ff6b6b;
        color: white;
        padding: 18px 40px;
        text-decoration: none;
        border-radius: 50px;
        font-size: 1.1em;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
        animation: pulse 2s infinite;
    }

    .cta-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
    }

    .pain-section {
        background: #fff5f5;
        padding: 60px 20px;
    }

    .pain-section h2 {
        text-align: center;
        color: #e53e3e;
        font-size: 2em;
        margin-bottom: 40px;
    }

    .pain-item {
        background: white;
        padding: 20px;
        margin: 15px 0;
        border-left: 4px solid #e53e3e;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .pain-item:hover {
        transform: translateX(10px);
    }

    .solution-section {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
    }

    .solution-section h2 {
        font-size: 2.2em;
        margin-bottom: 20px;
    }

    .features-section {
        padding: 60px 20px;
        background: #f7fafc;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .feature-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .feature-icon {
        font-size: 3em;
        margin-bottom: 15px;
    }

    .feature-card h3 {
        color: #667eea;
        margin-bottom: 15px;
    }

    .benefits-section {
        background: white;
        padding: 60px 20px;
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 40px;
    }

    .benefit-item {
        padding: 20px;
        text-align: center;
        background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
        border-radius: 10px;
    }

    .testimonial-section {
        background: #edf2f7;
        padding: 60px 20px;
    }

    .testimonial-card {
        background: white;
        padding: 30px;
        margin: 20px 0;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .testimonial-card p {
        font-style: italic;
        margin-bottom: 15px;
        color: #4a5568;
    }

    .testimonial-author {
        color: #667eea;
        font-weight: bold;
    }

    .transformation-section {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 60px 20px;
        text-align: center;
    }

    .transformation-list {
        text-align: left;
        max-width: 600px;
        margin: 30px auto;
        font-size: 1.1em;
    }

    .transformation-list li {
        margin: 15px 0;
        padding-left: 30px;
        position: relative;
    }

    .transformation-list li::before {
        content: '✨';
        position: absolute;
        left: 0;
    }

    .pricing-section {
        background: #2d3748;
        color: white;
        padding: 80px 20px;
        text-align: center;
    }

    .price-card {
        background: white;
        color: #2d3748;
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        margin: 30px auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .old-price {
        text-decoration: line-through;
        color: #e53e3e;
        font-size: 1.5em;
    }

    .new-price {
        font-size: 3em;
        color: #48bb78;
        font-weight: bold;
        margin: 20px 0;
    }

    .faq-section {
        padding: 60px 20px;
        background: white;
    }

    .faq-item {
        background: #f7fafc;
        padding: 20px;
        margin: 15px 0;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }

    .faq-item h4 {
        color: #667eea;
        margin-bottom: 10px;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 1.8em;
        }
        .features-grid {
            grid-template-columns: 1fr;
        }
    }

    h2 {
        text-align: center;
        font-size: 2em;
        margin-bottom: 30px;
    }
`;

const htmlContent = `
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>🎯 Bikin Anak Lebih Fokus & Teratur Tanpa Drama!</h1>
            <p>Capek tiap hari harus ngingetin anak buat beresin kamar, ngerjain PR, atau siap-siap sekolah? Kayaknya baru ngomong 5 menit lalu, eh udah lupa lagi... 😩</p>
            <a href="#pricing" class="cta-btn">SAYA MAU ANAK LEBIH FOKUS</a>
        </div>
    </section>

    <!-- Pain Section -->
    <section class="pain-section">
        <div class="container">
            <h2>😣 Pernah Ngalamin Ini Moms/Dads?</h2>
            <div class="pain-item">
                <strong>❌ Pagi Selalu Ribut</strong> — Anak susah bangun, semua serba buru-buru, mood pagi jadi rusak.
            </div>
            <div class="pain-item">
                <strong>❌ Tugas Gak Kelar-kelar</strong> — Kamu yang stres sendiri karena anak nunda-nunda terus.
            </div>
            <div class="pain-item">
                <strong>❌ Susah Fokus</strong> — Baru buka buku bentar, mata udah lari ke mainan atau hal lain.
            </div>
            <div class="pain-item">
                <strong>❌ Bingung Prioritas</strong> — Gak tahu harus ngapain duluan, akhirnya malah bengong dan gak ada yang selesai.
            </div>
            <div class="pain-item">
                <strong>❌ Ibu Jadi "Monster"</strong> — Capek ngomel tiap hari, suara habis, tapi gak ada perubahan.
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 1.1em;">
                Kalau iya... Tenang, kamu gak sendirian. Banyak orang tua ngerasain hal yang sama, apalagi buat anak yang punya tantangan di fokus dan pengaturan diri (Executive Functioning).
            </p>
        </div>
    </section>

    <!-- Solution Section -->
    <section class="solution-section">
        <div class="container">
            <h2>🧠 Solusinya: ADHD Executive Functioning Skill Pack</h2>
            <p style="font-size: 1.2em; max-width: 800px; margin: 0 auto;">
                Ini adalah paket printable lengkap yang didesain khusus buat bantu anak belajar mengatur waktu, fokus, dan menenangkan diri — dengan cara yang seru, visual, dan gampang dipahami!
            </p>
            <p style="font-size: 1.1em; margin-top: 20px;">
                <strong>Bukan sekadar kertas, tapi alat bantu agar otak anak lebih terstruktur.</strong>
            </p>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2>💡 Apa Aja yang Kamu Dapetin?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Daily Tracker & Goal Chart</h3>
                    <p>Bantu anak melihat progres hariannya secara visual. Mereka jadi bangga setiap kali bisa "ceklis" tugas yang selesai.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <h3>Behavior & Reward Chart</h3>
                    <p>Melatih tanggung jawab tanpa paksaan. Anak semangat berbuat baik karena bisa melihat hasilnya dan dapat reward kecil!</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">✅</div>
                    <h3>Routine Checklist (Pagi & Malam)</h3>
                    <p>Biar anak tahu urutan kegiatannya — Bangun ➡️ Mandi ➡️ Makan ➡️ Sekolah. Gak perlu diteriakin lagi!</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧘</div>
                    <h3>Calm Down & Breathing Sheet</h3>
                    <p>Teknik visual buat bantu anak mengatur emosi. Sangat berguna saat anak mulai tantrum, kesal, atau panik mengerjakan tugas.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Allowance & Kindness Tracker</h3>
                    <p>Bonus fitur biar anak belajar mengatur uang saku dan mencatat kebaikan yang mereka lakukan hari ini.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
        <div class="container">
            <h2>💬 Kenapa Banyak Orang Tua Suka Printable Ini?</h2>
            <div class="benefits-grid">
                <div class="benefit-item">
                    <div style="font-size: 3em; margin-bottom: 10px;">🎨</div>
                    <h3>Desain Visual & Colorful</h3>
                    <p>Anak visual (terutama ADHD) butuh warna biar gak bosan.</p>
                </div>
                <div class="benefit-item">
                    <div style="font-size: 3em; margin-bottom: 10px;">🖨️</div>
                    <h3>Tinggal Print & Pakai</h3>
                    <p>File digital, langsung sampai di emailmu detik ini juga.</p>
                </div>
                <div class="benefit-item">
                    <div style="font-size: 3em; margin-bottom: 10px;">🧠</div>
                    <h3>Ramah Otak</h3>
                    <p>Instruksinya pendek dan jelas, gak bikin anak pusing baca.</p>
                </div>
                <div class="benefit-item">
                    <div style="font-size: 3em; margin-bottom: 10px;">😌</div>
                    <h3>Anti Drama</h3>
                    <p>Mengurangi omelan, karena sistem yang bekerja buat kamu.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonial-section">
        <div class="container">
            <h2>⭐ Kata Mereka yang Sudah Mencoba</h2>
            <div class="testimonial-card">
                <p>"Anak saya biasanya susah banget disuruh fokus belajar, tapi sejak pakai printable ini dia jadi lebih semangat. Warnanya lucu, tampilannya jelas, dan dia jadi inget sendiri apa yang harus dikerjain."</p>
                <div class="testimonial-author">— Ibu Dinda (32 Th), Ibu Rumah Tangga</div>
            </div>
            <div class="testimonial-card">
                <p>"Jujur awalnya saya pikir ini cuma lembar kerja biasa. Tapi ternyata efektif banget. Sekarang dia bisa ngatur waktu main dan belajar sendiri. Sangat membantu kami!"</p>
                <div class="testimonial-author">— Pak Reza (35 Th), Ayah 2 Anak</div>
            </div>
            <div class="testimonial-card">
                <p>"Saya pakai chart ini di kelas buat anak-anak inklusif. Hasilnya luar biasa! Mereka senang tiap kali dapet bintang di reward chart-nya."</p>
                <div class="testimonial-author">— Ibu Maya (29 Th), Guru SD Inklusif</div>
            </div>
        </div>
    </section>

    <!-- Transformation Section -->
    <section class="transformation-section">
        <div class="container">
            <h2>✨ Coba Bayangin Deh, Moms...</h2>
            <ul class="transformation-list">
                <li>Anak kamu mulai bisa atur waktu sendiri tanpa diteriakin.</li>
                <li>Anak tahu kapan harus belajar, kapan boleh main gadget.</li>
                <li>Pagi hari kamu bisa ngopi dengan tenang karena anak sudah siap mandiri.</li>
                <li>Rumah jadi adem, hubungan sama anak makin dekat 🥰.</li>
            </ul>
            <p style="font-size: 1.2em; margin-top: 30px;"><strong>Semua itu bisa dimulai dari alat bantu yang tepat.</strong></p>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section" id="pricing">
        <div class="container">
            <h2 style="color: white;">💸 PROMO SPESIAL HARI INI!</h2>
            <div class="price-card">
                <h3>Full Pack Digital (PDF)</h3>
                <div class="old-price">Rp 299.000</div>
                <div class="new-price">Rp 149.000</div>
                <p style="color: #e53e3e; font-weight: bold; margin-bottom: 20px;">Hemat 50% - Harga bisa naik sewaktu-waktu!</p>
                <p>📦 Format: Digital PDF (Langsung Download)</p>
                <p>📅 Akses: Selamanya (Lifetime)</p>
                <p style="margin-bottom: 30px;">🔄 Bisa diprint berulang kali untuk adik/kakak!</p>
                <a href="#" class="cta-btn" style="display: inline-block; margin-top: 20px;">DOWNLOAD SEKARANG - RP 149RB</a>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <div class="container">
            <h2>❓ Pertanyaan yang Sering Diajukan</h2>
            <div class="faq-item">
                <h4>Q: Produk ini bentuknya apa sih?</h4>
                <p>A: Produk ini berbentuk file digital (PDF) kualitas tinggi. Link download akan dikirim otomatis ke email/WA setelah pembayaran. Kamu bisa print sendiri di rumah atau di fotokopian. Hemat ongkir!</p>
            </div>
            <div class="faq-item">
                <h4>Q: Cocok untuk anak usia berapa?</h4>
                <p>A: Sangat ideal untuk anak usia 4 - 12 tahun (TK sampai SD). Di usia ini, anak sedang belajar membangun kebiasaan (habit) dan executive function.</p>
            </div>
            <div class="faq-item">
                <h4>Q: Apakah bisa digunakan oleh guru atau terapis?</h4>
                <p>A: Bisa banget! Banyak guru SD inklusif dan terapis wicara/okupasi yang menggunakan lembar kerja ini sebagai media pendukung terapi atau manajemen kelas.</p>
            </div>
            <div class="faq-item">
                <h4>Q: Apakah harus untuk anak diagnosa ADHD saja?</h4>
                <p>A: Tidak harus. Anak neurotypical (umum) yang pelupa, susah fokus, atau susah diatur juga sangat terbantu dengan sistem visual seperti ini.</p>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="hero" style="padding: 60px 20px;">
        <div class="container">
            <h2 style="color: white; margin-bottom: 20px;">Siap Mulai Transformasi Anak Kamu?</h2>
            <p style="margin-bottom: 30px;">Jangan tunggu besok, mulai hari ini juga!</p>
            <a href="#pricing" class="cta-btn">YA, SAYA MAU SEKARANG!</a>
        </div>
    </section>
`;

export default function EbookAdhdLanding() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}