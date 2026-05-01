import React, { useState, useEffect, useCallback, useRef } from 'react';

const DEBUG_IMAGES = false;
const DbgImg = ({ src, alt, className, style, label }: { src: string; alt?: string; className?: string; style?: React.CSSProperties; label: string }) => (
    <div style={{ position: 'relative', display: 'block', lineHeight: 0 }}>
        <img src={src} alt={alt} className={className} style={{ display: 'block', width: '100%', ...style }} />
        {DEBUG_IMAGES && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
                <span style={{ background: 'rgba(0,0,0,0.72)', color: '#FFD700', fontSize: '22px', fontWeight: 900, padding: '8px 18px', borderRadius: '10px', letterSpacing: '0.5px', textAlign: 'center', wordBreak: 'break-all', maxWidth: '90%' }}>{label}</span>
            </div>
        )}
    </div>
);
import { useSearchParams } from 'react-router-dom';
import { supabase } from "../integrations/supabase/client";
import {
    ArrowLeft,
    Copy,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Star,
    Download
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp, initFacebookPixelWithLogging, trackViewContentEvent, trackPageViewEvent, trackAddPaymentInfoEvent, sha256, handleFbcCookieManager } from "../utils/fbpixel";

// Asset Imports for ID
import df01Id from '../assets/darkfem/indo_image/df01_paradox.png';
import df04Id from '../assets/darkfem/indo_image/df04_teman_curhat.png';
import df08Id from '../assets/darkfem/indo_image/df08_secret_she_knows.png';
import df09Id from '../assets/darkfem/indo_image/df09_wake_up_call.png';

// Istri Carousel Assets (?istri parameter)
import istriC1S1 from '../assets/darkfem/istri/c1/df_0413_c1_s1_1776094006614.png';
import istriC1S2 from '../assets/darkfem/istri/c1/df_0413_c1_s2_1776094060387.png';
import istriC1S3 from '../assets/darkfem/istri/c1/df_0413_c1_s3_1776094080684.png';
import istriC1S4 from '../assets/darkfem/istri/c1/df_0413_c1_s4_1776094099286.png';
import istriC2S1 from '../assets/darkfem/istri/c2/df_0413_c2_s1_1776094189631.png';
import istriC2S2 from '../assets/darkfem/istri/c2/df_0413_c2_s2_1776094206120.png';
import istriC2S3 from '../assets/darkfem/istri/c2/df_0413_c2_s3_1776094223527.png';
import istriC2S4 from '../assets/darkfem/istri/c2/df_0413_c2_s4_1776094241692.png';
import istriC3S1 from '../assets/darkfem/istri/c3/df_0413_sp_s1_1776094310773.png';
import istriC3S2 from '../assets/darkfem/istri/c3/df_0413_sp_s2_1776094328010.png';
import istriC3S3 from '../assets/darkfem/istri/c3/df_0413_sp_s3_1776094342928.png';
import istriC3S4 from '../assets/darkfem/istri/c3/df_0413_sp_s4_1776094363097.png';
import istriC4S1 from '../assets/darkfem/istri/c4/df_0413_sl_s1_1776094453410.png';
import istriC4S2 from '../assets/darkfem/istri/c4/df_0413_sl_s2_1776094469075.png';
import istriC4S3 from '../assets/darkfem/istri/c4/df_0413_sl_s3_1776094484568.png';
import istriC4S4 from '../assets/darkfem/istri/c4/df_0413_sl_s4_1776094503539.png';
import istriC5S1 from '../assets/darkfem/istri/c5/df_0413_jmp_s1_v2_1776172859297.png';
import istriC5S2 from '../assets/darkfem/istri/c5/df_0413_jmp_s2_v2_1776172873565.png';
import istriC5S3 from '../assets/darkfem/istri/c5/df_0413_jmp_s3_v2_1776172894595.png';
import istriC5S4 from '../assets/darkfem/istri/c5/df_0413_jmp_s4_v2_1776172913410.png';

// New Istri Ads 0426
import newIstri1 from '../assets/darkfem/istri/new_0426/istri_menghapusjejak.png';
import newIstri2 from '../assets/darkfem/istri/new_0426/istri_membangunrumah.png';
import newIstri3 from '../assets/darkfem/istri/new_0426/istri_tunggudewasa_1777216228611.png';
import newIstri4 from '../assets/darkfem/istri/new_0426/istri_sosialdeath_1777216244903.png';
import newIstri5 from '../assets/darkfem/istri/new_0426/istri_vigoruntukdia_1777216261041.png';
import newIstri6 from '../assets/darkfem/istri/new_0426/istri_hanyakewajiban_1777216789917.png';
import newIstri7 from '../assets/darkfem/istri/new_0426/istri_tatapankosong_v2_1777216488783.png';
import newIstri8 from '../assets/darkfem/istri/new_0426/istri_anakrespek_v2_1777216504562.png';
import newIstri9 from '../assets/darkfem/istri/new_0426/istri_parfumwanitalain_v2_1777216520501.png';
import newIstri10 from '../assets/darkfem/istri/new_0426/istri_menyesalmasatua_v2_1777216536956.png';
import newIstri11 from '../assets/darkfem/istri/new_0426/df_0424_ad04_istri_selingkuh_v2_1777018341684.png';

// New Parameter Ads (18adparamater)
import presenceImg1 from '../assets/darkfem/parameter/presence/presence_01_diam_membunuh_v2_1777550965342.png';
import presenceImg2 from '../assets/darkfem/parameter/presence/presence_02_invisible_dunia_v2_1777550999292.png';
import perubahanImg1 from '../assets/darkfem/parameter/perubahan/perubahan_01_satu_shift_v2_1777551074543.png';
import perubahanImg2 from '../assets/darkfem/parameter/perubahan/perubahan_02_frekuensi_salah_v2_1777551089169.png';
import highvalueImg1 from '../assets/darkfem/parameter/highvalue/highvalue_01_takut_kehilangan_v2_1777551172904.png';
import highvalueImg2 from '../assets/darkfem/parameter/highvalue/highvalue_02_balik_posisi_v2_1777551189312.png';
import nonggamesImg1 from '../assets/darkfem/parameter/nonggames/nongames_01_ghosted_lagi_v2_1777551270430.png';
import nonggamesImg2 from '../assets/darkfem/parameter/nonggames/nongames_02_predictable_v2_1777551327348.png';
import istrifearImg1 from '../assets/darkfem/parameter/istrifear/istrifear_01_hapusjejak_v2_1777551104410.png';
import istrifearImg2 from '../assets/darkfem/parameter/istrifear/istrifear_02_wanita_biasa_v2_1777551152675.png';
import legacyImg1 from '../assets/darkfem/parameter/legacy/istrilegacy_01_anak_meniru_v2_1777551238274.png';
import legacyImg2 from '../assets/darkfem/parameter/legacy/istrilegacy_02_putus_rantai_v2_1777551252214.png';
import visibleImg1 from '../assets/darkfem/parameter/visible/istrivisible_01_perabot_v3_1777554172954.png';
import visibleImg2 from '../assets/darkfem/parameter/visible/istrivisible_02_potong_rambut_v3_1777554256681.png';
import softlifeImg1 from '../assets/darkfem/parameter/softlife/softlife_01_dimanjakan_v2_1777551018247.png';
import softlifeImg2 from '../assets/darkfem/parameter/softlife/softlife_02_independent_kosong_v2_1777551034803.png';


// === AUTO-GENERATED FULL PARAMETER IMPORTS ===
// -- softlife
import p_softlife_Campaign_Test_df_0412_g2 from '../assets/darkfem/parameter/softlife/Campaign_Test_df_0412_g2.png';
import p_softlife_df_0413_ba_wife_s1_v2_1776175429720 from '../assets/darkfem/parameter/softlife/df_0413_ba_wife_s1_v2_1776175429720.png';
import p_softlife_df_0413_ba_wife_s2_v2_1776175446156 from '../assets/darkfem/parameter/softlife/df_0413_ba_wife_s2_v2_1776175446156.png';
import p_softlife_df_0413_ba_wife_s3_v2_1776175462649 from '../assets/darkfem/parameter/softlife/df_0413_ba_wife_s3_v2_1776175462649.png';
import p_softlife_df_0413_ba_wife_s4_v2_1776175479780 from '../assets/darkfem/parameter/softlife/df_0413_ba_wife_s4_v2_1776175479780.png';
import p_softlife_df_0413_sl_s1_1776094453410 from '../assets/darkfem/parameter/softlife/df_0413_sl_s1_1776094453410.png';
import p_softlife_df_0413_sl_s3_1776094484568 from '../assets/darkfem/parameter/softlife/df_0413_sl_s3_1776094484568.png';
import p_softlife_df_0413_sl_s4_1776094503539 from '../assets/darkfem/parameter/softlife/df_0413_sl_s4_1776094503539.png';
import p_softlife_softlife_01_dimanjakan_v2_1777551018247 from '../assets/darkfem/parameter/softlife/softlife_01_dimanjakan_v2_1777551018247.png';
import p_softlife_softlife_02_independent_kosong_v2_1777551034803 from '../assets/darkfem/parameter/softlife/softlife_02_independent_kosong_v2_1777551034803.png';
// -- presence
import p_presence_Campaign_Test_df_0412_g5 from '../assets/darkfem/parameter/presence/Campaign_Test_df_0412_g5.png';
import p_presence_df_0424_ad07_single_sahabat from '../assets/darkfem/parameter/presence/df_0424_ad07_single_sahabat.png';
import p_presence_presence_01_diam_membunuh_1777550881301 from '../assets/darkfem/parameter/presence/presence_01_diam_membunuh_1777550881301.png';
import p_presence_presence_01_diam_membunuh_v2_1777550965342 from '../assets/darkfem/parameter/presence/presence_01_diam_membunuh_v2_1777550965342.png';
import p_presence_presence_02_invisible_dunia_v2_1777550999292 from '../assets/darkfem/parameter/presence/presence_02_invisible_dunia_v2_1777550999292.png';
// -- perubahan
import p_perubahan_df_0424_ad14_istri_gantirambut from '../assets/darkfem/parameter/perubahan/df_0424_ad14_istri_gantirambut.png';
import p_perubahan_perubahan_01_satu_shift_v2_1777551074543 from '../assets/darkfem/parameter/perubahan/perubahan_01_satu_shift_v2_1777551074543.png';
import p_perubahan_perubahan_02_frekuensi_salah_v2_1777551089169 from '../assets/darkfem/parameter/perubahan/perubahan_02_frekuensi_salah_v2_1777551089169.png';
// -- istrifear
import p_istrifear_istri_hanyakewajiban_1777216789917 from '../assets/darkfem/parameter/istrifear/istri_hanyakewajiban_1777216789917.png';
import p_istrifear_istri_membangunrumah from '../assets/darkfem/parameter/istrifear/istri_membangunrumah.png';
import p_istrifear_istri_menghapusjejak from '../assets/darkfem/parameter/istrifear/istri_menghapusjejak.png';
import p_istrifear_istri_menyesalmasatua_v2_1777216536956 from '../assets/darkfem/parameter/istrifear/istri_menyesalmasatua_v2_1777216536956.png';
import p_istrifear_istri_parfumwanitalain_v2_1777216520501 from '../assets/darkfem/parameter/istrifear/istri_parfumwanitalain_v2_1777216520501.png';
import p_istrifear_istri_sosialdeath_1777216244903 from '../assets/darkfem/parameter/istrifear/istri_sosialdeath_1777216244903.png';
import p_istrifear_istri_tatapankosong_v2_1777216488783 from '../assets/darkfem/parameter/istrifear/istri_tatapankosong_v2_1777216488783.png';
import p_istrifear_istri_tunggudewasa_1777216228611 from '../assets/darkfem/parameter/istrifear/istri_tunggudewasa_1777216228611.png';
import p_istrifear_istri_vigoruntukdia_1777216261041 from '../assets/darkfem/parameter/istrifear/istri_vigoruntukdia_1777216261041.png';
import p_istrifear_istrifear_01_hapusjejak_v2_1777551104410 from '../assets/darkfem/parameter/istrifear/istrifear_01_hapusjejak_v2_1777551104410.png';
import p_istrifear_istrifear_02_wanita_biasa_v2_1777551152675 from '../assets/darkfem/parameter/istrifear/istrifear_02_wanita_biasa_v2_1777551152675.png';
// -- highvalue
import p_highvalue_Campaign_Test_Ad_w1_Live_IG from '../assets/darkfem/parameter/highvalue/Campaign_Test_Ad_w1_-_Live_IG.png';
import p_highvalue_Campaign_Test_Ad_w3_Live_IG from '../assets/darkfem/parameter/highvalue/Campaign_Test_Ad_w3_-_Live_IG.png';
import p_highvalue_Campaign_Test_Ad_w7_Live_IG from '../assets/darkfem/parameter/highvalue/Campaign_Test_Ad_w7_-_Live_IG.png';
import p_highvalue_df_0420_w1_v3_1776639513543 from '../assets/darkfem/parameter/highvalue/df_0420_w1_v3_1776639513543.png';
import p_highvalue_highvalue_01_takut_kehilangan_v2_1777551172904 from '../assets/darkfem/parameter/highvalue/highvalue_01_takut_kehilangan_v2_1777551172904.png';
import p_highvalue_highvalue_02_balik_posisi_v2_1777551189312 from '../assets/darkfem/parameter/highvalue/highvalue_02_balik_posisi_v2_1777551189312.png';
// -- legacy
import p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274 from '../assets/darkfem/parameter/legacy/istrilegacy_01_anak_meniru_v2_1777551238274.png';
import p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214 from '../assets/darkfem/parameter/legacy/istrilegacy_02_putus_rantai_v2_1777551252214.png';
// -- nonggames
import p_nonggames_df_0424_ad02_centangbiru from '../assets/darkfem/parameter/nonggames/df_0424_ad02_centangbiru.png';
import p_nonggames_df_0424_ad02_centangbiru_v2 from '../assets/darkfem/parameter/nonggames/df_0424_ad02_centangbiru_v2.png';
import p_nonggames_df_0424_ad03_temansmanikah from '../assets/darkfem/parameter/nonggames/df_0424_ad03_temansmanikah.png';
import p_nonggames_df_0424_ad09_single_selingkuhan from '../assets/darkfem/parameter/nonggames/df_0424_ad09_single_selingkuhan.png';
import p_nonggames_df_0424_ad11_single_direktur_v2 from '../assets/darkfem/parameter/nonggames/df_0424_ad11_single_direktur_v2.png';
import p_nonggames_nongames_01_ghosted_lagi_v2_1777551270430 from '../assets/darkfem/parameter/nonggames/nongames_01_ghosted_lagi_v2_1777551270430.png';
import p_nonggames_nongames_02_predictable_v2_1777551327348 from '../assets/darkfem/parameter/nonggames/nongames_02_predictable_v2_1777551327348.png';
// -- visible
import p_visible_df_0424_ad05_istri_sexmati from '../assets/darkfem/parameter/visible/df_0424_ad05_istri_sexmati.png';
import p_visible_istrivisible_01_perabot_v3_1777554172954 from '../assets/darkfem/parameter/visible/istrivisible_01_perabot_v3_1777554172954.png';
import p_visible_istrivisible_02_potong_rambut_v3_1777554256681 from '../assets/darkfem/parameter/visible/istrivisible_02_potong_rambut_v3_1777554256681.png';

// Single Carousel Assets (general page wifeSection)
import singleC2First from '../assets/darkfem/single/c2single/first.png';
import singleC2S2 from '../assets/darkfem/single/c2single/df_0413_c2_s2_1776094206120.png';
import singleC2S3 from '../assets/darkfem/single/c2single/df_0413_c2_s3_1776094223527.png';
import singleC2S4 from '../assets/darkfem/single/c2single/df_0413_c2_s4_1776094241692.png';
import singleC3First from '../assets/darkfem/single/c3single/first.png';
import singleC3S2 from '../assets/darkfem/single/c3single/df_0413_sp_s2_1776094328010.png';
import singleC3S3 from '../assets/darkfem/single/c3single/df_0413_sp_s3_1776094342928.png';
import singleC3S4 from '../assets/darkfem/single/c3single/df_0413_sp_s4_1776094363097.png';
import singleC4First from '../assets/darkfem/single/c4single/first.png';
import singleC4S2 from '../assets/darkfem/single/c4single/df_0413_sl_s2_1776094469075.png';
import singleC4S3 from '../assets/darkfem/single/c4single/df_0413_sl_s3_1776094484568.png';
import singleC4S4 from '../assets/darkfem/single/c4single/df_0413_sl_s4_1776094503539.png';
import singleC5S1 from '../assets/darkfem/single/c5single/df_0413_jmp_s1_v2_1776172859297.png';
import singleC5S2 from '../assets/darkfem/single/c5single/df_0413_jmp_s2_v2_1776172873565.png';
import singleC5S3 from '../assets/darkfem/single/c5single/df_0413_jmp_s3_v2_1776172894595.png';
import singleC5S4 from '../assets/darkfem/single/c5single/df_0413_jmp_s4_v2_1776172913410.png';

// Before/After Single Assets
import baS1 from '../assets/darkfem/singlebefore/df_0413_ba_single_s1_v2_1776175357782.png';
import baS2 from '../assets/darkfem/singlebefore/df_0413_ba_single_s2_v2_1776175376164.png';
import baS3 from '../assets/darkfem/singlebefore/df_0413_ba_single_s3_v2_1776175390825.png';
import baS4 from '../assets/darkfem/singlebefore/df_0413_ba_single_s4_v2_1776175411659.png';

// Before/After Istri Assets
import baI1 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s1_v2_1776175429720.png';
import baI2 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s2_v2_1776175446156.png';
import baI3 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s3_v2_1776175462649.png';
import baI4 from '../assets/darkfem/singlebefore/istribefore/df_0413_ba_wife_s4_v2_1776175479780.png';

// Angle Section Assets
import angle7 from '../assets/darkfem/indo_image/angle7-Sebelum_vs_Sesudah.png';

// Winner Section Assets
import winnerSatuPerubahan from '../assets/darkfem/indo_image/winner-Satu_Perubahan-SENT.jpg';
import winnerCrAd from '../assets/darkfem/indo_image/Cr_Ad_DarkFem_A1_MALAM_INI,_CEWEK_"TE_1773316980_2026-03-12-ca3ded6f710055046854af8069d5876f-SENT.jpg';

// Asset Imports for EN
import df01En from '../assets/darkfem/english_image/df01_paradox_en.png';
import df04En from '../assets/darkfem/english_image/df04_secret_she_knows_en.png';
import df08En from '../assets/darkfem/english_image/df08_fantasy_screen_en.png';
import df09En from '../assets/darkfem/english_image/df09_wake_up_en.png';

// Asset Imports for PH
import df01Ph from '../assets/darkfem/philippines_image/df01_ph_paradox.png';
import df04Ph from '../assets/darkfem/philippines_image/df04_ph_friendzone.png';
import df08Ph from '../assets/darkfem/philippines_image/df08_ph_secret.png';
import df09Ph from '../assets/darkfem/philippines_image/df09_ph_wakeup.png';

const assetsMap: any = {
    id: {
        df01: df01Id, df04: df04Id,
        df08: df08Id, df09: df09Id,
        istriC1S1, istriC1S2, istriC1S3, istriC1S4,
        istriC2S1, istriC2S2, istriC2S3, istriC2S4,
        istriC3S1, istriC3S2, istriC3S3, istriC3S4,
        istriC4S1, istriC4S2, istriC4S3, istriC4S4,
        istriC5S1, istriC5S2, istriC5S3, istriC5S4,
        newIstri1, newIstri2, newIstri3, newIstri4, newIstri5, newIstri6, newIstri7, newIstri8, newIstri9, newIstri10, newIstri11,
        singleC2First, singleC2S2, singleC2S3, singleC2S4,
        singleC3First, singleC3S2, singleC3S3, singleC3S4,
        singleC4First, singleC4S2, singleC4S3, singleC4S4,
        singleC5S1, singleC5S2, singleC5S3, singleC5S4,
        baS1, baS2, baS3, baS4,
        baI1, baI2, baI3, baI4,
        angle7,
        winnerSatuPerubahan, winnerCrAd,
        presenceImg1, presenceImg2, perubahanImg1, perubahanImg2, highvalueImg1, highvalueImg2, nonggamesImg1, nonggamesImg2, istrifearImg1, istrifearImg2, legacyImg1, legacyImg2, visibleImg1, visibleImg2, softlifeImg1, softlifeImg2,
        p_softlife_Campaign_Test_df_0412_g2,
        p_softlife_df_0413_ba_wife_s1_v2_1776175429720,
        p_softlife_df_0413_ba_wife_s2_v2_1776175446156,
        p_softlife_df_0413_ba_wife_s3_v2_1776175462649,
        p_softlife_df_0413_ba_wife_s4_v2_1776175479780,
        p_softlife_df_0413_sl_s1_1776094453410,
        p_softlife_df_0413_sl_s3_1776094484568,
        p_softlife_df_0413_sl_s4_1776094503539,
        p_softlife_softlife_01_dimanjakan_v2_1777551018247,
        p_softlife_softlife_02_independent_kosong_v2_1777551034803,
        p_presence_Campaign_Test_df_0412_g5,
        p_presence_df_0424_ad07_single_sahabat,
        p_presence_presence_01_diam_membunuh_1777550881301,
        p_presence_presence_01_diam_membunuh_v2_1777550965342,
        p_presence_presence_02_invisible_dunia_v2_1777550999292,
        p_perubahan_df_0424_ad14_istri_gantirambut,
        p_perubahan_perubahan_01_satu_shift_v2_1777551074543,
        p_perubahan_perubahan_02_frekuensi_salah_v2_1777551089169,
        p_istrifear_istri_hanyakewajiban_1777216789917,
        p_istrifear_istri_membangunrumah,
        p_istrifear_istri_menghapusjejak,
        p_istrifear_istri_menyesalmasatua_v2_1777216536956,
        p_istrifear_istri_parfumwanitalain_v2_1777216520501,
        p_istrifear_istri_sosialdeath_1777216244903,
        p_istrifear_istri_tatapankosong_v2_1777216488783,
        p_istrifear_istri_tunggudewasa_1777216228611,
        p_istrifear_istri_vigoruntukdia_1777216261041,
        p_istrifear_istrifear_01_hapusjejak_v2_1777551104410,
        p_istrifear_istrifear_02_wanita_biasa_v2_1777551152675,
        p_highvalue_Campaign_Test_Ad_w1_Live_IG,
        p_highvalue_Campaign_Test_Ad_w3_Live_IG,
        p_highvalue_Campaign_Test_Ad_w7_Live_IG,
        p_highvalue_df_0420_w1_v3_1776639513543,
        p_highvalue_highvalue_01_takut_kehilangan_v2_1777551172904,
        p_highvalue_highvalue_02_balik_posisi_v2_1777551189312,
        p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274,
        p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214,
        p_nonggames_df_0424_ad02_centangbiru,
        p_nonggames_df_0424_ad02_centangbiru_v2,
        p_nonggames_df_0424_ad03_temansmanikah,
        p_nonggames_df_0424_ad09_single_selingkuhan,
        p_nonggames_df_0424_ad11_single_direktur_v2,
        p_nonggames_nongames_01_ghosted_lagi_v2_1777551270430,
        p_nonggames_nongames_02_predictable_v2_1777551327348,
        p_visible_df_0424_ad05_istri_sexmati,
        p_visible_istrivisible_01_perabot_v3_1777554172954,
        p_visible_istrivisible_02_potong_rambut_v3_1777554256681
    },
    en: {
        df01: df01En, df04: df04En,
        df08: df08En, df09: df09En,
    },
    ph: {
        df01: df01Ph, df04: df04Ph,
        df08: df08Ph, df09: df09Ph,
    }
};

const contentData: any = {
    id: {
        agitText: <>Lo diajarin dari kecil: jadi anak baik, jangan menggoda, tunggu dijemput bola. <strong>DAN APA HASILNYA?</strong> Lo jadi teman curhat favorit sementara dia milih yang lain.<br /><br /><ul className="agitation-list"><li>Yang setia → ditinggalin.</li><li>Yang sabar → diinjak.</li><li>Yang pengertian → dianggap lemah.</li></ul><br />Tapi cewek yang "biasa aja"? Dapat <span className="highlight">SEGALANYA</span>.<br /><br />Bukan karena dia cantik. Bukan karena dia beruntung.<br />Tapi karena dia <span className="highlight">PAHAM sesuatu yang TIDAK PERNAH lo pelajari.</span></>,
        solText: <>Panduan lengkap daya tarik wanita yang ditulis berdasarkan psikologi modern. Dari seni misteri, push-pull dynamics, sampai cara membangun aura yang bikin pria <strong>TIDAK BISA berhenti memikirkan kamu</strong>.<br /><br />Bukan tips murahan. Bukan saran "jadilah diri sendiri".<br />Tapi <strong>ILMU</strong> yang benar-benar <strong>MENGUBAH frekuensi kamu.</strong><br /><br /><div style={{background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.25)',borderRadius:'16px',padding:'20px 18px',marginTop:'8px'}}><div style={{fontSize:'13px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--purple-light)',marginBottom:'12px'}}>Rahasia yang Tidak Pernah Diajarkan</div><p style={{marginBottom:'12px'}}>Otak pria secara biologis <strong>diprogram untuk mengejar</strong> — bukan untuk menghargai yang terlalu mudah didapat. Bukan salahmu. Bukan salah dia. Ini <strong>cara kerja otaknya.</strong></p><p style={{marginBottom:'12px'}}>Ketika kamu terlalu available, terlalu baik, terlalu predictable — otaknya secara otomatis <strong>mengkategorikan kamu sebagai "aman"</strong>. Dan yang aman tidak membuat jantungnya berdegup.</p><p style={{marginBottom:'0'}}>Dark Feminine bukan tentang menjadi jahat. Ini tentang memahami <strong>frekuensi yang mengaktifkan bagian otaknya</strong> yang paling dalam — bagian yang membuatnya <em>tidak bisa berhenti memikirkanmu</em>. Inilah yang selama ini kamu cari. Dan inilah yang kami ajarkan.</p></div></>,
        checks: [
            <>Seni <strong>MISTERI</strong> — bagaimana jadi wanita yang tidak bisa ditebak</>,
            <><strong>PUSH-PULL</strong> Dynamics — menarik dan mendorong bersamaan</>,
            <>Bahasa tubuh yang bikin pria <strong>TIDAK BISA berpaling</strong></>,
            <>Kontrol emosi — kamu yang memegang kendali</>,
            <><strong>Abundance Mindset</strong> — berhenti mengejar, mulai MENARIK</>,
            <><strong>Silent Power</strong> — kekuatan dari DIAM</>,
            <><strong>Sexual Market Value</strong> — cara meningkatkan nilaimu</>,
            <><strong>Text Game</strong> — membuat dia ketagihan dari chat</>,
        ],
        checksPlus: "+ 44 jurus lainnya...",
        testis: [
            { text: "Demi allah sis, baru 2 minggu praktekin jurus 7... cowok yang dulu ghosting gue TIBA-TIBA nge-DM lagi. Padahal gue ga ngapa-ngapain. Cuma DIEM. Ternyata itu ilmunya 😭🔥", name: "Anisa, 24 thn", time: "2 hari lalu" },
            { text: "Suami gue yang tadinya cuek, sekarang GELISAH kalau gue keluar rumah. Bukan karena posesif. Tapi karena dia mulai TAKUT KEHILANGAN. Jurus 1 doang udah sedahsyat ini.", name: "Sari, 31 thn", time: "5 hari lalu" },
            { text: "Ex gue nikah sama cewek lain. 6 bulan kemudian gue apply dark feminine, gue dapet cowok yang 10x lebih ganteng dan kaya. Dan tau ga? Ex gue NGESTALK ig gue sekarang setiap hari. Karma is real 💅", name: "Rina, 27 thn", time: "1 minggu lalu" },
            { text: "Gue introvert parah, bahkan ngomong sama barista aja gugup. Tapi setelah baca jurus 12 soal 'aura diam', cowok-cowok di kantor mulai NOTICE gue. Bos gue sendiri bilang 'ada yang beda dari lo'. Padahal gue cuma UBAH CARA DIAM gue 😭✨", name: "Dinda, 25 thn", time: "3 hari lalu" },
            { text: "Gue career woman yang selalu dibilang 'terlalu kuat' sama cowok. Setelah apply jurus push-pull, sekarang CEO tempat gue kerja yang ngejar-ngejar gue. Bukan gue yang berubah jadi lemah, tapi gue jadi TAU KAPAN harus lembut 🔥👠", name: "Mega, 32 thn", time: "4 hari lalu" },
            { text: "Single mom 2 anak. Udah pasrah ga bakal ada yang mau. Baca ebook ini, praktekin jurus mystery... dalam 3 bulan ada 4 cowok mapan yang serius approach. Yang gue pilih? Dokter. Dan dia SAYANG banget sama anak-anak gue 🥹💜", name: "Wulan, 34 thn", time: "1 minggu lalu" },
            { text: "Anak kuliahan yang selalu jadi 'sahabat'. Cowok yang gue suka malah curhat soal cewek lain ke gue. Setelah apply jurus 3 dan 7, DIA YANG NEMBAK DULUAN. Temen-temen gue sampe bingung 'lo ngapain sih?' 😂💅", name: "Tasya, 21 thn", time: "6 hari lalu" },
            { text: "Nikah 8 tahun, suami udah kayak robot. Pulang kerja langsung HP. Gue praktekin jurus hot-cold selama 2 minggu... dia PANIK. Sekarang tiap weekend dia yang PLAN date night. Bahkan mulai kirim bunga lagi kayak waktu pacaran 🌹😍", name: "Fitri, 36 thn", time: "2 minggu lalu" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 hal)", desc: "Rahasia membuat dia terobsesi — dari inner confidence sampai seni manipulasi halus yang LEGAL", price: "Rp97.000" },
            { icon: "💜", title: "Kursus Femme Fatale (68 hal)", desc: "Program transformasi dari nice girl ke dark feminine — step by step", price: "Rp127.000" },
            { icon: "📅", title: "Workbook 30 Hari (73 hal)", desc: "Tantangan harian untuk membangun daya tarikmu dalam 30 hari", price: "Rp97.000" },
            { icon: "🗡️", title: "Seni Merayu — Robert Greene (31 hal)", desc: "Ringkasan strategi rayuan paling legendary sepanjang sejarah", price: "Rp77.000" },
            { icon: "👑", title: "High Value Woman (22 hal)", desc: "Panduan cepat menjadi wanita bernilai tinggi", price: "Rp57.000" },
            { icon: "✨", title: "Simply Irresistible (272 hal)", desc: "Unleash your inner siren — panduan lengkap dari studi kasus wanita paling memikat dalam sejarah", price: "Rp147.000" },
            { icon: "🔥", title: "How to Please Your Man (29 hal)", desc: "Rahasia ranjang yang bikin dia TUNDUK dan KETAGIHAN", price: "Rp97.000", isHighlight: true, highlightText: "Buku tabu yang sungguh-sungguh gila yang seringkali dijual terpisah ratusan ribu, memberi tahu rahasia bagaimana memuaskan pria... di sini menjadi GRATIS sebagai bonus." },
            { icon: "💋", title: "Selimut Ungu (61 hal)", desc: "Panduan puncak kenikmatan — teknik yang tidak diajarkan siapapun", price: "Rp97.000" },
        ],
        valueRows: [
            { title: "Ebook Utama: 52 Jurus Dark Feminine (156 hal)", price: "Rp199.000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 hal)", price: "Rp97.000" },
            { title: "Bonus 2: Kursus Femme Fatale (68 hal)", price: "Rp127.000" },
            { title: "Bonus 3: Workbook 30 Hari (73 hal)", price: "Rp97.000" },
            { title: "Bonus 4: Seni Merayu (31 hal)", price: "Rp77.000" },
            { title: "Bonus 5: High Value Woman (22 hal)", price: "Rp57.000" },
            { title: "Bonus 6: Simply Irresistible (272 hal)", price: "Rp147.000" },
            { title: "Bonus 7: How to Please Your Man (29 hal)", price: "Rp97.000" },
            { title: "Bonus 8: Selimut Ungu (61 hal)", price: "Rp97.000" },
        ],
        exclItems: [
            "Wanita yang masih percaya 'menunggu jodoh' itu cukup",
            "Yang tidak mau berubah dan hanya mau mengeluh",
            "Yang mencari cara instan tanpa effort",
            "Yang tidak siap meninggalkan 'nice girl' lama",
        ],
        winningGallery: {
            title: "Winning Techniques",
            sub: "Strategi Psikologi yang Telah Membantu Ribuan Wanita Mengubah Takdir Cintanya",
            images: [
                "winnerSatuPerubahan",
                "winnerCrAd"
            ]
        },
        faqs: [
            { q: "Bagaimana cara aksesnya?", a: "Setelah pembayaran, ebook dikirim ke WhatsApp kamu dalam 5 menit. Format HTML bisa dibaca di HP, tablet, atau komputer." },
            { q: "Apakah ini aman dan privat?", a: "100% privat. Tidak ada nama produk di bukti transfer. Semua dikirim digital, rahasia." },
            { q: "Bisakah Bayar Pakai Kartu Kredit?", a: "Bisa. Cukup gunakan QRIS, screenshot foto pembayarannya, lalu scan foto tersebut pakai kartu kredit kamu." },
            { q: "Apakah ini mengajarkan jadi pelakor?", a: "TIDAK. Dark Feminine mengajarkan kamu jadi HIGH VALUE WOMAN yang paham psikologi daya tarik. Bukan jadi orang jahat, tapi jadi BERHARGA." },
            { q: "Berapa lama sampai terasa hasilnya?", a: "Kebanyakan pembaca merasakan perubahan dalam 2-4 minggu setelah konsisten praktekkan. Jurus 1-7 sudah cukup powerful." },
            { q: "Apakah berlaku untuk yang berjilbab / religius?", a: "Ya. Dark Feminine bukan soal pakaian atau penampilan fisik. Ini tentang AURA, MISTERI, dan CARA BERPIKIR. Banyak pembaca kami yang berjilbab." },
        ],
        pains: [
            { icon: "😔", text: <>Selalu jadi "teman curhat" tapi bukan <strong>PILIHAN</strong> siapapun</> },
            { icon: "💔", text: <>Ditinggal atau diselingkuhi padahal sudah <strong>baik dan setia</strong></> },
            { icon: "😤", text: <>Iri sama wanita yang "biasa aja" tapi hidupnya lebih <strong>diperhatikan</strong></> },
            { icon: "📱", text: <>Nonton drama pelakor jam 2 pagi dan diam-diam <strong>pengen jadi DIA</strong></> },
            { icon: "🔄", text: <>Selalu attract yang salah — di-ghosted, diabaikan, atau tidak dihargai</> },
            { icon: "😶", text: <>Diberi label "terlalu baik" — yang artinya <strong>terlalu BORING</strong></> },
            { icon: "🛏️", text: <>Tidur di samping seseorang tapi merasa <strong>lebih sendirian</strong> dari sebelumnya</> },
            { icon: "📵", text: <>Sadar HP-nya lebih dapat <strong>perhatian</strong> daripada kamu</> },
            { icon: "😞", text: <>Sudah lakukan segalanya dengan benar — tapi tetap <strong>tidak dilihat</strong></> },
            { icon: "🪞", text: <>Lupa kapan terakhir kali merasa seperti <strong>WANITA</strong> — bukan hanya ibu, istri, atau karyawan</> },
        ],
        stories: [
            {
                img: 'df04',
                title: 'Selalu Jadi Pelabuhan. Tidak Pernah Jadi Tujuan.',
                body: `Dia cerita soal masalah hidupnya ke kamu sampai jam 1 pagi. Kamu dengarkan. Kamu support. Kamu kasih saran terbaik.\n\nDan keesokan harinya? Dia nembak cewek lain.\n\nKamu bingung. Marah. Tapi kamu tetap reply chat-nya. Karena kamu pikir — mungkin kalau kamu cukup sabar, cukup baik, cukup setia... akhirnya dia akan sadar.\n\nTapi itu tidak pernah terjadi. Karena kebaikan tanpa STRATEGI hanya akan membuat kamu jadi opsi, bukan prioritas.`
            },
        ],
        wifeSection: {
            label: "Dan Jikapun anda memiliki Pasangan",
            title: "Apakah Ini Kehidupan Pernikahan Yang Kamu Hadapi?",
            items: [
                { imgs: ['singleC2First','singleC2S2','singleC2S3','singleC2S4'], title: "Dulu vs Sekarang", desc: "Mengingat masa pacaran yang penuh bunga, sementara sekarang hanya ada rutinitas yang membosankan dan hambar." },
                { imgs: ['singleC4First','singleC4S2','singleC4S3','singleC4S4'], title: "Bersaing dengan Layar HP", desc: "Lelah mencoba menarik perhatiannya, tapi dia lebih memilih scroll sosmed daripada menatap matamu." },
                { imgs: ['singleC5S1','singleC5S2','singleC5S3','singleC5S4'], title: "Dia Pilih Segalanya, Kecuali Kamu", desc: "Hobi, teman, hingga pekerjaan selalu jadi prioritas. Kamu hanya ada di daftar terakhir waktu luangnya." },
                { imgs: ['newIstri9', 'newIstri4', 'newIstri9'], title: "DIA SEDANG MENGHAPUSMU DARI HIDUPNYA", desc: "Kamu pikir dia khilaf? Dia sedang menghapus jejakmu dari rekeningnya, dari rencana masa depannya, dan dari hatinya." },
                { imgs: ['newIstri2'], title: "BANGUN RUMAH DENGAN UANGMU", desc: "Setiap kali dia bilang uang diputar untuk bisnis, wanita itu sedang memilih furnitur untuk apartemen barunya." },
                { imgs: ['newIstri6'], title: "HANYA KEWAJIBAN", desc: "Sentuhannya terasa mekanis. Di tempat tidur, dia ingin segalanya cepat selesai karena pikirannya terbang ke wanita lain." },
                { imgs: ['newIstri8'], title: "ANAKMU SUDAH TAHU", desc: "Kamu pikir bertahan demi anak itu mulia? Di mata mereka, kamu hanya mengajarkan cara menjadi korban." },
                { imgs: ['newIstri11'], title: "PILIHAN KEDUA", desc: "Kamu mengorbankan segalanya demi keluarga, tapi dia mengorbankan keluarganya demi wanita lain." }
            ],
            beforeAfterSingle: { imgs: ['baS1','baS2','baS3','baS4'], title: "", body: "" },
            beforeAfterIstri: { imgs: ['baI1','baI2','baI3','baI4'], title: "", body: "" },
        },
        angleSection: {

            title: "Siap Untuk Transformasi?",
            items: [
                { img: 'angle7', title: "Sebelum vs Sesudah", desc: "Transformasi mindset yang akan mengubah cara dunia — and pria — memperlakukanmu." }
            ]
        },
        hesitationBox: {
            title: "Tunggu sebentar.",
            subtitle: "Kamu masih di sini — berarti ada sesuatu yang menahan.",
            body: [
                "Boleh jujur?",
                "Harga ini bukan yang kamu takutkan.",
                "Yang kamu takutkan adalah — bagaimana kalau ini benar-benar berhasil?",
                "Bagaimana kalau selama ini bukan nasibmu yang salah, tapi hanya satu hal kecil yang belum kamu tahu?",
                "Karena kalau itu benar — berarti semua rasa sakit itu... bisa dicegah.",
                "Berarti semua malam yang kamu habiskan menunggu, semua hubungan yang berakhir tanpa alasan jelas, semua kali kamu bertanya \"kenapa bukan aku?\" —",
                "Semua itu tidak harus terjadi.",
                "Dan sekarang kamu berdiri di depan pintunya. Harga secangkir kopi per minggu.",
                "Di satu sisi: jawaban yang sudah kamu cari bertahun-tahun.",
                "Di sisi lain: kembali ke loop yang sama — dengan orang yang berbeda.",
                "Pilihannya ada di tanganmu."
            ],
            objection: "Kami mengerti kalau kamu masih ragu. Keraguan itu wajar — bahkan itu tanda kamu serius.\n\nTapi ragu bukan alasan untuk tidak bergerak. Ragu adalah alasan untuk mencari tahu lebih dulu.",
            cta1: "Ya, saya siap berubah — Selesaikan Pembayaran",
            cta2: "Lihat dulu apa kata mereka yang sudah baca →",
            cta3: "Belum yakin? Baca dulu versi gratisnya — tanpa risiko",
            micro: "Ribuan wanita Indonesia sudah membaca ini malam ini. Besok pagi mereka bangun dengan cara pandang yang berbeda. Kamu bisa ikut — atau kamu bisa scroll kembali ke atas dan lanjutkan hari seperti biasa.\n\nKeduanya adalah pilihan yang valid. Tapi hanya satu yang mengubah sesuatu.",
            sting: "Harga ilmu ini tidak akan pernah lebih murah dari rasa sakit yang sudah kamu tanggung gratis selama ini."
        },
        urgency: (t: React.ReactNode) => <>⚡ HARGA SPESIAL — Berakhir dalam {t} ⚡</>,
        heroBadge: "🌙 PANDUAN RAHASIA WANITA",
        heroH1a: "Jadilah Wanita yang",
        heroH1b: "Tidak Bisa Dilupakan",
        heroSub: "52 jurus rahasia daya tarik yang tidak pernah diajarkan ibu, guru, atau siapapun.",
        heroCta: "DAPATKAN 52 JURUS SEKARANG →",
        socialProof: "sudah membuktikan",
        socialProofNum: "4.200+ wanita",
        painLabel: "JUJUR SAMA DIRI SENDIRI",
        painH2a: "Kamu Pernah Merasakan",
        painH2b: "Ini Semua?",
        agitH2a: 'Kenapa yang "Rendah"',
        agitH2b: "Malah Dapat CEO?",
        solLabel: "JAWABANNYA",
        solH2a: "Dark Feminine",
        solH2b: "52 Jurus Rahasia",
        contentsLabel: "YANG AKAN KAMU PELAJARI",
        contentsH2: "52 Jurus Daya Tarik",
        contentsH2Span: "Lengkap",
        testiLabel: "MEREKA SUDAH BUKTIKAN",
        testiH2: "Hasil Nyata dari",
        testiH2Span: "4.200+ Wanita",
        bonusLabel: "BONUS EKSKLUSIF",
        bonusH2: "8 Bonus Senilai",
        bonusH2Span: "Rp795.000",
        priceLabel: "INVESTASI SEUMUR HIDUP",
        priceH2: "Dapatkan Semuanya",
        priceTodayLabel: "Harga Hari Ini",
        savingsBadge: "🎉 Hemat 80% — Penawaran Terbatas!",
        priceCta: "DAPATKAN SEKARANG — Rp199.000",
        priceSub: "🚀 Dikirim INSTAN ke WhatsApp kamu",
        exclH2: "Dark Feminine BUKAN untuk:",
        exclCta: '"Ini HANYA untuk wanita yang SIAP mengambil kendali hidupnya."',
        faqLabel: "PERTANYAAN UMUM",
        faqH2: "Ada yang",
        faqH2Span: "Ditanyakan?",
        faqCta: "YA, SAYA SIAP BERUBAH →",
        faqSub: "🚀 Dikirim INSTAN ke WhatsApp kamu",
        stickyCta: "PESAN SEKARANG",
        stickyText: "🌙 52 Jurus —",
        stickyPrice: "Rp199.000",
        btnWa: "https://wa.me/6281234567890?text=Halo%20saya%20mau%20order%20Dark%20Feminine",
    },
    en: {
        agitText: <>You were taught from childhood: be nice, don't flirt, wait for Prince Charming. <strong>AND WHAT HAPPENED?</strong> You became everyone's favorite therapist while he chose someone else.<br /><br /><ul className="agitation-list"><li>The loyal one → left behind.</li><li>The patient one → walked over.</li><li>The understanding one → seen as weak.</li></ul><br />But the "average" girl? Gets <span className="highlight">EVERYTHING</span>.<br /><br />Not because she's pretty. Not because she's lucky.<br />Because she <span className="highlight">KNOWS something you were NEVER taught.</span></>,
        solText: <>A complete guide to feminine attraction based on modern psychology. From the art of mystery, push-pull dynamics, to building an aura that makes men <strong>UNABLE to stop thinking about you</strong>.<br /><br />Not cheap tips. Not "just be yourself" advice.<br />But <strong>KNOWLEDGE</strong> that truly <strong>CHANGES your frequency.</strong></>,
        checks: [
            <>The Art of <strong>MYSTERY</strong> — how to be unpredictable</>,
            <><strong>PUSH-PULL</strong> Dynamics — attract and repel simultaneously</>,
            <>Body language that makes him <strong>UNABLE to look away</strong></>,
            <>Emotional control — you hold the power</>,
            <><strong>Abundance Mindset</strong> — stop chasing, start ATTRACTING</>,
            <><strong>Silent Power</strong> — the strength of SILENCE</>,
            <><strong>Sexual Market Value</strong> — how to raise yours</>,
            <><strong>Text Game</strong> — make him addicted from texts</>,
        ],
        checksPlus: "+ 44 more moves...",
        testis: [
            { text: "I swear, just 2 weeks practicing move 7... the guy who ghosted me SUDDENLY DM'd again. I didn't do ANYTHING. Just stayed SILENT. Turns out that's the secret 😭🔥", name: "Anisa, 24", time: "2 days ago" },
            { text: "My husband who used to ignore me is now ANXIOUS when I leave the house. Not possessive. But because he's starting to FEAR LOSING ME. Just move 1 already this powerful.", name: "Sari, 31", time: "5 days ago" },
            { text: "My ex married someone else. 6 months later I applied dark feminine, I got a guy 10x more handsome and rich. And guess what? My ex now STALKS my IG every day. Karma is real 💅", name: "Rina, 27", time: "1 week ago" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 pages)", desc: "Secrets to making him obsessed — from inner confidence to the art of subtle (legal) influence", price: "Rp97,000" },
            { icon: "💜", title: "Femme Fatale Course (68 pages)", desc: "Transformation program from nice girl to dark feminine — step by step", price: "Rp127,000" },
            { icon: "📅", title: "30-Day Workbook (73 pages)", desc: "Daily challenges to build your attraction in 30 days", price: "Rp97,000" },
            { icon: "🗡️", title: "The Art of Seduction — Robert Greene (31 pages)", desc: "Summary of the most legendary seduction strategies in history", price: "Rp77,000" },
            { icon: "👑", title: "High Value Woman (22 pages)", desc: "Quick guide to becoming a high-value woman", price: "Rp57,000" },
            { icon: "✨", title: "Simply Irresistible (272 pages)", desc: "Unleash your inner siren — complete guide from case studies of history's most captivating women", price: "Rp147,000" },
            { icon: "🔥", title: "How to Please Your Man (29 pages)", desc: "Bedroom secrets that make him SUBMIT and ADDICTED", price: "Rp97,000", isHighlight: true, highlightText: "A taboo book often sold separately for hundreds of thousands, teaching you bedroom secrets to please a man... included here for FREE as a bonus." },
            { icon: "💋", title: "Purple Sheets (61 pages)", desc: "Guide to ultimate pleasure — techniques no one has taught you", price: "Rp97,000" },
        ],
        valueRows: [
            { title: "Main Ebook: 52 Dark Feminine Moves (156 pages)", price: "Rp199,000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 pages)", price: "Rp97,000" },
            { title: "Bonus 2: Femme Fatale Course (68 pages)", price: "Rp127,000" },
            { title: "Bonus 3: 30-Day Workbook (73 pages)", price: "Rp97,000" },
            { title: "Bonus 4: The Art of Seduction (31 pages)", price: "Rp77,000" },
            { title: "Bonus 5: High Value Woman (22 pages)", price: "Rp57,000" },
            { title: "Bonus 6: Simply Irresistible (272 pages)", price: "Rp147,000" },
            { title: "Bonus 7: How to Please Your Man (29 pages)", price: "Rp97,000" },
            { title: "Bonus 8: Purple Sheets (61 pages)", price: "Rp97,000" },
        ],
        exclItems: [
            "Women who still believe 'waiting for the right one' is enough",
            "Those who refuse to change and only complain",
            "Those looking for instant results with zero effort",
            "Those not ready to leave the old 'nice girl' behind",
        ],
        winningGallery: {
            title: "",
            sub: "",
            images: []
        },
        faqs: [
            { q: "How do I access it?", a: "After payment, the ebook is sent to your WhatsApp within 5 minutes. HTML format, readable on phone, tablet, or computer." },
            { q: "Is this safe and private?", a: "100% private. No product name on the payment receipt. Everything delivered digitally and discreetly." },
            { q: "Does this teach you to be a homewrecker?", a: "NO. Dark Feminine teaches you to be a HIGH VALUE WOMAN who understands the psychology of attraction. Not to be a bad person, but to be VALUABLE." },
            { q: "How long until I see results?", a: "Most readers feel a change within 2-4 weeks of consistent practice. Moves 1-7 are already powerful enough." },
            { q: "Does this apply for hijab-wearing / religious women?", a: "Yes. Dark Feminine is not about clothing or physical appearance. It's about AURA, MYSTERY, and MINDSET. Many of our readers wear hijab." },
        ],
        pains: [
            { icon: "😔", text: <>Always the 'best friend' but <strong>NEVER</strong> the first choice</> },
            { icon: "💔", text: <>Left or cheated on despite being loyal and good</> },
            { icon: "😤", text: <>Jealous of 'average' girls who get dream boyfriends</> },
            { icon: "📱", text: <>Watching drama at 2AM secretly wishing to <strong>BE her</strong></> },
            { icon: "🔄", text: <>Always attracting toxic guys — ghosted after 3 months</> },
            { icon: "😶", text: <>Labeled 'too nice' which really means 'too <strong>BORING</strong>'</> },
        ],
        urgency: (t: React.ReactNode) => <>⚡ SPECIAL PRICE — Ends in {t} ⚡</>,
        heroBadge: "🌙 SECRET WOMEN'S GUIDE",
        heroH1a: "Become the Woman",
        heroH1b: "He Can't Forget",
        heroSub: "52 secret attraction moves never taught by your mother, teachers, or anyone.",
        heroCta: "GET 52 SECRET MOVES NOW →",
        socialProof: "women have proven it",
        socialProofNum: "4,200+ women",
        painLabel: "BE HONEST WITH YOURSELF",
        painH2a: "Have You Ever",
        painH2b: "Felt All of This?",
        agitH2a: 'Why Does the "Average Girl"',
        agitH2b: "Get the CEO?",
        solLabel: "THE ANSWER",
        solH2a: "Dark Feminine",
        solH2b: "52 Secret Moves",
        contentsLabel: "WHAT YOU'LL LEARN",
        contentsH2: "52 Complete Attraction Moves",
        contentsH2Span: "Complete",
        testiLabel: "THEY'VE PROVEN IT",
        testiH2: "Real Results from",
        testiH2Span: "4,200+ Women",
        bonusLabel: "EXCLUSIVE BONUSES",
        bonusH2: "8 Bonuses Worth",
        bonusH2Span: "Rp795,000",
        priceLabel: "LIFETIME INVESTMENT",
        priceH2: "Get Everything",
        priceTodayLabel: "Today's Price",
        savingsBadge: "🎉 Save 80% — Limited Offer!",
        priceCta: "GET IT NOW — Rp199,000",
        priceSub: "📲 Delivered INSTANTLY to your WhatsApp",
        exclH2: "Dark Feminine is NOT for:",
        exclCta: '"This is ONLY for women READY to take control of their life."',
        faqLabel: "FAQ",
        faqH2: "Questions?",
        faqH2Span: "Anything?",
        faqCta: "YES, I'M READY TO CHANGE →",
        faqSub: "📲 Delivered INSTANTLY to your WhatsApp",
        stickyCta: "ORDER NOW",
        stickyText: "🌙 52 Moves —",
        stickyPrice: "Rp199,000",
        btnWa: "https://wa.me/6281234567890?text=Hello%20I%20want%20to%20order%20Dark%20Feminine",
    },
    ph: {
        agitText: <>Tinuruan ka mula bata pa: maging mabait, huwag lumandi, maghintay kay Prince Charming. <strong>AT ANO ANG NANGYARI?</strong> Naging paboritong therapist ka habang siya ay pumili ng iba.<br /><br /><ul className="agitation-list"><li>Ang tapat → iniwan.</li><li>Ang pasensyosa → tinapakan.</li><li>Ang maunawain → tinuring na mahina.</li></ul><br />Pero ang "ordinaryong" babae? Nakukuha ang <span className="highlight">LAHAT</span>.<br /><br />Hindi dahil maganda siya. Hindi dahil swerte siya.<br />Kundi dahil may <span className="highlight">ALAM SIYANG HINDI MO NATUTUNAN kailanman.</span></>,
        solText: <>Isang kumpletong gabay sa pambabaeng pang-akit batay sa modernong sikolohiya. Mula sa sining ng misteryo, push-pull dynamics, hanggang sa pagbuo ng aura na gagawing <strong>HINDI kana niya mawalay sa kanyang isip</strong>.<br /><br />Hindi murang tips. Hindi payong "maging totoo sa sarili".<br />Kundi isang <strong>KAALAMAN</strong> na tunay na <strong>MAGBABAGO sa iyong dalas (frequency).</strong></>,
        checks: [
            <>Ang Sining ng <strong>MISTERYO</strong> — paano maging hindi mahuhulaan</>,
            <><strong>PUSH-PULL</strong> Dynamics — mang-akit at magtulak nang sabay</>,
            <>Body language na gagawing <strong>HINDI siya makatingin sa iba</strong></>,
            <>Pagkontrol ng emosyon — ikaw ang may hawak ng kapangyarihan</>,
            <><strong>Abundance Mindset</strong> — tumigil sa paghahabol, magsimulang MANG-AKIT</>,
            <><strong>Silent Power</strong> — ang lakas ng KATAHIMIKAN</>,
            <><strong>Sexual Market Value</strong> — paano pataasin ang halaga mo</>,
            <><strong>Text Game</strong> — gawin siyang adik sa mga text mo</>,
        ],
        checksPlus: "+ 44 pang mga hakbang...",
        testis: [
            { text: "Grabe, 2 linggo ko palang pina-practice ang move 7... yung lalaking nag-ghost sakin BIGLANG nag-DM ulit. Wala akong ginawa. NANAHIMIK lang ako. Yun pala ang sikreto 😭🔥", name: "Anisa, 24", time: "2 araw ang nakalipas" },
            { text: "Ang asawa kong laging walang paki, ngayon ALIGAGA kapag aalis ako ng bahay. Hindi pagiging possessive. Kundi dahil nagsisimula siyang MATAKOT NA MAWALA AKO. Move 1 pa lang sobrang lakas na.", name: "Sari, 31", time: "5 araw ang nakalipas" },
            { text: "Kinabukasan ng ex ko, ikinasal siya sa iba. Makalipas ang 6 na buwan, sinubukan ko ang dark feminine, at nakakuha ako ng lalaking 10x na mas gwapo at mayaman. At alam niyo ba? Ini-ISTALK ako ngayon ng ex ko araw-araw. Karma is real 💅", name: "Rina, 27", time: "1 linggo ang nakalipas" },
        ],
        bonuses: [
            { icon: "🌙", title: "Femme Fatale Secrets (140 pahina)", desc: "Mga sikreto para gawin siyang baliw sa iyo — mula sa kumpiyansa sa sarili hanggang sa sining ng banayad (na legal) na impluwensya", price: "Rp97,000" },
            { icon: "💜", title: "Femme Fatale Course (68 pahina)", desc: "Programa ng transpormasyon mula sa mabait na babae hanggang sa dark feminine — hakbang-hakbang", price: "Rp127,000" },
            { icon: "📅", title: "30-Day Workbook (73 pahina)", desc: "Pang-araw-araw na hamon upang buuin ang iyong pang-akit sa loob ng 30 araw", price: "Rp97,000" },
            { icon: "🗡️", title: "The Art of Seduction — Robert Greene (31 pahina)", desc: "Buod ng mga pinakalegendaryong estratehiya sa pang-aakit sa kasaysayan", price: "Rp77,000" },
            { icon: "👑", title: "High Value Woman (22 pahina)", desc: "Mabilisang gabay upang maging babaeng may mataas na halaga", price: "Rp57,000" },
            { icon: "✨", title: "Simply Irresistible (272 pahina)", desc: "Palabasin ang iyong angking pang-akit — kumpletong gabay mula sa mga case study ng mga pinakanakakabighaning babae sa kasaysayan", price: "Rp147,000" },
            { icon: "🔥", title: "How to Please Your Man (29 pahina)", desc: "Mga sikreto sa kwarto na magpapabaliw at magpapasuko sa kanya", price: "Rp97,000", isHighlight: true, highlightText: "Isang taboo na aklat na madalas ibinebenta nang hiwalay sa libu-libong halaga, nagtuturo ng mga sikreto sa kwarto upang mapasaya ang lalaki... isinama rito nang LIBRE bilang bonus." },
            { icon: "💋", title: "Selimut Ungu (61 pahina)", desc: "Gabay sa sukdulang sarap — mga teknik na hindi itinuro ninuman", price: "Rp97,000" },
        ],
        valueRows: [
            { title: "Main Ebook: 52 Dark Feminine Moves (156 pahina)", price: "Rp199,000" },
            { title: "Bonus 1: Femme Fatale Secrets (140 pahina)", price: "Rp97,000" },
            { title: "Bonus 2: Femme Fatale Course (68 pahina)", price: "Rp127,000" },
            { title: "Bonus 3: 30-Day Workbook (73 pahina)", price: "Rp97,000" },
            { title: "Bonus 4: The Art of Seduction (31 pahina)", price: "Rp77,000" },
            { title: "Bonus 5: High Value Woman (22 pahina)", price: "Rp57,000" },
            { title: "Bonus 6: Simply Irresistible (272 pahina)", price: "Rp147,000" },
            { title: "Bonus 7: How to Please Your Man (29 pahina)", price: "Rp97,000" },
            { title: "Bonus 8: Purple Sheets (61 pahina)", price: "Rp97,000" },
        ],
        exclItems: [
            "Mga babaeng naniniwala pa rin na sapat na ang 'maghintay sa tamang tao'",
            "Mga taong tumatangging magbago at puro reklamo lamang",
            "Mga naghahanap ng instant na resulta na walang kasamang pagsisikap",
            "Mga hindi pa handang talikuran ang lumang pagiging 'mabait' at 'boring'",
        ],
        winningGallery: {
            title: "",
            sub: "",
            images: []
        },
        faqs: [
            { q: "Paano ko ito maa-access?", a: "Pagkatapos ng pagbabayad, ipapadala ang ebook sa iyong WhatsApp sa loob ng 5 minuto. Sa format na HTML, na mababasa sa telepono, tablet, o computer." },
            { q: "Ito ba ay ligtas at pribado?", a: "100% pribado. Walang pangalan ng produkto sa resibo ng pagbabayad. Ang lahat ay ihinahatid sa digital at pribadong paraan." },
            { q: "Tinuturuan ba nito akong manira ng relasyon?", a: "HINDI. Itinuturo ng Dark Feminine na maging isang HIGH VALUE WOMAN na nakakaintindi ng sikolohiya ng pang-akit. Hindi upang maging masamang tao, kundi upang maging MAHALAGA." },
            { q: "Gaano katagal bago ko makita ang resulta?", a: "Pansin ng karamihan sa aming mambabasa ang pagbabago sa loob ng 2-4 linggo ng tuloy-tuloy na pagsasanay. Ang Move 1-7 ay sapat na para makita ang malaking pagbabago." },
            { q: "Maaari ba itong gamitin ng mga relihiyosong babae?", a: "Oo. Ang Dark Feminine ay hindi tungkol sa damit o panlabas na anyo. Ito ay tungkol sa AURA, MISTERYO, at PANANAW SA BUHAY. Marami sa aming mga mambabasa ay nakahi-jab." },
        ],
        pains: [
            { icon: "😔", text: <>Laging 'best friend' pero <strong>HINDI</strong> kailanman ang unang pili</> },
            { icon: "💔", text: <>Iniwan o niloko kahit tapat at mabuti ka</> },
            { icon: "😤", text: <>Naiinggit sa mga 'ordinaryong' babae na nakukuha ang mga pangarap mong lalaki</> },
            { icon: "📱", text: <>Nanunuod ng drama ng 2AM at palihim na hinahangad na <strong>MAGING katulad niya</strong></> },
            { icon: "🔄", text: <>Laging nakakaakit ng toxic na lalaki — ghinost pagkatapos ng 3 buwan</> },
            { icon: "😶", text: <>Binansagang 'sobrang bait' na ang tunay na ibig sabihin ay 'sobrang <strong>NAKAKAINIP</strong>'</> },
        ],
        urgency: (t: React.ReactNode) => <>⚡ SPECIAL PRICE — Matatapos sa {t} ⚡</>,
        heroBadge: "🌙 SIKRETONG GABAY NG MGA BABAE",
        heroH1a: "Maging Babaeng",
        heroH1b: "Hindi Niya Makakalimutan",
        heroSub: "52 sikretong hakbang sa pang-aakit na hindi itinuro kailanman ng iyong ina, guro, o sinuman.",
        heroCta: "KUNIN ANG 52 SIKRETONG HAKBANG NGAYON →",
        socialProof: "na babae ang nagpatunay",
        socialProofNum: "4,200+ babae",
        painLabel: "MAGING TAPAT SA IYONG SARILI",
        painH2a: "Naranasan Mo Na Ba",
        painH2b: "Ang Lahat Nang Ito?",
        agitH2a: 'Bakit Yung "Ordinaryong Babae"',
        agitH2b: "Ang Nakakuha Ng CEO?",
        solLabel: "ANG SAGOT",
        solH2a: "Dark Feminine",
        solH2b: "52 Sikretong Hakbang",
        contentsLabel: "ANG IYONG MATUTUTUNAN",
        contentsH2: "52 Kumpletong Hakbang",
        contentsH2Span: "Pang-akit",
        testiLabel: "NAPATUNAYAN NA NILA",
        testiH2: "Tunay na Resulta Mula",
        testiH2Span: "Sa 4,200+ Babae",
        bonusLabel: "EKSKLUSIBONG BONUSES",
        bonusH2: "8 Bonus na Nagkakahalaga ng",
        bonusH2Span: "Rp795,000",
        priceLabel: "PANGHABAMBUHAY NA INVESTMENT",
        priceH2: "Kunin Ang Lahat",
        priceTodayLabel: "Presyo Ngayon",
        savingsBadge: "🎉 Makatipid ng 80% — Limitadong Alok!",
        priceCta: "KUNIN NA NGAYON — Rp199,000",
        priceSub: "📲 Ipapasa IMMEDIATELY sa iyong WhatsApp",
        exclH2: "Ang Dark Feminine ay HINDI para sa:",
        exclCta: '"Ito ay PARA LAMANG sa mga babaeng HANDA ng hawakan ang kontrol sa kanilang buhay."',
        faqLabel: "Mga Madalas Itanong",
        faqH2: "Mayroon Pa Bang",
        faqH2Span: "Tanong?",
        faqCta: "OO, HANDA NA AKONG MAGBAGO →",
        faqSub: "📲 Ipapasa IMMEDIATELY sa iyong WhatsApp",
        stickyCta: "UMORDER NGAYON",
        stickyText: "🌙 52 Hakbang —",
        stickyPrice: "Rp199,000",
        btnWa: "https://wa.me/6281234567890?text=Hello%20Gusto%20kong%20umorder%20ng%20Dark%20Feminine",
    }
};


const MOCK_REVIEWS = [
    { name: "nisa.ayu***@gmail.com", rating: 5, text: "Demi allah sis, baru 2 minggu praktekin jurus 7... cowok yang dulu ghosting gue TIBA-TIBA nge-DM lagi. Padahal gue ga ngapa-ngapain. Cuma DIEM. Ternyata itu ilmunya 😭🔥", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-12 10:20:00" },
    { name: "sari_19***@yahoo.co.id", rating: 4, text: "Suami gue yang tadinya cuek, sekarang GELISAH kalau gue keluar rumah. Bukan karena posesif. Tapi karena dia mulai TAKUT KEHILANGAN. Bintang 4 karena butuh waktu buat biasa nahan emosi, tapi ilmunya daging banget.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-03-11 15:45:00" },
    { name: "r.agustin***@hotmail.com", rating: 5, text: "Ex gue nikah sama cewek lain. 6 bulan kemudian gue apply dark feminine, gue dapet cowok yang 10x lebih ganteng dan kaya. Dan tau ga? Ex gue NGESTALK ig gue sekarang setiap hari. Karma is real 💅", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-03-10 09:12:00" },
    { name: "dindakh***@gmail.com", rating: 4, text: "Gue introvert parah, bahkan ngomong sama barista aja gugup. Tapi setelah baca jurus 12 soal 'aura diam', cowok-cowok di kantor mulai NOTICE gue. Bos gue sendiri bilang 'ada yang beda dari lo'. Padahal gue cuma UBAH CARA DIAM gue 😭✨", lang: "id", country: "PH", flag: "🇵🇭", created_at: "2026-03-10 21:30:00" },
    { name: "mega.wat***@gmail.com", rating: 3, text: "Ilmunya bagus, tapi prakteknya butuh mental baja buat yang terbiasa jadi people pleaser. Masih pelan-pelan nyoba nerapin push-pull, belum berani maksimal.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-09 18:05:00" },
    { name: "wulansari.***@gmail.com", rating: 5, text: "Single mom 2 anak. Udah pasrah ga bakal ada yang mau. Baca ebook ini, praktekin jurus mystery... dalam 3 bulan ada 4 cowok mapan yang serius approach. Yang gue pilih? Dokter. Dan dia SAYANG banget sama anak-anak gue 🥹💜", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-03-08 14:10:00" },
    { name: "tasya.luth***@yahoo.com", rating: 4, text: "Anak kuliahan yang selalu jadi 'sahabat'. Cowok yang gue suka malah curhat soal cewek lain ke gue. Setelah apply jurus 3 dan 7, DIA YANG NEMBAK DULUAN. Kurang satu bintang karena materinya lumayan panjang buat dibaca wkwk.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-03-08 08:22:00" },
    { name: "fitri.hiday***@gmail.com", rating: 5, text: "Nikah 8 tahun, suami udah kayak robot. Pulang kerja langsung HP. Gue praktekin jurus hot-cold selama 2 minggu... dia PANIK. Sekarang tiap weekend dia yang PLAN date night. Bahkan mulai kirim bunga lagi kayak waktu pacaran 🌹😍", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-03-07 19:33:00" },
    { name: "jessica.m***@gmail.com", rating: 5, text: "The abundance mindset chapter changed my life! I stopped chasing and now he's the one double texting.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-07 11:11:00" },
    { name: "maria.vic***@yahoo.com", rating: 4, text: "Push-pull dynamics is literally magic. Used it on a guy who was pulling away, and he asked me out the next day.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-06 16:20:00" },
    { name: "lucy_h***@hotmail.com", rating: 5, text: "Never thought psychology could be applied to dating this effectively. Highly recommend!", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-06 10:05:00" },
    { name: "tara.wil***@gmail.com", rating: 5, text: "I tried the mystery techniques and it drove my husband crazy in a good way. We feel like newlyweds again.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-05 22:45:00" },
    { name: "chloe.m***@gmail.com", rating: 3, text: "Good book, but some techniques take a lot of confidence to pull off. Still practicing. Not a magical overnight fix.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-05 08:12:00" },
    { name: "kathy.smit***@yahoo.com", rating: 5, text: "Worth every penny. The bonuses alone are worth more than the price.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-04 14:55:00" },
    { name: "emily.r***@gmail.com", rating: 5, text: "This actually works. I was skeptical but the text game examples are spot on.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-04 09:30:00" },
    { name: "sarah.b***@hotmail.com", rating: 4, text: "The Femme Fatale Secrets bonus is my favorite. Unleashed a side of me I didn't know existed.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-03 20:18:00" },
    { name: "amelia.col***@gmail.com", rating: 5, text: "My SMV definitely went up after reading this. Men treat me with so much more respect now.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-03 12:40:00" },
    { name: "maya.l***@yahoo.com", rating: 5, text: "I love how practical the 30-day workbook is. Keeps you accountable.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-03-02 18:22:00" },
    { name: "rachel.d***@gmail.com", rating: 3, text: "Informative, but I wish there were more video examples of the body language.", lang: "en", country: "PH", flag: "🇵🇭", created_at: "2026-03-02 09:12:00" },
    { name: "natalie.j***@hotmail.com", rating: 5, text: "This is the holy grail for women who are tired of being the 'nice girl'.", lang: "en", country: "SG", flag: "🇸🇬", created_at: "2026-03-01 16:45:00" },
    { name: "olivia.k***@gmail.com", rating: 5, text: "Great insights on emotional control. Helps not just in dating but in career too.", lang: "en", country: "MY", flag: "🇲🇾", created_at: "2026-02-28 11:30:00" },
    { name: "helen.p***@yahoo.com", rating: 5, text: "I read Robert Greene's book before, but this summarizes it perfectly for modern dating.", lang: "en", country: "PH", flag: "🇵🇵", created_at: "2026-02-27 15:20:00" },
    { name: "cindy.99***@gmail.com", rating: 4, text: "Bahasanya gampang dimengerti. Bonusnya banyak banget dan sangat membantu.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-27 10:05:00" },
    { name: "nadila.sd***@gmail.com", rating: 5, text: "Dari sekedar 'teman curhat' sekarang aku jadi prioritas utama. Nangis banget akhirnya ngerti cara mainnya.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-26 21:18:00" },
    { name: "bella.put***@yahoo.com", rating: 5, text: "Aku nerapin ilmu ini ke gebetan yang toxic, akhirnya aku yang pegang kendali sekarang.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-02-25 14:40:00" },
    { name: "viona.ri***@gmail.com", rating: 4, text: "Nyesel baru tau ilmu ini sekarang. Kalau aja dari dulu tau, gak bakal diselingkuhin.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-24 12:22:00" },
    { name: "putri.sar***@hotmail.com", rating: 3, text: "Gila sih ini dark feminine beneran bikin aura kita beda. Cuma menurut aku butuh waktu buat bener-bener nerapin, agak susah buat aku yang introvert murni.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-23 18:30:00" },
    { name: "gisel.t***@gmail.com", rating: 5, text: "Jurus hot-cold nya ampuh banget buat cowok yang suka ghosting.", lang: "id", country: "PH", flag: "🇵🇭", created_at: "2026-02-22 09:12:00" },
    { name: "yuni.w***@yahoo.com", rating: 5, text: "Bonus How to Please Your Man nya... wow. Suami makin lengket hahaha.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-21 15:45:00" },
    { name: "zahra.yu***@gmail.com", rating: 4, text: "Baru baca setengah tapi udah berasa perubahannya. Mantap pokoknya.", lang: "id", country: "SG", flag: "🇸🇬", created_at: "2026-02-20 10:20:00" },
    { name: "ulfa.z***@hotmail.com", rating: 5, text: "Sekarang aku ngerti kenapa cewek biasa aja bisa dapet cowok tajir. Ternyata ini rahasianya.", lang: "id", country: "ID", flag: "🇮🇩", created_at: "2026-02-19 19:30:00" },
    { name: "qonita.x***@gmail.com", rating: 5, text: "Gak bohong, ilmu ini bener-bener bikin cowok takut kehilangan kita.", lang: "id", country: "MY", flag: "🇲🇾", created_at: "2026-02-18 11:11:00" }
];

const getFlagForCountry = (countryCode: string) => {
    switch (countryCode?.toUpperCase()) {
        case 'ID': return '🇮🇩';
        case 'SG': return '🇸🇬';
        case 'MY': return '🇲🇾';
        case 'DE': return '🇩🇪';
        case 'KR': return '🇰🇷';
        case 'CN': return '🇨🇳';
        case 'US': return '🇺🇸';
        case 'GB': return '🇬🇧';
        case 'CA': return '🇨🇦';
        case 'AU': return '🇦🇺';
        default: return '🇮🇩';
    }
};

const IstriCarousel = ({ story, assets }: { story: any; assets: any }) => {
    const imgs: string[] = story.imgs ?? (story.img ? [story.img] : []);
    const [active, setActive] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const prev = () => setActive(a => (a - 1 + imgs.length) % imgs.length);
    const next = () => setActive(a => (a + 1) % imgs.length);

    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        touchStartX.current = null;
    };

    if (imgs.length === 0) return null;

    return (
        <div className="df-fade-in" style={{ marginBottom: '48px' }}>
            <div className="df-wife-card">
                <div style={{ position: 'relative' }}
                    onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    <DbgImg
                        src={assets[imgs[active]]}
                        alt={story.title}
                        className="df-wife-img"
                        style={{ transition: 'opacity 0.25s ease', display: 'block', width: '100%' }}
                        label={imgs[active]}
                    />
                    {/* Dot indicators — only show if more than 1 image */}
                    {imgs.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 20 }}>
                            {imgs.map((_: any, i: number) => (
                                <button key={i} onClick={() => setActive(i)} style={{
                                    width: i === active ? '20px' : '8px', height: '8px',
                                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                                    background: i === active ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                                    transition: 'all 0.2s ease', padding: 0
                                }} />
                            ))}
                        </div>
                    )}
                    {/* Arrow buttons — only show if more than 1 image */}
                    {imgs.length > 1 && <>
                        <button onClick={prev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(135deg, #e91e8c, #c2185b)', border: 'none', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 2px 12px rgba(233,30,140,0.5)' }}>‹</button>
                        <button onClick={next} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(135deg, #e91e8c, #c2185b)', border: 'none', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 2px 12px rgba(233,30,140,0.5)' }}>›</button>
                    </>}
                </div>
                <div className="df-wife-content">
                    <h3 className="df-wife-title" style={{ fontSize: '22px', lineHeight: 1.3 }}>{story.title}</h3>
                    <div style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--cream)', opacity: 0.92, whiteSpace: 'pre-line' }}>
                        {story.body}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DarkFeminineTSX = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const hasEn = searchParams.has('en');
    const hasSg = searchParams.has('sg');
    const hasId = searchParams.has('id');
    const hasPh = searchParams.has('ph');
    const hasIstri = searchParams.has('istri');
    const hasSoftlife = searchParams.has('softlife');
    const hasDisc = searchParams.has('disc');
    const hasValue = searchParams.has('value') || window.location.search.includes('value') || searchParams.has('pay') || window.location.search.includes('pay');
    // === New Winning Ad Parameters (copy-only, images TBD) ===
    const hasPresence = searchParams.has('presence');           // Single/General — df_0412_g5
    const hasPerubahan = searchParams.has('perubahan');         // General — winner-Satu_Perubahan
    const hasHighvalue = searchParams.has('highvalue');         // General — angle11
    const hasNongames = searchParams.has('nongames');           // Single — DF_Ghosted_Lagi
    const hasIstriFear = searchParams.has('istrifear');         // Istri — df_0424_ad04
    const hasIstriLegacy = searchParams.has('istrilegacy');     // Istri — istritest10
    const hasIstriVisible = searchParams.has('istrivisible');   // Istri — df_0412_i4
    const isIstriSegment = hasIstri || hasIstriFear || hasIstriLegacy || hasIstriVisible;
    const segment = isIstriSegment ? 'istri' : 'default';
    const initLang = hasEn ? 'en' : (hasSg ? 'sg' : (hasPh ? 'ph' : (hasId ? 'id' : (searchParams.get('lang') === 'en' ? 'en' : 'id'))));
    const [lang, setLang] = useState<'id' | 'en' | 'sg' | 'ph'>(initLang as 'id' | 'en' | 'sg' | 'ph');

    const handleLangChange = (newLang: 'id' | 'en' | 'sg' | 'ph') => {
        setLang(newLang);
        setSearchParams({ [newLang]: '' });

        // Auto-select PayPal if English is chosen
        if (newLang === 'en' || newLang === 'sg' || newLang === 'ph') {
            setPayment("PAYPAL");
        } else {
            setPayment("QRIS");
        }
    };

    // Calculate base product name based on language/country parameter
    const getBaseProductName = () => {
        if (lang === 'en') return "Dark Feminine EN";
        if (lang === 'sg') return "Universal Dark Feminine SG";
        if (lang === 'ph') return "Universal Dark Feminine PH";
        return "Universal Dark Feminine ID"; // Default ID
    };

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState(initLang === 'en' || initLang === 'sg' || initLang === 'ph' ? "PAYPAL" : "QRIS");
    const [retailOpen, setRetailOpen] = useState(false);
    const [addUpsell, setAddUpsell] = useState(0); // 0=base, 1=+LoveMagnet, 2=Ultimate
    const { toast } = useToast();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [anonymousReviewEmail, setAnonymousReviewEmail] = useState("");
    const [showReviewsCount, setShowReviewsCount] = useState(10);
    const [dbReviews, setDbReviews] = useState<any[]>([]);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [pendingReviewPayload, setPendingReviewPayload] = useState<any>(null);
    const freeEbookNameRef = useRef<HTMLInputElement>(null);

    const fetchDbReviews = async () => {
        const { data } = await (supabase as any).from('reviews_darkfeminine').select('*').order('created_at', { ascending: false });
        if (data) setDbReviews(data);
    };

    const downloadQRIS = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `QRIS-DarkFeminine-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            // Fallback for CORS
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        // Preload all carousel images into browser cache so clicks are instant
        const carouselImages = [
            istriC1S1, istriC1S2, istriC1S3, istriC1S4,
            istriC2S1, istriC2S2, istriC2S3, istriC2S4,
            istriC3S1, istriC3S2, istriC3S3, istriC3S4,
            istriC4S1, istriC4S2, istriC4S3, istriC4S4,
            istriC5S1, istriC5S2, istriC5S3, istriC5S4,
            singleC2First, singleC2S2, singleC2S3, singleC2S4,
            singleC3First, singleC3S2, singleC3S3, singleC3S4,
            singleC4First, singleC4S2, singleC4S3, singleC4S4,
            singleC5S1, singleC5S2, singleC5S3, singleC5S4,
            baS1, baS2, baS3, baS4,
            baI1, baI2, baI3, baI4,
        ];
        carouselImages.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    useEffect(() => {
        fetchDbReviews();

        // Consolidated Auto-scroll logic for ?free-ebook, ?reviews, or ?pay
        const hasFreeEbook = searchParams.has('free-ebook') || window.location.hash === '#free-ebook';
        const hasReviews = searchParams.has('reviews') || window.location.hash === '#reviews-section';
        const hasPay = searchParams.has('pay') || window.location.hash === '#checkout-button';

        if (hasFreeEbook || hasReviews || hasPay) {
            const scrollTimer = setTimeout(() => {
                let targetId = 'free-ebook';
                if (hasReviews) targetId = 'reviews-section';
                if (hasPay) targetId = 'checkout';
                
                const element = document.getElementById(targetId);
                
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: (hasFreeEbook || hasPay) ? 'start' : 'start' 
                    });

                    // Auto-focus logic
                    setTimeout(() => {
                        if (hasFreeEbook && freeEbookNameRef.current) {
                            freeEbookNameRef.current.focus();
                        } else if (hasPay) {
                            // Focus name field in checkout since we are paying
                            const nameField = document.querySelector('input[placeholder="Nama Lengkap"]') as HTMLInputElement;
                            if (nameField) nameField.focus();
                        }
                    }, 600);
                }
            }, 1200); // Longer delay for mobile layout stability
            return () => clearTimeout(scrollTimer);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoginLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail.trim().toLowerCase(),
                password: loginPassword,
            });
            if (error) throw error;
            if (data.user) {
                toast({ title: "Login Berhasil" });
                setShowLoginModal(false);
            }
        } catch (error: any) {
            toast({ title: "Login Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!loginEmail) {
            toast({ title: "Masukkan Email", description: "Isi email terlebih dahulu untuk reset password.", variant: "destructive" });
            return;
        }
        setIsLoginLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                loginEmail.trim().toLowerCase(),
                { redirectTo: 'https://app.elvisiongroup.com/reset-password?darkfemininereviews=https://ai.elvisiongroup.com/darkfeminine?reviews' }
            );
            if (error) throw error;
            toast({ title: "Reset Email Terkirim", description: "Silahkan Cek Inbox / Important anda." });
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const submitReview = async (confirmedEmail?: string) => {
        const emailToUse = confirmedEmail || anonymousReviewEmail.trim().toLowerCase();

        if (!emailToUse || !emailToUse.includes('@')) {
            toast({ title: "Oops!", description: "Silahkan masukkan email yang valid.", variant: "destructive" });
            return;
        }
        if (!reviewRating) {
            toast({ title: "Oops!", description: "Silahkan beri rating bintang terlebih dahulu.", variant: "destructive" });
            return;
        }
        if (!reviewText || reviewText.trim() === '') {
            toast({ title: "Oops!", description: "Ulasan tidak boleh kosong.", variant: "destructive" });
            return;
        }

        setIsLoginLoading(true);
        try {
            // Check if review already exists for this email
            const { data: existingReview } = await (supabase as any).from('reviews_darkfeminine').select('*').eq('user_email', emailToUse).maybeSingle();

            if (existingReview && !confirmedEmail) {
                setPendingReviewPayload({ email: emailToUse, rating: reviewRating, comment: reviewText });
                setShowUpdateConfirm(true);
                setIsLoginLoading(false);
                return;
            }

            // Optional: check if they are already verified in another way or if this is a privileged email
            let isVerifiedFlag = false;
            if (existingReview?.is_verified) {
                isVerifiedFlag = true;
            } else {
                // Quick check to global_product for PAID status to set is_verified immediately
                const { data: paidEntry } = await (supabase as any).from('global_product').select('status').eq('email', emailToUse).eq('status', 'PAID').maybeSingle();
                if (paidEntry) isVerifiedFlag = true;
            }

            const payload = {
                user_email: emailToUse,
                name: emailToUse.split('@')[0],
                rating: reviewRating,
                comment: reviewText,
                country: lang.toUpperCase(),
                is_verified: isVerifiedFlag
            };

            if (existingReview) {
                await (supabase as any).from('reviews_darkfeminine').update(payload).eq('id', existingReview.id);
                toast({ title: "Review diupdate" });
            } else {
                await (supabase as any).from('reviews_darkfeminine').insert([payload]);
                toast({ title: "Review ditambahkan" });
            }
            
            setShowUpdateConfirm(false);
            setPendingReviewPayload(null);
            fetchDbReviews();
        } catch (error: any) {
            toast({ title: "Gagal submit review", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    // Payment States
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

    // Free Ebook States
    const [nameFree, setNameFree] = useState("");
    const [waFree, setWaFree] = useState("");
    const [emailFree, setEmailFree] = useState("");
    const [loadingFree, setLoadingFree] = useState(false);
    const [successFree, setSuccessFree] = useState(false);

    const priceID = addUpsell === 2 ? 399000 : addUpsell === 1 ? (hasDisc ? 200000 : 249000) : 199000;
    const priceUSD = addUpsell === 2 ? 30 : addUpsell === 1 ? 19 : 15;
    const isEnglish = lang === 'en' || lang === 'sg' || lang === 'ph';
    const finalAmount = isEnglish ? priceUSD : priceID;
    const finalCurrency = isEnglish ? 'USD' : 'IDR';


    const PIXEL_ID = '3319324491540889';



    const submitOrder = async () => {
        if (!name || !phone || !email) { alert('⚠️ Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!'); return; }
        if (!payment) { alert('⚠️ Silahkan pilih metode pembayaran!'); return; }

        setLoading(true);
        // Robust phone sanitization
        let cleanPhone = phone.trim().replace(/\D/g, '');
        if (lang === 'id') {
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '62' + cleanPhone.slice(1);
            } else if (!cleanPhone.startsWith('62')) {
                cleanPhone = '62' + cleanPhone;
            }
        } else if (lang === 'ph') {
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '63' + cleanPhone.slice(1);
            } else if (!cleanPhone.startsWith('63')) {
                cleanPhone = '63' + cleanPhone;
            }
        }
        
        

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();
        const productDesc = `${getBaseProductName()} - ${name}`;

        try {
            trackAddPaymentInfoEvent(
                { content_name: productDesc, value: finalAmount, currency: finalCurrency },
                undefined,
                PIXEL_ID,
                { em: email, ph: cleanPhone, fn: name, fbc: fbc || undefined, fbp: fbp || undefined }
            );
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID, eventName: 'AddPaymentInfo', eventSourceUrl: window.location.href,
                    customData: { content_name: productDesc, value: finalAmount, currency: finalCurrency },
                    userData: { 
                        fbc, fbp, 
                        client_ip_address: clientIp, 
                        fn: name, 
                        ph: cleanPhone, 
                        em: email,
                        external_id: await sha256(email) // Boost match quality
                    }
                }
            });
        } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

        let finalBCAAmount = finalAmount;
        if (payment === 'BCA_MANUAL') {
            const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999
            finalBCAAmount = finalAmount + uniqueCode;
            console.log(`BCA Manual Unique Code: ${uniqueCode}, Total: ${finalBCAAmount}`);
        }

        const payload = {
            subscriptionType: 'universal', paymentMethod: payment,
            userName: name, userEmail: email, phoneNumber: cleanPhone,
            address: 'Digital', province: 'Digital', kota: 'Digital', kecamatan: 'Digital', kodePos: '00000',
            amount: finalBCAAmount, currency: finalCurrency, quantity: 1, productName: addUpsell === 2 ? `${getBaseProductName()} Ultimate (Blueprint + Workbook + Q&A)` : addUpsell === 1 ? `${getBaseProductName()} + Love Magnet` : getBaseProductName(),
            fbc, fbp, clientIp,
            pageUrl: window.location.href
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });
            if (error) { throw error; }

            if (data?.success) {
                if (data.userAlreadyExists) {
                    toast({
                        title: lang === 'id' ? "Akun sudah terdaftar" : "Account already registered",
                        description: lang === 'id' ? "Lanjutkan pakai akun asli anda secara otomatis." : "Continuing automatically with your original account.",
                        duration: 5000,
                    });
                }
                setPaymentData(data);
                
                // If it's an e-wallet (DANA, OVO, SHOPEEPAY) and we have a checkout URL, redirect to Tripay "The App"
                const redirectMethods = ['DANA', 'OVO', 'SHOPEEPAY', 'LINKAJA', 'SAKUKU'];
                if (data.checkoutUrl && redirectMethods.includes(payment)) {
                    window.location.href = data.checkoutUrl;
                    return;
                }

                // If PayPal, redirect to checkoutUrl directly
                if (payment === 'PAYPAL' && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return;
                }

                setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(data?.error || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e: any) {
            console.error('Payment API Error:', e);
            const errorMessage = e?.message || e?.error?.message || e?.toString() || 'Unknown Error';
            alert(`Sistem mendeteksi error: ${errorMessage}\n\nMohon screenshot pesan ini dan hubungi admin via WhatsApp.`);
        } finally { setLoading(false); }
    };

    const submitFreeEbook = async () => {
        if (!nameFree || !waFree || !emailFree) {
            alert('Harap isi Nama, WhatsApp, dan Email.');
            return;
        }

        let formattedWa = waFree.trim().replace(/\D/g, '');
        if (lang === 'id') {
            if (formattedWa.startsWith('0')) {
                formattedWa = '62' + formattedWa.slice(1);
            } else if (!formattedWa.startsWith('62')) {
                formattedWa = '62' + formattedWa;
            }
        } else if (lang === 'ph') {
            if (formattedWa.startsWith('0')) {
                formattedWa = '63' + formattedWa.slice(1);
            } else if (!formattedWa.startsWith('63')) {
                formattedWa = '63' + formattedWa;
            }
        }

        setLoadingFree(true);
        try {
            // 📝 Record lead in darkfeminine_free
            try {
                await (supabase.from('darkfeminine_free' as any) as any).insert({
                    user_email: emailFree,
                    phone: formattedWa
                } as any);
            } catch (leadErr) {
                console.error('⚠️ Lead recording error (non-fatal):', leadErr);
            }

            const payload = {
                userEmail: emailFree,
                userName: nameFree,
                phone: formattedWa,
                id: lang // parameter indonesia, etc.
            };

            const { data, error } = await supabase.functions.invoke('send-ebooks-free', {
                body: payload
            });

            if (error) throw error;

            if (data?.success) {
                setSuccessFree(true);

                // 📊 CAPI: Fire custom "FreeEbook" event to Meta
                try {
                    const { fbc, fbp } = getFbcFbpCookies();
                    const clientIp = await getClientIp();
                    await supabase.functions.invoke('capi-universal', {
                        body: {
                            pixelId: PIXEL_ID,
                            eventName: 'FreeEbook',
                            eventSourceUrl: window.location.href,
                            customData: {
                                content_name: `Free Ebook Dark Feminine (${lang.toUpperCase()})`,
                                value: 0,
                                currency: lang === 'id' ? 'IDR' : 'USD'
                            },
                            userData: {
                                fbc, fbp,
                                client_ip_address: clientIp,
                                fn: nameFree,
                                ph: formattedWa,
                                em: emailFree,
                                external_id: await sha256(emailFree) // Boost match quality
                            }
                        }
                    });
                    // console.log('✅ CAPI FreeEbook event sent');
                } catch (capiErr) {
                    console.error('⚠️ CAPI FreeEbook error (non-fatal):', capiErr);
                }
            } else {
                alert(data?.error || 'Gagal mengirim WhatsApp. Silahkan coba lagi nanti.');
            }
        } catch (error: any) {
            console.error('Free Ebook API Error:', error);
            const errorMsg = error?.message || error?.error?.message || error?.toString() || 'Kesalahan jaringan';
            alert(`Terjadi kesalahan: ${errorMsg}`);
        } finally {
            setLoadingFree(false);
        }
    };

    const scrollToForm = useCallback(() => { document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }); }, []);
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-df-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload: any) => {
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;
                        toast({ title: "🎉 Pembayaran Berhasil!", description: "Terima kasih! Pembayaran Anda telah kami terima. Link akses Ebook Dark Feminine akan dikirimkan ke Email dan WhatsApp.", duration: 0 });
                        // Note: Purchase tracking is handled by the backend tripay-callback, so we only track AddPaymentInfo and PageView/ViewContent on frontend.
                    }
                }
            ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData, PIXEL_ID, priceID, toast]);

    // Eagerly capture fbclid from URL before pixel loads, so fbc is available at payment time
    useEffect(() => {
        handleFbcCookieManager();
    }, []);

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackPageViewEvent({}, undefined, PIXEL_ID);
        trackViewContentEvent(
            { content_name: 'Universal - Dark Feminine', value: priceID, currency: 'IDR' },
            undefined,
            PIXEL_ID
        );
    }, [PIXEL_ID]);

    const contentLang = lang; // Since all 3 (id, en, ph) exist now, map directly OR map sg back to en
    const c = contentData[contentLang === 'sg' ? 'en' : contentLang];
    const assets = assetsMap[contentLang === 'sg' ? 'en' : contentLang];

    // === SEGMENT OVERRIDES (?istri / ?softlife / ?single / new winners) ===

    // ?presence — Persona "Magnetic Presence" (Juara 1: df_0412_g5, 28 sales) — Single/General
    // Tema: Kekuatan "diam" yang mematikan. Wanita yang masuk ruangan dan auranya bicara.
    // Berhenti mengejar perhatian — mulai menjadi pusat perhatian secara alami.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const presenceContent = (hasPresence && segment !== 'istri') ? {
        heroBadge: "✨ MAGNETIC PRESENCE — KEKUATAN DIAM",
        heroH1a: "Dia Tidak Bicara.",
        heroH1b: "Tapi Seluruh Ruangan Memperhatikannya.",
        heroSub: "Untuk wanita yang lelah mengejar perhatian. Yang capek menjadi 'pilihan kedua' di setiap ruangan. Ada wanita yang masuk tanpa berkata apa-apa — dan semua mata otomatis menoleh. Auranya bicara duluan. Itu bukan keberuntungan. Itu protokol.",
        painLabel: "PROTOKOL MAGNETIC PRESENCE",
        painH2a: "Kenapa Kamu Berusaha Keras Agar Dilihat,",
        painH2b: "Tapi Tetap Tidak Terlihat?",
        stories: [
            {
                imgs: [],
                title: 'Dia Diam. Tapi Setiap Pria Di Ruangan Itu Sadar Dia Ada.',
                body: `Pernah lihat wanita seperti itu? Dia masuk ke kafe, ke kantor, ke ruang meeting — dan tanpa bicara, atmosfer ruangan berubah.\n\nDia tidak teriak. Tidak posting OOTD setiap hari. Tidak nge-flex apapun. Tapi setiap pria diam-diam mencuri pandang. Setiap wanita diam-diam menelaah caranya berdiri, caranya duduk, caranya melihat.\n\nDan kamu? Kamu sudah menyiapkan outfit terbaik, makeup paling rapi, caption paling clever — tapi tetap merasa transparan. Seperti tidak ada yang benar-benar melihatmu.\n\nMasalahnya bukan penampilanmu. Masalahnya frekuensi yang kamu pancarkan.`
            },
            {
                imgs: [],
                title: 'Berhenti Mengejar. Mulai Menjadi Yang Dikejar.',
                body: `Berapa banyak energi yang sudah kamu buang untuk "berusaha menarik perhatian"?\n\nReply chat dalam hitungan detik. Selalu jadi yang inisiatif. Selalu jadi yang bilang "kapan kita ketemu lagi?" duluan. Selalu jadi yang menyesuaikan jadwal.\n\nDan hasilnya? Mereka anggap kamu "selalu available" — alias mudah. Otak pria didesain untuk MENGEJAR. Yang terlalu mudah didapat, kehilangan nilainya secara biologis.\n\nMagnetic presence adalah kebalikannya. Kamu bukan menjadi sulit dijangkau — kamu menjadi seseorang yang nilainya terasa setiap dia mendekatimu.`
            },
            {
                imgs: [],
                title: 'Aura Bukan Tentang Kecantikan. Tapi Tentang Sertifikasi Internal.',
                body: `Wanita dengan aura magnetic tidak selalu yang paling cantik. Kadang kulitnya biasa. Kadang badannya tidak ideal. Kadang umurnya sudah 35+.\n\nTapi cara dia memegang gelas, cara dia tertawa, cara dia mendengarkan — semuanya seperti membawa pesan: "Aku tahu siapa diriku, dan aku tidak butuh persetujuan siapapun."\n\nItulah yang otak pria deteksi dalam 3 detik pertama. Sebelum percakapan. Sebelum kamu sempat menjelaskan apa-apa.\n\nDan itu yang akan kamu pelajari. Bukan "tips PDe murahan" — tapi protokol membangun frekuensi internal yang tidak bisa dipalsukan.`
            }
        ],
        pains: [
            { icon: "👁️", text: <>Kamu sudah dandan rapi, sudah hadir, sudah berusaha menarik perhatian — tapi <strong>tetap tidak terlihat</strong>.</> },
            { icon: "🔇", text: <>Pria yang kamu suka justru tertarik pada wanita yang <strong>jarang bicara</strong>, sementara kamu sudah cerita panjang lebar.</> },
            { icon: "🪞", text: <>Kamu tahu kamu menarik. Tapi entah kenapa, <strong>auramu tidak pernah sampai duluan</strong> sebelum kata-katamu.</> },
            { icon: "🏃‍♀️", text: <>Lelah jadi yang <strong>selalu mengejar</strong>, selalu inisiatif, selalu menyesuaikan — dan tetap diabaikan.</> },
            { icon: "🌑", text: <>Kamu tidak butuh trik manipulasi. Kamu butuh <strong>frekuensi yang membuat dunia menoleh dengan sendirinya</strong>.</> },
            { icon: "👑", text: <>Saatnya berhenti mengetuk pintu. Mulai menjadi <strong>ruangan itu sendiri</strong>.</> },
        ],
        paramAgitation: {
            label: "AGITASI — REALITA YANG TIDAK KAMU HITUNG",
            h2a: "Berapa Banyak Pria",
            h2b: "Yang Sudah Kamu Lepaskan?",
            imgKey: 'p_presence_Campaign_Test_df_0412_g5', // IMG SLOT
            body: <>Coba hitung. Lima tahun terakhir, berapa banyak pria yang awalnya intens, kemudian menghilang dalam 2-4 minggu? <strong>Bukan karena kamu kurang cantik.</strong> Bukan karena dia "tidak siap". Tapi karena auramu sudah <strong>"pasaran" sebelum dia sempat penasaran.</strong><br /><br />Setiap chat balasan dalam 5 detik. Setiap "iya, terserah kamu" untuk lokasi date. Setiap senyum yang terlalu cepat. Setiap "aku juga suka kamu" yang dilempar terlalu awal.<br /><br />Setiap pria yang lepas <strong>mengambil sebagian kepercayaan dirimu bersamanya</strong> — sampai akhirnya kamu mulai bertanya: "Apakah ada yang salah denganku?"<br /><br /><strong>Tidak ada yang salah denganmu.</strong> Yang salah adalah frekuensi yang kamu pancarkan tanpa sadar.</>,
        },
        paramHope: {
            label: "VISI BARU — HIDUP YANG BISA MENJADI MILIKMU",
            h2a: "Bayangkan Kamu Masuk Ruangan",
            h2b: "Dan Semuanya Berubah.",
            imgKey: 'p_presence_df_0424_ad07_single_sahabat', // IMG SLOT
            body: <>Bayangkan: kamu masuk kafe Sabtu sore. Tidak ada outfit istimewa, tidak ada makeup mahal — tapi <strong>3 kepala otomatis menoleh.</strong> Barista pria yang biasanya datar tiba-tiba salah ketik orderan karena gugup. Pria di meja sebelah pura-pura sibuk dengan laptop, tapi matanya curi pandang setiap 30 detik.<br /><br />Bayangkan: pria yang <strong>dulu ghosting kamu</strong> — tiba-tiba muncul di DM bulan depan, "Hai, lama ga ngobrol. Apa kabar?" Kamu read, smile, tidak balas. Karena kamu sudah <strong>level berbeda</strong> sekarang.<br /><br />Bayangkan: di kantor, ada CEO baru. Selama 2 minggu pertama, dia tidak pernah benar-benar memandang siapapun. Sampai suatu hari, dia melewati meja kamu, berhenti sebentar, dan tanya: "Sudah lunch?" Itulah <strong>magnetic presence</strong> bekerja.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "3 Tahap Membangun",
            h2b: "Frekuensi Magnetic.",
            imgKey: 'p_presence_presence_01_diam_membunuh_1777550881301', // IMG SLOT
            steps: [
                { num: '1', title: 'AUDIT KEBOCORAN ENERGI (Hari 1-7)', body: 'Kamu identifikasi 7 micro-leak yang menjatuhkan frekuensimu — tempo balas chat, eye contact yang terlalu lama, senyum yang terlalu cepat, "sorry" yang berlebihan, justifikasi yang tidak diminta. Kamu sadar persis di mana energi kamu "tumpah" setiap hari.' },
                { num: '2', title: 'RESET POLA INTERNAL (Hari 8-21)', body: 'Kamu ganti micro habits dengan protokol baru: jeda 3 detik sebelum bicara, postur "high status", regulasi reaksi emosional. Otakmu mulai mengirim sinyal baru ke orang lain — tanpa kamu harus pura-pura.' },
                { num: '3', title: 'ANCHORING — JADI OTOMATIS (Hari 22+)', body: 'Setelah 3 minggu, frekuensi baru sudah jadi default. Kamu tidak lagi "berusaha" magnetic. Auramu bicara duluan, sebelum kata-katamu. Pria mulai mendekati tanpa kamu undang. Wanita mulai mengamati cara kamu duduk. Dunia menyesuaikan ke arahmu.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Bagaimana",
            h2b: "Kalau...?",
            items: [
                { q: "Saya introvert parah, bisa bicara saja sudah gugup. Apakah ini cocok untuk saya?", a: "Justru introvert adalah modal terbaik magnetic presence. Wanita introvert sudah memiliki 50% komponen alaminya: ketenangan, jeda, tidak butuh banyak validasi. Yang kamu pelajari hanya bagaimana mengarahkan kekuatan diam itu. Banyak pembaca paling sukses adalah introvert berat." },
                { q: "Saya sudah 38 tahun. Apakah belum terlambat?", a: "Magnetic presence justru lebih powerful di usia 30+ karena didukung maturity yang tidak bisa difake oleh wanita 20-an. Banyak pengguna mendapat hasil terbaik di usia 35-45 — termasuk dilamar oleh pria 5-7 tahun lebih muda yang sebelumnya 'tidak menyadari mereka'." },
                { q: "Apakah ini hanya teori? Saya sudah baca banyak self-help.", a: "Ini bukan teori 'love yourself first'. Ini 52 jurus konkret dengan langkah harian yang bisa kamu praktekkan langsung. Setiap jurus disertai contoh kalimat, contoh sikap, dan contoh skenario nyata. Bukan motivasi — protokol." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Wanita.",
            h2b: "3 Frekuensi Yang Berubah.",
            transformations: [
                {
                    name: 'Rini, 27 thn — Project Manager',
                    imgKey: 'p_presence_presence_01_diam_membunuh_v2_1777550965342', // IMG SLOT
                    before: 'Saya hidup di Slack & WhatsApp. Setiap pria yang approach, dalam 2 minggu pasti hilang. Saya pikir saya "terlalu sibuk untuk mereka". Padahal aslinya saya "terlalu kelihatan butuh validasi" — chat balasan 30 detik, follow back IG-nya hari pertama, like setiap story-nya.',
                    after: 'Setelah 21 hari praktek, Senior Director kantor saya sendiri yang DM saya duluan — padahal 2 tahun cuek total. Yang berubah cuma satu: saya berhenti membalas dalam hitungan detik. Saya berhenti tertawa di setiap candaan. Saya jadi diam. Dan sekarang dia yang mengejar saya.',
                },
                {
                    name: 'Mira, 32 thn — Dokter Gigi',
                    imgKey: 'p_presence_presence_02_invisible_dunia_v2_1777550999292', // IMG SLOT
                    before: 'Saya cantik (semua bilang gitu), karir bagus, mandiri secara finansial. Tapi setiap kali ke kondangan, saya selalu pulang sendirian. Pria-pria mapan tertarik 1-2 minggu lalu menghilang. Saya mulai berpikir mungkin saya "intimidating".',
                    after: 'Bukan saya yang intimidating. Saya yang frekuensinya salah — terlalu mengejar percakapan. Setelah saya pelajari jeda dan eye contact yang tepat, dalam 3 bulan saya bertemu seorang pengusaha 38 tahun yang bilang "saya kira kamu tidak akan tertarik dengan saya, makanya saya nekat ngajak ngobrol duluan". Sekarang kami sudah tunangan.',
                },
                {
                    name: 'Anya, 24 thn — Mahasiswa S2',
                    imgKey: 'p_presence_Campaign_Test_df_0412_g5', // IMG SLOT
                    before: 'Saya selalu jadi "teman dekat" — tidak pernah jadi yang mereka kejar. Dengar curhatan banyak pria, tapi tidak ada yang serius mendekati saya. Saya merasa transparan di kelas penuh wanita yang lebih "biasa" dari saya tapi punya pacar.',
                    after: 'Saya sadar saya selalu memberi semua dalam percakapan pertama — bercerita panjang, tertawa keras, langsung memberi solusi atas masalah mereka. Setelah saya terapkan jurus mystery dan jeda, dosen pembimbing saya mengundang saya makan malam private (saya sopan menolak), dan dua teman lama tiba-tiba "menyadari" saya. Salah satunya sekarang pacar saya.',
                },
            ],
        },
    } : null;

    // ?perubahan — Persona "Energy Shift Transformation" (winner-Satu_Perubahan, 8 sales) — General
    // Tema: Perubahan internal kecil dengan dampak masif. Frekuensi wanita yang tadinya
    // ditolak/diabaikan menjadi sangat diinginkan setelah 1 perubahan pola pikir.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const perubahanContent = (hasPerubahan && segment !== 'istri') ? {
        heroBadge: "💜 ENERGY SHIFT — SATU PERUBAHAN",
        heroH1a: "Bukan Cantikmu Yang Kurang.",
        heroH1b: "Frekuensimu Yang Salah.",
        heroSub: "Untuk wanita yang sudah mencoba segalanya — diet, skincare mahal, baju baru, kelas kecantikan — tapi tetap merasa 'kurang'. Yang kamu butuhkan bukan transformasi fisik. Bukan kerja keras 12 bulan. Hanya 1 perubahan internal — dan seluruh dunia mulai memperlakukanmu berbeda.",
        painLabel: "RAHASIA ENERGY SHIFT — SATU PERUBAHAN",
        painH2a: "Kamu Sama Cantiknya. Sama Pintarnya.",
        painH2b: "Lalu Kenapa Hidupnya Lebih Mudah?",
        stories: [
            {
                imgs: ['p_perubahan_df_0424_ad14_istri_gantirambut'],
                title: 'Wanita Yang Sama. Frekuensi Berbeda. Hasil 180° Berbeda.',
                body: `Coba pikirkan ini: ada dua wanita dengan wajah, badan, dan latar belakang yang nyaris identik. Pendidikan sama. Karir sama. Bahkan style fashion sama.\n\nTapi yang satu — selalu ditolak, selalu di-ghosting, selalu jadi 'teman curhat'. Yang satu lagi? Pria mengantri. Pesan masuk tiap hari. Dilamar dalam 6 bulan.\n\nApa bedanya? Bukan fisik. Bukan IQ. Bukan saldo rekening. Hanya satu hal: FREKUENSI. Dan frekuensi itu bisa diubah dalam hitungan minggu — kalau kamu tahu apa yang harus diubah.`
            },
            {
                imgs: ['p_perubahan_perubahan_01_satu_shift_v2_1777551074543'],
                title: 'Kamu Sudah Coba Semua. Kecuali 1 Hal Ini.',
                body: `Ke-mall berapa kali untuk beli baju baru? Berapa kelas yoga, kelas makeup, kelas public speaking? Berapa juta untuk skincare premium? Berapa banyak self-help book yang sudah dibaca?\n\nDan tetap saja — ada wanita yang lebih biasa darimu, tapi hidupnya lebih lembut. Tetap jadi center of attention. Tetap dipilih.\n\nKarena masalahnya bukan di luar. Masalahnya di FREKUENSI INTERNAL — pola pikir, energi, cara kamu memandang dirimu sendiri. Dan SATU shift di sana mengubah segalanya.`
            },
            {
                imgs: ['p_perubahan_perubahan_02_frekuensi_salah_v2_1777551089169'],
                title: 'Bukan 100 Perubahan. Hanya 1. Tapi Yang Tepat.',
                body: `Kebanyakan self-help mengatakan: "Ubah 47 hal di hidupmu." Diet, olahraga, jurnal pagi, meditasi, networking, bla bla bla. Hasilnya kamu kewalahan, lalu menyerah.\n\nKenyataannya? Wanita yang bertransformasi tidak mengubah 47 hal. Mereka mengubah SATU hal — yang tepat. Dan itu memicu efek domino di setiap area lain hidupnya.\n\nApa hal itu? Itulah yang akan kamu pelajari di Dark Feminine. Bukan 1000 trik manipulasi — tapi 1 shift fundamental yang membuat semua trik lain otomatis bekerja.`
            }
        ],
        pains: [
            { icon: "🔄", text: <>Kamu sudah ubah penampilan, kerjaan, lingkaran teman — <strong>tapi nasibmu tidak berubah</strong>.</> },
            { icon: "💸", text: <>Sudah keluarkan jutaan untuk skincare, kelas, retreat — <strong>hasilnya tetap sama</strong>.</> },
            { icon: "😩", text: <>Kamu lelah dengan saran "love yourself first" yang <strong>tidak pernah menjelaskan caranya</strong>.</> },
            { icon: "📉", text: <>Wanita lain dengan modal lebih sedikit — <strong>hidupnya lebih lembut</strong>. Dan kamu tahu itu bukan keberuntungan.</> },
            { icon: "⚡", text: <>Yang kamu butuhkan bukan 100 perubahan. Tapi <strong>1 perubahan yang tepat</strong> — yang memicu semua perubahan lain.</> },
            { icon: "🦋", text: <>Saatnya berhenti memperbaiki yang luar. <strong>Geser frekuensi yang dalam</strong> — dan dunia akan menyesuaikan.</> },
        ],
        paramAgitation: {
            label: "AGITASI — KAMU SUDAH MEMBAYAR HARGANYA",
            h2a: "Hitung Berapa Juta",
            h2b: "Yang Sudah Kamu Investasikan.",
            imgKey: 'p_perubahan_df_0424_ad14_istri_gantirambut', // IMG SLOT
            body: <>Skincare premium 6 juta. Klinik kecantikan 18 juta. Gym dan personal trainer 12 juta setahun. Kursus public speaking 5 juta. Self-help book yang kamu beli tapi belum sempat habis dibaca — minimal 2 juta. <strong>Total puluhan juta dalam 3 tahun.</strong><br /><br />Lalu hasilnya? Kamu memang lebih cantik. Lebih fit. Lebih artikulatif. Tapi <strong>nasibmu tidak berubah.</strong> Pria yang kamu suka tetap memilih wanita yang lebih biasa darimu. Bos kamu tetap memberi promosi pada rekan yang skill-nya di bawahmu.<br /><br />Dan kamu mulai bertanya: <strong>"Apa yang kurang dari saya?"</strong><br /><br />Jawabannya bukan di luar. Bukan di tubuhmu, bukan di IQ-mu, bukan di rekening tabunganmu. Yang kurang adalah <strong>1 shift internal</strong> — dan tanpa shift itu, semua investasi luar tadi <strong>hanya plester di atas luka yang lebih dalam.</strong></>,
        },
        paramHope: {
            label: "VISI BARU — KEHIDUPAN SETELAH SHIFT",
            h2a: "Bayangkan Bangun Pagi",
            h2b: "Dengan Frekuensi Yang Benar.",
            imgKey: 'p_perubahan_perubahan_01_satu_shift_v2_1777551074543', // IMG SLOT
            body: <>Bayangkan: kamu bangun, lihat cermin — wajah yang sama, badan yang sama, kulit yang sama. Tapi <strong>caramu memandang dirimu sendiri sudah berbeda total.</strong> Tidak ada lagi rasa "kurang". Tidak ada lagi suara internal yang berbisik "harusnya kamu lebih baik dari ini".<br /><br />Bayangkan: kamu jalan ke kantor, dan untuk pertama kalinya dalam bertahun-tahun, kamu <strong>tidak peduli pendapat orang.</strong> Bukan defensive "I don't care" — tapi genuine indifference yang memancar dari dalam.<br /><br />Bayangkan: 6 bulan kemudian, situasi finansial, karir, dan asmaramu sudah <strong>tidak bisa kamu kenali lagi.</strong> Bukan karena kamu kerja 3x lebih keras. Tapi karena <strong>1 shift di dalam menggeser semua interaksi luar</strong> — mulai dari cara orang merespon emailmu, sampai siapa yang mengejarmu.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Anatomi 1 Shift",
            h2b: "Yang Mengubah Segalanya.",
            imgKey: 'p_perubahan_perubahan_02_frekuensi_salah_v2_1777551089169', // IMG SLOT
            steps: [
                { num: '1', title: 'IDENTIFIKASI BELIEF UTAMA YANG SALAH', body: 'Setiap wanita yang stuck punya 1 belief inti yang tidak pernah dia pertanyakan: "saya harus berusaha untuk dihargai", "saya harus jadi sempurna untuk dipilih", "saya harus mengalah untuk dicintai". Belief ini adalah akarnya. Selama belief ini hidup, kamu bisa ganti 100 pekerjaan dan 50 pacar — hasilnya tetap sama.' },
                { num: '2', title: 'GANTI BELIEF DENGAN PROTOKOL HARIAN (14 HARI)', body: 'Bukan affirmation murahan ("aku cantik, aku berharga"). Tapi protokol perilaku yang memaksa otakmu mengupdate belief lama dari pengalaman langsung. Hari ke-7, kamu mulai merasakan ada yang "ringan" di dadamu. Hari ke-14, kamu sadar kamu sudah berhenti meminta validasi tanpa menyadarinya.' },
                { num: '3', title: 'EFEK DOMINO (BULAN 1-3)', body: 'Setelah belief inti berubah, semua perilaku turunannya otomatis menyesuaikan. Cara bicaramu berubah. Cara kamu menerima kompliman berubah. Cara kamu menolak permintaan tidak masuk akal berubah. Dan dunia di sekitarmu — terpaksa menyesuaikan ke level barumu.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Apakah",
            h2b: "Saya Juga Bisa?",
            items: [
                { q: "Bagaimana kalau saya sudah coba banyak self-help dan tidak ada yang berhasil?", a: "Karena kebanyakan self-help fokus pada perubahan perilaku tanpa mengubah belief inti. Kamu disuruh 'tersenyum lebih', 'percaya diri', 'self-love' — tanpa diberi tahu CARANYA. Dark Feminine fokus pada akarnya, bukan daunnya. Itu sebabnya 1 shift kecil bisa menggantikan 50 saran biasa." },
                { q: "Saya skeptis. Apa garansinya ini bukan motivasi kosong?", a: "Setiap jurus disertai langkah harian konkret, contoh kalimat, dan skenario praktis. Tidak ada 'visualisasi' tanpa instruksi. Tidak ada motivasi tanpa metode. Dan ada garansi 30 hari uang kembali — kalau dalam 30 hari kamu tidak merasakan shift, kami refund 100% tanpa pertanyaan." },
                { q: "Saya orangnya keras kepala dan susah berubah. Bisakah?", a: "Justru lebih mudah untuk orang keras kepala. Karena begitu kamu yakin dengan satu belief baru, kamu akan keras kepala mempertahankannya. Yang sulit adalah orang yang gampang goyah — mereka kembali ke belief lama dalam 3 hari. Sifat keras kepalamu adalah aset, bukan hambatan." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Wanita.",
            h2b: "1 Shift Yang Sama. 3 Hidup Berbeda.",
            transformations: [
                {
                    name: 'Rini, 29 thn — Banker',
                    imgKey: 'p_perubahan_df_0424_ad14_istri_gantirambut', // IMG SLOT
                    before: 'Saya orang tipe A. Lulus cum laude, naik pangkat cepat, tabungan banyak. Tapi setiap pria yang serius mendekati saya pasti mundur dalam 2 bulan. Saya mulai pikir saya "terlalu sukses" untuk pria Indonesia. Saya beli ebook ini setengah tidak percaya — sambil pikir "saya sudah baca lebih banyak dari ini di Audible".',
                    after: 'Belief saya adalah: "kalau saya tidak prove value saya, mereka tidak akan menghargai saya." Itu yang saya bawa ke setiap date — over-explaining, over-achieving, over-everything. Setelah saya geser belief itu, dalam 4 bulan saya bertemu pengacara senior yang bilang "kamu hadir tanpa harus prove anything, itu langka". Sekarang sudah menikah.',
                },
                {
                    name: 'Lia, 35 thn — Single Mother 1 Anak',
                    imgKey: 'p_perubahan_perubahan_01_satu_shift_v2_1777551074543', // IMG SLOT
                    before: 'Cerai 2 tahun lalu. Saya pikir tidak akan ada pria yang mau dengan janda + anak + umur 35. Saya mengoperasi diri saya — setiap potential date saya pre-emptively jelaskan "saya sudah punya anak ya, kalau tidak nyaman tidak masalah, saya mengerti". Hampir semua memang tidak melanjutkan.',
                    after: 'Saya sadar saya bukan ditolak karena status. Saya menolak diri saya sendiri terlebih dulu — dan pria hanya merefleksikan ketidaklayakan yang saya pancarkan. Setelah saya hentikan pre-emptive disclaimer, dalam 5 bulan saya bertemu seorang dokter (single, 39 thn) yang bilang dia justru tertarik karena "saya tidak meminta maaf atas hidup saya". Pertunangan bulan depan.',
                },
                {
                    name: 'Sari, 26 thn — Marketing Executive',
                    imgKey: 'p_perubahan_perubahan_02_frekuensi_salah_v2_1777551089169', // IMG SLOT
                    before: 'Saya 4 tahun pacaran sama orang yang setiap weekend "lupa" ngajak saya keluar — tapi punya budget untuk gathering teman-teman cowoknya. Saya mengeluh ke teman, mereka bilang "kamu kebanyakan nuntut". Jadi saya berhenti menuntut. Hubungan kami "damai" tapi mati.',
                    after: 'Belief saya: "kalau saya menuntut, dia akan pergi". Setelah saya geser belief jadi "saya berhak diperlakukan dengan worthy, kalau tidak — biarkan dia pergi", saya kaget melihat dia BERUBAH. Bukan saya yang ngomong. Saya cuma jadi tidak available. Dia mulai tanya "kamu kemana?" untuk pertama kalinya. Sekarang dia yang ngajak weekend saya bukan kebalikannya.',
                },
            ],
        },
    } : null;

    // ?highvalue — Persona "High Stakes Attraction / Pria Takut Kehilangan" (angle11, 6 sales) — General
    // Tema: Cara membalikkan posisi. Menjadi wanita yang membuat pria berpikir 10x untuk
    // mengecewakanmu — karena dia takut kamu akan pergi.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const highvalueContent = (hasHighvalue && segment !== 'istri') ? {
        heroBadge: "👑 HIGH STAKES — PRIA YANG TAKUT KEHILANGANMU",
        heroH1a: "Buat Dia Berpikir 10x.",
        heroH1b: "Sebelum Mengecewakanmu.",
        heroSub: "Untuk wanita yang lelah jadi 'opsi'. Yang capek dimaafkan terus, dimaklumi terus, dianggap 'pasti tidak akan pergi'. Saatnya membalikkan posisi — menjadi wanita yang membuat pria gemetar membayangkan hidup tanpamu.",
        painLabel: "PROTOKOL HIGH STAKES ATTRACTION",
        painH2a: "Kapan Terakhir Dia",
        painH2b: "Takut Kehilanganmu?",
        stories: [
            {
                imgs: ['p_highvalue_Campaign_Test_Ad_w1_Live_IG'],
                title: 'Dia Tahu Kamu Tidak Akan Kemana-mana. Itu Masalahnya.',
                body: `Pria itu tidak menghargai apa yang dia yakin tidak akan pernah hilang.\n\nDia tahu kamu sudah investasi 2 tahun. Tahu kamu sayang. Tahu kamu sudah cerita ke teman-teman bahwa "dia orangnya". Tahu kamu sudah pamer ke keluarga. Dan dia tahu — kamu malu untuk pergi.\n\nKarena dia tahu kamu tidak akan pergi, dia berhenti berusaha. Dia mulai bilang "nanti", "tunggu sebentar", "lagi sibuk". Dia mulai memperlakukanmu sebagai pasti, bukan sebagai privilege.\n\nDan satu-satunya cara dia mulai berusaha lagi — adalah ketika dia mulai TAKUT kamu pergi.`
            },
            {
                imgs: ['p_highvalue_Campaign_Test_Ad_w3_Live_IG'],
                title: 'Bukan Ancaman. Bukan Drama. Tapi Kalkulasi Dingin.',
                body: `Banyak wanita salah paham. Mereka pikir "membuat pria takut kehilangan" itu berarti drama, ngambek, ancaman putus, atau cemburu palsu. Itu childish — dan justru bikin nilaimu jatuh.\n\nHigh stakes attraction adalah kebalikannya. Kamu tidak mengancam. Tidak teriak. Tidak posting passive aggressive. Kamu hanya mulai memperlakukan dirimu seperti orang yang tahu nilainya.\n\nKamu berhenti membatalkan rencana karena dia. Berhenti mengejar reply yang lambat. Berhenti meminta validasi.\n\nDan dalam 2-4 minggu — dia mulai gelisah. Karena untuk pertama kalinya, dia merasakan: "Bisa jadi aku akan kehilangan dia."`
            },
            {
                imgs: ['p_highvalue_Campaign_Test_Ad_w7_Live_IG'],
                title: 'Pria Mengejar Yang Sulit Dijaga. Bukan Yang Sulit Didapat.',
                body: `Lupakan trik "hard to get" yang murahan. Itu sudah basi.\n\nYang membuat pria mengejar — dan TETAP mengejar setelah dapat — adalah perasaan bahwa dia harus terus membuktikan dirinya untuk MEMPERTAHANKAN kamu.\n\nIni bukan game. Ini bukan manipulasi. Ini adalah bagaimana otak pria didesain. Dan ketika kamu paham mekanismenya, kamu tidak perlu lagi bertanya-tanya "kenapa dia berubah" — karena dia tidak akan berani berubah.\n\nDi Dark Feminine, kamu akan belajar persis bagaimana membangun "high stakes" itu — tanpa drama, tanpa game, tanpa kehilangan dirimu sendiri.`
            }
        ],
        pains: [
            { icon: "🥱", text: <>Dia menganggapmu <strong>pasti tidak akan pergi</strong> — jadi dia berhenti berusaha.</> },
            { icon: "📵", text: <>Reply chat-mu lambat dia santai. <strong>Reply dia lambat kamu panik</strong>. Posisinya sudah salah dari awal.</> },
            { icon: "🙇‍♀️", text: <>Kamu sudah memaafkan terlalu banyak. Dia sudah <strong>terlalu yakin</strong> kamu akan memaafkan lagi.</> },
            { icon: "⚖️", text: <>Bukan kamu yang harus berusaha mempertahankannya. <strong>Dia yang harus berusaha mempertahankanmu</strong>.</> },
            { icon: "❄️", text: <>Bukan drama. Bukan ancaman. Hanya <strong>kalkulasi dingin</strong> yang membuat dia gemetar.</> },
            { icon: "🔥", text: <>Saatnya menjadi wanita yang dia <strong>takut kehilangan</strong> — bukan yang dia takut tidak bisa kontrol.</> },
        ],
        paramAgitation: {
            label: "AGITASI — POSISI YANG SUDAH KAMU TERIMA TERLALU LAMA",
            h2a: "Berapa Kali Lagi Kamu Akan",
            h2b: "Memaafkan, Memaklumi, Mengalah?",
            imgKey: 'p_highvalue_df_0420_w1_v3_1776639513543', // IMG SLOT
            body: <>Hitung. Berapa kali kamu sudah memaafkan dia "lupa" anniversary? Berapa kali kamu sudah memaklumi dia "sibuk" saat kamu sakit? Berapa kali kamu sudah mengalah karena "biar tidak jadi masalah besar"?<br /><br />Setiap pemaafan tanpa konsekuensi <strong>mengajarkan dia satu hal:</strong> kamu akan tetap di sini, apapun yang dia lakukan. Bahwa kamu sudah <strong>"investasi terlalu banyak untuk pergi"</strong>. Bahwa kamu sudah pamer ke teman-temanmu, bahwa kamu sudah cerita ke ibumu, bahwa kamu sudah terlanjur sayang.<br /><br />Dan dia tahu itu. Otaknya menghitung resiko: "Kalau gue gini, dia akan marah 3 hari, lalu balik. Kalau gue gitu, dia akan diem 1 minggu, lalu balik. <strong>Selama gue tidak benar-benar 'pergi', dia akan selalu ada.</strong>"<br /><br />Dan posisi tawarmu hilang. Bukan karena dia tidak sayang — tapi karena dia <strong>tidak punya alasan untuk takut.</strong></>,
        },
        paramHope: {
            label: "VISI BARU — KETIKA POSISI BERBALIK",
            h2a: "Bayangkan Dia Yang",
            h2b: "Gemetar Membayangkan Hidup Tanpamu.",
            imgKey: 'p_highvalue_highvalue_01_takut_kehilangan_v2_1777551172904', // IMG SLOT
            body: <>Bayangkan: dia pulang malam, lihat kamu di kursi sofa membaca buku — dan untuk pertama kalinya, ada ketakutan kecil di dadanya. <strong>"Apakah dia masih milik gue?"</strong> Ketakutan itu tidak datang dari ancaman. Datang dari frekuensimu yang berubah.<br /><br />Bayangkan: kamu bilang "saya keluar dengan teman" — dan dia tidak lagi santai. Dia tanya "siapa?", "kemana?", "jam berapa pulang?". Bukan possessive — tapi <strong>tiba-tiba dia sadar dia bisa kehilanganmu.</strong> Dan untuk pertama kalinya dalam bertahun-tahun, dia membatalkan rencana sendirinya untuk menemanimu.<br /><br />Bayangkan: dia mulai membawa bunga. Mulai mengingat hari spesial. Mulai memuji penampilanmu spontan. <strong>Bukan karena kamu memohon</strong> — tapi karena dia takut tidak melakukan itu, kamu akan menyadari kamu pantas mendapat lebih, dan pergi.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Membalikkan Posisi",
            h2b: "Tanpa Drama, Tanpa Ancaman.",
            imgKey: 'p_highvalue_highvalue_02_balik_posisi_v2_1777551189312', // IMG SLOT
            steps: [
                { num: '1', title: 'BANGUN HIDUP DI LUAR DIA (Hari 1-21)', body: 'Bukan untuk membuat dia cemburu. Tapi untuk membuat dirimu sendiri tahu bahwa kamu punya hidup yang utuh tanpa dia. Hobi yang dia tidak ikuti. Teman yang dia tidak kenal. Tujuan yang tidak melibatkan dia. Tanpa ini, semua "trik" akan terlihat seperti drama.' },
                { num: '2', title: 'PUTUS POLA OTOMATIS (Hari 7-30)', body: 'Berhenti membatalkan rencanamu untuk mengakomodasi dia. Berhenti memaafkan tanpa konsekuensi. Berhenti meminta validasi dengan pertanyaan "kamu masih sayang aku kan?". Pola ini yang membuat dia "yakin" kamu pasti tetap. Putus pola, dan untuk pertama kalinya — dia kehilangan kepastian itu.' },
                { num: '3', title: 'CALIBRATE INTENSITAS (Bulan 2+)', body: 'Bukan jadi cuek selamanya — itu childish. Tapi kalibrasi: hangat saat dia berusaha, dingin saat dia mengabaikan. Otaknya akan secara otomatis mempelajari mana perilaku yang membawa kehadiranmu, mana yang menjauhkanmu. Dan dia akan mulai bekerja KERAS untuk mempertahankanmu.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Bagaimana",
            h2b: "Kalau...?",
            items: [
                { q: "Bukankah ini bermain-main? Saya tidak suka game.", a: "Ini bukan game. Game adalah berpura-pura cuek sambil ngintip story-nya. Yang kami ajarkan adalah genuine self-respect — bagaimana benar-benar membangun kehidupan utuh di luar dia, sehingga tidak ada lagi 'pura-pura' yang perlu dilakukan. Ketika kamu genuinely tidak butuh, dia secara otomatis takut kehilangan." },
                { q: "Bagaimana kalau dia justru pergi setelah saya berubah?", a: "Kalau dia pergi karena kamu mulai menghargai diri sendiri — dia pasti akan pergi cepat atau lambat. Yang kami ajarkan adalah filter: pria yang mengejar wanita 'mudah dimanipulasi' memang akan pergi. Pria yang menghargai wanita berdaya akan tetap dan menggandakan effort-nya. Kamu akan tahu, dalam 30 hari, mana posisinya." },
                { q: "Sudah 8 tahun pacaran/menikah. Apakah masih bisa diubah?", a: "Justru lebih dramatic dampaknya. Karena dia sudah punya 8 tahun data tentang kamu — dan tiba-tiba pola itu pecah. Otaknya akan masuk mode panik. Banyak pengguna yang hubungannya lebih lama (10-15 tahun) justru melihat perubahan suami yang paling cepat — karena kontrasnya paling tajam." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Wanita.",
            h2b: "3 Pria Yang Sekarang Takut Kehilangan.",
            transformations: [
                {
                    name: 'Rini, 31 thn — Pacaran 5 thn',
                    imgKey: 'p_highvalue_Campaign_Test_Ad_w1_Live_IG', // IMG SLOT
                    before: 'Pacar saya sudah seperti suami: tahu jadwal saya, tahu pasti saya tidak akan pergi, mulai males nge-treat saya seperti pacar. Setiap weekend dia pilih nongkrong sama temen daripada saya. Saya minta nikahin? Selalu "tahun depan". Saya udah investasi 5 tahun, malu kalau pergi.',
                    after: 'Saya tidak ngomong apa-apa. Saya cuma berhenti membatalkan rencana untuk dia. Saya keluar tiap weekend dengan teman, tidak update dia. 3 minggu kemudian, dia yang panik. Tanya saya "kamu kok beda?". Sekarang dia yang ngajak nikah duluan, bukan saya yang minta. Tanggal sudah ditentukan.',
                },
                {
                    name: 'Bella, 28 thn — Pacaran 2 thn',
                    imgKey: 'p_highvalue_Campaign_Test_Ad_w3_Live_IG', // IMG SLOT
                    before: 'Pacar saya pintar bohong soal kerjaan. "Lembur" yang ga jelas, "meeting" yang tidak ada di kalender. Saya tahu, tapi setiap konfrontasi dia bilang saya "berlebihan". Dan saya menyerah karena takut "kehilangan dia".',
                    after: 'Setelah saya pelajari ebook ini, saya berhenti konfrontasi. Saya start membangun karir baru, kelas Pilates, dan teman-teman lama yang dia tidak suka. Saya jadi sibuk dengan hidup saya. Dalam 5 minggu — dia yang ngecek HP saya, tanya saya kemana, mulai ada di rumah lebih banyak. Itu ironis tapi efektif.',
                },
                {
                    name: 'Dewi, 34 thn — Hampir Putus 3 Kali',
                    imgKey: 'p_highvalue_Campaign_Test_Ad_w7_Live_IG', // IMG SLOT
                    before: 'Setiap pertengkaran besar, saya yang minta maaf duluan. Saya yang chat panjang minta dibalas. Saya yang cari restoran untuk "make up date". Pacar saya tahu pola ini sudah 4 tahun. Pertengkaran-pertengkaran berikutnya makin santai untuk dia — karena dia tahu saya yang akan repair.',
                    after: 'Kali ke-4, saya tidak chat sama sekali setelah pertengkaran. 1 hari, 2 hari, 5 hari, 1 minggu. Dia panik. Dia datang ke kantor saya bawa bunga (untuk pertama kalinya). Saya cuma bilang "saya butuh waktu", dan untuk pertama kalinya dalam 4 tahun, dia ngalah duluan. Sekarang setiap kali ada konflik, dia yang inisiatif repair.',
                },
            ],
        },
    } : null;

    // ?nongames — Persona "Anti-Ghosting Protocol" (DF_Ghosted_Lagi, 4 sales) — Single
    // Tema: Mengakhiri siklus toxic. Wanita yang lelah dengan pria datang-pergi (ghosting)
    // dan ingin tahu cara "mengunci" atensi pria secara permanen.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const nongamesContent = (hasNongames && segment !== 'istri') ? {
        heroBadge: "🚫 ANTI-GHOSTING PROTOCOL",
        heroH1a: "Lelah Dia Datang Dan Pergi?",
        heroH1b: "Saatnya Mengunci Atensinya — Permanen.",
        heroSub: "Untuk wanita yang sudah terlalu sering jadi 'sebentar'. Chat manis seminggu — lalu hilang tanpa kabar. Pacar bulan ini, ghosting bulan depan. Saatnya kamu paham bagaimana cara kerja otak pria — dan menutup pintu ghosting selamanya.",
        painLabel: "PROTOKOL ANTI-GHOSTING",
        painH2a: "Kenapa Pria Yang Awalnya Mengejar,",
        painH2b: "Tiba-tiba Hilang Total?",
        stories: [
            {
                imgs: ['p_nonggames_df_0424_ad02_centangbiru'],
                title: 'Minggu Lalu Dia Bilang "Sayang". Sekarang Read Tanpa Reply.',
                body: `Awal chat — dia kirim pesan jam 12 malam. Bilang kamu beda. Bilang dia belum pernah ketemu wanita seperti kamu.\n\nKamu mulai percaya. Mulai berharap. Mulai menyusun masa depan di kepala.\n\nLalu — diam. Reply 2 hari sekali. Lalu seminggu sekali. Lalu hanya emoji. Lalu read tanpa reply.\n\nDan kamu duduk di kasur jam 3 pagi, scroll chat lama, mencari "di mana aku salah". Padahal salahmu cuma satu: kamu tidak tahu kapan harus menarik.\n\nGhosting bukan terjadi karena dia "berubah pikiran". Ghosting terjadi karena ATENSI tidak pernah benar-benar TERKUNCI dari awal.`
            },
            {
                imgs: ['p_nonggames_df_0424_ad02_centangbiru_v2'],
                title: 'Pria Tidak Ghosting Wanita Yang Misterius. Mereka Ghosting Yang Predictable.',
                body: `Coba pikirkan: pria-pria yang menghilang dari hidupmu — apa yang mereka tahu tentang kamu?\n\nMereka tahu jadwal kerjamu. Tahu reply-mu pasti dalam 5 menit. Tahu kamu always available untuk ketemu. Tahu kamu sudah suka mereka. Tahu reaksi-mu kalau mereka tidak balas — sedih, lalu mengirim chat lebih panjang.\n\nKamu sudah PREDICTABLE. Dan otak pria mulai bosan dengan yang predictable.\n\nWanita yang TIDAK PERNAH di-ghost punya satu hal yang sama: mereka tidak pernah memberikan SEMUA dirinya di awal. Selalu ada lapisan yang belum dia ketahui. Selalu ada alasan untuk dia tetap penasaran.`
            },
            {
                imgs: ['p_nonggames_df_0424_ad03_temansmanikah'],
                title: 'Lock Atensi. Tutup Pintu Belakang. Tidak Ada Ruang Untuk Hilang.',
                body: `Anti-ghosting bukan tentang "memohon dia tetap". Itu kebalikan dari yang harusnya kamu lakukan.\n\nIni tentang membangun arsitektur atensi — di mana dia secara tidak sadar terus kembali, terus ingin tahu lebih, terus merasa belum cukup mengenalmu.\n\nDi Dark Feminine, kamu akan belajar:\n• Cara mengatur tempo chat agar dia selalu menunggu\n• Bahasa tubuh dan kata-kata yang menanam benih obsesi\n• Bagaimana menutup celah yang biasa dipakai pria untuk "menghilang halus"\n\nIni bukan trik murahan. Ini protokol psikologi — yang sudah dipakai wanita-wanita paling memikat dalam sejarah.`
            }
        ],
        pains: [
            { icon: "👻", text: <>Sudah lelah dengan pria yang <strong>masuk dengan manis, hilang tanpa kabar</strong>.</> },
            { icon: "📱", text: <>Kamu refresh chat 50x sehari — sementara dia <strong>lupa kamu pernah ada</strong>.</> },
            { icon: "🔁", text: <>Pola yang sama berulang. Beda pria, beda kota, <strong>tapi endingnya selalu read tanpa reply</strong>.</> },
            { icon: "🤔", text: <>Kamu tahu kamu menarik. Tapi <strong>tidak tahu kenapa atensinya selalu menguap</strong> setelah 2 minggu.</> },
            { icon: "🔐", text: <>Yang kamu butuhkan bukan trik baru. Tapi <strong>protokol mengunci atensi</strong> — dari awal pertemuan.</> },
            { icon: "💎", text: <>Saatnya jadi wanita yang dia <strong>tidak berani ghosting</strong> — karena dia tahu kamu tidak akan menunggu dia kembali.</> },
        ],
        paramAgitation: {
            label: "AGITASI — POLA YANG TERUS BERULANG",
            h2a: "Sudah Berapa Pria",
            h2b: "Yang Hilang Begitu Saja?",
            imgKey: 'p_nonggames_df_0424_ad09_single_selingkuhan', // IMG SLOT
            body: <>Coba list di kepalamu sekarang: <strong>Pria yang hilang dalam 3 tahun terakhir.</strong> Yang awalnya intens — chat tiap hari, video call jam 12 malam, bilang "kamu beda". Lalu hilang.<br /><br />Reza dari Tinder. Adit dari kantor. Bagas teman teman. Aldo dari kondangan. Iman dari gym. <strong>Lima nama. Lima cerita yang sama persis.</strong><br /><br />Setiap kali kamu mencari "apa yang salah dariku?". Setiap kali kamu screenshot chat lama, mencari momen yang membuat dia "berubah pikiran". Setiap kali kamu ngehibur diri "mungkin dia memang belum siap", "mungkin saya kurang sabar".<br /><br /><strong>Hentikan pencarian itu.</strong> Kamu tidak salah. Tapi kamu juga tidak melakukan apa-apa untuk MENCEGAH ghosting berikutnya. Dan tanpa intervensi, pria ke-6, ke-7, ke-8 akan persis seperti yang sebelumnya. <strong>Kamu butuh protokol — bukan optimisme.</strong></>,
        },
        paramHope: {
            label: "VISI BARU — KETIKA ATENSI TERKUNCI",
            h2a: "Bayangkan Pria Yang",
            h2b: "Tidak Pernah Bisa Hilang.",
            imgKey: 'p_nonggames_df_0424_ad11_single_direktur_v2', // IMG SLOT
            body: <>Bayangkan: 6 minggu setelah kenalan, dia yang chat duluan setiap hari. Bukan kamu. Setiap pagi: "Selamat pagi, kamu sudah sarapan?" Setiap malam: "Hari ini gimana?". Tanpa kamu pernah meminta. Tanpa kamu pernah mengejar.<br /><br />Bayangkan: kamu balas chat-nya 4 jam kemudian — dan dia <strong>tidak tersinggung.</strong> Justru bertanya "kamu sibuk apa?" dengan rasa penasaran tulus. Karena dia tahu hidupmu lebih dari sekedar dia.<br /><br />Bayangkan: 3 bulan kemudian, kamu lihat IG-nya muncul foto bersama wanita lain (teman dari kantor). Kamu tidak panik, tidak stalk, tidak interogasi. Kamu cuma diam. Dan <strong>dia sendiri yang menjelaskan</strong> sebelum kamu sempat tanya — karena dia tahu posisinya tidak aman tanpa transparansi.<br /><br />Itulah <strong>atensi yang terkunci.</strong> Bukan karena kamu mengontrol. Tapi karena dia takut kehilangan akses padamu.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Arsitektur Atensi",
            h2b: "Yang Tidak Bisa Bocor.",
            imgKey: 'p_nonggames_nongames_01_ghosted_lagi_v2_1777551270430', // IMG SLOT
            steps: [
                { num: '1', title: 'PHASE 1 — TEMPO CHAT (Minggu 1-2)', body: 'Pelajari cara mengatur tempo balasan: bukan "ignore for game", tapi tempo yang menanam dopamine — kadang cepat, kadang lambat, dengan logika. Otaknya akan secara biologis tertanam pola "menunggu kamu = reward". Sekali dia tertanam pola ini, dia tidak akan ingin pergi.' },
                { num: '2', title: 'PHASE 2 — LAYER MYSTERY (Minggu 3-6)', body: 'Bukan dengan menyembunyikan info — tapi dengan tidak membongkar semua dirimu di awal. Selalu ada cerita yang dia belum tahu. Selalu ada hobi yang membuat dia penasaran. Setiap chat membuat dia merasa baru mengenal sebagian darimu — bukan keseluruhan.' },
                { num: '3', title: 'PHASE 3 — TUTUP CELAH GHOSTING (Bulan 2+)', body: 'Setiap pria yang ghosting menggunakan 3 celah yang sama: respon yang predictable, available di waktu predictable, reaksi marah yang predictable. Tutup ketiganya — dan dia secara biologis kehilangan "exit" untuk menghilang. Bukan karena terjebak. Tapi karena dia tidak ingin pergi.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Apakah",
            h2b: "Ini Tidak Tipuan?",
            items: [
                { q: "Bukankah saya jadi tidak otentik kalau saya 'mengatur tempo'?", a: "Yang tidak otentik adalah kebiasaanmu sekarang: balas dalam 5 detik bukan karena kamu siap, tapi karena kamu cemas. Ngajak ketemu setiap weekend bukan karena kamu mau, tapi karena kamu takut dia lupa. Yang kami ajarkan adalah berhenti pretending bahwa kamu santai padahal sebenarnya panik. Itu yang otentik." },
                { q: "Bagaimana kalau dia tetap ghosting setelah saya pakai protokol?", a: "Kalau ghosting tetap terjadi setelah protokol diterapkan, itu artinya dia bukan kandidat serius dari awal — dan kamu menghemat berbulan-bulan investasi emosional. Protokol ini juga berfungsi sebagai filter: pria serius akan tetap dan mengejar lebih kuat. Pria iseng akan menyerah cepat. Kamu menang di kedua skenario." },
                { q: "Saya sudah nyerah, saya pikir saya 'tidak menarik'. Bisakah ini benar-benar membantu?", a: "Bukan kamu yang tidak menarik. Kamu menarik di awal — yang membuktikan masalahnya bukan di fisik atau kepribadianmu. Masalahnya adalah cara kamu MENGELOLA atensi setelah dia tertarik. Itu skill yang bisa dipelajari, bukan bakat. Banyak pengguna yang sudah 2-3 tahun single mendapat hasil dalam 8 minggu pertama." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Wanita.",
            h2b: "3 Pria Yang Tidak Berani Ghosting.",
            transformations: [
                {
                    name: 'Rini, 26 thn — Sudah 8 Pria Hilang',
                    imgKey: 'p_nonggames_nongames_02_predictable_v2_1777551327348', // IMG SLOT
                    before: 'Saya pernah ngehitung: 3 tahun terakhir, 8 pria yang serius approach saya, semua hilang dalam 4-8 minggu. Pola yang sama: intens di awal, lalu pelan-pelan jarak. Saya mulai pikir saya "racun" untuk hubungan. Saya bahkan ke psikolog.',
                    after: 'Yang saya pelajari: saya selalu memberikan SEMUA dalam 2 minggu pertama. Cerita semua tentang saya, available 24/7, tertawa di setiap candaan. Setelah saya pelajari layer mystery dan tempo, pria ke-9 yang saya kenalan via teman — sekarang sudah 7 bulan, dia yang chat duluan setiap pagi. Dia bahkan bilang "kamu wanita pertama yang tidak terburu-buru menyukai saya".',
                },
                {
                    name: 'Mona, 30 thn — Trauma Ghosting',
                    imgKey: 'p_nonggames_df_0424_ad02_centangbiru', // IMG SLOT
                    before: 'Setelah 3 tahun pacaran, dia ghosting saya tanpa alasan. Saya hancur 1 tahun. Setiap pria baru yang approach, saya pre-emptive defensive — "you sure? saya umur 30 ya, kamu yakin tidak akan kabur?" Yang ironisnya, mereka semua kabur — karena saya sendiri yang menanam ide itu di kepala mereka.',
                    after: 'Saya pelajari kalau ghosting bukan tentang kelayakan saya, tapi tentang protokol yang saya lakukan setelah mereka tertarik. Saya stop preemptive defense. Saya stop overshare di chat pertama. Saya kenal seorang dokter anestesi — sekarang sudah 5 bulan, dia yang ajak menikah. Dia bilang "saya tidak pernah mengejar wanita seperti ini sebelumnya".',
                },
                {
                    name: 'Tasya, 23 thn — Mahasiswa',
                    imgKey: 'p_nonggames_df_0424_ad02_centangbiru_v2', // IMG SLOT
                    before: 'Saya selalu jadi "rebound girl". Pria abis putus, deketin saya seminggu, lalu balikan sama mantan. Pola ini sudah 3 kali di tahun yang sama. Saya mulai merasa saya cuma "stop-over", bukan tujuan.',
                    after: 'Saya pelajari kalau saya selalu memberikan "warmth" yang dia butuhkan setelah putus — dan sekali kebutuhan itu terpenuhi, dia kembali ke yang familiar. Saya stop jadi "comfort woman". Saya pakai tempo dingin di awal, hanya hangat setelah dia berusaha. Pria berikutnya — sudah 4 bulan, tidak balikan sama mantan, dan justru ngenalin saya ke ibunya bulan lalu.',
                },
            ],
        },
    } : null;

    // ?istrifear — Persona "Cold Betrayal Realization" (df_0424_ad04, 8 sales) — Istri (Fear)
    // Tema: Realita pahit perselingkuhan. Rasa takut digantikan oleh wanita yang lebih muda
    // atau bahkan biasa saja. Mengambil kendali sebelum terlambat.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const istriFearContent = hasIstriFear ? {
        heroBadge: "❄️ KENYATAAN DINGIN — UNTUK PARA ISTRI",
        heroH1a: "Wanita Itu Tidak Lebih Cantik Darimu.",
        heroH1b: "Tapi Suamimu Tetap Memilihnya.",
        heroSub: "Untuk istri yang menyangkal — sambil di dalam hati sudah tahu. Yang melihat suaminya semakin sering 'lembur', semakin sering 'meeting di luar', semakin sering tersenyum kepada layar HP. Realita ini pahit. Tapi menyangkalnya akan jauh lebih pahit lagi.",
        painLabel: "KENYATAAN YANG TIDAK BERANI KAMU AKUI",
        painH2a: "Kamu Sudah Tahu Sebenarnya,",
        painH2b: "Hanya Belum Berani Mengakuinya.",
        stories: [
            {
                imgs: ['p_istrifear_istri_hanyakewajiban_1777216789917'],
                title: 'Dia Tidak Lebih Cantik. Tidak Lebih Muda. Tidak Lebih Pintar.',
                body: `Inilah yang paling menyakitkan dari perselingkuhan. Bukan kalau wanita itu super model. Bukan kalau dia 10 tahun lebih muda. Bukan kalau dia direktur perusahaan.\n\nYang paling menyakitkan adalah ketika kamu akhirnya melihat foto wanita itu — dan dia BIASA SAJA. Mungkin lebih biasa darimu. Lebih sederhana. Bahkan tidak terlalu cantik.\n\nDan pertanyaannya menghantam seperti palu: "Kalau bukan karena cantik, lalu kenapa?"\n\nJawabannya: dia memberikan suamimu sesuatu yang sudah lama berhenti kamu berikan. Bukan tubuh. Bukan kemewahan. Tapi FREKUENSI yang membuat suamimu merasa dilihat sebagai pria — bukan sebagai mesin ATM atau pengantar anak ke sekolah.`
            },
            {
                imgs: ['p_istrifear_istri_membangunrumah'],
                title: 'Setiap Hari Yang Kamu Tunggu — Adalah Hari Yang Dia Pakai Untuk Menggantikanmu.',
                body: `Banyak istri menunggu. Menunggu dia "sadar". Menunggu dia "kembali". Menunggu situasi "selesai sendiri".\n\nKamu pikir kamu sedang sabar. Sebenarnya kamu sedang memberinya WAKTU untuk membangun hidup baru bersama wanita lain.\n\nSetiap minggu yang kamu tunggu — adalah seminggu lagi dia berjalan menjauh. Setiap pertengkaran yang kamu hindari demi "menjaga rumah tangga" — adalah pintu lagi yang dia tutup di belakangmu.\n\nDan ketika kamu akhirnya berani bicara, kamu akan dengar kalimat paling dingin di dunia: "Aku sudah memutuskan, Sayang. Maaf."`
            },
            {
                imgs: ['p_istrifear_istri_menghapusjejak'],
                title: 'Kamu Bukan Mau Menyelamatkan Pernikahan. Kamu Mau Menyelamatkan Dirimu.',
                body: `Ini realita yang harus kamu terima: kamu tidak bisa "memaksa" suamimu kembali dengan menjadi lebih baik untuknya. Memasak lebih enak, melayani lebih sempurna, mengalah lebih banyak — tidak ada satupun yang akan mengubah arahnya.\n\nYang akan mengubah arahnya adalah ketika DIA merasakan kamu tidak lagi tergantung pada kembalinya.\n\nKetika frekuensimu berubah dari "tolong jangan tinggalkan aku" menjadi "aku akan baik-baik saja dengan atau tanpa kamu" — di situlah, untuk pertama kalinya dalam bertahun-tahun, dia akan benar-benar MELIHATMU lagi.\n\nDi Dark Feminine, kamu akan belajar bagaimana melakukan shift itu — tanpa drama, tanpa kehilangan martabat, tanpa kehilangan dirimu.`
            }
        ],
        pains: [
            { icon: "📵", text: <>HP-nya sekarang selalu <strong>terbalik di meja</strong>. Notifikasi off. Password baru.</> },
            { icon: "🌙", text: <>"Lembur" yang tidak masuk akal. <strong>Parfum baru</strong> yang bukan untukmu.</> },
            { icon: "💸", text: <>Pengeluaran yang tidak jelas. <strong>Hadiah yang tidak pernah sampai padamu</strong>.</> },
            { icon: "👁️", text: <>Tatapannya kosong saat kamu bicara — tapi <strong>matanya hidup saat lihat layar HP</strong>.</> },
            { icon: "⏳", text: <>Setiap hari kamu menunggu, <strong>adalah hari dia bangun rumah baru</strong> dengan wanita itu.</> },
            { icon: "🩹", text: <>Saatnya berhenti menyangkal. <strong>Ambil kendali sebelum kabar itu datang sebagai kalimat terakhir</strong>.</> },
        ],
        paramAgitation: {
            label: "AGITASI — REALITA YANG TIDAK BERANI KAMU LIHAT",
            h2a: "Setiap Hari Yang Kamu Tunggu —",
            h2b: "Adalah Hari Dia Membangun Hidup Tanpamu.",
            imgKey: 'p_istrifear_istri_menyesalmasatua_v2_1777216536956', // IMG SLOT
            body: <>Kamu pikir kamu sedang sabar. Kamu pikir kamu sedang menjaga rumah tangga. Kamu pikir kamu sedang "memberi waktu" untuk dia kembali. <strong>Kamu salah besar.</strong><br /><br />Setiap minggu yang kamu pilih untuk diam — adalah seminggu lagi dia membangun rutinitas dengan wanita itu. Setiap pertengkaran yang kamu hindari "demi anak" — adalah pertahanan yang dia turunkan terhadap wanita itu. Setiap kali kamu memilih masak makanan kesukaannya supaya dia "ingat enaknya rumah" — wanita itu sedang memasakkan dia kenangan baru.<br /><br />Kamu mengira waktu memihakmu. <strong>Waktu memihaknya.</strong> Karena setiap hari yang berlalu, dia semakin nyaman dengan struktur hidup baru itu. Dan suatu pagi, dia akan duduk di meja makan, melihatmu, dan dengan suara dingin yang tidak pernah kamu kenal — bilang: <strong>"Aku sudah memutuskan, Yang."</strong><br /><br />Saat itu, sudah terlambat. Dan kamu akan ingat hari ini, hari kamu memilih "menunggu".</>,
        },
        paramHope: {
            label: "VISI BARU — KETIKA KAMU MENGAMBIL KENDALI",
            h2a: "Bayangkan Dia Yang",
            h2b: "Tiba-tiba Takut Kehilanganmu.",
            imgKey: 'p_istrifear_istri_parfumwanitalain_v2_1777216520501', // IMG SLOT
            body: <>Bayangkan: 6 minggu setelah kamu menerapkan protokol — dia pulang malam, dan untuk pertama kalinya dalam 2 tahun, kamu <strong>tidak ada di rumah.</strong> Tidak ada catatan. Tidak ada chat "kamu mau makan apa?". Hanya rumah yang sepi.<br /><br />Bayangkan: dia chat kamu jam 11 malam. <strong>Untuk pertama kalinya — dia yang chat duluan dalam berminggu-minggu.</strong> "Kamu di mana, Sayang?" Kamu balas santai 2 jam kemudian: "Acara dengan teman. Pulang larut, jangan tunggu."<br /><br />Bayangkan: minggu ke-8, dia mulai memperhatikanmu lagi. Mulai komentari penampilanmu. Mulai bertanya bagaimana harimu. Dan suatu malam — dia mengaku. Bukan karena kamu memohon. Tapi karena dia takut <strong>kehilangan wanita yang baru saja dia "sadari" lagi.</strong><br /><br />Tujuannya bukan sekadar "merebut dia kembali". Tujuannya: kamu mengambil kembali <strong>kepemilikan atas hidupmu</strong> — dan apapun keputusanmu setelah itu (bertahan atau pergi), kamu yang memilih.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "3 Langkah Mengambil",
            h2b: "Kembali Posisi Tawarmu.",
            imgKey: 'p_istrifear_istri_sosialdeath_1777216244903', // IMG SLOT
            steps: [
                { num: '1', title: 'STOP MENJADI "AMAN" (Hari 1-14)', body: 'Otaknya sudah mengkategorikanmu sebagai 100% pasti. Pasti masak. Pasti urus anak. Pasti tidak akan pergi. Dan otomatis dia berhenti memperhatikan. Dalam 2 minggu pertama, kamu akan mulai memutus pola "selalu ada". Bukan dengan drama — tapi dengan menjadi sedikit "tidak terduga". Pulang lebih telat 1 jam dari biasa, tanpa penjelasan. Tidur dengan rambut tersisir rapi.' },
                { num: '2', title: 'BANGUN HIDUP DI LUAR DIA (Hari 15-30)', body: 'Bukan untuk membuat dia cemburu — tapi untuk MENJADI WANITA yang lebih dari "istri seseorang yang selingkuh". Kelas baru. Teman lama yang sudah lama hilang. Hobi yang dulu kamu cintai sebelum menikah. Otaknya akan mendeteksi: "istri saya berubah" — dan rasa amannya hancur dalam sekejap.' },
                { num: '3', title: 'CALIBRATE RESPONS (Bulan 2+)', body: 'Ketika dia mulai memperhatikanmu lagi, jangan langsung kembali ke pola lama. Hangat saat dia berusaha. Dingin saat dia kembali pada wanita itu. Dia akan melatih otaknya sendiri — perilaku mana yang membawa kehadiranmu, mana yang menjauhkanmu. Dalam 8-12 minggu, dia akan mengejar — secara genuine, bukan karena terancam.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Bagaimana",
            h2b: "Dengan Situasi Saya?",
            items: [
                { q: "Saya punya anak kecil. Saya tidak bisa drama atau pergi.", a: "Justru protokol ini didesain TANPA drama dan TANPA harus pergi. Tidak ada konfrontasi terbuka. Tidak ada ultimatum. Hanya perubahan halus dalam pola hidupmu sendiri yang otomatis mengubah dinamika. Anak-anakmu tidak akan menyadari ada konflik — mereka justru akan melihat ibunya bangkit." },
                { q: "Saya tidak punya bukti, hanya firasat. Apakah ini layak dilakukan?", a: "Tidak peduli ada perselingkuhan atau tidak. Kalau dia sudah berhenti memperhatikanmu, sudah berhenti memperjuangkanmu, sudah berhenti melihatmu sebagai wanita — maka pernikahanmu sudah dalam zona bahaya. Protokol ini menyelamatkan pernikahan dari emotional neglect, dengan atau tanpa orang ketiga." },
                { q: "Bagaimana kalau dia memilih wanita itu setelah saya 'berubah'?", a: "Kalau itu terjadi, kamu menghemat 5-10 tahun bertahan dalam pernikahan yang akan tetap berakhir. Tapi data dari pengguna kami: 73% suami yang awalnya 'sudah memutuskan' berubah arah ketika istri mereka mengambil kendali — karena untuk pertama kalinya, mereka takut kehilangan SESUATU yang BERHARGA, bukan sekadar 'istri yang pasti tetap'." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Istri.",
            h2b: "3 Suami Yang Tiba-tiba Takut Kehilangan.",
            transformations: [
                {
                    name: 'Rini, 38 thn — Menikah 12 thn',
                    imgKey: 'p_istrifear_istri_tatapankosong_v2_1777216488783', // IMG SLOT
                    before: 'Saya tahu suami selingkuh dengan kolega kantornya. HP-nya selalu terbalik, parfum baru yang bukan untuk saya, "lembur" yang tidak masuk akal. Saya konfrontasi 3 kali — dia bilang saya "berlebihan". Saya menyerah, fokus ke anak, mati rasa. Tiap malam tidur sambil menangis tanpa suara.',
                    after: 'Saya berhenti konfrontasi. Saya mulai dandan rapi (untuk diri sendiri, bukan untuk dia). Saya kembali kelas yoga, ketemu teman lama. Saya mulai pulang larut sesekali. Minggu ke-5, dia mulai panik. Tanya saya kemana. Mulai memperhatikan bagaimana saya berpakaian. Bulan ke-3, dia mengaku, minta maaf, dan memohon. Saya yang memilih sekarang — bukan dia.',
                },
                {
                    name: 'Sandra, 42 thn — Menikah 17 thn',
                    imgKey: 'p_istrifear_istri_tunggudewasa_1777216228611', // IMG SLOT
                    before: 'Suami saya jatuh cinta sama wanita 28 thn yang dia kenal di klub golf. Saya menemukan chat-nya tidak sengaja. Saya hancur. Tapi saya sadar saya tidak siap kehilangan rumah, anak-anak, dan 17 tahun yang sudah dibangun. Saya merasa terjebak.',
                    after: 'Protokol ini menyelamatkan saya. Saya bahkan tidak ngomong soal chat itu ke dia. Saya cuma mulai membangun versi baru diri saya — kelas Pilates, baju baru, fokus karir saya yang sempat tertinggal. Wanita 28 thn itu mulai kehilangan daya tariknya sendiri di mata suami saya — karena saya sekarang yang lebih "fresh" dan "interesting" di matanya. Mereka putus 3 bulan kemudian. Suami saya tidak pernah tahu saya tahu.',
                },
                {
                    name: 'Maya, 35 thn — Menikah 8 thn',
                    imgKey: 'p_istrifear_istri_vigoruntukdia_1777216261041', // IMG SLOT
                    before: 'Dia tidak selingkuh secara fisik (saya cek), tapi emotional affair dengan teman kantornya jelas. Setiap notifikasi WA dia langsung bahagia. Setiap kali saya cerita, dia tidak respons. Saya merasa dia lebih ada untuk wanita itu daripada untuk saya.',
                    after: 'Saya stop bersaing dengan wanita itu untuk perhatian dia. Saya membangun lingkaran sosial saya sendiri (kelas keramik, book club). Saya berhenti menanyakan harinya, berhenti memasak makanan favoritnya, berhenti bertanya jam berapa pulang. Dalam 6 minggu, dia yang mengejar saya. Tanya "kamu marah ya?" — padahal saya tidak marah, saya cuma sibuk. Sekarang dia delete kontak wanita itu sendiri, tanpa saya minta.',
                },
            ],
        },
    } : null;

    // ?istrilegacy — Persona "Breaking the Cycle / Demi Anak" (istritest10, 4 sales) — Istri
    // Tema: Melindungi masa depan anak. Anak akan meniru template pernikahan ibunya.
    // Jika ibu tidak berdaya, anak akan jadi korban juga.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const istriLegacyContent = hasIstriLegacy ? {
        heroBadge: "🌱 DEMI ANAK — PUTUS RANTAI INI",
        heroH1a: "Anakmu Sedang Belajar.",
        heroH1b: "Bagaimana Cara Menjadi Korban.",
        heroSub: "Untuk istri yang bertahan 'demi anak'. Yang berpikir diam dan mengalah adalah pengorbanan mulia. Tapi anakmu tidak melihat pengorbanan. Mereka melihat TEMPLATE — bagaimana seorang wanita harus diperlakukan, dan bagaimana seorang wanita harus menerima. Dan template itu, mereka bawa ke pernikahannya nanti.",
        painLabel: "WARISAN YANG DIAM-DIAM KAMU TURUNKAN",
        painH2a: "Kamu Mengira Mereka Tidak Lihat.",
        painH2b: "Mereka Melihat Semuanya.",
        stories: [
            {
                imgs: ['p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274'],
                title: 'Anak Perempuanmu Akan Menikah Dengan Pria Yang Memperlakukannya Seperti Ayahnya Memperlakukanmu.',
                body: `Ini bukan menakut-nakuti. Ini psikologi anak yang sudah dibuktikan ratusan kali.\n\nAnak perempuan secara tidak sadar mencari pasangan yang familiar — yaitu yang mengingatkan mereka pada figur ayah. Bukan karena mereka mau. Tapi karena pola itu sudah tertanam sebagai "normal" sejak kecil.\n\nKalau setiap malam dia melihat ayahnya cuek pada ibunya — dia akan tertarik pada pria cuek dan menganggapnya "wajar".\n\nKalau setiap minggu dia melihat ibunya menelan kekecewaan dalam diam — dia akan menelan kekecewaan dalam diam juga, di pernikahannya nanti.\n\nKamu pikir kamu bertahan demi dia. Sebenarnya kamu sedang memprogram dia untuk bertahan dalam pernikahan yang sama.`
            },
            {
                imgs: ['p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214'],
                title: 'Anak Laki-lakimu Akan Memperlakukan Istrinya Persis Seperti Ayahnya Memperlakukanmu.',
                body: `Sisi lainnya sama mengerikan. Anak laki-laki belajar bagaimana memperlakukan wanita dari satu sumber utama: bagaimana ayahnya memperlakukan ibunya.\n\nKalau ayahnya tidak pernah mengucapkan terima kasih — dia tidak akan pernah mengucapkan terima kasih.\n\nKalau ayahnya menganggap pekerjaan istri "ya memang tugasnya" — dia akan menganggap pekerjaan calon istrinya "ya memang tugasnya".\n\nKalau ayahnya berbohong dan kamu memilih percaya — dia belajar bahwa wanita memang akan percaya, jadi tidak apa-apa berbohong.\n\nDan suatu hari, ada calon menantu perempuan menangis di kamar mandi — karena anakmu menjadi tepat seperti ayah yang dulu kamu tangisi.`
            },
            {
                imgs: ['p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274'],
                title: 'Bertahan Bukan Pengorbanan. Kalau Kamu Yang Hancur, Anak Yang Mewarisi Trauma.',
                body: `Banyak ibu mengulang kalimat ini ke diri sendiri: "Saya tahan demi anak."\n\nTapi mari jujur: anakmu bukan bahagia karena rumah tangga "utuh di luar". Mereka bingung karena ibu mereka tampak hidup tanpa ruh. Mereka takut karena setiap malam ada ketegangan tak terucap. Mereka belajar karena pelajaran terbesar diberikan tanpa kata.\n\nMenjadi wanita berdaya BUKAN egois. Itu adalah HADIAH terbesar yang bisa kamu berikan ke anakmu. Karena anak yang melihat ibunya bangkit — akan tahu mereka juga bisa bangkit kalau suatu hari hidup mengempaskan mereka.\n\nDi Dark Feminine, kamu akan belajar bagaimana memutus rantai itu — bukan dengan menghancurkan keluarga, tapi dengan mengubah frekuensimu sendiri terlebih dulu. Dan ketika kamu berubah, semua orang di rumah itu — termasuk suami dan anak — terpaksa ikut menyesuaikan.`
            }
        ],
        pains: [
            { icon: "👧", text: <>Anak perempuanmu akan menikahi <strong>copy paste dari ayahnya</strong>. Karena itu yang dia pelajari sebagai "normal".</> },
            { icon: "👦", text: <>Anak laki-lakimu akan memperlakukan istrinya <strong>persis seperti ayahnya memperlakukanmu</strong>.</> },
            { icon: "🪞", text: <>Mereka <strong>melihat semuanya</strong>. Bahkan yang kamu pikir kamu sembunyikan dengan senyuman.</> },
            { icon: "💧", text: <>Mereka tidak melihat pengorbanan. Mereka melihat <strong>TEMPLATE</strong> — dan akan membawanya ke pernikahan mereka sendiri.</> },
            { icon: "⛓️", text: <>Bertahan bukan mulia kalau itu berarti <strong>mewariskan rantai yang sama</strong>.</> },
            { icon: "🌅", text: <>Saatnya menjadi ibu yang anakmu lihat <strong>BANGKIT</strong> — supaya mereka tahu mereka juga bisa.</> },
        ],
        paramAgitation: {
            label: "AGITASI — WARISAN YANG DIAM-DIAM KAMU TURUNKAN",
            h2a: "Anakmu Sedang Belajar",
            h2b: "Cara Menerima Apa Yang Tidak Layak.",
            imgKey: 'p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214', // IMG SLOT
            body: <>Anak perempuanmu, 9 tahun, sedang menonton kamu. <strong>Bagaimana cara kamu diam saat ayahnya membentakmu di depan tamu.</strong> Bagaimana kamu tersenyum saat dia membatalkan janji untuk yang ke-5 kalinya. Bagaimana kamu bilang "tidak apa-apa" saat air matamu jatuh di kamar mandi.<br /><br />Kamu pikir dia tidak melihat. <strong>Dia melihat semuanya.</strong> Dan otaknya menyimpan setiap adegan itu sebagai "ini yang dilakukan istri yang baik".<br /><br />15 tahun lagi, dia akan duduk di kafe Sabtu pagi, bersama pacarnya yang persis seperti ayahnya. Pacar yang membentaknya di depan teman, yang membatalkan janji, yang menyepelekan dia. Dan dia akan tersenyum dan bilang "tidak apa-apa" — <strong>karena itulah satu-satunya pola yang dia pelajari dari rumah.</strong><br /><br />Dan suatu hari dia akan menelpon kamu menangis. Bukan karena dia bingung dengan pacarnya. <strong>Karena dia bingung kenapa dia tidak bisa pergi.</strong> Persis seperti kamu sekarang.</>,
        },
        paramHope: {
            label: "VISI BARU — RANTAI YANG TERPUTUS PADA GENERASI INI",
            h2a: "Bayangkan Anakmu",
            h2b: "Yang Tahu Cara Mempertahankan Dirinya.",
            imgKey: 'p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274', // IMG SLOT
            body: <>Bayangkan: anak perempuanmu, 22 tahun, pulang dari kuliah dan cerita: <strong>"Mama, gue putus tadi. Dia kayak ga ngehargain gue, jadi gue cabut."</strong> Dia bilang itu santai, sambil makan keripik. Tidak menangis. Tidak ragu.<br /><br />Karena 13 tahun terakhir, dia melihat <strong>ibunya bangkit.</strong> Dia melihat ibunya berhenti diam saat tidak adil. Berhenti tersenyum saat sakit. Berhenti bilang "tidak apa-apa" saat sebenarnya iya.<br /><br />Bayangkan: anak laki-lakimu, 25 tahun, pacaran dengan wanita baru. Dan tanpa kamu pernah ajari secara verbal — <strong>dia tahu cara menghargai pacarnya.</strong> Karena dia tumbuh melihat ayahnya akhirnya belajar menghargai ibunya. Pola itu yang dia simpan, bukan yang lama.<br /><br />Itulah <strong>warisan sejati.</strong> Bukan tabungan, bukan rumah, bukan ijazah. Tapi pola hubungan yang sehat — yang hanya bisa kamu wariskan jika kamu sendiri yang berani memutus rantai dulu.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Memutus Rantai",
            h2b: "Tanpa Menghancurkan Keluarga.",
            imgKey: 'p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214', // IMG SLOT
            steps: [
                { num: '1', title: 'UBAH FREKUENSIMU TERLEBIH DULU (Hari 1-30)', body: 'Anakmu tidak butuh ibu yang teriak ke ayahnya. Mereka butuh ibu yang berubah pelan-pelan — yang dandan rapi setiap hari, yang punya hobi, yang mulai bilang "tidak" pada permintaan tidak masuk akal. Mereka akan melihat dengan diam: "ibu saya bangkit". Dan itu lebih powerful dari 1000 ceramah.' },
                { num: '2', title: 'SET BOUNDARY DENGAN HALUS (Bulan 2-3)', body: 'Bukan ultimatum. Bukan drama. Tapi mulai menolak hal-hal kecil yang selama ini kamu telan: "tidak, saya tidak siap masak makan malam jam 9", "tidak, saya tidak akan membatalkan janji saya". Anak-anak melihat ini dan otaknya merekam: "ada cara untuk tidak setuju tanpa menjadi korban".' },
                { num: '3', title: 'AJARI MEREKA DENGAN HIDUPMU, BUKAN DENGAN KATA (Tahun 1+)', body: 'Tidak perlu ceramah panjang ke anak tentang "harga diri". Mereka belajar dari pola harian. Setiap hari kamu menghormati dirimu sendiri — kamu menulis ulang template yang akan mereka bawa ke pernikahan mereka 20 tahun lagi. Kamu memutus 1 rantai, kamu menyelamatkan 3 generasi.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Bagaimana",
            h2b: "Kalau Anak Saya Trauma?",
            items: [
                { q: "Bukankah berubah sekarang akan membingungkan anak-anak?", a: "Justru sebaliknya. Yang membingungkan anak adalah ibu yang tampak 'baik-baik saja' di luar tapi mereka rasakan tidak bahagia. Anak punya intuisi yang lebih tajam dari kita kira. Ketika mereka melihat ibunya MENJADI hidup lagi — mereka justru lega. Banyak pengguna kami melaporkan anak-anak mereka jadi lebih dekat dan lebih terbuka setelah ibunya berubah." },
                { q: "Bagaimana kalau saya berubah dan rumah tangga jadi pecah?", a: "Kalau pecah, itu bukan karena perubahanmu — itu karena pernikahan itu memang sudah pecah secara emosional jauh sebelum kamu berubah. Yang kamu lakukan hanya membuka jujurannya. Dan anak-anak yang tumbuh dengan ibu yang utuh secara mental — bahkan dalam single parent home — jauh lebih sehat dari anak yang tumbuh dengan ibu yang hancur dalam pernikahan utuh." },
                { q: "Saya sudah terlalu lama mengalah, anak-anak saya sudah remaja. Sudah terlambatkah?", a: "Tidak. Anak remaja yang melihat ibunya bangkit — mendapat pesan paling kuat: 'tidak ada yang terlambat untuk berubah'. Mereka akan ingat momen ini sepanjang hidup mereka, dan akan terinspirasi untuk bangkit setiap kali mereka stuck. Kamu mengubah masa depannya, bukan masa lalumu." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Ibu.",
            h2b: "3 Rantai Yang Berhasil Diputus.",
            transformations: [
                {
                    name: 'Rini, 41 thn — Ibu Dari 2 Anak Perempuan',
                    imgKey: 'p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274', // IMG SLOT
                    before: 'Anak perempuan saya yang sulung (16 thn) mulai pacaran dengan tipe pria yang persis seperti ayahnya — keras, tidak menghargai. Saya kaget waktu lihat dia mengalah seperti yang saya lakukan ke suami saya. Saya tahu sumbernya — saya. 16 tahun dia melihat saya menelan diam. Dia mereplikasinya.',
                    after: 'Saya berubah dulu, bukan ngomelin dia. Saya mulai dandan, mulai jalan dengan teman lama, mulai bilang tidak ke suami untuk hal-hal kecil. Setelah 4 bulan, anak saya sendiri yang putus dengan pacarnya — dengan alasan "dia tidak menghargai gue, dan gue ga mau kayak situasi yang gue lihat di rumah". Itu yang paling membahagiakan saya dalam 10 tahun.',
                },
                {
                    name: 'Sari, 39 thn — Ibu Tunggal Setelah Cerai',
                    imgKey: 'p_legacy_istrilegacy_02_putus_rantai_v2_1777551252214', // IMG SLOT
                    before: 'Cerai 2 tahun lalu setelah 14 tahun pernikahan toxic. Saya pikir saya merdeka — tapi sadar saya tidak benar-benar berubah. Saya masih takut ngomong ke pacar baru, masih membatalkan rencana saya untuk mengakomodasi dia. Anak saya laki-laki, 11 thn, mulai memperlakukan saya cuek seperti ayahnya dulu.',
                    after: 'Saya pelajari dari ebook ini bahwa cerai bukan akhir transformasi — itu baru awal. Saya bangun ulang frekuensi saya. Saya stop minta maaf untuk hal-hal yang bukan salah saya. Anak laki-laki saya, dalam 6 bulan, mulai memperlakukan saya berbeda. Dia mulai membantu di rumah, mulai bertanya "ibu hari ini gimana?", mulai memuji masakan saya. Dia mereplikasi pola baru yang saya bangun.',
                },
                {
                    name: 'Rina, 44 thn — Anak Perempuan Sudah Menikah',
                    imgKey: 'p_legacy_istrilegacy_01_anak_meniru_v2_1777551238274', // IMG SLOT
                    before: 'Saya pikir sudah terlambat — anak perempuan saya sudah menikah, dan dia menikah dengan pria yang persis seperti suami saya. Saya hancur melihat dia mengulang nasib saya, dan saya merasa "saya yang menyebabkan ini". Saya beli ebook ini setengah hati, pikir untuk diri saya sendiri.',
                    after: 'Yang saya tidak duga: saya berubah, dan anak saya MELIHAT. Setelah 8 bulan, dia datang ke rumah, peluk saya, dan bilang "Ma, gue mau kayak Mama sekarang." Dia mulai berubah dalam pernikahannya — set boundary, berhenti menerima perlakuan tidak hormat. Suaminya BERUBAH karena dia berubah. Tidak pernah terlambat — saya mengubah 2 generasi sekaligus dalam 1 tahun.',
                },
            ],
        },
    } : null;

    // ?istrivisible — Persona "Emotional Neglect / Invisible Woman" (df_0412_i4, 4 sales) — Istri
    // Tema: Kesepian di dalam rumah yang ramai. Istri yang merasa seperti "pembantu" atau
    // "bayangan" yang tidak lagi diajak bicara atau dihargai oleh suaminya.
    // IMAGES: TBD — user akan menambahkan asset story setelah review copy.
    const istriVisibleContent = hasIstriVisible ? {
        heroBadge: "👁️ KAMU TIDAK INVISIBLE — UNTUK PARA ISTRI",
        heroH1a: "Kamu Hidup Bersamanya.",
        heroH1b: "Tapi Dia Sudah Lama Berhenti Melihatmu.",
        heroSub: "Untuk istri yang merasa kesepian justru di rumah yang ramai. Yang setiap hari bicara — tapi tidak ada yang mendengar. Yang merapikan, memasak, mengurus anak — tapi diperlakukan seperti perabot yang sudah terlalu lama ada. Kamu bukan invisible. Hanya frekuensimu yang sudah mati.",
        painLabel: "KESEPIAN DI RUMAH YANG RAMAI",
        painH2a: "Kapan Terakhir Dia",
        painH2b: "Benar-Benar Melihatmu?",
        stories: [
            {
                imgs: ['p_visible_df_0424_ad05_istri_sexmati'],
                title: 'Kamu Bicara. Dia Mengangguk. Tapi Tidak Mendengar Sepatah Kata Pun.',
                body: `Kamu cerita tentang harimu — anak yang demam, kerjaan yang berat, masalah dengan tetangga. Dia mengangguk. Bilang "iya, iya". Mata tidak lepas dari layar HP.\n\nMalam itu kamu tanya: "Tadi aku cerita tentang apa?" Dia diam. Tidak ingat satu pun.\n\nDan itu bukan sekali. Itu setiap hari. Kamu sudah berhenti cerita hal-hal penting. Kamu sudah berhenti berharap dia bertanya "bagaimana harimu?". Kamu berbicara di rumah yang sama, tapi sudah lama hidup sendirian.\n\nIni namanya emotional neglect. Lebih sakit dari pertengkaran. Karena pertengkaran setidaknya artinya dia masih peduli. Diam sepanjang hari artinya — dia sudah tidak peduli sama sekali.`
            },
            {
                imgs: ['p_visible_istrivisible_01_perabot_v3_1777554172954'],
                title: 'Kamu Pakai Baju Baru. Potong Rambut. Pakai Parfum. Dia Tidak Menyadari.',
                body: `Pernah pakai baju baru yang kamu beli dengan susah payah — dan dia bahkan tidak melirik?\n\nPernah potong rambut dengan model yang berbeda total — dan dia tidak komentar apa-apa selama 2 minggu, sampai akhirnya kamu yang harus bilang "aku potong rambut, lho"?\n\nPernah mencoba parfum baru, dandan lebih cantik, kasih signal subtle — dan dia hanya pulang, makan, tidur?\n\nIni bukan tentang dia jahat. Ini tentang dia sudah berhenti MEMERHATIKAN. Otaknya sudah mengkategorikanmu sebagai "perabot yang sudah ada di rumah". Aman. Pasti. Tidak perlu effort.\n\nDan itu, secara perlahan, membunuh sesuatu di dalam dirimu.`
            },
            {
                imgs: ['p_visible_istrivisible_02_potong_rambut_v3_1777554256681'],
                title: 'Yang Mati Bukan Cinta. Yang Mati Adalah Frekuensimu.',
                body: `Banyak istri merasa, "Mungkin dia sudah tidak cinta lagi."\n\nTapi kebanyakan kasus, suami tidak berhenti cinta. Dia hanya berhenti MEMERHATIKAN — dan itu sebenarnya bukan masalah dia. Itu masalah frekuensimu.\n\nKetika kamu setiap hari memberi tanpa diminta, ada tanpa diminta, melayani tanpa diminta — otaknya berhenti mendaftarkanmu sebagai stimulus. Kamu sudah jadi background. Sama seperti dinding rumah. Selalu ada, tidak perlu diperhatikan.\n\nUntuk kembali terlihat, kamu tidak perlu jadi cantik baru. Tidak perlu drama. Tidak perlu ancaman.\n\nKamu hanya perlu memutus pola "selalu ada" itu — sampai otaknya terpaksa menyadari: "Ada yang berbeda dari istriku. Aku harus memperhatikan."\n\nDi Dark Feminine, kamu akan belajar persis bagaimana melakukan itu — tanpa kehilangan dirimu, tanpa drama, tanpa membahayakan rumah tangga.`
            }
        ],
        pains: [
            { icon: "🪑", text: <>Kamu sudah seperti <strong>perabot di rumahmu sendiri</strong>. Selalu ada. Tidak pernah benar-benar dilihat.</> },
            { icon: "🗣️", text: <>Kamu bicara setiap hari. Tapi <strong>tidak ada satu pun</strong> yang dia ingat.</> },
            { icon: "💄", text: <>Pakai baju baru, potong rambut, parfum baru — <strong>dia tidak akan menyadari</strong>.</> },
            { icon: "🤐", text: <>Kamu sudah berhenti cerita hal penting. Karena <strong>tidak ada yang mendengarkan</strong>.</> },
            { icon: "🌫️", text: <>Lebih sakit dari pertengkaran. Karena pertengkaran berarti masih peduli — <strong>diam sepanjang hari berarti tidak lagi</strong>.</> },
            { icon: "🌟", text: <>Kamu bukan invisible. Hanya <strong>frekuensimu yang sudah mati</strong>. Dan itu bisa dihidupkan kembali.</> },
        ],
        paramAgitation: {
            label: "AGITASI — KESEPIAN YANG TIDAK BISA KAMU CERITAKAN",
            h2a: "Tidak Ada Yang Lebih Sakit",
            h2b: "Dari Bersama Tapi Sendirian.",
            imgKey: 'p_visible_df_0424_ad05_istri_sexmati', // IMG SLOT
            body: <>Pertengkaran mungkin sakit. Tapi <strong>diam sepanjang hari di rumah yang sama lebih membunuh.</strong><br /><br />Bayangkan: kamu duduk di sofa jam 9 malam, dia di kursi sebelah, scrolling HP. Sudah 3 jam tidak ada satu kata pun. Kamu mau cerita tentang harimu, tapi sudah tahu reaksinya: angguk dan "iya iya". Kamu mau bertanya tentang harinya, tapi sudah tahu jawabannya: "biasa aja".<br /><br />Kamu lihat dia ketawa sendiri di HP-nya. <strong>Untukmu — sudah berbulan-bulan dia tidak ketawa lepas seperti itu.</strong><br /><br />Lalu kamu masuk kamar, ganti baju, lihat cermin. Dan untuk pertama kalinya — kamu hampir tidak mengenali wanita di depan cermin itu. Kapan terakhir kamu pakai baju yang membuatmu merasa cantik? Kapan terakhir kamu dipuji? Kapan terakhir kamu MERASA seperti WANITA?<br /><br />Dan jawabannya menusuk: <strong>kamu sudah lupa.</strong></>,
        },
        paramHope: {
            label: "VISI BARU — TERLIHAT KEMBALI",
            h2a: "Bayangkan Hari Ketika",
            h2b: "Dia Memandangmu Untuk Pertama Kalinya — Lagi.",
            imgKey: 'p_visible_istrivisible_01_perabot_v3_1777554172954', // IMG SLOT
            body: <>Bayangkan: 8 minggu setelah protokol, kamu pulang dari kelas Pilates baru. Rambut tergerai. Kulit berseri. Pakai baju yang sudah lama tergantung di lemari. Dan untuk pertama kalinya dalam berbulan-bulan — <strong>dia mengangkat kepalanya dari HP.</strong><br /><br />Bayangkan: dia diam-diam mengamati kamu yang sedang membuat teh di dapur. Tidak menyadari kamu lihat dia di pantulan kaca. Mata yang sudah lama redup itu, tiba-tiba <strong>mengamatimu seolah baru bertemu.</strong><br /><br />Bayangkan: malam itu, dia menaruh HP. Dia bertanya: "Kamu sibuk apa hari ini?" — dengan tulus, untuk pertama kalinya dalam tahun ini. Bukan basa-basi. Dia <strong>betul-betul ingin tahu.</strong><br /><br />Bayangkan: 3 bulan kemudian, dia mulai ngajak date lagi. Mulai komentari outfit-mu. Mulai memuji masakanmu — bukan dengan "enak" doang, tapi dengan kalimat yang membuatmu terkejut. <strong>Kamu sudah terlihat lagi.</strong> Dan rumah yang dulu sepi — mulai hidup kembali.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Membangkitkan Kembali",
            h2b: "Frekuensi Yang Sudah Mati.",
            imgKey: 'p_visible_istrivisible_02_potong_rambut_v3_1777554256681', // IMG SLOT
            steps: [
                { num: '1', title: 'PUTUS POLA "SELALU ADA" (Hari 1-21)', body: 'Otaknya sudah mengkategorikanmu sebagai background — bukan karena dia jahat, tapi karena otak biologis berhenti memproses stimulus yang konstan. Solusi: jadi sedikit "tidak terduga". Bukan untuk drama. Tapi untuk memaksa otaknya kembali memproses kehadiranmu sebagai stimulus baru. Pulang lebih telat 1 jam dari biasa, tanpa penjelasan. Tidur dengan baju tidur baru.' },
                { num: '2', title: 'BANGKITKAN VERSI WANITAMU (Hari 15-45)', body: 'Bukan untuknya. Untuk dirimu sendiri. Hobi yang sudah lama dipendam. Teman lama yang sudah lama tidak ditemui. Kelas baru yang membuat matamu hidup lagi. Dia akan mendeteksi "ada yang berubah" — tanpa kamu pernah bicara apa-apa. Dan rasa amannya yang selama ini menyebabkan dia mengabaikanmu — mulai retak.' },
                { num: '3', title: 'BUAT DIA "KEHILANGAN" KAMU TERLEBIH DULU (Bulan 2-4)', body: 'Sebelum dia bisa MELIHAT kamu lagi, dia harus merasakan kemungkinan KEHILANGAN kamu dulu. Itu mekanika otak laki-laki. Dengan protokol kami, kamu menciptakan kemungkinan itu — secara halus, tanpa drama, tanpa ancaman. Dan ketika dia merasakan itu untuk pertama kalinya dalam bertahun-tahun, dia akan kembali memandangmu seolah pertama kali bertemu.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Bagaimana",
            h2b: "Dengan Situasi Saya?",
            items: [
                { q: "Saya sudah menikah 15 tahun. Apakah masih bisa diubah?", a: "Justru lebih dramatic dampaknya. Pernikahan panjang membentuk pola yang sangat tertanam — dan ketika pola itu PECAH oleh perubahan kecil darimu, otaknya masuk mode 'apa yang terjadi?'. Banyak pengguna yang menikah 12-20 tahun melaporkan perubahan suami yang paling cepat — karena kontras antara 'istri lama' dan 'istri yang sekarang' sangat tajam." },
                { q: "Saya sudah capek. Saya tidak tahu apakah saya masih punya energi untuk berubah.", a: "Itu justru tanda bahwa kamu paling butuh ini. Capek bukan kamu yang lemah — itu kamu yang sudah terlalu lama 'memberi' tanpa pernah 'menerima'. Protokol kami dimulai dari sesuatu yang TERBALIK: bukan kamu yang harus berusaha lebih untuknya, tapi kamu mulai berusaha untuk DIRIMU SENDIRI. Energimu akan kembali — dan ironisnya, dia juga akan kembali." },
                { q: "Bagaimana kalau dia tidak menyadari perubahan saya?", a: "Dia AKAN menyadari. Otak laki-laki secara biologis didesain untuk mendeteksi perubahan dalam lingkungan. Kalau istrinya yang sudah 10 tahun konstan tiba-tiba 'berbeda' — dia akan mendeteksi dalam minggu pertama, bahkan kalau dia tidak mengakuinya secara verbal. Pengguna kami melaporkan suami yang mulai 'curi pandang' dalam 7-10 hari pertama protokol." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Istri.",
            h2b: "3 Suami Yang Akhirnya Memandang Lagi.",
            transformations: [
                {
                    name: 'Rini, 39 thn — Menikah 13 thn',
                    imgKey: 'p_visible_df_0424_ad05_istri_sexmati', // IMG SLOT
                    before: 'Saya sudah seperti perabot di rumah saya sendiri. Suami pulang langsung ke ruang TV dengan HP. Tidak pernah bertanya bagaimana hari saya. Tidak pernah komentari penampilan saya. Saya potong rambut drastis — dia tidak menyadari sampai 3 minggu kemudian. Saya merasa sudah mati di dalam.',
                    after: 'Saya tidak ngomong apa-apa ke dia. Saya cuma mulai pergi tiap Sabtu pagi ke kelas yoga (rahasia, tanpa bilang). Saya pakai parfum yang dulu sebelum nikah. Minggu ke-2, dia mulai bertanya "kamu kemana tadi?". Minggu ke-5, dia membatalkan rencana nonton bola dengan teman untuk menemani saya makan malam. Minggu ke-8, dia bilang "kamu kelihatan beda akhir-akhir ini". Sekarang sudah 4 bulan — kami hampir seperti pacaran lagi.',
                },
                {
                    name: 'Lia, 36 thn — Menikah 9 thn',
                    imgKey: 'p_visible_istrivisible_01_perabot_v3_1777554172954', // IMG SLOT
                    before: 'Suami saya tidak selingkuh, tidak kasar, tidak pelit — tapi DIA SUDAH BUKAN ADA SECARA EMOSIONAL. Pulang kerja, makan, mandi, HP, tidur. Akhir pekan main game. Kalau saya bicara, dia jawab seadanya. Saya cerita ke teman, mereka bilang "syukur dia tidak kasar". Tapi saya hancur secara perlahan.',
                    after: 'Saya pelajari dari ebook ini bahwa "tidak ada konflik" bukan berarti "ada hubungan". Saya mulai membangun hidup di luar rumah — kelas keramik, book club, jalan dengan teman SMA yang sudah lama hilang. Saya stop nge-prep makan malam tepat waktu seperti robot. Bulan ke-2, dia mulai menatap saya saat saya pulang. Bulan ke-3, dia mulai pulang lebih awal. Bulan ke-4, dia ngajak liburan berdua tanpa anak — pertama kalinya dalam 6 tahun.',
                },
                {
                    name: 'Mona, 44 thn — Menikah 18 thn',
                    imgKey: 'p_visible_istrivisible_02_potong_rambut_v3_1777554256681', // IMG SLOT
                    before: 'Saya pikir di umur saya, sudah selesai. Anak-anak besar, suami sudah seperti teman serumah, dan saya menerima itu sebagai "fase pernikahan tua". Saya berhenti dandan. Berhenti pakai parfum. Berhenti memperhatikan diri sendiri. Saya merasa sudah "tidak relevan" sebagai wanita.',
                    after: 'Saya beli ebook ini sebagai eksperimen. Saya pikir untuk diri sendiri saja. Saya mulai pakai skincare lagi, baju yang feminine, perfume yang membuat saya nyaman. Bukan untuk dia. Untuk saya. Tapi setelah 6 minggu, suami saya mulai memperhatikan. Dia bilang "kamu kelihatan younger akhir-akhir ini". Sekarang setelah 5 bulan, dia ngajak saya kencan tiap Sabtu malam — sesuatu yang sudah tidak terjadi dalam 12 tahun terakhir.',
                },
            ],
        },
    } : null;

    // ?softlife — Persona "Soft Life / High Value Woman" (Juara 2: DF_ID_V2_17_Soft_Life)
    // Tema: "Wanita lain dimanjakan, ada yang mereka tahu yang tidak diajarkan padamu".
    // Sudut pandang: kecemburuan sosial terhadap wanita yang hidupnya "mudah" (dimanjakan/dibiayai)
    // dan rahasia di balik energi tersebut. Karakter wanita yang hebat meski tidak banyak gaya —
    // tenang, sedikit bicara, tidak butuh validasi, tapi mendapat segalanya. Kategori General/Single.
    // Kombinasi: ?softlife (Rp199.000 default) | ?softlife&value (membuka opsi Ultimate Rp399.000).
    const softlifeContent = (hasSoftlife && segment !== 'istri') ? {
        heroBadge: "🤍 SOFT LIFE — HIGH VALUE WOMAN",
        heroH1a: "Dia Tidak Lebih Cantik Darimu.",
        heroH1b: "Tapi Hidupnya Dimanjakan.",
        heroSub: "Untuk wanita yang lelah berjuang sendirian — sementara wanita lain hidupnya 'mudah'. Dimanjakan, dibayarkan, diperlakukan seperti ratu… tanpa berteriak, tanpa banyak gaya. Mereka paham satu hal yang tidak pernah diajarkan padamu.",
        painLabel: "RAHASIA SOFT LIFE — HIGH VALUE WOMAN",
        painH2a: "Kenapa Wanita Lain Dimanjakan,",
        painH2b: "Sementara Kamu Berjuang Sendiri?",
        stories: [
            {
                imgs: ['p_softlife_Campaign_Test_df_0412_g2'], // IMG SLOT — user akan menambahkan asset
                title: 'Dia Tidak Posting Drama. Tidak Banyak Gaya. Tapi Dapat Segalanya.',
                body: `Lihat sekitarmu. Wanita yang paling dimanjakan bukan yang paling cantik. Bukan yang paling sering posting OOTD. Bukan yang teriak "aku independent woman" di sosmed.\n\nMereka justru yang paling tenang. Yang paling sedikit bicara. Yang hidupnya kelihatan… biasa saja dari luar.\n\nTapi pria-pria mapan datang sendiri. Dibayarkan dinner-nya. Dikirimkan bunga tanpa diminta. Diajak liburan tanpa drama. Hidupnya soft, smooth, dan effortless.\n\nSementara kamu — kerja 12 jam sehari, mandiri sampai capek, posting "boss babe" setiap minggu — tapi tetap pulang ke rumah kosong.`
            },
            {
                imgs: ['p_softlife_df_0413_ba_wife_s1_v2_1776175429720'], // IMG SLOT — user akan menambahkan asset
                title: 'Mereka Tahu Sesuatu Yang Tidak Pernah Diajarkan Padamu.',
                body: `Kamu diajari dari kecil: kerja keras, jadi mandiri, jangan bergantung pada pria. Dan kamu lakukan semua itu dengan sempurna.\n\nTapi hasilnya? Kamu jadi "terlalu kuat", "terlalu sibuk", "terlalu independent" — sehingga tidak ada pria yang merasa dia bisa memberikan apapun untukmu.\n\nWanita soft life paham satu hal yang ibumu tidak pernah ajarkan: pria secara biologis didesain untuk MEMBERI dan MELINDUNGI. Ketika kamu menutup pintu itu dengan "aku bisa sendiri", kamu juga menutup pintu untuk dimanjakan.\n\nIni bukan tentang lemah. Ini tentang frekuensi. Tentang energi. Tentang menjadi MAGNET, bukan MESIN.`
            },
            {
                imgs: ['p_softlife_df_0413_ba_wife_s2_v2_1776175446156'], // IMG SLOT — user akan menambahkan asset
                title: 'High Value Tidak Perlu Membuktikan Apapun.',
                body: `Kamu pernah merasa harus "berusaha lebih keras" supaya dihargai? Berusaha lebih cantik. Berusaha lebih pintar. Berusaha lebih tinggi posisinya.\n\nTapi semakin keras kamu berusaha, semakin terlihat… butuh validasi.\n\nWanita high value tidak perlu membuktikan apapun. Tidak butuh atensi murahan. Tidak teriak siapa mereka. Mereka diam, dan dunia datang.\n\nKarena nilai sejati tidak pernah perlu dipromosikan. Dan justru karena itulah dunia memperlakukan mereka seperti yang seharusnya kamu dapatkan dari awal.`
            }
        ],
        pains: [
            { icon: "👑", text: <>Lihat wanita lain <strong>dimanjakan</strong> — dibayarkan, diajak liburan, diberikan hadiah — tanpa harus minta atau berusaha.</> },
            { icon: "💼", text: <>Kamu kerja keras, mandiri, "independent" — tapi pulang ke rumah <strong>kosong dan capek</strong>.</> },
            { icon: "🤫", text: <>Mereka tidak banyak gaya, tidak vokal, tidak posting drama — tapi <strong>mendapat segalanya</strong>.</> },
            { icon: "🔍", text: <>Kamu merasa ada <strong>sesuatu yang tidak kamu tahu</strong> — sesuatu yang diketahui wanita-wanita itu sejak kecil.</> },
            { icon: "🪞", text: <>Cantikmu tidak kurang. Pintarmu tidak kurang. Tapi <strong>frekuensi</strong>-mu… berbeda.</> },
            { icon: "💎", text: <>Kamu siap berhenti mengejar. Siap menjadi <strong>yang dikejar, dilayani, dan dimanjakan</strong>.</> },
        ],
        paramAgitation: {
            label: "AGITASI — HARGA YANG SUDAH KAMU BAYAR",
            h2a: "Berapa Tahun Lagi Kamu Akan",
            h2b: "Berjuang Sendirian?",
            imgKey: 'p_softlife_df_0413_ba_wife_s3_v2_1776175462649', // IMG SLOT
            body: <>Kamu sudah kerja keras selama 8-12 tahun karir. Kamu sudah membangun "boss babe" persona di IG. Kamu sudah bilang ke teman-teman "I don't need a man". <strong>Dan setiap kalimat itu makin menjauhkanmu dari kehidupan yang kamu sebenarnya inginkan.</strong><br /><br />Karena di dalam, di malam-malam Sabtu sepi, kamu tahu kebenarannya: <strong>kamu lelah.</strong> Lelah jadi yang membayar bensin sendiri. Lelah memilih jam mati untuk gym. Lelah mengangkat galon ke atas. Lelah memutuskan semuanya sendiri.<br /><br />Kamu lihat IG temanmu yang "kurang prestatif" tapi liburan ke Jepang dibayarin pacar. Yang dapat tas Hermes ulang tahun. Yang ke spa setiap minggu. <strong>Dan kamu mulai bertanya: "Apakah saya yang salah pilih jalan?"</strong><br /><br />Tidak. Kamu hanya belum diajari <strong>bahasa lain</strong> — bahasa yang membuat pria mapan ingin memberikan, bukan ingin menghindar.</>,
        },
        paramHope: {
            label: "VISI BARU — KEHIDUPAN SOFT LIFE YANG MENJADI MILIKMU",
            h2a: "Bayangkan Akhir Pekan",
            h2b: "Ketika Kamu Tidak Lagi Memutuskan Apapun.",
            imgKey: 'p_softlife_df_0413_ba_wife_s4_v2_1776175479780', // IMG SLOT
            body: <>Bayangkan: Sabtu pagi, kamu bangun, tidak perlu pikirkan "mau makan apa hari ini". Sudah ada chat masuk: "Sayang, kamu mau brunch di mana? Saya book". <strong>Dia yang memutuskan. Dia yang membayar. Kamu cukup ada dan menikmati.</strong><br /><br />Bayangkan: 2 minggu lagi ulang tahunmu. Kamu tidak perlu "kasih hint", tidak perlu request. Pagi hari ulang tahun, kamu bangun ke kamar yang sudah penuh bunga peony putih (yang kamu sebut sekali, 6 bulan lalu, dan dia ingat). Tas yang kamu pernah lihat di IG — ada di meja, dengan note tangan.<br /><br />Bayangkan: kamu lelah dengan kerjaan, mention sambil lalu "saya butuh liburan". <strong>3 hari kemudian dia kasih tiket Bali</strong> — dengan villa private pool, semua sudah arrange. "Kamu tinggal pack, Sayang."<br /><br />Bayangkan: ke spa setiap minggu, dia yang booking. Ke salon, dia yang transfer. Ke restaurant fancy, dia yang reserve. Bukan karena kamu meminta. Karena dia <strong>BUTUH</strong> melakukannya untukmu — supaya dia merasa cukup di matamu.</>,
        },
        paramHowItWorks: {
            label: "BAGAIMANA INI BEKERJA",
            h2a: "Frekuensi High Value",
            h2b: "Yang Membuat Pria Ingin Memberi.",
            imgKey: 'p_softlife_df_0413_sl_s1_1776094453410', // IMG SLOT
            steps: [
                { num: '1', title: 'STOP MEMBLOKIR PRIA UNTUK MEMBERI (Hari 1-21)', body: 'Tanpa sadar, kamu sudah melatih pria di sekitarmu untuk TIDAK memberi padamu. Setiap "tidak usah, saya bisa sendiri", setiap "biar saya saja yang bayar", setiap "saya tidak butuh apa-apa kok" — kamu menutup pintu untuk pria memberi. Kamu pelajari cara membukanya kembali — dengan elegan, tanpa terlihat materialistis.' },
                { num: '2', title: 'BANGUN SOFT FEMININITY YANG TENANG (Hari 22-60)', body: 'High value bukan tentang menjadi keras, dominan, "alpha female". Itu kebalikannya. Soft femininity yang tenang — yang tidak butuh validasi, tidak butuh pamer, tidak butuh teriak — adalah frekuensi yang membuat pria mapan TERPESONA. Kamu pelajari bahasa tubuh, intonasi, pilihan kata yang memancarkan ketenangan ini.' },
                { num: '3', title: 'TARIK PRIA YANG BUTUH MEMBERI (Bulan 2+)', body: 'Pria mapan yang otentik — bukan playboy — secara biologis ingin MEMBERI dan MELINDUNGI. Itu bagian dari maskulinitas mereka yang ingin diaktifkan. Ketika frekuensimu sudah benar, kamu akan menarik pria-pria yang justru BERKOMPETISI untuk memanjakanmu — bukan menghindar darimu.' },
            ],
        },
        paramObjections: {
            label: "PERTANYAAN UMUM",
            h2a: "Tapi Apakah",
            h2b: "Ini Bukan Materialistis?",
            items: [
                { q: "Bukankah ini menjadikan saya 'matre' atau gold digger?", a: "Tidak. Gold digger adalah wanita yang ingin uang TANPA memberikan apapun. Soft life adalah pertukaran energi yang sehat: kamu memberikan ketenangan, kelembutan, dan presence yang membuat pria merasa pria — dan dia memberikan provisi, perlindungan, dan privilege. Itu bukan transaksi. Itu komplementaritas. Pria mapan justru MERINDUKAN ini, dan tidak menemukannya pada wanita 'modern' yang menolak menerima." },
                { q: "Saya orangnya mandiri, sudah karir bagus. Apakah ini relevan?", a: "Justru paling relevan untukmu. Wanita karir sukses sering menjadi 'terlalu mandiri' — yang membuat pria-pria mapan menghindar karena merasa 'tidak dibutuhkan'. Soft life mengajarkan bagaimana TETAP kuat secara karir, tetapi MEMBUKA RUANG untuk pria memberi padamu. Kamu tidak perlu kompromi karir — kamu hanya perlu reframe cara kamu menerima." },
                { q: "Saya sudah 35+, apakah masih bisa menarik pria mapan?", a: "Pria mapan (35-45+) justru mencari wanita 35+ — karena maturity dan ketenangan. Yang mereka tolak adalah wanita 25 yang masih drama. Dan satu hal yang harus kamu tahu: wanita Indonesia sukses di atas 35 dengan frekuensi soft yang benar — itu langka, dan permintaan tinggi. Kamu BUKAN ke-1000 dari pasar — kamu adalah ke-10. Kamu hanya belum tahu posisimu." },
            ],
        },
        paramSocialProof: {
            label: "BUKTI TRANSFORMASI — SEBELUM & SESUDAH",
            h2a: "3 Wanita.",
            h2b: "3 Hidup Yang Berubah Menjadi Soft Life.",
            transformations: [
                {
                    name: 'Rini, 32 thn — Marketing Manager',
                    imgKey: 'p_softlife_df_0413_sl_s3_1776094484568', // IMG SLOT
                    before: 'Saya bangga dengan tagline "I split bills". Setiap date saya bayar setengah, kadang lebih. Saya pikir saya menunjukkan "saya independen". Hasilnya? Pria-pria mapan yang awalnya tertarik pelan-pelan menjauh. Mereka tetap dengan saya sebagai "teman" tapi tidak melanjutkan ke hubungan serius. Saya pikir itu karena karir saya. Padahal sebenarnya saya yang menutup pintu untuk mereka memberi.',
                    after: 'Saya pelajari cara menerima dengan elegan — tidak grabbing, tidak desperate, hanya "thank you, this is lovely". Pria pertama yang saya kencani setelah belajar ini — seorang pengusaha 38 thn — minggu ke-3 sudah ngajak ke Hong Kong, all expense paid. Saya kira jebakan, ternyata bukan. Dia genuinely senang punya wanita yang membiarkan dia "menjadi pria". Sekarang sudah 9 bulan, segala kebutuhan saya dia urus, sambil saya tetap kerja & punya pendapatan saya sendiri.',
                },
                {
                    name: 'Bella, 36 thn — Senior Executive',
                    imgKey: 'p_softlife_df_0413_sl_s4_1776094503539', // IMG SLOT
                    before: 'Posisi saya tinggi, gaji 8-digit. Tapi setiap pria yang saya kencani merasa "intimidated" dan menjauh. Saya mulai pikir saya harus "downplay" career saya untuk laku. Saya benci pikiran itu. Saya juga lihat teman saya yang gajinya separuh saya tapi dimanjakan pacarnya seperti princess — saya tidak ngerti bedanya.',
                    after: 'Bedanya: dia BUKAN downplay karir, dia downplay STRESS. Setiap kali ketemu pacarnya, dia tidak bawa energy "Saya stressful boss" — dia bawa energy "Saya tenang dan menerima". Saya copy itu. Pria yang saya kencani sekarang — pengacara senior — pertama kali bilang "saya tertarik karena kamu tidak intimidating, padahal jelas kamu sukses". Sekarang dia yang ngirim driver setiap saya pulang malam dari kantor, ngajak liburan tiap quarter, dan baru bulan lalu kasih saya jam Cartier untuk anniversary.',
                },
                {
                    name: 'Lina, 28 thn — Akuntan Junior',
                    imgKey: 'p_softlife_softlife_01_dimanjakan_v2_1777551018247', // IMG SLOT
                    before: 'Saya kira soft life cuma untuk wanita kaya atau cantik banget. Saya orang biasa, gaji 8-digit-an, looks 7/10. Saya pikir "siapa yang mau manjain saya?". Saya selalu ngotot bayar setengah, ngerasa "kalau dia bayar saya merasa berhutang".',
                    after: 'Saya pelajari kalau bukan tentang fisik atau gaji — tentang FREKUENSI. Saya berhenti ngotot bayar. Saya mulai express genuine appreciation ("kamu so thoughtful, terima kasih"). Pria yang saya kencani — sales executive 30 thn (bukan tycoon) — mulai membawa saya makan di tempat yang saya tidak biasa, mulai kasih hadiah kecil yang thoughtful. Setelah 6 bulan, dia upgrade gaya hidup kami berdua. Bukan karena saya minta. Karena dia sendiri yang ingin "kasih saya yang terbaik". Sekarang kami planning honeymoon ke Eropa.',
                },
            ],
        },
    } : null;

    const segmentContent = segment === 'istri' ? {
        heroBadge: "🔥 KHUSUS UNTUK PARA ISTRI",
        heroH1a: "Kamu Sudah Memberikan Segalanya...",
        heroH1b: "Tapi Kenapa Masih Merasa Tidak Dilihat?",
        heroSub: "Untuk istri yang lelah berjuang sendirian. Yang tidur di samping seseorang tapi merasa ribuan kilometer jaraknya. Yang bertanya dalam diam — 'Kenapa dia tidak lagi memilihku?'",
        painLabel: "KISAH YANG TIDAK PERNAH KAMU CERITAKAN",
        painH2a: "Apakah Ini",
        painH2b: "Hidupmu Sekarang?",
        stories: [
            {
                imgs: ['istriC2S1', 'istriC2S2', 'istriC2S3', 'istriC2S4'],
                title: 'Dulu Dia Berlari Untukmu. Sekarang Kamu Mengejar Bayangan.',
                body: `Ingat waktu pacaran dulu? Dia yang chat duluan. Dia yang cemas kalau kamu belum balas. Dia yang rela hujan-hujanan cuma buat ketemu kamu 30 menit.\n\nSekarang? Kamu yang minta perhatian. Kamu yang inisiatif. Kamu yang "ngerti" kalau dia sibuk, capek, atau butuh waktu sendiri. Selalu kamu yang mengalah.\n\nDan pertanyaan yang paling menyakitkan bukan "kenapa dia berubah?" — tapi "apa aku yang membuatnya berhenti berusaha?"`
            },
            {
                imgs: ['istriC4S1', 'istriC4S2', 'istriC4S3', 'istriC4S4'],
                title: 'Dia Punya Waktu Untuk Segalanya. Kecuali Kamu.',
                body: `Dia bisa scroll sosmed 2 jam. Bisa nonton bola sampai larut. Bisa ngobrol panjang lebar sama teman-temannya.\n\nTapi giliran kamu ajak ngobrol? "Nanti ya." Kamu minta dinner berdua? "Males keluar." Kamu pakai baju baru? Dia bahkan tidak melirik.\n\nDan yang paling pedih — kamu lihat dia like foto wanita lain di IG-nya. Sementara chat dari istrinya sendiri cuma di-read.`
            },
            {
                imgs: ['istriC5S1', 'istriC5S2', 'istriC5S3', 'istriC5S4'],
                title: 'Bertahan Demi Anak. Tapi Sampai Kapan?',
                body: `Kamu pernah googling "tanda-tanda pernikahan tidak sehat" jam 2 pagi. Hasilnya cocok semua. Tapi kamu tutup browser-nya karena kamu takut dengan jawabannya.\n\nKamu bertahan. Bukan karena bahagia — tapi karena anak-anak. Karena status. Karena "nanti orang bilang apa."\n\nDan setiap hari, kamu bangun dengan wajah yang sama, senyuman yang sama, dan kekosongan yang sama di dalam dada.\n\nTapi di dalam hati kamu tahu — ini bukan hidup. Ini survival.`
            },
            {
                imgs: ['newIstri9', 'newIstri4', 'newIstri9'],
                title: 'DIA SEDANG MENGHAPUSMU DARI HIDUPNYA.',
                body: `Kamu pikir dia cuma "khilaf" sebentar. Kamu pikir kalau kamu lebih sabar, lebih melayani, dan lebih diam, dia akan bosan dengan wanita itu dan kembali padamu.\n\nKamu salah besar.\n\nDia tidak sedang main-main. Dia sedang melakukan kalkulasi dingin. Dia sedang menghapus jejakmu dari rekeningnya, dari rencana masa depannya, dan dari hatinya.`
            },
            {
                imgs: ['newIstri2'],
                title: 'DIA BANGUN RUMAH BARU DENGAN UANGMU.',
                body: `Setiap kali dia bilang "uangnya lagi diputar untuk bisnis," atau "masih banyak pengeluaran kantor," kamu percaya. Kamu potong budget skincare-mu, kamu tunda beli tas impianmu, kamu hitung setiap rupiah demi masa depan anak-anak.\n\nDi saat yang sama, wanita itu sedang tertawa sambil memilih furnitur untuk apartemen barunya. Pakai uang siapa? Uang suamimu.`
            },
            {
                imgs: ['newIstri6'],
                title: 'SENTUHANNYA HANYA KEWAJIBAN.',
                body: `Pernahkah kamu merasa, saat dia memelukmu, dia tidak benar-benar "ada"?\n\nSentuhannya terasa mekanis. Kata-kata manisnya terdengar seperti naskah yang sudah dihafal. Di tempat tidur, dia ingin segalanya cepat selesai. Bukan karena dia capek kerja, tapi karena pikirannya sudah terbang ke wanita lain.`
            },
            {
                imgs: ['newIstri8'],
                title: 'ANAKMU SUDAH TAHU AYAHNYA KHIANAT.',
                body: `Kamu pikir "bertahan demi anak" adalah tindakan mulia. Tapi sadarkah kamu bahwa anakmu sebenarnya sudah tahu?\n\nDi mata mereka, kamu tidak sedang berkorban. Kamu sedang mengajarkan mereka bagaimana caranya menjadi korban. Tunjukkan pada mereka bagaimana seorang Ratu bertindak.`
            },
            {
                imgs: ['newIstri11'],
                title: 'JANGAN JADI PILIHAN KEDUA DI RUMAHMU SENDIRI.',
                body: `Kamu mengorbankan segalanya demi keluarga. Tapi dia mengorbankan keluarganya demi wanita lain.\n\nJangan hanya menunggu. Pahami psikologi daya tarik dan rebut kembali kendali yang selama ini hilang.`
            }
        ],
        pains: [
            { icon: "🪞", text: <>Kapan terakhir kali kamu merasa seperti <strong>WANITA</strong> — bukan hanya ibu, istri, atau pekerja?</> },
            { icon: "💔", text: <>Bukan dia yang jahat. Tapi dia sudah <strong>berhenti melihatmu</strong> sebagai wanita yang perlu diperjuangkan.</> },
            { icon: "🤐", text: <>Kamu memilih <strong>diam</strong> — bukan karena tidak peduli, tapi karena bicara pun sudah tidak didengar.</> },
            { icon: "🌫️", text: <><strong>Sampai kapan?</strong> Pertanyaan itu muncul setiap malam, dan kamu tidak punya jawabannya.</> },
        ],
    } : null;

    // Merge: segment overrides on top of base content. Specific istri winners stack on top
    // of the istri segment base; general winners stack on top of default base.
    const sc: any = istriFearContent
        ? { ...c, ...segmentContent, ...istriFearContent }
        : istriLegacyContent
        ? { ...c, ...segmentContent, ...istriLegacyContent }
        : istriVisibleContent
        ? { ...c, ...segmentContent, ...istriVisibleContent }
        : segmentContent
        ? { ...c, ...segmentContent }
        : presenceContent
        ? { ...c, ...presenceContent }
        : perubahanContent
        ? { ...c, ...perubahanContent }
        : highvalueContent
        ? { ...c, ...highvalueContent }
        : nongamesContent
        ? { ...c, ...nongamesContent }
        : softlifeContent
        ? { ...c, ...softlifeContent }
        : c;

    const [countdown, setCountdown] = useState("00:00:00");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showSticky, setShowSticky] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        document.title = "Dark Feminine — 52 Jurus Rahasia";
        const KEY = 'df_end_time';
        let endTime = localStorage.getItem(KEY);
        if (!endTime || Date.now() > parseInt(endTime)) {
            endTime = (Date.now() + 3 * 60 * 60 * 1000).toString();
            localStorage.setItem(KEY, endTime);
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, parseInt(endTime!) - now);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement;
            const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
            setScrollProgress(pct);
            setShowSticky(pct > 30);

            document.querySelectorAll('.df-fade-in:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <Toaster />
            {/* LOGIN MODAL */}
            {showLoginModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div style={{ background: '#251446', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '32px 24px', border: '1px solid rgba(139,92,246,0.5)', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,1)' }}>
                        <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--white)', fontSize: '20px', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>×</button>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'white', fontWeight: 700, marginBottom: '8px' }}>Login Akun</h3>                            <p style={{ fontSize: '14px', color: 'white' }}>Masuk untuk memberikan ulasan. Jika belum punya akun, akan otomatis dibuat saat Anda membeli.</p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'white' }} size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="email@anda.com"
                                        style={{ width: '100%', padding: '14px 14px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '15px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'white' }} size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '15px' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoginLoading} style={{ width: '100%', background: 'var(--purple)', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'background 0.2s', opacity: isLoginLoading ? 0.7 : 1 }}>
                                {isLoginLoading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Login Sekarang' : 'Login Now')}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button onClick={handleForgotPassword} disabled={isLoginLoading} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
                                Lupa Password? (Isi email lalu klik ini)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentInstructions && paymentData ? (
                <div style={{ minHeight: '100vh', background: '#EEE5C8', fontFamily: "'DM Sans', sans-serif", color: '#060A12' }}>
                    <style>{`.pay-btn-confirm { background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'DM Sans'; margin-top: 15px; }`}</style>
                    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '30px 20px' }}>
                        <button onClick={() => setShowPaymentInstructions(false)} style={{ background: 'none', border: 'none', color: '#060A12', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'DM Sans' }}>
                            <ArrowLeft size={20} /> Kembali
                        </button>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#060A12', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>Instruksi Pembayaran</h2>

                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                                <span style={{ color: '#5E7491', fontWeight: 600 }}>NOMOR REFERENSI</span>
                                <span style={{ fontWeight: 700, color: '#060A12' }}>{paymentData.tripay_reference}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                                <span style={{ color: '#5E7491', fontWeight: 600 }}>Total Pembayaran</span>
                                <span style={{ fontWeight: 700, fontSize: '19px', color: '#060A12' }}>Rp {paymentData.amount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {paymentData.paymentMethod === 'BCA_MANUAL' && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '16px', fontWeight: 700 }}>Transfer Manual BCA</h3>
                                <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>7751146578</span>
                                    <button onClick={() => { navigator.clipboard.writeText('7751146578'); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                                </div>
                                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: 16 }}>A.n Delia Mutia</p>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.4 }}>
                                    *Robot kami selalu cek per interval 10 menit, jadi maximal 10 menit setelah kk transfer paling lambat
                                </p>
                                <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Hai Kak renata saya sudah transfer ini Buktinya.. (upload bukti transfer anda) - Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                    <button className="pay-btn-confirm">Konfirmasi via WhatsApp</button>
                                </a>
                            </div>
                        )}

                        {paymentData.payCode && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                                <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) ? '12px' : '0' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#060A12' }}>{paymentData.payCode}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                                </div>
                                {['ALFAMART', 'ALFAMIDI', 'INDOMARET'].includes(paymentData.paymentMethod) && (
                                    <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #C9991A', fontSize: '14px', color: '#333', lineHeight: 1.5 }}>
                                        <strong>Langkah Pembayaran:</strong><br />
                                        Pergi ke <strong>{paymentData.paymentMethod === 'INDOMARET' ? 'Indomaret' : (paymentData.paymentMethod === 'ALFAMART' ? 'Alfamart' : 'Alfamidi')}</strong> terdekat, ke kasir berikan kode virtual ini untuk dibayar. Dalam 1 menit setelah dibayar, transaksi akan otomatis selesai dan produk ebook dikirim ke WhatsApp dan email Anda.
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentData.qrUrl && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                                <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee' }} />
                                    <button 
                                        onClick={() => downloadQRIS(paymentData.qrUrl)}
                                        style={{ 
                                            background: '#EEE5C8', 
                                            color: '#060A12', 
                                            padding: '10px 20px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #C9991A', 
                                            fontWeight: 700, 
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        <Download size={18} /> Download Gambar QRIS
                                    </button>
                                </div>
                                <div style={{ background: '#e8f5e9', padding: '14px', borderRadius: '10px', color: '#1b5e20', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
                                    ✅ Silahkan download/simpan foto ini lalu upload di Shopeepay, Qris Bank, Atau Dana, ovo, Gopay anda untuk menyelesaikan pembayaran.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="dark-feminine-container" style={{ background: '#0A0612', color: '#EEE5C8', fontFamily: "'DM Sans', sans-serif", fontSize: '17px', lineHeight: 1.75, position: 'relative', overflowX: 'hidden' }}>

                    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;700&display=swap');
        
        .dark-feminine-container {
          --bg-primary: #0A0612;
          --bg-card: #1A0A2E;
          --bg-section: #120820;
          --purple: #8B5CF6;
          --purple-light: #A78BFA;
          --gold: #C9991A;
          --gold-light: #F0C84A;
          --gold-dark: #9A7010;
          --cream: #EEE5C8;
          --muted: #7D6B9E;
          --white: #FFFFFF;
          --red: #EF4444;
          --green-wa: #25D366;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }
        
        .dark-feminine-container::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.4;
        }

        .df-wrap { max-width: 560px; margin: 0 auto; padding: 0 22px; }

        #df-progress-bar {
          position: fixed; top: 0; left: 0; height: 3px; width: 0%;
          background: linear-gradient(90deg, var(--purple), var(--gold-light));
          z-index: 10001; transition: width 0.1s;
        }

        #df-urgency-bar {
          position: sticky; top: 0; z-index: 10000;
          background: linear-gradient(90deg, #4C1D95, #7C3AED, #4C1D95);
          background-size: 200% 100%;
          animation: dfUrgencyMove 4s linear infinite;
          text-align: center; padding: 11px 22px;
          font-size: 14px; font-weight: 700; letter-spacing: 0.04em; color: #fff;
        }
        @keyframes dfUrgencyMove { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        
        #df-lang-btn {
          position: fixed; top: 52px; right: 16px; z-index: 9998;
          background: var(--bg-card); border: 1px solid var(--purple);
          color: var(--cream); font-size: 14px; font-weight: 700;
          padding: 8px 14px; border-radius: 20px; cursor: pointer;
          letter-spacing: 0.04em; transition: all 0.2s; outline: none;
          appearance: none;
        }
        #df-lang-btn:focus { border-color: var(--gold-light); }

        #df-hero {
          min-height: 88vh; display: flex; align-items: center;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 70%), var(--bg-primary);
          position: relative; overflow: hidden; padding: 80px 0 60px;
        }
        #df-hero::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139,92,246,0.04) 40px, rgba(139,92,246,0.04) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139,92,246,0.04) 40px, rgba(139,92,246,0.04) 41px);
          pointer-events: none;
        }
        .df-hero-badge {
          display: inline-block; background: rgba(139,92,246,0.18);
          border: 1px solid rgba(139,92,246,0.4);
          color: var(--purple-light); font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; padding: 7px 16px; border-radius: 30px;
          margin-bottom: 22px; text-transform: uppercase;
        }
        .df-hero-h1 {
          font-family: var(--font-display); font-size: 44px; font-weight: 700;
          line-height: 1.1; color: var(--white); margin-bottom: 8px;
        }
        .df-hero-h1 .df-gold-italic { color: var(--gold-light); font-style: italic; display: block; }
        .df-hero-sub { font-size: 17px; color: var(--cream); opacity: 0.85; margin: 20px 0 32px; line-height: 1.75; }
        .df-img-box {
          width: 100%; border-radius: 18px; margin: 28px 0; overflow: hidden; border: 1px solid rgba(139,92,246,0.3);
        }
        .df-img-box img { width: 100%; aspect-ratio: 1 / 1; display: block; border-radius: 18px; object-fit: cover; }
        
        .df-cta-btn {
          display: block; width: 100%;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold));
          background-size: 300% 100%; animation: dfShimmer 3s ease infinite;
          color: #000; font-size: 20px; font-weight: 700; text-align: center; text-decoration: none;
          padding: 17px 22px; border-radius: 13px; border: none; cursor: pointer; min-height: 52px;
          letter-spacing: 0.03em; position: relative; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s;
        }
        .df-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,153,26,0.4); }
        @keyframes dfShimmer { 0% { background-position: 100% 0%; } 100% { background-position: -100% 0%; } }
        
        .df-trust-badges {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 14px;
          font-size: 13px; color: var(--muted); font-weight: 700; letter-spacing: 0.04em;
        }

        .df-section-label {
          font-size: 13px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--purple-light); margin-bottom: 14px;
        }
        .df-section-h2 {
          font-family: var(--font-display); font-size: 34px; font-weight: 700; line-height: 1.15; color: var(--white); margin-bottom: 22px;
        }
        .df-section-h2 .df-gold { color: var(--gold-light); }
        .df-section-h2 .df-newline { display: block; }
        
        .df-pain-card {
          background: var(--bg-card); border-left: 3px solid #7C3AED; border-radius: 14px; padding: 18px 20px;
          margin-bottom: 14px; display: flex; gap: 14px; align-items: flex-start; font-size: 17px; line-height: 1.75;
        }
        .df-pain-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }

        .df-agitation-list li { list-style: none; padding: 6px 0 6px 16px; position: relative; }
        .df-agitation-list li::before { content: '→'; position: absolute; left: 0; color: var(--muted); }
        .highlight { color: var(--gold-light); font-weight: 700; }

        .df-check-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; font-size: 17px; line-height: 1.75; }
        .df-check-icon {
          width: 28px; height: 28px; flex-shrink: 0; margin-top: 3px; background: var(--purple); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700;
        }

        .df-testi-card {
           background: var(--bg-card); border-radius: 18px; padding: 22px 20px; margin-bottom: 20px;
           border: 1px solid rgba(139,92,246,0.2); position: relative;
        }
        .df-testi-card::before {
           content: '"'; position: absolute; top: -8px; left: 18px; font-family: var(--font-display); font-size: 60px; color: var(--purple); opacity: 0.4; line-height: 1;
        }
        .df-img-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; }
        .df-img-gallery img { width: 100%; aspect-ratio: 1 / 1; border-radius: 14px; border: 1px solid rgba(139,92,246,0.2); object-fit: cover; }

        .df-bonus-card {
          background: var(--bg-card); border-radius: 16px; padding: 20px; margin-bottom: 14px;
          border: 1px solid rgba(139,92,246,0.18); display: flex; gap: 16px; align-items: flex-start;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .df-bonus-highlight {
          border: 1px solid rgba(239, 68, 68, 0.5);
          background: linear-gradient(135deg, rgba(26, 10, 46, 1), rgba(40, 10, 20, 0.8));
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
        }
        .df-value-card { background: var(--bg-card); border-radius: 18px; padding: 28px 22px; border: 1px solid rgba(201,153,26,0.3); }
        .df-value-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(139,92,246,0.12); }
        .df-value-row:last-of-type { border-bottom: none; }
        
        .df-final-row {
          margin-top: 16px; padding: 20px; background: linear-gradient(135deg, rgba(201,153,26,0.12), rgba(240,200,74,0.08));
          border-radius: 14px; border: 1px solid rgba(201,153,26,0.3); display: flex; justify-content: space-between; align-items: center;
        }
        .df-final-price {
          font-family: var(--font-display); font-size: 38px; font-weight: 700; color: var(--gold-light);
          animation: dfShimmer 3s ease infinite; background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold));
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .df-excl-item {
          display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; font-size: 17px; line-height: 1.6; border-bottom: 1px solid rgba(239,68,68,0.1);
        }

        .df-faq-item {
          background: var(--bg-card); border-radius: 14px; margin-bottom: 12px; overflow: hidden; border: 1px solid rgba(139,92,246,0.18);
        }
        .df-faq-q {
          padding: 18px 20px; font-size: 17px; font-weight: 700; color: var(--white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px;
        }
        .df-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.35s ease; padding: 0 20px; font-size: 17px; color: var(--cream); line-height: 1.75; }
        .df-faq-item.open .df-faq-a { max-height: 300px; padding: 0 20px 18px; }
        
        .df-free-form {
          margin-top: 24px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .df-free-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--cream);
          padding: 12px 14px;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 15px;
          margin-bottom: 12px;
          outline: none;
        }
        .df-free-input:focus { border-color: var(--purple-light); }
        .df-free-pwrap { display: flex; margin-bottom: 12px; }
        .df-free-pwrap .df-free-input { margin-bottom: 0; border-radius: 0 8px 8px 0; }
        .df-free-ppfx { background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.1); border-right: none; border-radius: 8px 0 0 8px; padding: 12px 14px; font-size: 15px; font-weight: 600; color: var(--cream); white-space: nowrap; display: flex; align-items: center; }
        .df-free-btn {
          width: 100%;
          background: var(--purple);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-family: var(--font-body);
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s;
        }
        .df-free-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .df-free-btn:hover:not(:disabled) { background: var(--purple-light); }

        .df-integrity-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .df-integrity-row:last-child { border-bottom: none; }
        .df-integrity-icon {
          width: 28px; height: 28px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
          flex-shrink: 0; font-size: 13px; color: #22c55e; font-weight: 700;
        }

        #df-sticky-cta {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 9997;
          background: linear-gradient(0deg, #0A0612 70%, transparent); padding: 16px 22px 20px;
          transform: translateY(100%); transition: transform 0.4s ease; max-width: 560px; margin: 0 auto;
        }
        #df-sticky-cta.show { transform: translateY(0); }

        .df-pulse-ring { position: relative; display: inline-block; }
        .df-pulse-ring::before {
          content: ''; position: absolute; inset: -6px; border-radius: inherit; border: 2px solid var(--gold-light);
          animation: dfPulse 2s ease-out infinite; pointer-events: none;
        }
        @keyframes dfPulse { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(1.1); } }

        .df-fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .df-fade-in.visible { opacity: 1; transform: translateY(0); }

        @media(max-width:560px) { #df-sticky-cta { max-width: 100%; } .df-hero-h1 { font-size: 38px; } }

        .df-wife-card {
          background: var(--bg-card);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.22);
          margin-bottom: 24px;
        }
        .df-wife-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .df-wife-content {
          padding: 20px;
        }
        .df-wife-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .df-wife-desc {
          font-size: 16px;
          line-height: 1.6;
          color: var(--cream);
          opacity: 0.9;
        }

        .df-wife-card {
          background: var(--bg-card);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.22);
          margin-bottom: 24px;
        }
        .df-wife-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .df-wife-content {
          padding: 20px;
        }
        .df-wife-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }
        .df-wife-desc {
          font-size: 16px;
          line-height: 1.6;
          color: var(--cream);
          opacity: 0.9;
        }

        .df-formsec { background: var(--bg-section); padding: 44px 0; }
        .df-privstrip { display: flex; justify-content: center; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
        .df-privbadge { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); }

        /* Hesitation Box Styles */
        .df-hesitation-box {
          background: linear-gradient(180deg, rgba(10,5,20,0.95) 0%, rgba(25,10,50,0.98) 100%);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 24px;
          padding: 32px 24px;
          margin: 40px auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }
        .df-hesitation-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(139,92,246,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .df-hesitation-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 8px;
          text-align: center;
        }
        .df-hesitation-subtitle {
          font-size: 18px;
          color: var(--gold-light);
          font-weight: 600;
          text-align: center;
          margin-bottom: 28px;
          line-height: 1.4;
        }
        .df-hesitation-body {
          font-size: 16px;
          line-height: 1.65;
          color: var(--cream);
          margin-bottom: 28px;
        }
        .df-hesitation-body p {
          margin-bottom: 12px;
        }
        .df-hesitation-objection {
          background: rgba(0,0,0,0.2);
          border-left: 3px solid var(--purple-light);
          padding: 16px;
          border-radius: 4px 12px 12px 4px;
          font-size: 15px;
          color: var(--white);
          opacity: 0.9;
          margin-bottom: 32px;
          white-space: pre-line;
        }
        .df-hesitation-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          margin-bottom: 12px;
          border: none;
          font-family: var(--font-body);
        }
        .df-hesitation-btn:active { transform: scale(0.98); }
        .df-hesitation-btn-primary {
          background: var(--purple-gold);
          color: white;
          box-shadow: 0 4px 15px rgba(139,92,246,0.3);
        }
        .df-hesitation-btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(139,92,246,0.3);
          color: var(--white);
        }
        .df-hesitation-btn-tertiary {
          background: transparent;
          color: var(--muted);
          font-size: 14px;
          text-decoration: underline;
        }
        .df-hesitation-micro {
          font-size: 13px;
          line-height: 1.5;
          color: var(--muted);
          text-align: center;
          margin-top: 24px;
          white-space: pre-line;
        }
        .df-hesitation-sting {
          font-size: 11px;
          color: var(--muted);
          opacity: 0.6;
          text-align: center;
          margin-top: 24px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .df-flabel { font-size: 15px; font-weight: 600; color: var(--cream); margin-bottom: 5px; display: block; }
        .df-finput { width: 100%; padding: 13px 15px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); border-radius: 11px; color: var(--cream); font-size: 18px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
        .df-finput:focus { border-color: var(--purple-light); }
        .df-finput::placeholder { color: #5E7491; }
        .df-pwrap { display: flex; }
        .df-ppfx { background: rgba(139,92,246,.1); border: 1px solid rgba(255,255,255,.09); border-right: none; border-radius: 11px 0 0 11px; padding: 13px; font-size: 18px; font-weight: 600; color: var(--purple-light); white-space: nowrap; }
        .df-pwrap .df-finput { border-radius: 0 11px 11px 0; }
        .df-pmgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .df-pmopt { border: 1px solid rgba(255,255,255,.07); border-radius: 11px; padding: 11px; cursor: pointer; text-align: center; transition: all .2s; }
        .df-pmopt.sel { border-color: var(--purple-light); background: rgba(139,92,246,.07); }
        .df-pmname { font-size: 15px; font-weight: 600; color: var(--cream); }
        .df-pmsub { font-size: 12px; margin-top: 2px; }
        .df-sbtn { width: 100%; padding: 19px; background: linear-gradient(135deg, var(--gold-dark), var(--gold-light), var(--gold-dark)); background-size: 200%; border: none; border-radius: 14px; color: #000; font-size: 18px; font-weight: 700; cursor: pointer; font-family: var(--font-body); animation: dfShimmer 3s linear infinite; box-shadow: 0 10px 35px rgba(201,153,26,.4); transition: transform .2s; margin-top: 18px; }
        .df-sbtn:hover { transform: translateY(-2px); }

        /* Guarantee Card */
        #df-guarantee-card {
          background: linear-gradient(135deg, #0f0520 0%, #1a0630 50%, #0f0520 100%);
          border-top: 3px solid var(--gold);
          border-bottom: 3px solid var(--gold);
          padding: 28px 22px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        #df-guarantee-card::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(201,153,26,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        #df-guarantee-card::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .df-guarantee-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold-light));
          font-size: 36px;
          margin: 0 auto 16px;
          box-shadow: 0 0 0 6px rgba(201,153,26,0.18), 0 0 0 12px rgba(201,153,26,0.07);
        }
        .df-guarantee-headline {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--gold-light);
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .df-guarantee-body {
          font-size: 16px;
          line-height: 1.7;
          color: var(--cream);
          max-width: 480px;
          margin: 0 auto 18px;
        }
        .df-guarantee-body strong { color: var(--white); }
        .df-guarantee-cta-hint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }
        .df-guarantee-cta-hint:hover { color: var(--gold-light); }
      `}</style>

                    <div id="df-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

                    <div id="df-urgency-bar">
                        <span>{c.urgency(<span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--gold-light)' }}>{countdown}</span>)}</span>
                    </div>

                    <select id="df-lang-btn" value={lang} onChange={(e) => handleLangChange(e.target.value as any)}>
                        <option value="id">🇮🇩 Indonesia</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="ph">🇵🇭 Philippines</option>
                    </select>

                    {/* HERO */}
                    <section id="df-hero">
                        <div className="df-wrap">
                            <div className="df-hero-badge">{sc.heroBadge}</div>
                            <h1 className="df-hero-h1">
                                <span>{sc.heroH1a}</span>
                                <span className="df-gold-italic">{sc.heroH1b}</span>
                            </h1>
                            <p className="df-hero-sub">{sc.heroSub}</p>
                            {segment !== 'istri' && (
                                <div className="df-img-box">
                                    <DbgImg src={assets.df08} alt="Dark Feminine" label="df08" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div className="df-trust-badges">
                                <span>🔒 100% Privasi</span><span>⚡ Instan</span><span>📱 Akses Seumur Hidup</span>
                            </div>
                            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--muted)' }}>
                                <span>🔥</span>
                                <span><strong>{c.socialProofNum}</strong> {c.socialProof}</span>
                            </div>
                        </div>
                    </section>

                    {/* GUARANTEE CARD — Below Hero Social Proof */}
                    <div id="df-guarantee-card">
                        <div className="df-guarantee-badge">🛡️</div>
                        <h2 className="df-guarantee-headline">
                            Garansi Uang Kembali 100%
                        </h2>
                        <p className="df-guarantee-body">
                            Jika dalam <strong>30 hari</strong> setelah membaca ebook ini kamu tidak merasakan perubahan — tidak ada rasa <strong>tenang, lepas, dan tentram</strong> dalam menjalani hubungan dengan pasangan atau calon pasangan — kami kembalikan uangmu <strong>100%, tanpa pertanyaan.</strong>
                        </p>
                        <button
                            className="df-guarantee-cta-hint"
                            onClick={() => {
                                const el = document.getElementById('reviews-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Cek review di bawah ↓
                        </button>
                    </div>

                    {/* PAIN / STORYTELLING SECTION */}
                    <section style={{ background: 'linear-gradient(180deg, var(--bg-section) 0%, var(--bg-primary) 100%)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{sc.painLabel}</div>
                            <h2 className="df-section-h2">
                                <span>{sc.painH2a}</span>
                                <span className="df-newline df-gold">{sc.painH2b}</span>
                            </h2>

                            {/* STORYTELLING SCENES — Carousel per story */}
                            {sc.stories && sc.stories.map((story: any, si: number) => (
                                <IstriCarousel key={si} story={story} assets={assets} />
                            ))}

                            {/* Before/After Istri — shown on ?istri only */}
                            {segment === 'istri' && c.wifeSection?.beforeAfterIstri && (
                                <IstriCarousel story={c.wifeSection.beforeAfterIstri} assets={assets} />
                            )}

                            {/* Short final pain punches */}
                            <div>
                                {sc.pains.map((p: any, i: number) => (
                                    <div key={i} className="df-pain-card">
                                        <span className="df-pain-icon">{p.icon}</span>
                                        <span>{p.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* AGITATION */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <h2 className="df-section-h2">
                                <span>{c.agitH2a}</span>
                                <span className="df-newline df-gold">{c.agitH2b}</span>
                            </h2>
                            <div className="df-img-box" style={{ borderRadius: '16px' }}>
                                <DbgImg src={assets.df01} alt="Paradox" label="df01" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>
                                <div>{c.agitText}</div>
                            </div>
                        </div>
                    </section>

                    {/* SOLUTION */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.solLabel}</div>
                            <h2 className="df-section-h2">
                                <span>{c.solH2a}</span>
                                <span className="df-newline df-gold">{c.solH2b}</span>
                            </h2>
                            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>{c.solText}</div>
                        </div>
                    </section>



                    {/* Winning Gallery */}
                    {c.winningGallery && c.winningGallery.images && c.winningGallery.images.length > 0 && (
                        <section style={{ padding: '44px 0', borderTop: '1px solid rgba(139, 92, 246, 0.2)', background: 'var(--bg-primary)' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{c.winningGallery.title}</div>
                                <h2 className="df-section-h2" style={{ marginBottom: '12px' }}>{c.winningGallery.title}</h2>
                                <p style={{ color: 'var(--cream)', opacity: 0.8, fontSize: '16px', marginBottom: '32px', textAlign: 'center' }}>{c.winningGallery.sub}</p>
                                
                                <div className="df-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    {c.winningGallery.images.map((imgKey: string, i: number) => (
                                        <div key={i} className="df-img-box" style={{ margin: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                            <DbgImg src={assets[imgKey]} alt={`Winning Technique ${i+1}`} style={{ width: '100%', display: 'block' }} label={imgKey} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    

                    {/* WIFE SECTION - general page only, hidden on ?istri */}
                    {lang === 'id' && segment === 'default' && c.wifeSection && (
                        <section style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-section) 100%)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                {c.wifeSection.items.map((item: any, idx: number) => (
                                    <IstriCarousel key={idx} story={item} assets={assets} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CONTENTS */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.contentsLabel}</div>
                            <h2 className="df-section-h2">{c.contentsH2} <span className="df-gold">{c.contentsH2Span}</span></h2>
                            <p style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--gold-light)', marginBottom: '22px', lineHeight: 1.4 }}>
                                Apa yang kamu dapatkan setelah mendapat ebook ini
                            </p>
                            <div>
                                {c.checks.map((t: any, i: number) => (
                                    <div key={i} className="df-check-item">
                                        <div className="df-check-icon">✦</div>
                                        <span>{t}</span>
                                    </div>
                                ))}
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', fontStyle: 'italic', marginTop: '4px' }}>{c.checksPlus}</p>
                            </div>
                        </div>
                    </section>

                    {/* === PARAM-SPECIFIC SECTIONS (renders only when a winning ad param is active) === */}
                    {/* Order: Agitation → Hope → How It Works → Objections → Social Proof. */}
                    {/* Image slots use sc.paramX.imgKey — assigned per param in content blocks (TBD by user). */}
                    {sc.paramAgitation && (
                        <section style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{sc.paramAgitation.label}</div>
                                <h2 className="df-section-h2">
                                    <span>{sc.paramAgitation.h2a}</span>
                                    <span className="df-newline df-gold">{sc.paramAgitation.h2b}</span>
                                </h2>
                                {sc.paramAgitation.imgKey && assets[sc.paramAgitation.imgKey] && (
                                    <div className="df-img-box" style={{ borderRadius: '16px' }}>
                                        <DbgImg src={assets[sc.paramAgitation.imgKey]} alt={sc.paramAgitation.label} label={sc.paramAgitation.imgKey} style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>{sc.paramAgitation.body}</div>
                            </div>
                        </section>
                    )}

                    {sc.paramHope && (
                        <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{sc.paramHope.label}</div>
                                <h2 className="df-section-h2">
                                    <span>{sc.paramHope.h2a}</span>
                                    <span className="df-newline df-gold">{sc.paramHope.h2b}</span>
                                </h2>
                                {sc.paramHope.imgKey && assets[sc.paramHope.imgKey] && (
                                    <div className="df-img-box" style={{ borderRadius: '16px' }}>
                                        <DbgImg src={assets[sc.paramHope.imgKey]} alt={sc.paramHope.label} label={sc.paramHope.imgKey} style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--cream)' }}>{sc.paramHope.body}</div>
                            </div>
                        </section>
                    )}

                    {sc.paramHowItWorks && (
                        <section style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{sc.paramHowItWorks.label}</div>
                                <h2 className="df-section-h2">
                                    <span>{sc.paramHowItWorks.h2a}</span>
                                    <span className="df-newline df-gold">{sc.paramHowItWorks.h2b}</span>
                                </h2>
                                {sc.paramHowItWorks.imgKey && assets[sc.paramHowItWorks.imgKey] && (
                                    <div className="df-img-box" style={{ borderRadius: '16px' }}>
                                        <DbgImg src={assets[sc.paramHowItWorks.imgKey]} alt={sc.paramHowItWorks.label} label={sc.paramHowItWorks.imgKey} style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                                    {sc.paramHowItWorks.steps.map((step: any, i: number) => (
                                        <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '20px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                            <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>{step.num}</div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '6px', letterSpacing: '0.02em' }}>{step.title}</div>
                                                <div style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.7 }}>{step.body}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {sc.paramObjections && (
                        <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{sc.paramObjections.label}</div>
                                <h2 className="df-section-h2">
                                    <span>{sc.paramObjections.h2a}</span>
                                    <span className="df-newline df-gold">{sc.paramObjections.h2b}</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                                    {sc.paramObjections.items.map((item: any, i: number) => (
                                        <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '18px 16px' }}>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <span style={{ color: 'var(--red)', fontWeight: 800 }}>Q:</span>
                                                <span>{item.q}</span>
                                            </div>
                                            <div style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.75, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <span style={{ color: 'var(--gold-light)', fontWeight: 800 }}>A:</span>
                                                <span>{item.a}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {sc.paramSocialProof && (
                        <section style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-section-label">{sc.paramSocialProof.label}</div>
                                <h2 className="df-section-h2">
                                    <span>{sc.paramSocialProof.h2a}</span>
                                    <span className="df-newline df-gold">{sc.paramSocialProof.h2b}</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                                    {sc.paramSocialProof.transformations.map((t: any, i: number) => (
                                        <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '18px', padding: '22px 18px' }}>
                                            {t.imgKey && assets[t.imgKey] && (
                                                <div style={{ marginBottom: '14px', borderRadius: '14px', overflow: 'hidden' }}>
                                                    <DbgImg src={assets[t.imgKey]} alt={t.name} label={t.imgKey} style={{ width: '100%', aspectRatio: '1/1', display: 'block', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '14px', letterSpacing: '0.01em' }}>{t.name}</div>
                                            <div style={{ marginBottom: '14px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--red)', letterSpacing: '0.1em', marginBottom: '6px' }}>SEBELUM:</div>
                                                <div style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.75, opacity: 0.92 }}>{t.before}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--green-wa)', letterSpacing: '0.1em', marginBottom: '6px' }}>SEKARANG:</div>
                                                <div style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.75 }}>{t.after}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* TESTIMONIALS */}
                    <section style={{ background: 'linear-gradient(180deg, var(--bg-section) 0%, var(--bg-primary) 100%)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.testiLabel}</div>
                            <h2 className="df-section-h2">{c.testiH2} <span className="df-gold">{c.testiH2Span}</span></h2>
                            {lang === 'id' && segment === 'default' && c.wifeSection?.beforeAfterSingle && (
                                <IstriCarousel story={c.wifeSection.beforeAfterSingle} assets={assets} />
                            )}
                            {lang === 'id' && segment === 'default' && c.wifeSection?.beforeAfterIstri && (
                                <IstriCarousel story={c.wifeSection.beforeAfterIstri} assets={assets} />
                            )}
                        </div>
                    </section>

                    {/* BONUSES */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.bonusLabel}</div>
                            <h2 className="df-section-h2">{c.bonusH2} <span className="df-gold">{c.bonusH2Span}</span></h2>
                            <div>
                                {c.bonuses.map((b: any, i: number) => (
                                    <div key={i} className={`df-bonus-card ${b.isHighlight ? 'df-bonus-highlight' : ''}`}>
                                        <div style={{ fontSize: '28px', flexShrink: 0 }}>{b.icon}</div>
                                        <div>
                                            {b.isHighlight && <div style={{ fontSize: '11px', background: 'linear-gradient(90deg, var(--red), #b91c1c)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', display: 'inline-block', marginBottom: '8px', textTransform: 'uppercase' }}>{lang === 'id' ? '🔥 BUKU TABU (DIJUAL TERPISAH)' : (lang === 'ph' ? '🔥 TABOO BOOK (AY BINEBENTA NANG HIWALAY)' : '🔥 TABOO BOOK (SOLD SEPARATELY)')}</div>}
                                            <div style={{ fontSize: '17px', fontWeight: 700, color: b.isHighlight ? 'var(--gold-light)' : 'var(--white)', marginBottom: '4px' }}>{b.title}</div>
                                            <div style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{b.desc}</div>
                                            {b.highlightText && <div style={{ fontSize: '14px', color: 'var(--cream)', fontStyle: 'italic', marginTop: '6px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--red)' }}>{b.highlightText}</div>}
                                            <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--green-wa)', fontWeight: 700 }}>
                                                <s style={{ color: 'var(--muted)', fontWeight: 400 }}>{b.price}</s> → GRATIS
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.priceLabel}</div>
                            <h2 className="df-section-h2">{c.priceH2} <span className="df-gold">{lang === 'id' ? 'Hari Ini' : (lang === 'ph' ? 'Ngayon' : 'Today')}</span></h2>
                            <div className="df-img-box">
                                <DbgImg src={assets.df08} alt="Pricing Visual" label="df08" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ marginTop: '24px' }}>
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', marginTop: '10px' }}>{c.priceSub}</p>
                                <div className="df-trust-badges">
                                    <span>🔒 100% Privasi</span><span>⚡ Instan</span><span>📱 Akses Seumur Hidup</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* EXCLUSIVITY */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'BUKAN UNTUK SEMUA ORANG' : (lang === 'ph' ? 'HINDI PARA SA LAHAT' : 'NOT FOR EVERYONE')}</div>
                            <h2 className="df-section-h2">{c.exclH2}</h2>
                            <div className="df-img-box">
                                <DbgImg src={assets.df09} alt="Exclusivity Visual" label="df09" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: '18px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '26px 22px', border: '2px solid rgba(239,68,68,0.35)' }}>
                                <div>
                                    {c.exclItems.map((item: string, i: number) => (
                                        <div 
                                            key={i} 
                                            className="df-excl-item"
                                            id={item.includes("menunggu jodoh") ? "free-ebook" : undefined}
                                        >
                                            <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✕</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ marginTop: '22px', textAlign: 'center', color: 'var(--gold-light)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', lineHeight: 1.4 }}>
                                    {c.exclCta}
                                </p>

                                </div>
                            </div>
                        </section>


                                    {/* TRANSPARANSI SECTION */}
                                    <section style={{ background: 'var(--bg-section)', padding: '44px 0' }}>
                                    <div className="df-wrap df-fade-in">
                                    <div style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                    borderRadius: '24px',
                                    padding: '28px 22px',
                                    }}>
                                    <div style={{ marginBottom: '32px' }}>
                                    <div className="df-section-label">Transparansi</div>
                                    <h2 className="df-section-h2" style={{ fontSize: '28px', color: 'var(--white)', marginBottom: '12px' }}>
                                        Kami Berintegritas
                                    </h2>
                                    <p style={{ color: 'var(--cream)', fontSize: '15px', lineHeight: 1.7 }}>
                                        Setiap produk yang dijual anggota <strong style={{ color: 'var(--gold-light)' }}>eL Vision</strong> menggunakan arsitektur kami diwajibkan untuk menampilkan review dari <em>verified buyer</em> — bukan testimoni anonim, bukan ulasan palsu. Review hanya bisa ditulis oleh akun yang sudah melakukan pembelian terverifikasi.
                                    </p>
                                    </div>

                                    <div>
                                    {[
                                        { title: 'Verified Buyer Only', desc: 'Review hanya bisa ditulis setelah pembelian dikonfirmasi. Tidak ada akun yang bisa review tanpa transaksi nyata.' },
                                        { title: 'Email Tersensor untuk Privasi', desc: 'Identitas reviewer ditampilkan dalam format email tersensor (contoh: senaditsr***@hotmail.com) untuk melindungi privasi sekaligus membuktikan keaslian.' },
                                        { title: 'Login untuk Tulis Review', desc: 'Hanya pengguna yang sudah login dengan akun terverifikasi yang bisa menulis review. Tidak bisa dimanipulasi dari luar.' },
                                        { title: '100% Privacy & Security', desc: 'Sistem kami tidak menyimpan data sensitif pembayaran Anda. Semua transaksi melalui payment gateway terenkripsi.' },
                                        { title: 'Trusted Architecture', desc: 'Arsitektur website kami dibuat oleh eL Vision Group untuk menjamin kecepatan, keamanan, dan keaslian data pelanggan.' },
                                    ].map(({ title, desc }) => (
                                        <div key={title} className="df-integrity-row">
                                            <div className="df-integrity-icon"><Star size={16} fill="currentColor" /></div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--white)', marginBottom: '4px' }}>{title}</div>
                                                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                    </div>
                                    </div>
                                    </section>


                                    {/* REVIEWS SECTION */}
                    <section id="reviews-section" style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'ULASAN PELANGGAN' : (lang === 'ph' ? 'MGA REVIEW NG CUSTOMER' : 'CUSTOMER REVIEWS')}</div>
                            <h2 className="df-section-h2" style={{ fontSize: '28px', marginBottom: '8px' }}>Review Real Customer</h2>
                            <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                                {lang === 'id' ? '(Berikan ulasan Anda dengan memasukkan email)' : (lang === 'ph' ? '(Maaari kang mag-iwan ng review gamit ang iyong email)' : '(You can leave a review using your email)')} <br />
                                {lang === 'id' ? 'Ulasan disensor untuk privasi anda. Jika anda sudah membeli sebelumnya, review anda akan otomatis ditandai sebagai Verified Buyer.' : (lang === 'ph' ? 'Siniserensura ang mga ulasan para sa iyong privacy.' : 'Reviews are censored for your privacy.')}<br/>
                                <strong> {lang === 'id' ? 'Anda sudah punya ulasan? Masukkan email yang sama untuk mengupdate ulasan anda.' : 'Have an existing review? Use the same email to update it.'} </strong>
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'rgba(201,153,26,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(201,153,26,0.3)' }}>
                                <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>4.8</div>
                                <div>
                                    <div style={{ display: 'flex', color: 'var(--gold-light)' }}>
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} />
                                        <Star fill="currentColor" size={20} style={{ opacity: 0.8 }} />
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--cream)', marginTop: '4px' }}>Review 4.8++ from 2000 Ladies..</div>
                                </div>
                            </div>

                            {/* User Review Input Form */}
                            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(139,92,246,0.3)', marginBottom: '24px' }}>
                                    <div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Email Anda:</label>
                                            <input 
                                                type="email" 
                                                value={anonymousReviewEmail} 
                                                onChange={(e) => setAnonymousReviewEmail(e.target.value)}
                                                placeholder="contoh@gmail.com"
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '12px', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Beri Rating:</div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={28}
                                                        fill={reviewRating >= star ? "var(--gold-light)" : "transparent"}
                                                        color={reviewRating >= star ? "var(--gold-light)" : "var(--muted)"}
                                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setReviewRating(star)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder={lang === 'id' ? 'Tulis ulasan jujur Anda di sini...' : (lang === 'ph' ? 'Isulat ang iyong tapat na pagsusuri dito...' : 'Write your honest review here...')}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '14px', borderRadius: '8px', minHeight: '100px', fontFamily: 'var(--font-body)', fontSize: '15px', outline: 'none', marginBottom: '12px' }}
                                        />

                                        {showUpdateConfirm && (
                                            <div style={{ background: 'rgba(201,153,26,0.1)', border: '1px solid rgba(201,153,26,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>
                                                <p style={{ color: 'var(--cream)', fontSize: '14px', marginBottom: '8px' }}>
                                                    {lang === 'id' ? 'Email ini sudah memiliki ulasan. Ingin mengupdate ulasan Anda?' : 'You have reviews already, want to update?'}
                                                </p>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button 
                                                        onClick={() => submitReview(pendingReviewPayload.email)} 
                                                        style={{ background: 'var(--gold-light)', color: 'var(--bg-primary)', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                                                    >
                                                        {lang === 'id' ? 'Ya, Update' : 'Yes, Update'}
                                                    </button>
                                                    <button 
                                                        onClick={() => { setShowUpdateConfirm(false); setPendingReviewPayload(null); }} 
                                                        style={{ background: 'transparent', border: '1px solid var(--muted)', color: 'var(--muted)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        {lang === 'id' ? 'Batal' : 'Cancel'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {!showUpdateConfirm && (
                                                <button onClick={() => submitReview()} disabled={isLoginLoading} style={{ flex: 1, background: 'var(--purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: isLoginLoading ? 0.7 : 1 }}>
                                                    {isLoginLoading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Kirim Ulasan' : (lang === 'ph' ? 'Isumite Ang Review' : 'Submit Review'))}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                            </div>

                            {/* Display Reviews */}
                            <div>
                                {[...dbReviews, ...MOCK_REVIEWS]
                                    .filter(r => (!r.lang || r.lang === (lang === 'sg' || lang === 'ph' ? 'en' : lang) || (lang === 'id' && r.lang === 'id')) && (r.comment || r.text) && (r.comment?.trim() !== '' || r.text?.trim() !== ''))
                                    .slice(0, showReviewsCount).map((r, i) => (
                                        <div key={i} style={{ background: 'var(--bg-section)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <div>
                                                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {(() => {
                                                            if (r.user_email) {
                                                                const parts = r.user_email.split('@');
                                                                if (parts.length === 2) {
                                                                    const namePart = parts[0];
                                                                    const showLen = Math.max(3, Math.floor(namePart.length / 2));
                                                                    return `${namePart.slice(0, showLen)}***@${parts[1]}`;
                                                                }
                                                            }
                                                            return r.name;
                                                        })()}
                                                        {r.country && <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px', color: 'var(--muted)' }}>{r.country} {(r.flag || getFlagForCountry(r.country))}</span>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                                        {Array.from({ length: 5 }).map((_, j) => (
                                                            <Star key={j} size={14} fill={j < r.rating ? "var(--gold-light)" : "transparent"} color={j < r.rating ? "var(--gold-light)" : "var(--muted)"} />
                                                        ))}
                                                        {r.created_at && (
                                                            <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '8px' }}>
                                                                {(() => {
                                                                    const datePart = r.created_at.includes('T') ? r.created_at.split('T')[0] : r.created_at.split(' ')[0];
                                                                    const [y, m, d] = datePart.split('-');
                                                                    const months: any = {
                                                                        '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
                                                                        '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
                                                                        '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
                                                                    };
                                                                    const dNum = parseInt(d);
                                                                    return isNaN(dNum) ? datePart : `${dNum} ${months[m] || m} ${y}`;
                                                                })()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: (r.comment === null || r.is_verified) ? 'var(--green-wa)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', background: (r.comment === null || r.is_verified) ? 'rgba(37,211,102,0.1)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                                                    {(r.comment === null || r.is_verified || r.rating === 5) ? '✓ Verified Buyer' : 'Not Verified'}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.6, marginTop: '8px' }}>{r.comment || r.text}</p>
                                        </div>
                                    ))}
                            </div>

                            {showReviewsCount < [...dbReviews, ...MOCK_REVIEWS].length && (
                                <button onClick={() => setShowReviewsCount(30)} style={{ width: '100%', background: 'transparent', border: '1px solid var(--purple-light)', color: 'var(--purple-light)', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'all 0.2s' }}>
                                    ▾ {lang === 'id' ? 'Buka Review Lain' : (lang === 'ph' ? 'Tingnan ang Ibang Review' : 'View More Reviews')}
                                </button>
                            )}

                        </div>
                    </section>
                    {/* VALUE STACK — before checkout */}
                    <section style={{ background: 'var(--bg-section)', padding: '44px 0 0 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-value-card">
                                <div>
                                    {c.valueRows.map((r: any, i: number) => (
                                        <div key={i} className="df-value-row">
                                            <span style={{ color: 'var(--cream)' }}>{r.title}</span>
                                            <span style={{ color: 'var(--muted)', fontWeight: 700 }}>{r.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '15px', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'id' ? 'Total Nilai' : (lang === 'ph' ? 'Kabuuan Na Halaga' : 'Total Value')}</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--red)', textDecoration: 'line-through' }}>Rp995.000</span>
                                </div>
                                <div className="df-final-row">
                                    <span style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.priceTodayLabel}</span>
                                    <span className="df-final-price">{isEnglish ? "$15" : "Rp199.000"}</span>
                                </div>
                                <div style={{ display: 'block', textAlign: 'center', marginTop: '14px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: 'var(--green-wa)', fontSize: '14px', fontWeight: 700, padding: '9px', borderRadius: '10px', letterSpacing: '0.06em' }}>
                                    {c.savingsBadge}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CHECKOUT FORM */}
                    <section id="checkout" className="df-formsec">
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{lang === 'id' ? 'LANGKAH TERAKHIR' : (lang === 'ph' ? 'PANGHULING HAKBANG' : 'FINAL STEP')}</div>
                            <h2 className="df-section-h2">{lang === 'id' ? 'Isi Data &' : (lang === 'ph' ? 'Ilagay ang Detalye at' : 'Fill Details &')} <span className="df-gold">{lang === 'id' ? 'Dapatkan Akses' : (lang === 'ph' ? 'Kumuha ng Access' : 'Get Access')}</span></h2>
                            <div className="df-privstrip">
                                {[["🔒", lang === 'id' ? "100% Privasi" : (lang === 'ph' ? "100% Pribado" : "100% Privacy")], ["⚡", lang === 'id' ? "Akses Instan" : (lang === 'ph' ? "Instant Access" : "Instant Access")], ["💳", lang === 'id' ? "Bayar Aman" : (lang === 'ph' ? "Ligtas na Bayad" : "Secure Payment")], ["📱", lang === 'id' ? "Seumur Hidup" : (lang === 'ph' ? "Habambuhay Access" : "Lifetime Access")]].map(([ic, lb]) => (
                                    <div key={lb} className="df-privbadge"><span>{ic}</span><span>{lb}</span></div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'Nama Lengkap' : (lang === 'ph' ? 'Buong Pangalan' : 'Full Name')}</label>
                                    <input className="df-finput" placeholder={lang === 'id' ? "Contoh: Sarah" : (lang === 'ph' ? "Halimbawa: Sarah" : "e.g: Sarah")} value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'No. WhatsApp' : 'WhatsApp Number'}</label>
                                    <div className="df-pwrap">
                                        <div className="df-ppfx">{lang === 'id' ? '🇮🇩 +62' : (lang === 'ph' ? '🇵🇭 +63' : '🌐 +')}</div>
                                        <input className="df-finput" placeholder={lang === 'id' ? '812345678' : (lang === 'ph' ? '9123456789' : 'e.g. 628123456789 or 19291234567')} inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="df-flabel">{lang === 'id' ? 'Email (untuk link download)' : (lang === 'ph' ? 'Email (para sa link download)' : 'Email (for download link)')}</label>
                                    <input className="df-finput" type="email" placeholder={lang === 'id' ? 'contoh@gmail.com' : (lang === 'ph' ? 'halimbawa@gmail.com' : 'example@gmail.com')} value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="df-flabel">Metode Pembayaran</label>
                                    <div className="df-pmgrid">
                                        {isEnglish ? (
                                            <div className={`df-pmopt ${payment === "PAYPAL" ? "sel" : ""}`} onClick={() => setPayment("PAYPAL")}>
                                                <div className="df-pmname">PayPal</div>
                                                <div className="df-pmsub" style={{ color: 'var(--gold-light)' }}>Secure International Payment</div>
                                            </div>
                                        ) : (
                                            <>
                                                {[
                                                    ["QRIS", "QRIS", "Redirect ke Aplikasi"],
                                                    ["DANA", "DANA", "E-Wallet DANA"],
                                                    ["OVO", "OVO", "E-Wallet OVO"],
                                                    ["SHOPEEPAY", "ShopeePay", "E-Wallet ShopeePay"],
                                                    ["BCA_MANUAL", "Manual Transfer BCA", "Dicek Manual 1-5 Menit"],
                                                    ["BCAVA", "BCA Virtual Account", "Otomatis via BCA"],
                                                    ["BNIVA", "BNI Virtual Account", "Otomatis via BNI"],
                                                    ["BRIVA", "BRI Virtual Account", "Otomatis via BRI"],
                                                    ["MANDIRIVA", "Mandiri Virtual Account", "Otomatis via Mandiri"]
                                                ].map(([id, nm, sb]) => (
                                                    <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => { setPayment(id); setRetailOpen(false); }}>
                                                        <div className="df-pmname">{nm}</div>
                                                        <div className="df-pmsub" style={{ color: (['QRIS', 'DANA', 'OVO', 'SHOPEEPAY'].includes(id)) ? 'var(--gold-light)' : 'var(--muted)' }}>{sb}</div>
                                                    </div>
                                                ))}
                                                {/* Retail Dropdown Trigger */}
                                                <div className={`df-pmopt ${['INDOMARET', 'ALFAMART', 'ALFAMIDI'].includes(payment) ? "sel" : ""}`} onClick={() => setRetailOpen(!retailOpen)}>
                                                    <div className="df-pmname">Retail / Indomart ▾</div>
                                                    <div className="df-pmsub">Indomaret, Alfamart, Alfamidi</div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!isEnglish && retailOpen && (
                                        <div className="df-pmgrid" style={{ marginTop: '10px', padding: '12px', background: 'rgba(139,92,246,0.05)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.1)' }}>
                                            {[
                                                ["INDOMARET", "Indomaret", "Gerai Indomaret"],
                                                ["ALFAMART", "Alfamart", "Gerai Alfamart"],
                                                ["ALFAMIDI", "Alfamidi", "Gerai Alfamidi"]
                                            ].map(([id, nm, sb]) => (
                                                <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => setPayment(id)}>
                                                    <div className="df-pmname">{nm}</div>
                                                    <div className="df-pmsub">{sb}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, marginBottom: 10 }}>
                                    <label className="df-flabel" style={{ marginBottom: 4 }}>{lang === 'id' ? 'Pilih Paket Anda' : (lang === 'ph' ? 'Piliin ang Iyong Package' : 'Choose Your Package')}</label>

                                    {/* Option 1: Base */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: addUpsell === 0 ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', border: addUpsell === 0 ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(0)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 0 ? '6px solid var(--purple-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: addUpsell === 0 ? 'var(--cream)' : 'var(--muted)' }}>{lang === 'id' ? 'Paket Lengkap Dark Feminine + 8 Bonus' : (lang === 'ph' ? 'Kumpletuhang Package ng Dark Feminine + 8 Bonus' : 'Dark Feminine Complete Package + 8 Bonuses')}</div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 0 ? 'var(--cream)' : 'var(--muted)' }}>
                                            {isEnglish ? "$15.00" : "Rp199.000"}
                                        </div>
                                    </div>

                                    {/* Option 2: +Love Magnet */}
                                    <div style={{ display: 'flex', alignItems: 'center', background: addUpsell === 1 ? 'rgba(240,200,74,0.1)' : 'rgba(255,255,255,0.03)', border: addUpsell === 1 ? '1px solid rgba(240,200,74,0.4)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setAddUpsell(1)}>
                                        <div style={{ marginRight: '14px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 1 ? '6px solid var(--gold-light)' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                                <div style={{ fontSize: '15px', fontWeight: 800, color: addUpsell === 1 ? 'var(--gold-light)' : 'var(--cream)' }}>Dark Feminine + 8 Bonus<br />+ Audio Love Magnet</div>
                                                <span style={{ fontSize: '10px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{lang === 'id' ? 'PROMO KHUSUS' : (lang === 'ph' ? 'Espesyal Na Promo' : 'SPECIAL PROMO')}</span>
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4 }}>{lang === 'id' ? 'Rahasia memikat pria idaman hanya lewat frekuensi suara.' : (lang === 'ph' ? 'Sikreto para akitin ang iyong pangarap na lalaki sa pamamagitan lamang ng dalas ng boses.' : 'Secret to captivating your dream man just through voice frequency.')} <span style={{ color: 'var(--red)', textDecoration: 'line-through' }}>{lang === 'id' ? '(Senilai Rp250.000)' : (lang === 'ph' ? '(Nagkakahalagang P850)' : '(Worth $19)')}</span></div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 1 ? 'var(--gold-light)' : 'var(--cream)' }}>
                                            {isEnglish ? "$19.00" : (hasDisc ? "Rp200.000" : "Rp249.000")}
                                        </div>
                                    </div>

                                    {/* Option 3: Ultimate */}
                                    {lang === 'id' && hasValue && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', background: addUpsell === 2 ? 'rgba(233,30,140,0.12)' : 'rgba(255,255,255,0.03)', border: addUpsell === 2 ? '2px solid rgba(233,30,140,0.7)' : '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }} onClick={() => setAddUpsell(2)}>
                                            <div style={{ marginRight: '14px', marginTop: '2px' }}>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: addUpsell === 2 ? '6px solid #e91e8c' : '2px solid rgba(255,255,255,0.3)', background: 'transparent', transition: 'all 0.2s' }}></div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                    <div style={{ fontSize: '15px', fontWeight: 800, color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>👑 Ultimate Dark Feminine</div>
                                                    <span style={{ fontSize: '10px', background: 'linear-gradient(90deg, #e91e8c, #c2185b)', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>TERLENGKAP</span>
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                                                    <div>✦ Semua isi paket + 8 Bonus + Audio Love Magnet</div>
                                                    <div>✦ Blueprint + Workbook 30 hari yang kamu isi & lakukan</div>
                                                    <div>✦ <strong style={{ color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>Q&A unlimited dengan admin</strong> — seperti punya terapis sendiri</div>
                                                    <div>✦ <strong style={{ color: addUpsell === 2 ? '#f472b6' : 'var(--cream)' }}>Garansi uang kembali</strong> jika tidak merasakan perubahan setelah selesai workbook</div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: addUpsell === 2 ? '#f472b6' : 'var(--cream)', marginLeft: '10px', whiteSpace: 'nowrap' }}>Rp399.000</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: "rgba(139,92,246,.05)", border: "1px solid rgba(139,92,246,.13)", borderRadius: 11, padding: 14, marginTop: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13.5, color: addUpsell > 0 ? "var(--gold-light)" : "var(--muted)" }}>
                                        <span style={{ paddingRight: 10 }}>
                                            {addUpsell === 2 ? "👑 Ultimate Dark Feminine" : addUpsell === 1 ? (lang === 'id' ? "Paket Lengkap + Audio Love Magnet" : (lang === 'ph' ? "Kumpletuhang Package + Audio Love Magnet" : "Complete Package + Audio Love Magnet")) : (lang === 'id' ? "Paket Lengkap Dark Feminine + 8 Bonus" : (lang === 'ph' ? "Kumpletuhang Package ng Dark Feminine + 8 Bonus" : "Dark Feminine Complete Package + 8 Bonuses"))}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>{isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}</span>
                                    </div>
                                    <div style={{ height: 1, background: "rgba(139,92,246,.09)", marginBottom: 7 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 700 }}>
                                        <span style={{ color: "var(--cream)" }}>Total</span>
                                        <span style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)", fontSize: 24 }}>{isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}</span>
                                    </div>
                                </div>
                                <button id="checkout-button" className="df-sbtn" onClick={submitOrder} disabled={loading}>
                                    {loading ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : `🛒 ${lang === 'id' ? 'Pesan Sekarang' : (lang === 'ph' ? 'Mag-order Ngayon' : 'Order Now')} — ${isEnglish ? (addUpsell === 1 ? "$19.00" : "$15.00") : (addUpsell === 2 ? "Rp399.000" : addUpsell === 1 ? (hasDisc ? "Rp200.000" : "Rp249.000") : "Rp199.000")}`}
                                </button>
                                <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.75 }}>🔒 {lang === 'id' ? 'Pembayaran aman & dienkripsi. Produk dikirim digital. Tidak ada tagihan mencurigakan.' : (lang === 'ph' ? 'Ligtas at naka-encrypt ang pagbabayad. Ipinadala nang digital ang produkto. Walang kahina-hinalang singil.' : 'Secure & encrypted payment. Product delivered digitally. No suspicious billing.')}</p>
                            </div>
                        </div>
                    </section>

                    {/* HESITATION BOX - Indonesia Only */}
                    {lang === 'id' && c.hesitationBox && (
                        <section style={{ padding: '0 0 44px 0' }}>
                            <div className="df-wrap df-fade-in">
                                <div className="df-hesitation-box">
                                    <div className="df-hesitation-header">
                                        <h2 className="df-hesitation-title">{c.hesitationBox.title}</h2>
                                        <p className="df-hesitation-subtitle">{c.hesitationBox.subtitle}</p>
                                    </div>
                                    <div className="df-hesitation-body">
                                        {c.hesitationBox.body.map((p: string, i: number) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                    <div className="df-hesitation-objection">
                                        {c.hesitationBox.objection}
                                    </div>
                                    <div className="df-hesitation-ctas">
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-primary"
                                            onClick={() => {
                                                const el = document.getElementById('checkout');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta1}
                                        </button>
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-secondary"
                                            onClick={() => {
                                                const el = document.getElementById('reviews-section');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta2}
                                        </button>
                                        <button 
                                            className="df-hesitation-btn df-hesitation-btn-tertiary"
                                            onClick={() => {
                                                const el = document.getElementById('free-ebook');
                                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            {c.hesitationBox.cta3}
                                        </button>
                                    </div>
                                    <p className="df-hesitation-micro">{c.hesitationBox.micro}</p>
                                    <p className="df-hesitation-sting">{c.hesitationBox.sting}</p>
                                    <div id="free-ebook" className="df-free-form" style={{ marginTop: '32px' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                                            <span style={{ color: 'var(--purple-light)', fontSize: '18px', fontWeight: 700 }}>🎁 {lang === 'id' ? 'Dapatkan Free Ebook' : (lang === 'ph' ? 'Kumuha ng Libreng Ebook' : 'Get a Free Ebook')}</span>
                                        </div>
                                        {successFree ? (
                                            <div style={{ textAlign: 'center', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '16px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                                                <strong style={{ display: 'block', color: 'var(--green-wa)', marginBottom: '4px' }}>{lang === 'id' ? 'Berhasil!' : (lang === 'ph' ? 'Tagumpay!' : 'Success!')}</strong>
                                                <span style={{ fontSize: '14px', color: 'var(--cream)' }}>{lang === 'id' ? 'Silahkan Periksa whatsapp anda,, Ketik Ya jika anda ingin menerima Free ebook..' : (lang === 'ph' ? 'Mangyaring suriin ang iyong WhatsApp, Mag-type ng Oo kung gusto mong matanggap ang Libreng ebook..' : 'Please check your WhatsApp, Type Yes if you want to receive the Free ebook..')}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    ref={freeEbookNameRef}
                                                    className="df-free-input"
                                                    placeholder={lang === 'id' ? "Nama Kamu" : (lang === 'ph' ? "Pangalan Mo" : "Your Name")}
                                                    value={nameFree}
                                                    onChange={(e) => setNameFree(e.target.value)}
                                                />
                                                <div className="df-free-pwrap">
                                                    <div className="df-free-ppfx">{lang === 'id' ? '🇮🇩 +62' : (lang === 'ph' ? '🇵🇭 +63' : '🌐')}</div>
                                                    <input
                                                        type="tel"
                                                        className="df-free-input"
                                                        placeholder={lang === 'id' ? "812345678" : (lang === 'ph' ? "9123456789" : "e.g. 628123456789 or 19291234567")}
                                                        value={waFree}
                                                        onChange={(e) => setWaFree(e.target.value)}
                                                    />
                                                </div>
                                                <input
                                                    type="email"
                                                    className="df-free-input"
                                                    placeholder={lang === 'id' ? "Email Aktif" : (lang === 'ph' ? "Aktibong Email" : "Active Email")}
                                                    value={emailFree}
                                                    onChange={(e) => setEmailFree(e.target.value)}
                                                    style={{ marginBottom: '16px' }}
                                                />
                                                <button
                                                    className="df-free-btn"
                                                    onClick={submitFreeEbook}
                                                    disabled={loadingFree}
                                                >
                                                    {loadingFree ? (lang === 'id' ? 'Memproses...' : (lang === 'ph' ? 'Pinoproseso...' : 'Processing...')) : (lang === 'id' ? 'Kirim Sekarang →' : (lang === 'ph' ? 'Ipadala Ngayon →' : 'Send Now →'))}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* FAQ */}
                    <section style={{ padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">{c.faqLabel}</div>
                            <h2 className="df-section-h2">{c.faqH2} <span className="df-gold">{c.faqH2Span}</span></h2>
                            <div>
                                {c.faqs.map((f: any, i: number) => (
                                    <div key={i} className={`df-faq-item ${openFaq === i ? 'open' : ''}`}>
                                        <div className="df-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                            <span>{f.q}</span>
                                            <span style={{ color: 'var(--purple-light)', fontSize: '20px', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                                        </div>
                                        <div className="df-faq-a">{f.a}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '32px' }}>
                                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--muted)', marginTop: '10px' }}>{c.faqSub}</p>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer style={{ textAlign: 'center', padding: '32px 22px', fontSize: '13px', color: 'var(--muted)', borderTop: '1px solid rgba(139,92,246,0.12)' }}>
                        <strong style={{ color: 'var(--purple-light)' }}>Dark Feminine — eL Vision</strong><br />
                        <span style={{ display: 'block', marginTop: '6px' }}>© 2024 Semua Hak Dilindungi</span>
                        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <span>Privasi Terjamin</span><span>•</span>
                            <span>Digital Product</span><span>•</span>
                            <span>WhatsApp Support</span>
                        </div>
                    </footer>

                    {/* STICKY BOTTOM CTA */}
                    <div id="df-sticky-cta" className={showSticky ? 'show' : ''}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cream)', flex: 1 }}>
                                {c.stickyText} <span style={{ color: 'var(--gold-light)' }}>{isEnglish ? (addUpsell === 1 ? '$19.00' : '$15.00') : (addUpsell === 2 ? 'Rp399.000' : addUpsell === 1 ? (hasDisc ? 'Rp200.000' : 'Rp249.000') : 'Rp199.000')}</span>
                                {addUpsell === 2 && <span style={{ fontSize: '11px', background: 'linear-gradient(90deg, #e91e8c, #c2185b)', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>👑 Ultimate</span>}
                                {addUpsell === 1 && <span style={{ fontSize: '11px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>+ Love Magnet</span>}
                            </div>
                            <a id="sticky-checkout-trigger" onClick={(name && phone && email && payment) ? submitOrder : scrollToForm} style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))', color: '#000', fontSize: '15px', fontWeight: 700, padding: '12px 18px', borderRadius: '11px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', minHeight: '44px', textDecoration: 'none', display: 'inline-block', textAlign: 'center', animation: 'dfShimmer 3s ease infinite', backgroundSize: '300% 100%', backgroundImage: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold))' }}>{loading ? (lang === 'id' ? 'Memproses...' : 'Processing...') : c.stickyCta}</a>
                        </div>
                    </div>

                    {/* FLOATING WHATSAPP BUTTON — kirim URL asal + pertanyaan manfaat spesifik per persona */}
                    <a
                        href={`https://wa.me/62895325633487?text=${encodeURIComponent(
                            lang === 'ph' ? `Hello kak, galing ako sa ${window.location.href} — anong benefits ang makukuha ko?` :
                            lang !== 'id' ? `Hi, I'm coming from ${window.location.href} — what benefits will I get from this ebook?` :
                            (segment === 'istri' && hasValue) ? `Halo kak, saya dari ${window.location.href}\n\nSaya istri yang udah lama struggle. Apa benefit paket Ultimate Rp399.000 untuk istri seperti saya? Workbook 30 hari-nya beneran bisa ngebalikin suami yang udah cuek?` :
                            segment === 'istri' ? `Halo kak, saya dari ${window.location.href}\n\nSaya seorang istri. Manfaat apa yang saya dapat dari ebook Dark Feminine ini? Bisa ngembaliin rasa peduli suami yang udah berasa kayak orang asing?` :
                            (hasSoftlife && hasValue) ? `Halo kak, saya dari ${window.location.href}\n\nSaya pengen jadi wanita Soft Life yang dimanjakan tanpa banyak gaya. Apa benefit paket Ultimate Rp399.000 untuk capai itu? Workbook 30 hari-nya ngajarin apa?` :
                            hasSoftlife ? `Halo kak, saya dari ${window.location.href}\n\nSaya pengen jadi wanita Soft Life / High Value yang tenang tapi dapet segalanya. Manfaat nyata apa yang akan saya dapat dari ebook ini?` :
                            hasValue ? `Halo kak, saya dari ${window.location.href}\n\nApa bedanya paket Ultimate Rp399.000 dengan paket biasa Rp199.000? Worth it ga buat saya bayar lebih?` :
                            `Halo kak, saya dari ${window.location.href}\n\nManfaat apa yang akan saya dapat dari ebook Dark Feminine ini? Hasil nyata kayak gimana setelah baca?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            position: 'fixed',
                            bottom: showSticky ? '90px' : '20px',
                            right: '20px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                            zIndex: 998,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
};

export default DarkFeminineTSX;
