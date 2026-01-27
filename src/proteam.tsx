import { Lock, Zap, Brain, Target, Calendar, Users, ArrowRight, ChevronDown } from 'lucide-react';

const ProTeamLandingPage = () => {

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-amber-500/30 rounded-full bg-amber-500/5 backdrop-blur-sm">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Berlaku Mulai November 2025</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Selamat Datang di<br />Inner Circle: Pro Team
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Akses eksklusif untuk para pemimpin.<br />
            Buka jalur langsung ke <span className="text-amber-500 font-semibold">All Father</span>.
          </p>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-16">
            <ChevronDown className="w-8 h-8 text-gray-600 mx-auto" />
          </div>
        </div>
      </section>

      {/* Qualification Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative border border-amber-500/20 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-amber-500/5 to-blue-500/5 backdrop-blur-sm">
            {/* Lock Icon */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50">
                <Lock className="w-8 h-8 text-black" />
              </div>
            </div>

            <div className="text-center mt-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Persyaratan Eksklusif</h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-amber-500" />
                <p className="text-xl md:text-2xl font-semibold">
                  Minimum <span className="text-amber-500">50 Anggota Aktif</span>
                </p>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Hanya untuk Affiliate yang telah membangun grup solid dengan minimal 50 anggota aktif. 
                Ini adalah standar untuk masuk ke inner circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Core Benefits Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Dua Pilar <span className="bg-gradient-to-r from-amber-500 to-blue-500 bg-clip-text text-transparent">Transformasi</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Kami tidak hanya mengajarkan taktik. Kami membangun ulang fondasi kesuksesan Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pillar 1: Internal Mastery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative border border-amber-500/30 rounded-2xl p-8 bg-gradient-to-br from-amber-500/10 to-black backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/50">
                  <Brain className="w-8 h-8 text-black" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-amber-500">
                  Internal Mastery
                </h3>
                <p className="text-sm uppercase tracking-wider text-amber-500/70 mb-4 font-semibold">
                  The Subconscious
                </p>

                <div className="mb-6">
                  <p className="text-xl font-semibold mb-3 text-white">
                    "Alignment daripada Hustle"
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Berhenti <span className="text-amber-500 font-semibold">banting tulang</span> tanpa arah. 
                    Kami mereset subconscious Anda ke frekuensi Kebahagiaan. 
                    Kami fokus pada penyelarasan energi untuk <span className="text-amber-500">menarik kekayaan</span>, 
                    bukan mengejarnya.
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Reset frekuensi mental ke abundance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Eliminasi block subconscious yang menghambat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Alignment energi untuk magnetic attraction</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: External Mastery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative border border-blue-500/30 rounded-2xl p-8 bg-gradient-to-br from-blue-500/10 to-black backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                  <Target className="w-8 h-8 text-black" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-blue-500">
                  External Mastery
                </h3>
                <p className="text-sm uppercase tracking-wider text-blue-500/70 mb-4 font-semibold">
                  The Technical
                </p>

                <div className="mb-6">
                  <p className="text-xl font-semibold mb-3 text-white">
                    "Presisi Marketing Bedah"
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Asah pisau Anda. Teknik affiliate tingkat lanjut: 
                    <span className="text-blue-500 font-semibold"> Killer Hooks</span>, 
                    <span className="text-blue-500 font-semibold"> Content Packaging</span>, dan 
                    <span className="text-blue-500 font-semibold"> Hypnotic Copywriting</span> yang mengkonversi.
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Advanced affiliate marketing frameworks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Conversion-optimized copywriting tactics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Content packaging yang magnetic</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-amber-500/30 rounded-full bg-amber-500/5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Jadwal Eksklusif</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Direct Access ke <span className="text-amber-500">All Father</span>
            </h2>
          </div>

          <div className="border border-amber-500/20 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-500">Sesi Coaching Live</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <span>Mingguan atau Dua Mingguan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <span>Jadwal dinamis berdasarkan ketersediaan founder</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <span>Akses langsung untuk tanya jawab</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-500">Yang Anda Dapatkan</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Strategi personal dari All Father</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Review langsung campaign Anda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Networking dengan elite affiliates</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-center text-sm text-gray-300">
                <span className="text-amber-500 font-semibold">Catatan Penting:</span> Jadwal dapat berubah 
                sesuai dengan komitmen All Father. Kelangkaan ini membuat setiap sesi sangat berharga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Siap Bergabung dengan <span className="bg-gradient-to-r from-amber-500 to-blue-500 bg-clip-text text-transparent">Elite?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Verifikasi grup Anda dan mulai perjalanan transformasi bersama All Father.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <a href="https://wa.me/+62895325633487?text=Kak%20saya%20sudah%20mengumpulkan%2050%2B%2B%2B%20tolong%20buka%20affiliate%20team%20saya" target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-black text-lg shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <span>Verifikasi Grup Saya & Gabung Pro Team</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>


          </div>

          {/* Trust Badge */}
          <div className="mt-16 pt-8 border-t border-gray-900">
            <p className="text-gray-600 text-sm">
              Program eksklusif dari <span className="text-amber-500 font-semibold">eL Vision</span> 
              • Transformasi Internal & External • Dimulai November 2025
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2025 eL Vision. All rights reserved. • Pro Team Exclusive Program</p>
        </div>
      </footer>
    </div>
  );
};

export default ProTeamLandingPage;