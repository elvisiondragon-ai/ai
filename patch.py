import re

with open('src/darkfeminine.tsx', 'r') as f:
    content = f.read()

# 1. Imports
imports = """import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from "../integrations/supabase/client";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp } from "../utils/fbpixel";
import qrisBcaImage from "../assets/qrisbca.jpeg";"""
content = re.sub(r"import React, { useState, useEffect } from 'react';\nimport { useSearchParams } from 'react-router-dom';", imports, content)

# 2. State & Hooks
state_hooks = """const DarkFeminineTSX = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState("QRIS");
    const { toast } = useToast();

    // Payment States
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

    const priceID = 199000;
    const PIXEL_ID = '934836615539666';

    const sendWAAlert = async (type: 'attempt' | 'success', details: any) => {
        try {
            const productDesc = `Dark Feminine Package`;
            const msg = type === 'attempt'
                ? `🔔 *Mencoba Checkout*\\nProduk: ${productDesc}\\nNama: ${details.name}\\nWA: ${details.phone}\\nMetode: ${details.method}`
                : `✅ *Checkout Sukses*\\nRef: ${details.ref}\\nProduk: ${productDesc}\\nNama: ${details.name}\\nWA: ${details.phone}\\nTotal: Rp ${details.amount.toLocaleString('id-ID')}`;

            await fetch('https://watzapp.web.id/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': '23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8' },
                body: JSON.stringify({ phone: "62895325633487", message: msg, token: "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8" })
            });
        } catch (e) { console.error('WA API Error', e); }
    };

    const submitOrder = async () => {
        if (!name || !phone || !email) { alert('⚠️ Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!'); return; }
        if (!payment) { alert('⚠️ Silahkan pilih metode pembayaran!'); return; }

        setLoading(true);
        sendWAAlert('attempt', { name, phone, method: payment });

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();
        const productDesc = `universal - ${name} dark feminine`;

        try {
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID, eventName: 'AddPaymentInfo', eventSourceUrl: window.location.href,
                    customData: { content_name: productDesc, value: priceID, currency: 'IDR' },
                    userData: { fbc, fbp, client_ip_address: clientIp, fn: name, ph: phone, em: email }
                }
            });
        } catch (e) { console.error('AddPaymentInfo CAPI error', e); }

        const payload = {
            subscriptionType: 'universal', paymentMethod: payment,
            userName: name, userEmail: email, phoneNumber: phone,
            address: 'Digital', province: 'Digital', kota: 'Digital', kecamatan: 'Digital', kodePos: '00000',
            amount: priceID, currency: 'IDR', quantity: 1, productName: 'universal_darkfeminine',
            fbc, fbp, clientIp
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });
            if (error) { throw error; }

            if (data?.success) {
                setPaymentData(data); setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref: data.tripay_reference, name, phone, amount: priceID });
            } else if (payment === 'BCA_MANUAL') {
                const ref = `MANUAL-${Date.now()}`;
                setPaymentData({ paymentMethod: 'BCA_MANUAL', amount: priceID, status: 'UNPAID', tripay_reference: ref });
                setShowPaymentInstructions(true); window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref, name, phone, amount: priceID });
            } else {
                alert(data?.error || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e) { alert('Network Error. Silakan pesan via WhatsApp.'); console.error(e); } finally { setLoading(false); }
    };

    const scrollToForm = useCallback(() => { document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" }); }, []);
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;
        const channelName = `payment-status-df-${paymentData.tripay_reference}`;
        const channel = supabase.channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_product', filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload) => {
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;
                        toast({ title: "🎉 Pembayaran Berhasil!", description: "Terima kasih! Pembayaran Anda telah kami terima. Link akses Ebook Dark Feminine akan dikirimkan ke Email dan WhatsApp.", duration: 0 });
                        if (typeof window !== 'undefined' && (window as any).fbq) { (window as any).fbq('track', 'Purchase', { value: priceID, currency: 'IDR', content_name: 'universal dark feminine' }); }
                    }
                }
            ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [showPaymentInstructions, paymentData, PIXEL_ID, priceID, toast]);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
            const fbq = (window as any).fbq;
            fbq('init', PIXEL_ID); fbq('track', 'PageView'); fbq('track', 'ViewContent', { content_name: 'universal dark feminine', value: priceID, currency: 'IDR' });
        }
    }, [PIXEL_ID]);"""
content = content.replace("const DarkFeminineTSX = () => {\n  const [searchParams, setSearchParams] = useSearchParams();", state_hooks)

# 3. CSS for form
css_form = """
        .df-formsec { background: var(--bg-section); padding: 44px 0; }
        .df-privstrip { display: flex; justify-content: center; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
        .df-privbadge { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--muted); }
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
      `}</style>"""
content = content.replace("      `}</style>", css_form)

# 4. Form HTML (Before FAQ)
form_html = """      {/* CHECKOUT FORM */}
      <section id="checkout" className="df-formsec">
        <div className="df-wrap df-fade-in">
          <div className="df-section-label">LANGKAH TERAKHIR</div>
          <h2 className="df-section-h2">Isi Data & <span className="df-gold">Dapatkan Akses</span></h2>
          <div className="df-privstrip">
              {[["🔒", "100% Privasi"], ["⚡", "Akses Instan"], ["��", "Bayar Aman"], ["📱", "Seumur Hidup"]].map(([ic, lb]) => (
                  <div key={lb} className="df-privbadge"><span>{ic}</span><span>{lb}</span></div>
              ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                  <label className="df-flabel">Nama Lengkap</label>
                  <input className="df-finput" placeholder="Contoh: Sarah" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                  <label className="df-flabel">No. WhatsApp</label>
                  <div className="df-pwrap">
                      <div className="df-ppfx">🇮🇩 +62</div>
                      <input className="df-finput" placeholder="812345678" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
              </div>
              <div>
                  <label className="df-flabel">Email (untuk link download)</label>
                  <input className="df-finput" type="email" placeholder="contoh@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                  <label className="df-flabel">Metode Pembayaran</label>
                  <div className="df-pmgrid">
                      {[
                          ["QRIS", "QRIS", "Shopee, OVO, GoPay, DANA"],
                          ["BCAVA", "BCA Virtual Account", "Otomatis via BCA"],
                          ["BNIVA", "BNI Virtual Account", "Otomatis via BNI"],
                          ["BRIVA", "BRI Virtual Account", "Otomatis via BRI"],
                          ["MANDIRIVA", "Mandiri Virtual Account", "Otomatis via Mandiri"],
                          ["PERMATAVA", "Permata Virtual Account", "Otomatis via Permata"]
                      ].map(([id, nm, sb]) => (
                          <div key={id} className={`df-pmopt ${payment === id ? "sel" : ""}`} onClick={() => setPayment(id)}>
                              <div className="df-pmname">{nm}</div>
                              <div className="df-pmsub" style={{ color: (id === 'QRIS') ? 'var(--gold-light)' : 'var(--muted)' }}>{sb}</div>
                          </div>
                      ))}
                  </div>
              </div>
              <div style={{ background: "rgba(139,92,246,.05)", border: "1px solid rgba(139,92,246,.13)", borderRadius: 11, padding: 14, marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13.5, color: "var(--muted)" }}>
                      <span>Paket Lengkap Dark Feminine</span>
                      <span style={{ color: "var(--cream)", fontWeight: 600 }}>Rp199.000</span>
                  </div>
                  <div style={{ height: 1, background: "rgba(139,92,246,.09)", marginBottom: 7 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 700 }}>
                      <span style={{ color: "var(--cream)" }}>Total</span>
                      <span style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)", fontSize: 24 }}>Rp199.000</span>
                  </div>
              </div>
              <button className="df-sbtn" onClick={submitOrder} disabled={loading}>
                  {loading ? "Memproses..." : `🛒 Pesan Sekarang — Rp199.000`}
              </button>
              <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.75 }}>🔒 Pembayaran aman & dienkripsi. Produk dikirim digital. Tidak ada tagihan mencurigakan.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}"""
content = content.replace("      {/* FAQ */}", form_html)

# 5. Return Wrapper & Payment View
ret_wrap = """  return (
    <div style={{ position: 'relative' }}>
      <Toaster />
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
                        <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: 16 }}>A.n Delia Mutia</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={qrisBcaImage} alt="QRIS BCA" style={{ width: '220px', height: '220px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '24px' }} />
                        </div>
                        <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah bayar Ebook Dark Feminine. Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                            <button className="pay-btn-confirm">Konfirmasi via WhatsApp</button>
                        </a>
                    </div>
                )}

                {paymentData.payCode && (
                    <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px' }}>
                        <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                        <div style={{ background: '#EEE5C8', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: '#060A12' }}>{paymentData.payCode}</span>
                            <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="#C9991A" /></button>
                        </div>
                    </div>
                )}

                {paymentData.qrUrl && (
                    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                        <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }} />
                        </div>
                        <div style={{ background: '#e8f5e9', padding: '14px', borderRadius: '10px', color: '#1b5e20', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
                            ✅ Screenshot / Simpan gambar QRIS ini lalu upload dari galeri pada aplikasi pembayaran Anda.
                        </div>
                    </div>
                )}
            </div>
        </div>
      ) : (
        <div className="dark-feminine-container" style={{ background: '#0A0612', color: '#EEE5C8', fontFamily: "'DM Sans', sans-serif", fontSize: '17px', lineHeight: 1.75, position: 'relative', overflowX: 'hidden' }}>"""
content = content.replace("  return (\n    <div className=\"dark-feminine-container\" style={{ background: '#0A0612', color: '#EEE5C8', fontFamily: \"'DM Sans', sans-serif\", fontSize: '17px', lineHeight: 1.75, position: 'relative', overflowX: 'hidden' }}>", ret_wrap)

# Close the conditionals
content = content.replace("export default DarkFeminineTSX;", "      )}\n    </div>\n  );\n};\n\nexport default DarkFeminineTSX;")
# remove the extra div closure before export
content = content.replace("    </div>\n  );\n};\n\n      )}\n    </div>\n  );\n};\n\nexport default DarkFeminineTSX;", "      )}\n    </div>\n  );\n};\n\nexport default DarkFeminineTSX;")

# 6. Replace CTA links
content = content.replace('href={c.btnWa}', 'onClick={scrollToForm}')
content = content.replace('className="df-cta-btn"', 'className="df-cta-btn" style={{cursor: "pointer", color: "#000"}}')

with open('src/darkfeminine.tsx', 'w') as f:
    f.write(content)

print("Patched successfully!")
