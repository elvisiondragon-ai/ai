import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react'

// Static Import (Instant Load)
import DisplayPage from './display.tsx';
import UangPanasLanding from './id_ebook/ebook_uangpanas.tsx';
import EbookFeminineLanding from './id_ebook/ebook_feminine.tsx';
import NotFound from './NotFound.tsx';

// Lazy Loaded (Heavy Pages - Load on Click)
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

// Simple Loading Spinner (Tiny)
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<DisplayPage />} />
        <Route path="/intro" element={<IntroLanding />} />
        <Route path="/ebook_uangpanas" element={<UangPanasLanding />} />
        <Route path="/ebook_feminine" element={<EbookFeminineLanding />} />
        <Route path="/ebook_adhd" element={<EbookAdhdLanding />} />
        <Route path="/ebook_arif" element={<ArifEbookLanding />} />
        <Route path="/ebook_elvision" element={<EbookElvisionPaymentPage />} />
        <Route path="/ebook_grief" element={<EbookGriefLanding />} />
        <Route path="/ebook_langsing" element={<DietPaymentPage />} />
        <Route path="/ebook_percayadiri" element={<EbookPercayaDiriLP />} />
        <Route path="/ebook_tracker" element={<EbookTrackerLanding />} />
        <Route path="/vip_15jt" element={<ELVision15K />} />
        <Route path="/proteam" element={<Proteam />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <SpeedInsights />
    <Analytics />
  </BrowserRouter>,
)