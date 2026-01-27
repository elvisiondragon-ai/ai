import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react'

// Static Imports (Full Speed)
import DisplayPage from './display.tsx';
import IntroLanding from './intro.tsx';
import UangPanasLanding from './id_ebook/ebook_uangpanas.tsx';
import EbookFeminineLanding from './id_ebook/ebook_feminine.tsx';
import EbookAdhdLanding from './id_ebook/ebook_adhd.tsx';
import ArifEbookLanding from './id_ebook/ebook_arif.tsx';
import EbookElvisionPaymentPage from './id_ebook/ebook_elvision.tsx';
import EbookGriefLanding from './id_ebook/ebook_grief.tsx';
import DietPaymentPage from './id_ebook/ebook_langsing.tsx';
import EbookPercayaDiriLP from './id_ebook/ebook_percayadiri.tsx';
import EbookTrackerLanding from './id_ebook/ebook_tracker.tsx';
import ELVision15K from './id_ebook/vip_15jt.tsx';
import Proteam from './proteam.tsx';
import NotFound from './NotFound.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
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
    <SpeedInsights />
    <Analytics />
  </BrowserRouter>,
)