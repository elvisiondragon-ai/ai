import { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, Phone, ArrowRight, Sparkles, Shield, Check, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackCustomEvent,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';

export default function ELVision15K() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {
    try {
      await waitForFbp();
      const { data: { session } } = await supabase.auth.getSession();
      const body: any = {
        pixelId: '3319324491540889',
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
      };

      const { fbc, fbp } = getFbcFbpCookies();
      const userData: any = {
        client_user_agent: navigator.userAgent,
      };

      if (session?.user?.email) userData.email = session.user.email;
      if (session?.user?.user_metadata?.phone) userData.phone = session.user.user_metadata.phone;
      
      let rawName = session?.user?.user_metadata?.full_name;
      if (rawName) {
        const nameParts = rawName.trim().split(/\s+/);
        userData.fn = nameParts[0];
        if (nameParts.length > 1) userData.ln = nameParts.slice(1).join(' ');
      }

      if (session?.user?.id) {
        userData.external_id = session.user.id;
      } else if (user?.id) {
        userData.external_id = user.id;
      }
      
      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      
      body.userData = userData;

      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  // Facebook Pixel Code
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pixelId = '3319324491540889';
      initFacebookPixelWithLogging(pixelId);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);
      sendCapiEvent('PageView', {}, pageEventId);
    }
  }, []);

  const videoTestimonials = [
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Kepala Intelijen Pangandaran",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4",
      thumbnail: "🎖️"
    },
    {
      name: "Dr. Gumilar",
      title: "Hipnoterapist & Pemimpin Yayasan",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4",
      thumbnail: "⚕️"
    },
    {
      name: "Habib Umar",
      title: "Pemimpin Pondok Pesantren Atsaqofah",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4",
      thumbnail: "🕌"
    },
    {
      name: "Umi Jamilah",
      title: "Pemimpin Yayasan",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4",
      thumbnail: "👳‍♀️"
    },
    {
      name: "Felicia",
      title: "Pengusaha",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4",
      thumbnail: "👩‍💼"
    },
    {
      name: "Lena",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4",
      thumbnail: "🌟"
    },
    {
      name: "Vio",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
      thumbnail: "✨"
    },
    {
      name: "Arif",
      title: "Klien eL Vision",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4",
      thumbnail: "👨‍💻"
    }
  ];

  const testimonials = [
    {
      name: "Felicia Quincy",
      title: "Instagram: @itsfelicia.quincy, @felicia.quincy",
      verified: true,
      image: "👩‍💼",
      rating: 5,
      text: "Mengikuti program 6 minggu membuat saya dari cemas dan overthinking, awalnya semua keputusan saya kabur dan sangat sulit untuk maju, setelah program saya bisa melihat hal-hal lebih jelas dan juga ketika getaran saya jelas, realitas, koneksi dan keuangan saya menjadi lebih baik. Luar biasa"
    },
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Kepala Intelijen Pangandaran, Indonesia",
      verified: true,
      image: "👨‍💼",
      rating: 5,
      text: "Sebagai kepala intelijen di Indonesia saya memiliki banyak tugas sulit dan tanggung jawab yang mustahil untuk diputuskan, dengan meditasi 6 minggu saya memiliki intuisi super untuk mendapatkan hasil terbaik dari pekerjaan saya"
    },
    {
      name: "Dr. Gumilar",
      title: "Dokter & Hipnoterapis (20+ Tahun)",
      verified: true,
      image: "⚕️",
      rating: 5,
      text: "Sebagai dokter dan hipnoterapis selama lebih dari 20 tahun, saya MENYADARI hipnoterapi saya sudah ketinggalan zaman, melakukan metode eL Vision selama 6 minggu sepenuhnya mengubah perspektif saya dan melihat bahwa metode modern ini memberikan hasil yang cepat"
    },
    {
      name: "Suryadi",
      title: "Yayasan Aisyah - Mengelola 100+ Panti Asuhan",
      verified: true,
      image: "🌟",
      rating: 5,
      text: "Kami mengelola ratusan panti asuhan dan memberikan mereka beasiswa ke perguruan tinggi terbaik di seluruh dunia. Bagian tersulit adalah mendapatkan donatur yang memahami nilainya, dengan meditasi mendalam bersama eL, luar biasa dan membuat saya lebih mudah bertemu donatur yang tepat"
    },
    {
      name: "David Sutanto",
      title: "CEO Tech Startup, Valuasi $50M",
      image: "💎",
      rating: 5,
      text: "Uang bukan lagi masalah, tapi masalah terus datang. Setelah 1:1 dengan eL Vision, saya paham: yang hilang bukan strategi, tapi kalibrasi energi. Sekarang bisnis berkembang tanpa drama."
    },
    {
      name: "Linda Permata",
      title: "Investor Real Estate & Pengusaha",
      image: "👩‍💼",
      rating: 5,
      text: "Saya pikir saya sudah 'selesai' secara finansial. Ternyata ada level berikutnya: manifestasi tanpa paksaan. Rp 15 juta adalah investasi terbaik dibandingkan seminar Rp 50 juta yang hanya teori."
    },
    {
      name: "Budi Hermawan",
      title: "Pemilik Grup Manufaktur",
      image: "🎯",
      rating: 5,
      text: "6 minggu mengubah 15 tahun pola pikir. Kekayaan ada, tapi kedamaian tidak. Sekarang saya mengerti: kemakmuran sejati dimulai dengan 1% fokus yang tepat."
    },
    {
      name: "Arif",
      title: "Klien eL Vision, Instagram: @syarifuddi",
      verified: true,
      image: "👨‍💻",
      rating: 5,
      text: "Saya didiagnosis kanker otak stadium 4 dan divonis mati 3 bulan kemudian, sekarang sudah 1 tahun lebih saya hidup dan lebih baik dari sebelumnya, tehnik ini bukan tehnik biasa"
    }
  ];

  const weeklyProgram = [
    {
      week: "Minggu 0",
      title: "Sebelum Program",
      description: "Masalah, pikiran kabur, sakit kepala, takut, ragu",
      color: "from-red-900/30 to-gray-900",
      borderColor: "border-red-900/50"
    },
    {
      week: "Minggu 1",
      title: "Pergeseran Awal",
      description: "Mulai merasa lebih mudah melihat hari demi hari dan kegembiraan",
      color: "from-orange-900/30 to-gray-900",
      borderColor: "border-orange-900/50"
    },
    {
      week: "Minggu 2",
      title: "Koneksi Lebih Dalam",
      description: "Memperdalam rasa realitas Anda, dari visual, mendengar bahkan merasakan kinetik, Anda mulai terhubung dengan realitas dengan kegembiraan",
      color: "from-yellow-900/30 to-gray-900",
      borderColor: "border-yellow-900/50"
    },
    {
      week: "Minggu 3",
      title: "Keselarasan & Aliran",
      description: "Kebahagiaan mulai mengalir otomatis dalam kehadiran Anda, karena sekarang Anda Selaras dengan tujuan Anda, semua jawaban yang mungkin mulai mengungkapkan dirinya kepada Anda",
      color: "from-green-900/30 to-gray-900",
      borderColor: "border-green-900/50"
    },
    {
      week: "Minggu 4",
      title: "Hasil Mulai Terlihat",
      description: "Mulai mengumpulkan hasil langkah demi langkah",
      color: "from-blue-900/30 to-gray-900",
      borderColor: "border-blue-900/50"
    },
    {
      week: "Minggu 5",
      title: "Hasil Semakin Dalam",
      description: "Hasil Semakin Dekat saat frekuensi Anda semakin selaras dengan tujuan Anda",
      color: "from-purple-900/30 to-gray-900",
      borderColor: "border-purple-900/50"
    },
    {
      week: "Minggu 6",
      title: "Pencapaian",
      description: "Hasil tercapai",
      color: "from-yellow-500/30 to-amber-500/30",
      borderColor: "border-yellow-500/50"
    }
  ];

  const goals = [
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "KEKAYAAN",
      description: "Manifestasi kesadaran kekayaan tanpa kecemasan. Uang mengalir secara alami."
    },
    {
      icon: <Crown className="w-12 h-12" />,
      title: "KEKUASAAN",
      description: "Kepemimpinan yang berakar pada kejelasan. Pengaruh organik dan berkelanjutan."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "CINTA",
      description: "Hubungan yang autentik dan mendalam. Kehadiran magnetik alami."
    }
  ];

  // Audio Player Component
  const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
          // @ts-ignore
          if (typeof (window as any).fbq === 'function') {
            // @ts-ignore
            (window as any).fbq('trackCustom', 'AudioPlayed', {
              audio_src: audioRef.current.src,
            });
          }
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
      }
    }, []);

    return (
      <div className="flex items-center justify-center p-4">
        <button
          onClick={togglePlayPause}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/50"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Jeda Audio' : 'Putar Audio'}
        </button>
        <audio ref={audioRef} src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/audio/el.mp3" preload="auto" className="hidden" />
      </div>
    );
  };

  // Video Testimonial Component
  const VideoTestimonial = ({ testimonial }: { testimonial: any }) => {
    const videoRef = useRef(null);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{testimonial.thumbnail}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
            <p className="text-sm text-gray-400">{testimonial.title}</p>
          </div>
        </div>
        
        <video 
          ref={videoRef}
          className="w-full rounded-lg"
          controls
          preload="metadata"
          playsInline
          webkit-playsinline="true"
        >
          <source src={testimonial.videoUrl} type="video/mp4" />
          Browser Anda tidak mendukung pemutaran video.
        </video>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black to-black" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">EKSKLUSIF UNTUK HIGH ACHIEVERS</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              SISTEM 1:1
            </span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-300 mb-4 font-light">
            eL Vision Premium Coaching
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-500 text-yellow-500" />
            ))}
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Untuk mereka yang sudah memiliki segalanya, namun masih mencari sesuatu yang lebih dalam
          </p>

          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm mb-6">
            <div className="text-5xl font-bold text-yellow-400 mb-2">Rp 15.000.000</div>
            <div className="text-xl text-gray-300 mb-1">6 Minggu • 6 Sesi Private (60 menit/sesi)</div>
            <div className="text-sm text-gray-400">1 Sesi per Minggu</div>
          </div>

          {/* Money Back Guarantee Box */}
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto backdrop-blur-sm mb-8">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xl font-bold text-blue-400 uppercase tracking-wider">Money Back Guarantee</div>
                <div className="text-gray-300">Berdasarkan masukan klien internal, sebagian besar merasakan kemajuan positif di awal proses.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-purple-500/50 flex items-center gap-4 mx-auto mb-16"
        onClick={() => window.open('https://instagram.com/elreyzandra', '_blank')}
      >
        <ArrowRight className="w-6 h-6" />
        FOLLOW FOUNDER KAMI DI INSTAGRAM
      </button>
    
      {/* Audio Player */}
      <div className="py-10 bg-black">
        <div className="container mx-auto px-6">
          <AudioPlayer />
        </div>
      </div>

      {/* Reyzandra's Message */}
      <div className="py-10 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8 text-gray-300 leading-relaxed text-lg">
            <p className="mb-4">Nama saya eL Reyzandra,</p>
            <p className="mb-4">Pendiri eL Vision.</p>
            <p className="mb-4">Hingga 2025, saya telah menghabiskan lebih dari 15 tahun bekerja di bidang ini.</p>
            <p className="mb-4">Klien saya terutama adalah individu dengan tanggung jawab signifikan—kepala unit intelijen, pendiri yayasan sosial, lembaga beasiswa, dan pemimpin yang beroperasi di bawah tekanan konstan.</p>
            <p className="mb-4">Satu kategori klien yang meninggalkan kesan mendalam bagi saya adalah mereka yang datang di momen paling kritis dalam hidup.</p>
            <p className="mb-4">Misalnya, Pak Arif, yang pada Mei 2025 secara medis didiagnosis dengan kanker otak stadium 4 dan diberi estimasi tiga bulan. Hingga Desember 2025, beliau masih hidup, sadar, dan berfungsi.</p>
            <p className="mb-4">Pengalaman ini memperkuat prinsip yang telah saya pegang selama bertahun-tahun:</p>
            <p className="mb-4">sains dapat mengukur probabilitas, tetapi tidak memiliki otoritas atas kehidupan.</p>
            <p className="mb-4">Kehidupan bergerak menurut hukum alam—dan alam, ketika dipahami dengan benar, jauh lebih penuh belas kasih daripada yang kebanyakan orang sadari.</p>
            <p className="mb-4">Banyak yang bertanya mengapa klien saya cenderung individu profil tinggi.</p>
            <p className="mb-4">Alasannya sederhana:</p>
            <p className="mb-4">semakin banyak pengetahuan dan pengalaman yang dikumpulkan seseorang, semakin cepat mereka menyadari bahwa ada faktor pembatas yang tidak terlihat—faktor yang menghalangi kemajuan terlepas dari kecerdasan, strategi, atau usaha.</p>
            <p className="mb-4">Ini bukan kurangnya keterampilan.</p>
            <p className="mb-4">Ini adalah ketidakselarasan dengan hukum alam.</p>
            <p className="mb-4">Perjalanan saya dimulai 15 tahun yang lalu ketika saya secara pribadi mencoba menerapkan Law of Attraction melalui ajaran populer seperti The Secret. Saya gagal total.</p>
            <p className="mb-4">Kegagalan itu memaksa saya untuk mengajukan pertanyaan yang lebih dalam:</p>
            <p className="mb-4">Apa yang hilang?</p>
            <p className="mb-4">Bertahun-tahun penelitian, pengujian pribadi, dan pengorbanan akhirnya mengungkap celahnya.</p>
            <p className="mb-4">Celah itulah yang sekarang ditangani oleh eL Vision—bukan sebagai teori, tetapi sebagai sistem yang hidup yang dapat dialami secara langsung.</p>
            <p className="mb-4">Saya tidak menjual motivasi, kepercayaan, atau nasihat.</p>
            <p className="mb-4">Saya menawarkan metode yang bekerja.</p>
            <p className="mb-4">Salah satu klien internasional pertama saya di Dubai datang kepada saya setelah kehilangan pekerjaannya. Minggu kemudian, dia mendapatkan posisi yang lebih baik sebagai manajer di gym premium setelah menerapkan metode kami.</p>
            <p className="mb-4">Tidak ada janji yang dibuat. Tidak ada bujukan yang digunakan.</p>
            <p className="mb-4">Apakah saya luar biasa?</p>
            <p className="mb-4">Tidak.</p>
            <p className="mb-4">Yang telah saya pelajari adalah ini:</p>
            <p className="mb-4">setiap manusia membawa kekuatan batin yang sudah diberikan oleh alam.</p>
            <p className="mb-4">Perbedaannya hanya terletak pada mengetahui cara mengaktifkannya.</p>
            <p className="mb-4">Jika Anda benar-benar ingin mengalami ini sendiri, bergabunglah dengan program enam minggu ini.</p>
            <p className="mb-4">Saya tidak tertarik mendapatkan uang dengan membuat orang tetap tergantung atau bingung.</p>
            <p className="mb-4">Ini dirancang untuk menjadi salah satu investasi paling efisien yang pernah Anda buat—</p>
            <p className="mb-4">sebagian kecil dari sumber daya Anda, sebagai pertukaran untuk apa yang paling penting: kejelasan, keselarasan, dan stabilitas batin.</p>
            <p className="mb-4">Saya menantikan untuk bertemu Anda di kelas.</p>
            <p className="mt-8 font-bold">— eL Reyzandra</p>
            <p className="font-bold">Pendiri, eL Vision</p>
                      </div>
                    </div>
                  </div>
          
                {/* Founder History & Why It Works Section */}
                <div className="py-20 bg-gray-900">
                  <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                      <div className="w-full md:w-1/3">
                         <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-3xl p-8 text-center backdrop-blur-sm">
                           <div className="text-6xl mb-6">📰</div>
                           <div className="font-bold text-yellow-500 text-sm tracking-wider uppercase mb-2">Diliput Oleh</div>
                           <div className="text-3xl font-bold text-white mb-4">Liputan6</div>
                           <div className="h-px w-16 bg-yellow-500/50 mx-auto mb-4"></div>
                           <p className="text-gray-300 italic">"Membantu ratusan pengusaha dengan tingkat keberhasilan 98%"</p>
                         </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h2 className="text-4xl font-bold mb-6">
                          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                            Dari Motivator yang Diakui Media Menjadi Arsitek Sistem
                          </span>
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                          Sebelum eL Vision menjadi layanan 1:1 eksklusif, <strong className="text-white">eL Reyzandra</strong> diakui oleh media nasional (Liputan6) sebagai motivator bisnis yang sukses membimbing ratusan pengusaha pemula menuju profitabilitas.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          Namun dalam perjalanan ini, ia menemukan kebenaran kritis: <strong>Motivasi itu sementara. Sistem itu permanen.</strong>
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mt-4">
                          Ia menyadari bahwa 2% yang gagal bukan karena kurang usaha—mereka memiliki "algoritma" internal yang menolak kesuksesan. Hal ini menyebabkan terciptanya Metode eL Vision: sebuah protokol bukan untuk memotivasi pikiran, melainkan untuk <strong className="text-yellow-400">memprogram ulang sistem biologis dan energetik</strong> itu sendiri.
                        </p>
                      </div>
                    </div>
          
                    <div className="text-center mb-12">
                      <h3 className="text-3xl font-bold text-white mb-4">Mengapa Sistem Ini Berhasil di Semua Bidang</h3>
                      <p className="text-xl text-gray-400">Kami tidak menyelesaikan masalah. Kami memperbaiki mesin yang merasakannya.</p>
                    </div>
          
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Finance */}
                      <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-green-500/30 transition-all group">
                         <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <DollarSign className="w-8 h-8 text-green-400" />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-3">Keuangan</h4>
                         <div className="text-green-500 text-sm font-bold mb-3 uppercase tracking-wider">Algoritma "Profit"</div>
                         <p className="text-gray-400 leading-relaxed">
                           Sebagian besar hambatan finansial bukan masalah strategis—melainkan energetik. Kami memasang "Algoritma Kesuksesan" yang menyelaraskan fokus bawah sadar Anda dengan peluang pasar, membuat penciptaan kekayaan terasa seperti refleks alami daripada usaha yang dipaksakan.
                         </p>
                      </div>
          
                      {/* Health */}
                      <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-red-500/30 transition-all group">
                         <div className="w-14 h-14 bg-red-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <Heart className="w-8 h-8 text-red-400" />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-3">Kesehatan</h4>
                         <div className="text-red-500 text-sm font-bold mb-3 uppercase tracking-wider">Mode "Perbaikan"</div>
                         <p className="text-gray-400 leading-relaxed">
                           Para high achiever hidup dalam stres simpatik (fight-or-flight) kronis. Metode kami memaksa sistem saraf masuk ke dominasi parasimpatik yang dalam—satu-satunya kondisi di mana tubuh dapat memperbaiki jaringan, membunuh sel abnormal (seperti yang terlihat pada kasus penyintas kanker kami), dan membalikkan penuaan.
                         </p>
                      </div>
          
                      {/* Relationship */}
                      <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-purple-500/30 transition-all group">
                         <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <Crown className="w-8 h-8 text-purple-400" />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-3">Hubungan</h4>
                         <div className="text-purple-500 text-sm font-bold mb-3 uppercase tracking-wider">Hukum "Resonansi"</div>
                         <p className="text-gray-400 leading-relaxed">
                           Anda tidak mendapatkan apa yang Anda inginkan; Anda mendapatkan siapa diri Anda. Dengan mengkalibrasi baseline emosional internal Anda, Anda secara alami menolak dinamika beracun dan secara magnetis menarik pasangan (atau menyembuhkan pernikahan yang ada) yang menghormati dan menghargai kehadiran Anda tanpa Anda mengucapkan sepatah kata pun.
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Story-Based Case Studies Section */}      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Cerita Nyata, Transformasi Nyata
              </span>
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Studi kasus dari high-performers yang menembus batasan internal
            </p>

            {/* Health Section - Arif's Story */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold">TRANSFORMASI KESEHATAN</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Ketika Medis Memberikan Vonis, Alam Memberikan Jalan Lain
                </span>
              </h2>
            </div>

            {/* Arif's Video Testimonial */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/50 rounded-2xl p-10 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">🏥</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-green-400">Syarifudin Arif</h3>
                  <p className="text-lg text-gray-400">Instagram: @syarifudin_arif25</p>
                  <p className="text-sm text-gray-500 mt-1">Penyintas Kanker Otak Stadium 4</p>
                </div>
              </div>
              
              <video 
                className="w-full rounded-lg mb-6"
                controls
                preload="metadata"
                playsInline
                webkit-playsinline="true"
              >
                <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4" type="video/mp4" />
                Browser Anda tidak mendukung pemutaran video.
              </video>

              <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 border border-green-500/30 rounded-xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-red-400 font-bold text-lg mb-2">📋 Vonis Medis - Mei 2025</div>
                    <p className="text-gray-300">Kanker Otak Stadium 4</p>
                    <p className="text-gray-300">Estimasi Waktu: 3 Bulan</p>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-lg mb-2">✨ Realitas - Desember 2025</div>
                    <p className="text-gray-300">Masih Hidup & Sehat</p>
                    <p className="text-gray-300">Kondisi Semakin Membaik</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  Bagaimana eL Vision Membantu Transformasi Kesehatan Pak Arif?
                </p>
                
                <p>
                  Ketika Pak Arif datang kepada kami pada Mei 2025, kondisi medisnya sudah divonis stadium akhir dengan estimasi waktu 3 bulan. Namun kami percaya bahwa <span className="text-green-400 font-semibold">tubuh manusia memiliki kemampuan penyembuhan alami yang luar biasa</span> - yang sering kali terblokir oleh kondisi mental dan emosional.
                </p>

                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6 my-4">
                  <h4 className="text-xl font-bold text-green-400 mb-3">🧠 Metode Custom Terapi Frekuensi eL Vision</h4>
                  <p className="mb-3">
                    Kami bekerja pada level <span className="text-green-400 font-semibold">alam bawah sadar untuk menetralkan sel-sel abnormal</span>. Meski terdengar mustahil bagi pendekatan medis konvensional, prinsip ini sebenarnya sudah diakui dalam bidang psychoneuroimmunology - ilmu yang mempelajari hubungan antara pikiran, sistem saraf, dan sistem kekebalan tubuh.
                  </p>
                  
                  <div className="space-y-2 ml-4">
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Kalibrasi Alam Bawah Sadar:</strong> Kami memprogram ulang respons otomatis tubuh terhadap sel abnormal, mengaktifkan mekanisme penyembuhan alami yang selama ini tertidur</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Terapi Frekuensi Spesifik:</strong> Setiap sel memiliki frekuensi getaran. Kami membantu menyelaraskan frekuensi tubuh ke kondisi optimal untuk regenerasi</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Water Fasting Protocol:</strong> Dikombinasikan dengan protokol puasa air yang terbukti memicu autophagy - proses alami tubuh membersihkan sel-sel rusak</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Stress Neutralization:</strong> Menghilangkan stres kronis yang menekan sistem imun, membiarkan tubuh fokus pada penyembuhan</span>
                    </p>
                  </div>
                </div>

                <p className="text-lg text-yellow-400 font-semibold italic">
                  "Sains medis mengukur probabilitas, tetapi tidak memiliki otoritas penuh atas kehidupan. Alam, ketika dipahami dan diselaraskan dengan benar, jauh lebih penuh belas kasih dari yang dibayangkan."
                </p>

                <p>
                  Hasil Pak Arif bukan keajaiban dalam artian supernatural - ini adalah <span className="text-green-400 font-semibold">hasil dari mengaktifkan kembali sistem penyembuhan alami tubuh yang sudah ada sejak lahir</span>, namun sering terblokir oleh pola pikir, emosi negatif, dan stres berkepanjangan.
                </p>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mt-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Disclaimer:</strong> Metode eL Vision bukan pengganti pengobatan medis. Kami bekerja sebagai pendamping yang mengoptimalkan kondisi mental-emosional untuk mendukung proses penyembuhan alami tubuh. Konsultasikan dengan dokter Anda untuk keputusan medis.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl text-gray-300 italic">
                "Tubuh Anda lebih kuat dari diagnosis. Anda hanya perlu tahu cara membuka kuncinya."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-blue-400 font-bold">TRANSFORMASI BISNIS</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bisnis Stuck? Masalahnya Bukan di Luar
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Ketika strategi sudah benar, tim sudah kuat, tetapi hasil tetap mentok - masalahnya ada di dalam
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/50 rounded-2xl p-10">
              <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">❌ Pola yang Sering Terjadi</h3>
                  <div className="space-y-3">
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Owner/CEO sudah punya strategi sempurna, tetapi eksekusi selalu tertunda atau tidak maksimal</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Tim kompeten, modal cukup, sistem bagus - tapi pertumbuhan terhenti di ceiling yang sama</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Setiap keputusan besar terasa berat, penuh keraguan, menguras energi mental</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Kompetitor dengan sumber daya lebih sedikit justru berkembang lebih cepat</span>
                    </p>
                  </div>
                </div>

                <p className="text-2xl font-bold text-white text-center py-4">
                  Ini Bukan Masalah Strategi. Ini Masalah <span className="text-blue-400">Alignment</span>.
                </p>

                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">✨ Akar Masalah Sebenarnya</h3>
                  <p className="mb-4">
                    Seringkali bisnis stuck <span className="text-blue-400 font-semibold">bukan karena faktor eksternal</span> seperti pasar, kompetitor, atau modal - melainkan karena <span className="text-blue-400 font-semibold">kondisi internal owner/CEO</span>.
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-xl font-bold text-purple-400 mb-2">🧠 Mental & Pemikiran yang Tidak Selaras</h4>
                      <p>
                        Jika seorang pemimpin terus beroperasi dengan <span className="text-purple-400 font-semibold">keraguan, kecemasan, atau ketakutan tersembunyi</span> - maka energi itu akan merembes ke setiap keputusan, setiap interaksi tim, dan akhirnya ke hasil bisnis.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-purple-400 mb-2">⚡ Hukum Frekuensi dalam Bisnis</h4>
                      <p>
                        Bisnis adalah manifestasi dari <span className="text-purple-400 font-semibold">frekuensi internal pemimpinnya</span>. Jika frekuensi internal (keyakinan, emosi, energi) tidak selaras dengan visi dan goal - maka akan selalu ada gesekan, sabotase halus, dan hambatan yang tampak "dari luar" padahal sebenarnya berasal dari dalam.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">🎯 Solusi eL Vision untuk Bisnis</h3>
                  <p className="mb-4">
                    Kami menggunakan <span className="text-green-400 font-semibold">teknik alignment frekuensi</span> yang membuat <span className="text-green-400 font-semibold">arus realitas Anda selaras dengan tujuan bisnis Anda</span>.
                  </p>

                  <div className="space-y-3 mt-4">
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Menghapus Keraguan di Level Bawah Sadar:</strong> Keraguan yang tampak "logis" sebenarnya sering berakar dari program lama di alam bawah sadar. Kami bersihkan itu.</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Kalibrasi Keputusan:</strong> Membuat proses pengambilan keputusan menjadi lebih jelas, cepat, dan tanpa beban mental berlebih</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Alignment Visi-Realitas:</strong> Menyinkronkan frekuensi dunia nyata Anda (kondisi mental, emosi, energi) dengan visi besar bisnis Anda</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Flow State Execution:</strong> Eksekusi menjadi natural, tanpa paksaan - seperti air yang mengalir ke tujuannya</span>
                    </p>
                  </div>
                </div>

                <div className="text-center py-6">
                  <p className="text-2xl text-yellow-400 font-bold italic mb-2">
                    "Ketika Owner Selaras, Bisnis Mengalir"
                  </p>
                  <p className="text-lg text-gray-400">
                    Bukan motivasi. Bukan mindset biasa. Ini adalah rekalibrasi sistem internal yang menggerakkan segalanya.
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-400 mb-3">📊 Hasil Nyata dari Klien Bisnis Kami</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>• CEO Tech Startup (Valuasi $50M): <em>"Bisnis berkembang tanpa drama setelah kalibrasi energi"</em></p>
                    <p>• Pemilik Bisnis John: <em>"Breakthrough akhirnya terjadi setelah hambatan internal dihilangkan"</em></p>
                    <p>• Pemimpin Yayasan: <em>"Donasi meningkat dari $0 ke $6M/tahun setelah alignment internal"</em></p>
                  </div>
                </div>

                <p className="text-xl text-center text-white font-semibold pt-4">
                  Siap untuk menyelaraskan bisnis Anda dengan potensi sebenarnya?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black"></div>

            {/* John's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8">
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-yellow-400 font-semibold text-sm">STUDI KASUS: JOHN</span>
              </div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">Pemilik Bisnis yang Sudah Melakukan Semuanya dengan Benar</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  John sudah melakukan semuanya dengan benar. Dia telah menguji berbagai strategi iklan, mempekerjakan tim yang kuat, mengoptimalkan funnel, dan menghabiskan uang yang serius untuk eksekusi. Secara teknis, tidak ada yang salah.
                </p>
                <p>
                  Namun bisnisnya terus terhenti di batas yang sama. Tidak peduli seberapa keras dia mendorong secara eksternal, terobosan tidak akan terjadi.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Ketika kami bekerja sama, menjadi jelas: hambatan bukan lagi di luar bisnis. Itu internal — gesekan mental yang halus, kelelahan keputusan, dan resistensi tidak sadar yang bahkan orang pintar lewatkan.
                </p>
                <p>
                  Setelah memasuki proses privat 6 minggu yang terfokus, perubahan tidak dramatis di permukaan. Tapi kejelasan kembali. Eksekusi disederhanakan. Dan hasil yang dia kejar akhirnya mulai bergerak.
                </p>
              </div>
            </div>

            {/* Noah's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-10">
              <div className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-amber-400 font-semibold text-sm">STUDI KASUS: NOAH</span>
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mb-6">Kekayaan Tanpa Kedamaian</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Kisah Noah terlihat berbeda. Dia memiliki kekayaan, status, dan kebebasan di atas kertas. Tapi keluarganya tidak bahagia. Tubuhnya rusak.
                </p>
                <p>
                  Uang, alih-alih menjadi alat, telah menjadi sumber tekanan dan masalah berulang. Masalahnya bukan kurangnya kesuksesan. Itu ketidakselarasan internal.
                </p>
                <p className="text-amber-400 font-semibold">
                  Selama kerja privat 6 minggu yang sama, kami menangani pola internal yang diam-diam mendistorsi bagaimana uang, hubungan, dan kesehatan muncul dalam hidupnya.
                </p>
                <p>
                  Seiring waktu, uang kembali ke peran yang tepat — alat untuk hidup, bukan pemicu penderitaan.
                </p>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-purple-400 mb-4">Pola Umum</h4>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>
                  Banyak orang berbagi pola yang sama. Mereka mencoba lebih keras. Mereka memperbaiki strategi. Mereka mengoptimalkan sistem. Tapi solusinya bukan di sana.
                </p>
                <p className="text-xl font-semibold text-white">
                  Faktanya, lebih dari 90% klien kami adalah pemain tingkat atas. Mereka sudah memiliki penguasaan teknis dan kompetensi eksternal.
                </p>
                <p>
                  Jadi mengapa mereka datang kepada kami? Karena semakin pintar Anda, semakin Anda menyadari ada faktor X yang tidak bisa diperbaiki dengan teknik. Dan faktor itu adalah internal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Program Breakdown */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Perjalanan Transformasi 6 Minggu
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Apa yang terjadi minggu demi minggu dalam transformasi Anda
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {weeklyProgram.map((week, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${week.color} border ${week.borderColor} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${week.week === "Minggu 6" ? "bg-yellow-500" : "bg-gray-800"} flex items-center justify-center border-2 ${week.week === "Minggu 6" ? "border-yellow-400" : "border-gray-700"}`}>
                      <span className={`font-bold ${week.week === "Minggu 6" ? "text-black" : "text-white"}`}>{idx}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-400 uppercase">{week.week}</span>
                      {week.week === "Minggu 6" && <Check className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{week.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{week.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300">
                <strong className="text-yellow-400">Ini bukan nasihat. Ini bukan motivasi.</strong><br />
                Ini adalah pekerjaan presisi pada sistem yang menggerakkan segalanya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 mb-8">
              <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Kami Tidak Menjual Nasihat
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                Kami Menjual <span className="text-yellow-400 font-bold">HASIL TERBUKTI</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✗</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Bukan Ini</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Nasihat teoretis yang terdengar bagus di atas kertas</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Motivasi sementara yang memudar besok</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Konsep spiritual abstrak</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Janji kosong tanpa bukti nyata</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-black border-2 border-green-500/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✓</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">Yang Anda Dapatkan</h3>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">🏥</span>
                    <span><strong>Transformasi kesehatan:</strong> Kami telah membantu klien menentang diagnosis terminal. Pak Arif didiagnosis kanker dan diberi waktu 3 bulan untuk hidup pada Mei 2025 - dia hidup dan berkembang hari ini. Anda dapat menghubunginya langsung untuk mendengar ceritanya.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">💰</span>
                    <span><strong>Terobosan finansial:</strong> Satu pemilik yayasan meningkatkan donasi beasiswa mereka dari nol menjadi $6M/tahun setelah bekerja dengan kami.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">👨‍👩‍👧‍👦</span>
                    <span><strong>Penyembuhan keluarga:</strong> Pria sukses sering berjuang dengan perasaan dihormati di rumah. Ketika bentrokan ego tampak tidak dapat diselesaikan, kami menciptakan perubahan dalam hitungan minggu - bukan tahun.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">☮️</span>
                    <span><strong>Kedamaian & kebahagiaan sejati:</strong> Uang dan kebahagiaan berbeda. Uang membeli kunjungan rumah sakit dan penghilang stres - bukan kegembiraan. Kebahagiaan sejati berasal dari sikap dan memberi. Dalam sesi pertama Anda, Anda akan menemukan kebahagiaan melalui hal-hal sederhana: napas Anda, apa yang Anda lihat, bagaimana Anda merasakan dunia. Keuangan Anda menjadi bonus untuk kebahagiaan itu sendiri.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-2xl mt-1 flex-shrink-0">❤️</span>
                    <span><strong>Cinta & hubungan:</strong> Klien pria kami yang ingin menarik wanita tertentu memiliki tingkat keberhasilan 95% dalam 6 minggu. Untuk transparansi: wanita yang ingin menarik pria tertentu memiliki tingkat keberhasilan 50% dalam jangka waktu yang sama. Namun, wanita yang bekerja untuk menyembuhkan pernikahan yang ada juga mencapai keberhasilan 95% - itulah mengapa kami sering merekomendasikan jalur itu.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8">
              <p className="text-2xl text-gray-300 leading-relaxed">
                Anda tidak harus percaya kata-kata kami.<br />
                <span className="text-3xl font-bold text-yellow-400">Rasakan buktinya sendiri.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Point Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Apakah Ini Anda?
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl p-8">
                <div className="text-red-400 text-6xl mb-4">💸</div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Uang Ada, Tapi...</h3>
                <p className="text-gray-300 leading-relaxed">
                  Masalah terus datang. Seolah uang menjadi magnet untuk drama, konflik, dan kecemasan. Semakin banyak kekayaan yang Anda miliki, semakin kompleks masalah menggerogoti kedamaian Anda.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-900/30 rounded-2xl p-8">
                <div className="text-orange-400 text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">Sukses di Luar, Kosong di Dalam</h3>
                <p className="text-gray-300 leading-relaxed">
                  Pencapaian demi pencapaian tercapai. Tapi ada kekosongan yang tidak bisa diisi oleh apa pun. Anda tahu ada lebih banyak, tapi tidak tahu bagaimana mengaksesnya.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8">
                <div className="text-yellow-400 text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Energi Terkuras</h3>
                <p className="text-gray-300 leading-relaxed">
                  Setiap hari terasa seperti pertempuran. Keputusan besar menguras energi Anda. Anda ingin aliran alami, bukan perjuangan melelahkan yang konstan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-8">
                <div className="text-amber-400 text-6xl mb-4">🌪️</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Kehilangan Kejelasan</h3>
                <p className="text-gray-300 leading-relaxed">
                  Visi yang dulunya tajam sekarang kabur. Terlalu banyak pilihan, terlalu banyak suara. Anda membutuhkan kejelasan untuk melihat langkah selanjutnya dengan kepastian.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl text-gray-300 italic">
                "Kalibrasi yang salah membuat kesuksesan terasa seperti beban."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Tentukan Tujuan Spesifik Anda
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Fokus adalah kunci. Pilih satu area untuk transformasi mendalam dalam 6 minggu
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="text-yellow-500 mb-6 flex justify-center">
                  {goal.icon}
                </div>
                <h3 className="text-3xl font-bold text-center mb-4 text-yellow-400">
                  {goal.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400 mb-8">
              Atau kombinasi dari ketiganya? Kami akan menyesuaikan dengan kebutuhan Anda.
            </p>
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Yang Anda Dapatkan
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              "6 Sesi Private 1:1 (60 menit per sesi) dengan metode eksklusif eL Vision",
              "Vipassana & Kalibrasi yang disesuaikan khusus untuk tujuan Anda",
              "Akses WhatsApp langsung untuk bimbingan di antara sesi",
              "Protokol manifestasi khusus berdasarkan tanda tangan energi Anda",
              "Pelacakan kemajuan mingguan untuk memastikan transformasi terukur",
              "Akses seumur hidup ke komunitas klien tingkat tinggi eksklusif"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-900/50 transition-all">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Testimoni Video Klien Kami
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Dengarkan langsung dari mereka yang telah merasakan transformasi
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {videoTestimonials.map((testimonial, idx) => (
              <VideoTestimonial key={idx} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Text Testimonials Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Apa Kata Klien Tingkat Tinggi Kami
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Mereka yang sudah "berhasil" tetapi mencari level berikutnya
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <div className="bg-blue-500 rounded-full p-1" title="Terverifikasi">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300 mb-2">
                <strong className="text-purple-400">Hasil Bukan Kebetulan.</strong>
              </p>
              <p className="text-lg text-gray-400">
                Setiap testimoni adalah bukti kalibrasi energi yang presisi.
              </p>
            </div>
          </div>

          {/* Metode yang Kami Gunakan Section */}
          <div className="mt-20 text-left">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Metode yang Kami Gunakan
              </span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Metode eL Vision <strong className="text-yellow-400">bukanlah magic</strong>, bukan sugesti kosong, dan bukan sekadar <em>positive thinking</em>.
                Pendekatan ini merupakan <strong className="text-yellow-400">kalibrasi sistem internal manusia</strong>, yang bekerja pada tiga lapisan utama:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>energi fisiologis (kondisi tubuh & sistem saraf),</li>
                <li>alam bawah sadar,</li>
                <li>serta pola pengambilan keputusan yang secara konsisten membentuk realitas sehari-hari.</li>
              </ul>
              <p>
                Dalam ilmu saraf dan psikologi modern, manusia <strong className="text-yellow-400">tidak terutama digerakkan oleh niat sadar</strong>,
                melainkan oleh <strong className="text-yellow-400">pola bawah sadar yang bekerja otomatis</strong>.
              </p>
              <p>
                Berbagai riset menunjukkan bahwa:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>sekitar <strong className="text-yellow-400">90–95% keputusan manusia bersifat non-sadar</strong>,</li>
                <li>sementara pikiran sadar sering kali hanya berfungsi untuk
                  <strong className="text-yellow-400">membenarkan keputusan yang telah dibuat oleh sistem bawah sadar</strong>.
                </li>
              </ul>
              <p className="italic text-gray-400">
                (Referensi: Daniel Kahneman – <em>Thinking, Fast and Slow</em>)
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Letak Masalah 90% Orang yang “Stuck”</h3>
              <p>
                Sebagian besar orang yang merasa mentok <strong className="text-yellow-400">bukan karena kekurangan strategi, ilmu, atau usaha</strong>.
                Justru masalahnya berada di level yang lebih dalam, yaitu <strong className="text-yellow-400">ketidaksinkronan internal</strong>.
              </p>
              <p>
                Polanya hampir selalu sama:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Sistem saraf berada dalam kondisi <strong className="text-yellow-400">tegang kronis</strong>
                  (stres berkepanjangan, kewaspadaan berlebih, tekanan yang tidak disadari)
                </li>
                <li>Energi tubuh <strong className="text-yellow-400">tidak selaras</strong> dengan tujuan dan visi hidup</li>
                <li><strong className="text-yellow-400">Keyakinan lama tetap aktif</strong>, meskipun secara logika sudah “tahu harus berubah”</li>
              </ul>
              <p>
                Akibatnya:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Visi besar terasa berat</li>
                <li>Eksekusi tidak konsisten</li>
                <li>Keputusan kecil sering tertunda</li>
                <li>Hasil hidup stagnan meski usaha terus ditingkatkan</li>
              </ul>
              <p>
                Ini <strong className="text-yellow-400">bukan kemalasan</strong>.
                Ini adalah <strong className="text-yellow-400">masalah sinkronisasi sistem internal</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Apa yang Kami Lakukan (Secara Nyata)</h3>
              <p>
                Dalam sesi privat eL Vision, kami <strong className="text-yellow-400">tidak bekerja di level motivasi atau nasihat</strong>.
                Kami bekerja <strong className="text-yellow-400">langsung ke sistem bawah sadar</strong>.
              </p>
              <p>
                Pendekatan ini memanfaatkan prinsip dari:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">Neuroscience</strong> (khususnya neuroplasticity)</li>
                <li><strong className="text-yellow-400">Somatic psychology</strong> (hubungan tubuh, emosi, dan pikiran)</li>
                <li><strong className="text-yellow-400">Subconscious patterning</strong> dan <em>emotional recalibration</em></li>
              </ul>
              <p>
                Founder eL Vision memiliki <strong className="text-yellow-400">pengalaman lebih dari 15 tahun</strong>
                dalam memandu individu masuk ke kondisi internal tertentu,
                di mana <strong className="text-yellow-400">keyakinan, rasa diri, dan pola emosi dapat ditata ulang secara bertahap</strong>.
              </p>
              <p>
                Dalam literatur psikologi, proses ini sering disebut sebagai:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><em>bypassing conscious resistance</em>, atau</li>
                <li><em>direct subconscious access</em></li>
              </ul>
              <p>
                Bukan dipaksa.
                Bukan dilawan.
                Melainkan <strong className="text-yellow-400">diatur ulang dari dalam</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Mengapa Ini Bukan Law of Attraction Biasa</h3>
              <p>
                Teknik eL Vision <strong className="text-yellow-400">bukan sekadar Law of Attraction versi motivasi</strong>.
                Kami menyebutnya sebagai <strong className="text-yellow-400">upgrade sistem</strong>, karena bekerja dengan <strong className="text-yellow-400">dua arus sekaligus</strong>.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">1. Arus Visi <em>(Goal / Keinginan)</em></h4>
              <p>
                Ini adalah niat sadar, target, dan gambaran masa depan yang ingin dicapai.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">2. Arus Kenyataan <em>(Kondisi Internal Saat Ini)</em></h4>
              <p>
                Ini mencakup:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>emosi dominan sehari-hari,</li>
                <li>tonus sistem saraf,</li>
                <li>rasa aman, percaya diri,</li>
                <li>serta tingkat kehadiran seseorang di dalam tubuhnya.</li>
              </ul>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Masalah Kebanyakan Orang</h3>
              <p>
                Pada mayoritas orang:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">Arus visinya sangat kuat</strong></li>
                <li>tetapi <strong className="text-yellow-400">arus kenyataannya tidak selaras dengan visi tersebut</strong></li>
              </ul>
              <p>
                Visi dibangun oleh pikiran sadar,
                sementara arus kenyataan dikendalikan oleh <strong className="text-yellow-400">alam bawah sadar</strong> —
                dan alam bawah sadar <strong className="text-yellow-400">selalu lebih dominan</strong>.
              </p>
              <p>
                Dalam fisika sistem dan psikologi dinamis berlaku prinsip sederhana:
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-400">
                <p><strong className="text-yellow-400">Sistem yang lebih stabil dan konsisten akan menyeret sistem yang lebih lemah.</strong></p>
              </blockquote>
              <p>
                Jika arus kenyataan bertentangan dengan visi,
                maka visi akan terus mengalami friksi, sabotase halus, dan penundaan.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Prinsip Inti eL Vision</h3>
              <p>
                Dalam eL Vision:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">Bukan visi yang dikejar mati-matian</strong></li>
                <li>melainkan <strong className="text-yellow-400">arus kenyataan yang diselaraskan dan diperkuat terlebih dahulu</strong></li>
              </ul>
              <p>
                Saat:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>tubuh menjadi lebih tenang,</li>
                <li>emosi lebih sinkron,</li>
                <li>dan keyakinan internal lebih stabil,</li>
              </ul>
              <p>
                maka <strong className="text-yellow-400">arus kenyataan mulai searah dengan visi</strong>.
              </p>
              <p>
                Dan ketika arus kenyataan sudah selaras dan cukup kuat,
                visi <strong className="text-yellow-400">tidak perlu lagi dipaksakan</strong> —
                ia <strong className="text-yellow-400">terbawa masuk ke realitas secara alami</strong>.
              </p>
              <p>
                Inilah yang oleh banyak orang disebut sebagai <em>“terwujud”</em>.
              </p>
              <p>
                Bukan karena berharap.
                Melainkan karena <strong className="text-yellow-400">sistem internal sudah berada di arah yang benar</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            
            <h2 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Saatnya Rekalibrasi
              </span>
            </h2>

            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Uang Anda sudah cukup. Yang Anda butuhkan adalah kejelasan, kedamaian, dan aliran alami dalam mewujudkan keinginan Anda berikutnya.
            </p>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="text-5xl font-bold text-yellow-400 mb-3">Rp 15.000.000</div>
              <div className="text-xl text-gray-300 mb-2">Transformasi 6 Minggu (60 menit/sesi)</div>
              <div className="text-sm text-gray-400 mb-6">1 Sesi per Minggu</div>

              <div className="flex items-center gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="text-left text-sm text-gray-300">
                  <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider">Money Back Guarantee</span>
                  Berdasarkan masukan klien internal, sebagian besar merasakan kemajuan positif di awal proses.
                </div>
              </div>
              
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
                <p className="text-yellow-400 font-semibold">⚡ Terbatas: Hanya 3 Slot per Bulan</p>
              </div>
            </div>

            <button 
              className="group bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-2xl px-16 py-8 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/50 flex items-center gap-4 mx-auto mb-8"
              onClick={() => {
                const eventId = `contact-${Date.now()}`;
                const pixelId = '3319324491540889';
                trackCustomEvent('Contact', { content_name: 'VIP 1:1 Booking' }, eventId, pixelId);
                sendCapiEvent('Contact', { content_name: 'VIP 1:1 Booking' }, eventId);
                window.open('https://wa.me/62895325633487?text=Hi%20saya%20ingin%20mendaftar%20VIP%201%3A1%20%0ANama:%20%0ATujuan%20Spesifik:%20', '_blank');
              }}
            >
              <Phone className="w-8 h-8" />
              BOOK SEKARANG
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-gray-500 text-sm">
              Slot terbatas. Kami hanya bekerja dengan mereka yang serius tentang transformasi mendalam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}