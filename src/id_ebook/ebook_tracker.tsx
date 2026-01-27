
const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #1a1a2e;
        overflow-x: hidden;
    }

    .hero {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        padding: 80px 20px 100px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .hero::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
        animation: pulse 15s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }

    .hero-content {
        max-width: 900px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }

    .chaos-icon {
        font-size: 80px;
        margin-bottom: 20px;
        animation: shake 2s ease-in-out infinite;
    }

    @keyframes shake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }

    h1 {
        font-size: 3em;
        color: #fff;
        margin-bottom: 20px;
        text-shadow: 0 4px 20px rgba(168, 85, 247, 0.5);
        line-height: 1.2;
    }

    .highlight {
        color: #a855f7;
        font-weight: bold;
    }

    .subheadline {
        font-size: 1.3em;
        color: #e0e0e0;
        margin-bottom: 40px;
        font-weight: 300;
    }

    .cta-button {
        background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
        color: white;
        padding: 18px 50px;
        font-size: 1.2em;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(168, 85, 247, 0.6);
    }

    .section {
        padding: 80px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .dark-section {
        background: linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%);
        color: #fff;
    }

    .light-section {
        background: linear-gradient(180deg, #f8f7ff 0%, #e9d5ff 100%);
    }

    h2 {
        font-size: 2.5em;
        margin-bottom: 40px;
        text-align: center;
        position: relative;
    }

    .dark-section h2 {
        color: #a855f7;
    }

    .light-section h2 {
        color: #6b21a8;
    }

    .problem-list {
        list-style: none;
        margin-bottom: 30px;
    }

    .problem-item {
        background: rgba(220, 38, 38, 0.1);
        border-left: 4px solid #dc2626;
        padding: 20px;
        margin-bottom: 15px;
        border-radius: 8px;
        font-size: 1.1em;
        display: flex;
        align-items: center;
        transition: transform 0.3s ease;
    }

    .problem-item:hover {
        transform: translateX(10px);
    }

    .problem-item::before {
        content: '❌';
        margin-right: 15px;
        font-size: 1.5em;
    }

    .solution-box {
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        padding: 60px 40px;
        border-radius: 20px;
        text-align: center;
        margin: 40px 0;
        box-shadow: 0 20px 60px rgba(168, 85, 247, 0.3);
    }

    .solution-box h3 {
        font-size: 2.5em;
        color: #fff;
        margin-bottom: 20px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .solution-box p {
        font-size: 1.3em;
        color: #f3e8ff;
        margin-bottom: 10px;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .feature-card {
        background: rgba(168, 85, 247, 0.05);
        border: 2px solid #a855f7;
        padding: 30px;
        border-radius: 15px;
        transition: all 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(168, 85, 247, 0.3);
        background: rgba(168, 85, 247, 0.1);
    }

    .feature-icon {
        font-size: 3em;
        margin-bottom: 15px;
    }

    .feature-card h4 {
        color: #a855f7;
        font-size: 1.5em;
        margin-bottom: 15px;
    }

    .steps {
        display: flex;
        justify-content: space-around;
        margin: 40px 0;
        flex-wrap: wrap;
    }

    .step {
        text-align: center;
        flex: 1;
        min-width: 200px;
        margin: 20px;
    }

    .step-number {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        font-weight: bold;
        margin: 0 auto 20px;
        box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
    }

    .testimonials {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .testimonial-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(107, 33, 168, 0.1);
        border-top: 4px solid #a855f7;
    }

    .testimonial-text {
        font-style: italic;
        margin-bottom: 20px;
        color: #4a5568;
        line-height: 1.8;
    }

    .testimonial-author {
        font-weight: bold;
        color: #6b21a8;
    }

    .pricing-box {
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        padding: 60px;
        border-radius: 20px;
        text-align: center;
        margin: 40px auto;
        max-width: 600px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .old-price {
        text-decoration: line-through;
        color: #9ca3af;
        font-size: 1.5em;
        margin-bottom: 10px;
    }

    .new-price {
        font-size: 3.5em;
        color: #a855f7;
        font-weight: bold;
        margin-bottom: 30px;
        text-shadow: 0 4px 20px rgba(168, 85, 247, 0.5);
    }

    .guarantee {
        background: rgba(168, 85, 247, 0.1);
        border: 2px dashed #a855f7;
        padding: 20px;
        border-radius: 10px;
        margin: 30px 0;
        text-align: center;
    }

    .emoji-large {
        font-size: 3em;
        margin-bottom: 20px;
        display: block;
    }

    .check-list {
        list-style: none;
        text-align: left;
        max-width: 600px;
        margin: 30px auto;
    }

    .check-item {
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        font-size: 1.1em;
    }

    .check-item::before {
        content: '✅';
        margin-right: 15px;
        font-size: 1.5em;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2em;
        }

        h2 {
            font-size: 1.8em;
        }

        .hero {
            padding: 60px 20px;
        }

        .section {
            padding: 60px 20px;
        }
    }
`;

const htmlContent = `
    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-content">
            <div class="chaos-icon">😵‍💫</div>
            <h1>Pusing Mantau Investasi<br>di <span class="highlight">Banyak Platform?</span></h1>
            <p class="subheadline">Aset Berantakan & Gak Tau Profit Sebenarnya?<br>Pantau Saham, Crypto, Reksadana & Cash dalam Satu Dashboard Otomatis!</p>
            <button class="cta-button" onclick="window.location.href='#order'">Dapatkan Invest Tracker Sekarang</button>
        </div>
    </div>

    <!-- Problem Section -->
    <div class="section dark-section">
        <h2>Kamu Pasti Pernah Ngalamin Ini...</h2>
        <ul class="problem-list">
            <li class="problem-item">Aset kepecah di mana-mana: sekuritas, exchange, wallet, reksadana</li>
            <li class="problem-item">Tiap mau cek untung-rugi harus hitung manual satu-satu</li>
            <li class="problem-item">Harga aset beda-beda di tiap platform bikin bingung</li>
            <li class="problem-item">Gak pernah tau total profit sebenarnya berapa (cuma kira-kira doang)</li>
            <li class="problem-item">Mau rebalancing tapi datanya kacau balau</li>
        </ul>
        <p style="font-size: 1.3em; text-align: center; margin-top: 30px; color: #e0e0e0;">
            "Capek banget kan rasanya harus ngitung manual modal, average price, profit, ROR… belum lagi kalo salah rumus?" 😮‍💨
        </p>
    </div>

    <!-- Solution Section -->
    <div class="section light-section">
        <h2>Tenang, Kamu Gak Sendirian!</h2>
        <p style="text-align: center; font-size: 1.2em; margin-bottom: 40px; color: #4a5568;">
            Ribuan investor juga ngalamin hal yang sama. Solusinya?
        </p>
        
        <div class="solution-box">
            <h3>✨ Invest Tracker Omnitracker ✨</h3>
            <p>Sebuah template simpel—tapi powerful—untuk memantau SEMUA aset kamu dalam satu dashboard.</p>
            <p style="font-size: 1.5em; margin-top: 20px; font-weight: bold;">Tinggal masukin transaksi… Dan Jreng! ✨</p>
        </div>

        <ul class="check-list" style="color: #1a1a2e;">
            <li class="check-item">Gak perlu input harga manual</li>
            <li class="check-item">Gak perlu ribet tracking satu-satu</li>
            <li class="check-item">Gak perlu pusing lagi ngitung profit</li>
        </ul>
    </div>

    <!-- Features Section -->
    <div class="section dark-section">
        <h2>Apa yang Bisa Kamu Lakukan dengan Template Ini?</h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">📈</div>
                <h4>Auto-Update via Google Finance</h4>
                <p>Harga saham & crypto update otomatis. Kamu gak perlu input harga manual setiap hari.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">👁️</div>
                <h4>All-in-One Portfolio View</h4>
                <p>Punya aset di Ajaib, Indodax, Bibit, Binance? Semuanya digabung jadi satu grafik yang cantik.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">💲</div>
                <h4>Multi-Currency Support</h4>
                <p>Mau IDR, USD, EUR? Tinggal pilih di awal, seluruh sheet otomatis menyesuaikan.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">⚖️</div>
                <h4>Fitur Rebalancing Otomatis</h4>
                <p>Pengen alokasi 60% Saham – 40% Crypto? Tab rebalancing bakal kasih tau kamu harus geser dana berapa.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔍</div>
                <h4>Watchlist Fundamental</h4>
                <p>Pantau calon aset incaran lengkap dengan data fundamentalnya sebelum entry.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h4>Dashboard Interaktif</h4>
                <p>Visualisasi performa portfolio kamu dengan grafik yang mudah dipahami dan eye-catching.</p>
            </div>
        </div>
    </div>

    <!-- Comparison Section -->
    <div class="section light-section">
        <h2>Kenapa Template Ini Beda dari Excel Biasa?</h2>
        <p style="text-align: center; font-size: 1.3em; margin-bottom: 40px; color: #4a5568;">
            Karena semua rumus, dashboard, dan alur sudah jadi!
        </p>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <ul class="check-list" style="color: #1a1a2e;">
                <li class="check-item">Kamu gak perlu ngerti rumus Excel yang njelimet</li>
                <li class="check-item">Kamu gak perlu ngulik desain dashboard berjam-jam</li>
                <li class="check-item">Cukup download, isi, dan gunakan langsung!</li>
            </ul>
        </div>

        <h3 style="text-align: center; font-size: 2em; margin: 50px 0 30px; color: #6b21a8;">Cukup 3 Langkah:</h3>
        
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <h4 style="color: #6b21a8; font-size: 1.3em;">Set Currency</h4>
                <p style="color: #4a5568;">Pilih mata uang utama kamu</p>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <h4 style="color: #6b21a8; font-size: 1.3em;">Input Transaksi</h4>
                <p style="color: #4a5568;">Masukkan data beli/jual kamu</p>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <h4 style="color: #6b21a8; font-size: 1.3em;">Selesai!</h4>
                <p style="color: #4a5568;">Biarkan template bekerja otomatis</p>
            </div>
        </div>
    </div>

    <!-- What's Inside Section -->
    <div class="section dark-section">
        <h2>Apa yang Kamu Dapatkan di Dalamnya?</h2>
        <p style="text-align: center; font-size: 1.3em; margin-bottom: 40px;">Total ada <span class="highlight">9 Tab Siap Pakai:</span></p>
        
        <ul class="check-list">
            <li class="check-item">Step-by-step Instructions (Panduan lengkap)</li>
            <li class="check-item">Start & Setup Tab</li>
            <li class="check-item">Watchlist & Transaction Tracker</li>
            <li class="check-item">Account Registry</li>
            <li class="check-item">Investment Dashboard (Menu Utama)</li>
            <li class="check-item">Portfolio Summary & Rebalance</li>
            <li class="check-item">Performance Analytics</li>
            <li class="check-item">Tax Calculator Helper</li>
            <li class="check-item">BONUS: Video Tutorial Setup</li>
        </ul>
    </div>

    <!-- Testimonials Section -->
    <div class="section light-section">
        <h2>Apa Kata Mereka yang Sudah Pakai?</h2>
        
        <div class="testimonials">
            <div class="testimonial-card">
                <p class="testimonial-text">"Dulu aku tracking manual di Excel, bikin emosi. Setelah pakai template ini, semuanya auto. Bahkan tau aset yang rugi ternyata gede 😭 Jadi bisa langsung action!"</p>
                <p class="testimonial-author">— Putra Sariwangi<br><small>Owner Bisnis Aksesoris HP</small></p>
            </div>
            
            <div class="testimonial-card">
                <p class="testimonial-text">"Dashboardnya rapi banget, langsung ngerti kondisi portofolio. Mantau jadi fun! Sekarang gak pernah skip daily check lagi."</p>
                <p class="testimonial-author">— Parno Suryajana<br><small>Owner Jasa Jual-Beli Kucing</small></p>
            </div>
            
            <div class="testimonial-card">
                <p class="testimonial-text">"Worth it banget. Sangat membantu buat investor pemula yang mau tracking dengan benar. Formulas-nya udah lengkap semua!"</p>
                <p class="testimonial-author">— Ari Yudi<br><small>Jualan Alat Dapur</small></p>
            </div>
        </div>
    </div>

    <!-- Pricing Section -->
    <div class="section dark-section" id="order">
        <h2 style="color: #fff;">Ready Buat Mantau Investasi Kayak Pro Tanpa Ribet?</h2>
        
        <div class="pricing-box">
            <p style="color: #e0e0e0; font-size: 1.2em; margin-bottom: 20px;">Harga Normal:</p>
            <p class="old-price">Rp 499.000</p>
            
            <p style="color: #fbbf24; font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">🔥 Khusus Bulan Ini:</p>
            <p class="new-price">Rp 149.000</p>
            
            <p style="color: #e0e0e0; margin-bottom: 30px;">Hemat Rp 350.000!</p>
            
            <button class="cta-button" style="width: 100%; max-width: 400px;">Dapatkan Template Sekarang - Rp 149rb</button>
        </div>

        <div class="guarantee">
            <span class="emoji-large">🛡️</span>
            <h3 style="color: #a855f7; margin-bottom: 15px;">Garansi 100% Kepuasan</h3>
            <p style="color: #e0e0e0;">Jika file rusak atau tidak bisa dibuka, kami ganti baru atau bantu sampai bisa. Investasi kamu terlindungi!</p>
        </div>
    </div>

    <!-- Final CTA -->
    <div class="section light-section" style="text-align: center;">
        <span class="emoji-large">⏰</span>
        <h2 style="color: #6b21a8;">Jangan Tunda Lagi!</h2>
        <p style="font-size: 1.3em; margin-bottom: 40px; color: #4a5568;">
            Mulai tracking investasi kamu dengan cara yang benar. Ribuan investor sudah lebih tenang dengan Invest Tracker Omnitracker.
        </p>
        <button class="cta-button" onclick="window.location.href='#order'">Ya, Saya Mau Template Ini Sekarang!</button>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em;">
            © 2025 Invest Tracker Omnitracker. All Rights Reserved.
        </p>
    </div>
`;

export default function EbookTrackerLanding() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}