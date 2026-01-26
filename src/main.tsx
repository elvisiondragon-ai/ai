import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"

// Lazy load pages to reduce initial bundle size
const DisplayPage = lazy(() => import('./display.tsx'))
const IntroLanding = lazy(() => import('./intro.tsx'))
const UangPanasLanding = lazy(() => import('./id_ebook/ebook_uangpanas.tsx'))
const EbookFeminineLanding = lazy(() => import('./id_ebook/ebook_feminine.tsx'))

// Minimal loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400 text-sm animate-pulse">
    Loading...
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<DisplayPage />} />
        <Route path="/intro" element={<IntroLanding />} />
        <Route path="/ebook_uangpanas" element={<UangPanasLanding />} />
        <Route path="/ebook_feminine" element={<EbookFeminineLanding />} />
      </Routes>
    </Suspense>
    <SpeedInsights />
  </BrowserRouter>,
)
