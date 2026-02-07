import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react'
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { WhatsAppButton } from './components/WhatsAppButton';

// Static Import (Primary Landing Pages - Instant Load)
import DisplayPage from './display.tsx';
import UangPanasLanding from './id_ebook/ebook_uangpanas.tsx';
import EbookFeminineLanding from './id_ebook/ebook_feminine.tsx';
import NotFound from './NotFound.tsx';

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
const WebinarIbu = React.lazy(() => import('./web/webinar_ibu.tsx'));
const WebinarBapak = React.lazy(() => import('./web/webinar_bapak.tsx'));
const WebinarIbuJodoh = React.lazy(() => import('./web/webinar_ibujodoh.tsx'));
const WebinarAnakMandiri = React.lazy(() => import('./web/webinar_anakmandiri.tsx'));
const WebinarOrtuSakit = React.lazy(() => import('./web/webinar_ortusakit.tsx'));
const WebinarOrtuAnak = React.lazy(() => import('./web/webinar_ortuanak.tsx'));
const WebinarIbuIstri = React.lazy(() => import('./web/webinar_ibuistri.tsx'));
const WebinarPriaSusis = React.lazy(() => import('./web/webinar_priasusis.tsx'));
const WebinarPriaSingle = React.lazy(() => import('./web/webinar_priasingle.tsx'));
const WebinarBurnout = React.lazy(() => import('./web/webinar_burnout.tsx'));
const WebinarSopanMandiri = React.lazy(() => import('./web/webinar_sopanmandiri.tsx'));
const AnalyticsDashboard = React.lazy(() => import('./web/analytics.tsx'));
const WebList = React.lazy(() => import('./web/weblist.tsx'));
const WebPay = React.lazy(() => import('./web/webpay.tsx'));
const WebinarLeft = React.lazy(() => import('./web/webinar_left.tsx'));
const UsaWebHealth = React.lazy(() => import('./usa/usa_webhealth.tsx'));
const UsaWebFinance = React.lazy(() => import('./usa/usa_webfinance.tsx'));
const UsaWebRelationship = React.lazy(() => import('./usa/usa_webrelationship.tsx'));

// Moved from elvisiongroup
const UsaEbookSlim = React.lazy(() => import('./usa/usa_ebookslim.tsx'));
const Usa3000 = React.lazy(() => import('./usa/usa_3000.tsx'));
const UsaPay3000 = React.lazy(() => import('./usa/usa_pay3000.tsx'));
const Usa3000Survey = React.lazy(() => import('./usa/usa_3000survey.tsx'));
const UsaPaypal = React.lazy(() => import('./usa/usa_paypal.tsx'));
const UsaEbookHealth = React.lazy(() => import('./usa/usa_ebookhealth.tsx'));
const UsaEbookFeminine = React.lazy(() => import('./usa/usa_ebookfeminine.tsx'));
const UsaPaypalFinish = React.lazy(() => import('./usa/usa_paypal_finish.tsx'));

// Fisik
const DrelfLP = React.lazy(() => import('./fisik/drelflp.tsx'));
const DrelfPayment = React.lazy(() => import('./fisik/drelf.tsx'));

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
        import('./web/webinar_ibu.tsx');
        import('./web/webinar_bapak.tsx');
        import('./web/webinar_ibujodoh.tsx');
        import('./web/webinar_anakmandiri.tsx');
        import('./web/webinar_ortusakit.tsx');
        import('./web/webinar_ortuanak.tsx');
        import('./web/webinar_ibuistri.tsx');
        import('./web/webinar_priasusis.tsx');
        import('./web/webinar_priasingle.tsx');
        import('./web/webinar_burnout.tsx');
        import('./web/webinar_sopanmandiri.tsx');
        import('./web/weblist.tsx');
        import('./web/webpay.tsx');
        import('./web/webinar_left.tsx');
        import('./usa/usa_webhealth.tsx');
        import('./usa/usa_webfinance.tsx');
        import('./usa/usa_webrelationship.tsx');
        import('./usa/usa_ebookslim.tsx');
        import('./usa/usa_3000.tsx');
        import('./usa/usa_pay3000.tsx');
        import('./usa/usa_3000survey.tsx');
        import('./usa/usa_paypal.tsx');
        import('./usa/usa_ebookhealth.tsx');
        import('./usa/usa_ebookfeminine.tsx');
        import('./usa/usa_paypal_finish.tsx');
        import('./fisik/drelflp.tsx');
        import('./fisik/drelf.tsx');
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
        <Route path="/webinar_ibu" element={<WebinarIbu />} />
        <Route path="/webinar_bapak" element={<WebinarBapak />} />
                <Route path="/webinar_ibujodoh" element={<WebinarIbuJodoh />} />
                <Route path="/webinar_anakmandiri" element={<WebinarAnakMandiri />} />
        <Route path="/webinar_ortusakit" element={<WebinarOrtuSakit />} />
        <Route path="/webinar_ortuanak" element={<WebinarOrtuAnak />} />
        <Route path="/webinar_ibuistri" element={<WebinarIbuIstri />} />
        <Route path="/webinar_priasusis" element={<WebinarPriaSusis />} />
        <Route path="/webinar_priasingle" element={<WebinarPriaSingle />} />
        <Route path="/webinar_burnout" element={<WebinarBurnout />} />
        <Route path="/webinar_sopanmandiri" element={<WebinarSopanMandiri />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/weblist" element={<WebList />} />
        <Route path="/webpay" element={<WebPay />} />
        <Route path="/webinarleft" element={<WebinarLeft />} />
        <Route path="/usa_webhealth" element={<UsaWebHealth />} />
        <Route path="/usa_webfinance" element={<UsaWebFinance />} />
        <Route path="/usa_webrelationship" element={<UsaWebRelationship />} />
        
        {/* Moved from elvisiongroup */}
        <Route path="/usa_ebookslim" element={<UsaEbookSlim />} />
        <Route path="/usa_3000" element={<Usa3000 />} />
        <Route path="/usa_pay3000" element={<UsaPay3000 />} />
        <Route path="/usa_3000survey" element={<Usa3000Survey />} />
        <Route path="/usa_paypal" element={<UsaPaypal />} />
        <Route path="/usa_ebookhealth" element={<UsaEbookHealth />} />
        <Route path="/usa_ebookfeminine" element={<UsaEbookFeminine />} />
        <Route path="/usa_paypal_finish" element={<UsaPaypalFinish />} />

        {/* Fisik */}
        <Route path="/drelflp" element={<DrelfLP />} />
        <Route path="/drelf" element={<DrelfPayment />} />

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
    <WhatsAppButton />
    <SpeedInsights />
    <Analytics />
  </BrowserRouter>,
)