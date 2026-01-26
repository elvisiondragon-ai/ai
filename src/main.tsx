import React from 'react'
import ReactDOM from 'react-dom/client'
import IntroLanding from './intro.tsx'
import DisplayPage from './display.tsx'
import UangPanasLanding from './id_ebook/uangpanas.tsx'
import EbookFeminineLanding from './id_ebook/ebook_feminine.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayPage />} />
        <Route path="/intro" element={<IntroLanding />} />
        <Route path="/ebook_uangpanas" element={<UangPanasLanding />} />
        <Route path="/ebook_feminine" element={<EbookFeminineLanding />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
