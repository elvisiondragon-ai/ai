const APP_VERSION = '2026.02.26.02'; // Force update

if (localStorage.getItem('v_cache') !== APP_VERSION) {
  // 1. Clear Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  }

  // 2. Clear Caches
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(n => caches.delete(n)));
  }

  // 3. Update version and Hard Reload
  localStorage.setItem('v_cache', APP_VERSION);
  setTimeout(() => window.location.reload(), 500);
}

import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react'
import { AnalyticsTracker } from './components/AnalyticsTracker';

// Lazy Loaded (Primary Landing Pages - Lazy Load)
const DisplayPage = React.lazy(() => import('./display.tsx'));
const UangPanasLanding = React.lazy(() => import('./id_ebook/ebook_uangpanas.tsx'));
const EbookFeminineLanding = React.lazy(() => import('./id_ebook/ebook_feminine.tsx'));
const NotFound = React.lazy(() => import('./NotFound.tsx'));

// Lazy Loaded (Secondary Pages - Load on Click)
const EbookAdhdLanding = React.lazy(() => import('./id_ebook/ebook_adhd.tsx'));
const ArifEbookLanding = React.lazy(() => import('./id_ebook/ebook_arif.tsx'));
const EbookElvisionPaymentPage = React.lazy(() => import('./id_ebook/ebook_elvision.tsx'));
const EbookGriefLanding = React.lazy(() => import('./id_ebook/ebook_grief.tsx'));
const DietPaymentPage = React.lazy(() => import('./id_ebook/ebook_langsing.tsx'));
const EbookPercayaDiriLP = React.lazy(() => import('./id_ebook/ebook_percayadiri.tsx'));
const EbookTrackerLanding = React.lazy(() => import('./id_ebook/ebook_tracker.tsx'));
const ELVision15K = React.lazy(() => import('./id_ebook/vip_15jt.tsx'));
const Proteam = React.lazy(() => import('./proteam.tsx'));
const IntroLanding = React.lazy(() => import('./intro.tsx'));
const Rajaranjang = React.lazy(() => import('./rajaranjang/rajaranjang.tsx'));
const DarkFeminine = React.lazy(() => import('./darkfeminine.tsx'));

// Moved from elvisiongroup
const UsaEbookSlim = React.lazy(() => import('./usa/usa_ebookslim.tsx'));
const Usa3000 = React.lazy(() => import('./usa/usa_3000.tsx'));
const UsaPay3000 = React.lazy(() => import('./usa/usa_pay3000.tsx'));
const Usa3000Survey = React.lazy(() => import('./usa/usa_3000survey.tsx'));
const UsaPaypal = React.lazy(() => import('./usa/usa_paypal.tsx'));
const UsaEbookHealth = React.lazy(() => import('./usa/usa_ebookhealth.tsx'));
const UsaEbookFeminine = React.lazy(() => import('./usa/usa_ebookfeminine.tsx'));
const UsaPaypalFinish = React.lazy(() => import('./usa/usa_paypal_finish.tsx'));

// SG
const SgElvision = React.lazy(() => import('./sg/sg_elvision.tsx'));

// Audio Product
const AudioProductPayment = React.lazy(() => import('./checkout/audio_product.tsx'));

// Simple Loading Spinner (For secondary pages)
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  // Prefetch secondary pages in background
  React.useEffect(() => {
    const timer = setTimeout(() => {
      import('./id_ebook/ebook_elvision.tsx');
      import('./id_ebook/vip_15jt.tsx');
      import('./usa/usa_ebookslim.tsx');
      import('./usa/usa_3000.tsx');
      import('./usa/usa_pay3000.tsx');
      import('./usa/usa_3000survey.tsx');
      import('./usa/usa_paypal.tsx');
      import('./usa/usa_ebookhealth.tsx');
      import('./usa/usa_ebookfeminine.tsx');
      import('./usa/usa_paypal_finish.tsx');
      import('./sg/sg_elvision.tsx');
      import('./checkout/audio_product.tsx');
      import('./components/address_en.tsx');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<DisplayPage />} />
      <Route path="/intro" element={<IntroLanding />} />
      <Route path="/ebook_uangpanas" element={<UangPanasLanding />} />
      <Route path="/ebook_feminine" element={<EbookFeminineLanding />} />
      <Route path="/ebook_feminine/v2" element={<EbookFeminineLanding />} />
      <Route path="/ebook_adhd" element={<EbookAdhdLanding />} />
      <Route path="/ebook_arif" element={<ArifEbookLanding />} />
      <Route path="/ebook_elvision" element={<EbookElvisionPaymentPage />} />
      <Route path="/ebook_grief" element={<EbookGriefLanding />} />
      <Route path="/ebook_langsing" element={<DietPaymentPage />} />
      <Route path="/ebook_percayadiri" element={<EbookPercayaDiriLP />} />
      <Route path="/ebook_tracker" element={<EbookTrackerLanding />} />
      <Route path="/vip_15jt" element={<ELVision15K />} />
      <Route path="/proteam" element={<Proteam />} />
      <Route path="/rajaranjang" element={<Rajaranjang />} />
      <Route path="/darkfeminine" element={<DarkFeminine />} />

      {/* Moved from elvisiongroup */}
      <Route path="/usa_ebookslim" element={<UsaEbookSlim />} />
      <Route path="/usa_3000" element={<Usa3000 />} />
      <Route path="/usa_pay3000" element={<UsaPay3000 />} />
      <Route path="/usa_3000survey" element={<Usa3000Survey />} />
      <Route path="/usa_paypal" element={<UsaPaypal />} />
      <Route path="/usa_ebookhealth" element={<UsaEbookHealth />} />
      <Route path="/usa_ebookfeminine" element={<UsaEbookFeminine />} />
      <Route path="/usa_paypal_finish" element={<UsaPaypalFinish />} />

      {/* SG */}
      <Route path="/sg_elvision" element={<SgElvision />} />

      {/* Audio */}
      <Route path="/audio" element={<AudioProductPayment />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AnalyticsTracker />
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
    <SpeedInsights />
    <Analytics />
  </BrowserRouter>,
)