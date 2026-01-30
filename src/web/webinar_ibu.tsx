

const WebinarIbu = () => {
    // Countdown logic removed

    const videoTestimonials = [
        {
          name: "Agus Mulyadi, SH., MH.",
          title: "Kepala Intelijen Pangandaran",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/agus.jpg",
          thumbnail: "🎖️"
        },
        {
          name: "Dr. Gumilar",
          title: "Hipnoterapist & Pemimpin Yayasan",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/dr.jpg",
          thumbnail: "⚕️"
        },
        {
          name: "Habib Umar",
          title: "Pemimpin Pondok Pesantren Atsaqofah",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/habib.jpg",
          thumbnail: "🕌"
        },
        {
          name: "Umi Jamilah",
          title: "Pemimpin Yayasan",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/umi.jpg",
          thumbnail: "👳‍♀️"
        },
        {
          name: "Felicia",
          title: "Pengusaha",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/felicia.jpg",
          thumbnail: "👩‍💼"
        },
        {
          name: "Lena",
          title: "Klien eL Vision",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/lena.jpg",
          thumbnail: "🌟"
        },
        {
          name: "Vio",
          title: "Klien eL Vision",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/vio2.jpg",
          thumbnail: "✨"
        },
        {
          name: "Arif",
          title: "Klien eL Vision",
          videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.mp4",
          poster: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif_inte.jpg",
          thumbnail: "👨‍💻"
        }
    ];
    


    return (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            background: "linear-gradient(135deg, #fdfbf7 0%, #fff1f2 100%)", // Rose/warm tint for mother theme
            color: "#2d2d2d",
            lineHeight: 1.6
        }}>
            <div style={{
                maxWidth: "680px",
                margin: "0 auto",
                padding: "20px"
            }}>
                {/* Header Branding */}
                <div style={{
                    textAlign: "center",
                    padding: "20px 0",
                    marginBottom: "20px"
                }}>
                    <div style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        color: "#be123c", // Rose color
                        letterSpacing: "2px"
                    }}>eL VISION</div>
                    <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>Official Webinar Series</div>
                </div>

                {/* Hero Section - The Hook */}
                <div style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    background: "white",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    boxShadow: "0 10px 30px rgba(190, 18, 60, 0.1)",
                    border: "1px solid rgba(190, 18, 60, 0.1)"
                }}>
                    <span style={{ 
                        background: "#ffe4e6", 
                        color: "#be123c", 
                        padding: "10px 25px", 
                        borderRadius: "50px", 
                        fontSize: "20px", // BIG FONT updated here
                        fontWeight: "900",
                        marginBottom: "25px",
                        display: "inline-block",
                        letterSpacing: "1px",
                        border: "2px solid #fecdd3"
                    }}>KHUSUS IBU YANG LELAH MENTAL</span>
                    
                    <h1 style={{
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#1a1a1a",
                        marginBottom: "15px",
                        lineHeight: 1.3
                    }}>Bunda, Jujur... Sebenarnya Bunda Sedang Menunggu Bom Waktu Meledak, Kan?</h1>
                    
                    <p style={{
                        fontSize: "16px",
                        color: "#444",
                        marginBottom: "0px",
                        lineHeight: 1.6
                    }}>Badan ada di rumah, tapi pikiran keliling dunia mencari masalah yang belum tentu terjadi.</p>
                </div>

                {/* The Voices (Specific Pain) */}
                <div style={{
                    background: "#fff",
                    padding: "30px 25px",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    borderLeft: "5px solid #be123c"
                }}>
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#be123c",
                        marginBottom: "20px"
                    }}>Apakah Ini Suara di Kepala Bunda Setiap Malam?</h2>
                    
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

                {/* Deep Agitation - Logic Trap */}
                <div style={{
                    padding: "20px 10px",
                    marginBottom: "30px"
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px", textAlign: "center", color: "#1a1a1a" }}>Banting Tulang Tapi Jalan di Tempat</h2>
                    
                    <p style={{ marginBottom: "15px" }}>
                        Bunda merasa sudah lari sekuat tenaga, tapi hidup rasanya seperti di atas <em>treadmill</em>.
                    </p>
                    <ul style={{ paddingLeft: "20px", marginBottom: "20px", color: "#444" }}>
                        <li style={{ marginBottom: "10px" }}>Kerjaan atau bisnis stagnan, segini-gini aja.</li>
                        <li style={{ marginBottom: "10px" }}>Harga kebutuhan naik, uang belanja cuma "numpang lewat".</li>
                        <li style={{ marginBottom: "10px" }}>Dunia rasanya jahat, penuh masalah, dan Bunda merasa sendirian memikul beban ini.</li>
                    </ul>
                    
                    <div style={{
                        background: "#fff1f2",
                        padding: "20px",
                        borderRadius: "15px",
                        textAlign: "center",
                        border: "1px dashed #be123c",
                        color: "#881337"
                    }}>
                        <strong>Logika Bunda berteriak:</strong><br/>
                        <em>"Saya harus mikir keras biar selamat!"</em><br/><br/>
                        Tapi kenyataannya? Semakin Bunda mikir keras, semakin Bunda <strong>tenggelam</strong>.
                    </div>
                </div>

                {/* The Cockroach Effect (Highlight) */}
                <div style={{
                    background: "#1a1a1a",
                    color: "white",
                    padding: "40px 25px",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px", color: "#f43f5e" }}>HUKUM KECOA TERBANG: Masalah Mengejar Orang yang Takut</h2>
                    
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                        Pernah perhatikan? Orang yang paling takut, paling histeris saat melihat kecoa, justru adalah orang yang <strong>dikejar dan dihinggapi</strong> kecoa itu.
                    </p>
                    
                    <p style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                        Begitu juga nasib Bunda. Semakin Bunda <strong>Overthinking</strong>, semakin Bunda memancarkan aroma <strong>"KETAKUTAN"</strong>.
                    </p>
                    
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                        <p style={{ margin: 0 }}>Takut uang habis? 👉 <strong>Pengeluaran tak terduga datang.</strong></p>
                        <p style={{ margin: "10px 0" }}>Takut suami selingkuh? 👉 <strong>Suami makin menjauh.</strong></p>
                        <p style={{ margin: 0 }}>Takut anak sakit? 👉 <strong>Anak jadi rewel & lemah.</strong></p>
                    </div>

                    <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Mau sampai kapan Bunda jadi magnet masalah?
                    </p>
                </div>

                {/* The Solution - The Shift */}
                <div style={{
                    background: "white",
                    padding: "30px 25px",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                }}>
                    <h2 style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>Buang Rasa Takut Itu Seperti Angin Lalu</h2>
                    
                    <p style={{ marginBottom: "20px", textAlign: "center", color: "#444" }}>
                        Di webinar ini, kita tidak akan pakai teori motivasi basi. Kita akan lakukan <strong>Operasi Pikiran</strong>.
                    </p>

                    <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "15px", border: "1px solid #bbf7d0", marginBottom: "20px" }}>
                        <p style={{ fontWeight: "bold", color: "#166534", marginBottom: "10px", textAlign: "center" }}>✨ BESOK PAGI BUNDA BANGUN DENGAN:</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li style={{ padding: "8px 0", borderBottom: "1px dashed #bbf7d0", color: "#15803d" }}>✅ Dada yang biasanya sesak, tiba-tiba <strong>PLONG</strong>.</li>
                            <li style={{ padding: "8px 0", borderBottom: "1px dashed #bbf7d0", color: "#15803d" }}>✅ Ketakutan masa depan <strong>HILANG</strong>, diganti rasa yakin.</li>
                            <li style={{ padding: "8px 0", color: "#15803d" }}>✅ Suara berisik di kepala itu <strong>DIAM</strong>. Hening. Damai.</li>
                        </ul>
                    </div>

                    <p style={{ textAlign: "center", fontStyle: "italic" }}>
                        Kita cabut akar ketakutannya. Saat rasa takut hilang, "kecoa" masalah akan pergi dengan sendirinya.
                    </p>
                </div>

                {/* Authority - eL Reyzandra */}
                <div style={{
                    background: "white",
                    padding: "30px 20px",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    border: "1px solid #eee"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael1.jpeg" alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '9/16' }} />
                        <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/siapael/siapael2.jpeg" alt="eL Reyzandra" style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', aspectRatio: '1/1' }} />
                    </div>
                    
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#be123c", marginBottom: "5px" }}>Siapa eL Reyzandra?</h2>
                        <div style={{ fontSize: "13px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>The Mind Engineer</div>
                    </div>

                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#333" }}>
                        Selama 16 tahun, saya meneliti bagaimana <strong>Alam Bawah Sadar</strong> mengendalikan 95% hidup manusia. 
                    </p>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "15px", color: "#333" }}>
                        Saya bukan motivator. Saya adalah "Insinyur Pikiran". Saya membongkar kabel yang korslet (trauma & overthinking), dan memasang instalasi baru (ketenangan & magnet rezeki).
                    </p>
                    
                    <div style={{ background: "#1a1a1a", color: "#c4975f", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>
                        "Bahagia Adalah Koentji"
                    </div>
                </div>

                {/* Video Testimonials */}
                <div style={{
                    marginBottom: "40px"
                }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", textAlign: "center" }}>Mereka yang Sudah "Waras" Kembali</h2>
                    
                    <div style={{ 
                        display: "flex", 
                        overflowX: "auto", 
                        gap: "15px", 
                        paddingBottom: "15px", 
                        scrollSnapType: "x mandatory"
                    }}>
                        {videoTestimonials.map((testi, idx) => (
                            <div key={idx} style={{ 
                                minWidth: "260px", 
                                background: "white", 
                                borderRadius: "15px", 
                                padding: "15px",
                                scrollSnapAlign: "center",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                            }}>
                                <video 
                                    controls 
                                    poster={testi.poster} 
                                    style={{ width: "100%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover", marginBottom: "10px", backgroundColor: "#000" }}
                                >
                                    <source src={testi.videoUrl} type="video/mp4" />
                                </video>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1a1a1a" }}>{testi.name}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>{testi.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Webinar Curriculum */}
                <div style={{
                    background: "white",
                    padding: "30px 25px",
                    borderRadius: "25px",
                    marginBottom: "30px",
                    border: "2px solid #be123c"
                }}>
                    <div style={{ 
                        background: "#be123c", 
                        color: "white", 
                        display: "inline-block", 
                        padding: "5px 15px", 
                        borderRadius: "20px", 
                        fontSize: "12px", 
                        fontWeight: "bold",
                        marginBottom: "15px"
                    }}>MATERI EKSKLUSIF</div>
                    
                    <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "25px", color: "#1a1a1a" }}>WEBINAR: "DETOKS PIKIRAN IBU"</h2>
                    
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                            <div style={{ background: "#fff1f2", color: "#be123c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>1</div>
                            <div>
                                <strong style={{ color: "#be123c" }}>Teknik "Sakelar Otak"</strong>
                                <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#444" }}>Cara mematikan overthinking dalam 30 detik saat serangan panik datang.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                            <div style={{ background: "#fff1f2", color: "#be123c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>2</div>
                            <div>
                                <strong style={{ color: "#be123c" }}>Reset Bawah Sadar</strong>
                                <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#444" }}>Menghapus program "Saya Ibu Gagal" dan menggantinya dengan "Ibu Bahagia".</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "15px" }}>
                            <div style={{ background: "#fff1f2", color: "#be123c", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>3</div>
                            <div>
                                <strong style={{ color: "#be123c" }}>Aura Magnet Keluarga</strong>
                                <p style={{ fontSize: "14px", margin: "5px 0 0 0", color: "#444" }}>Otomatis membuat anak nurut dan suami setia, tanpa Bunda perlu banyak bicara.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & CTA Section */}
                <div style={{
                    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                    color: "white",
                    padding: "40px 25px",
                    borderRadius: "30px",
                    marginBottom: "40px",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                }}>
                    {/* Countdown and warning removed here */}

                    <h2 style={{ marginTop: "20px", fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Investasi Ketentraman Bunda</h2>
                    
                    <p style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "20px" }}>
                        Biasanya, satu sesi dihargai:
                    </p>
                    
                    <div style={{ fontSize: "20px", textDecoration: "line-through", color: "#64748b", marginBottom: "5px" }}>Rp 5.000.000,-</div>
                    
                    <div style={{ 
                        fontSize: "42px", 
                        fontWeight: 900, 
                        color: "#fbbf24", 
                        marginBottom: "10px",
                        textShadow: "0 2px 10px rgba(251, 191, 36, 0.3)" 
                    }}>Rp 200.000,-</div>
                    
                    <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "30px" }}>
                        (Setara harga sekali makan keluarga di mall)
                    </p>

                    {/* Sticky CTA Button */}
                    <button 
                        onClick={() => window.open('https://your-checkout-link.com', '_blank')}
                        style={{
                            background: "linear-gradient(to bottom, #fbbf24, #d97706)",
                            color: "#000",
                            width: "100%",
                            padding: "20px",
                            borderRadius: "50px",
                            border: "none",
                            fontSize: "18px",
                            fontWeight: 900,
                            cursor: "pointer",
                            boxShadow: "0 4px 0 #b45309, 0 10px 20px rgba(251, 191, 36, 0.3)",
                            transition: "transform 0.1s",
                            marginBottom: "15px"
                        }}
                    >
                        👉 SAYA MAU BOOK WEBINAR SEKARANG
                    </button>
                    
                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                        🔒 Melewatkan kesempatan langka ini hanya 200 ribu, tapi Anda akan rugi seumur hidup jika tidak mencoba.
                    </p>
                </div>

                {/* Footer */}
                <div style={{ textAlign: "center", paddingBottom: "30px", color: "#9ca3af", fontSize: "12px" }}>
                    <p style={{ marginBottom: "5px", fontWeight: "bold" }}>eL Vision Group</p>
                    <p>"Bahagia Adalah Koentji"</p>
                </div>
            </div>
        </div>
    );
};

export default WebinarIbu;