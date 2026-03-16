import re

with open("ai/src/universal/darkfeminine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Imports
import_replacement = """import { ArrowLeft, Copy, Mail, Lock, Eye, EyeOff, Star, Trash2 } from "lucide-react";"""
content = re.sub(r'import \{ ArrowLeft, Copy \} from "lucide-react";', import_replacement, content)

# 2. Add MOCK_REVIEWS before the component
mock_reviews = """
const MOCK_REVIEWS = [
    { name: "A***a", rating: 5, text: "Jurus 7 benar-benar bekerja. Saya sangat terkejut, dia yang biasanya dingin sekarang selalu mencari perhatian saya.", lang: "id" },
    { name: "S***i", rating: 5, text: "Buku ini merubah mindset saya 180 derajat. Sangat direkomendasikan untuk wanita yang merasa kurang dihargai.", lang: "id" },
    { name: "J***n", rating: 5, text: "The abundance mindset chapter changed my life! I stopped chasing and now he's the one double texting.", lang: "en" },
    { name: "R***a", rating: 5, text: "Isinya daging semua, cuma butuh waktu buat bener-bener nerapin karena kebiasaan lama susah hilang. Tapi worth it banget!", lang: "id" },
    { name: "M***a", rating: 5, text: "Push-pull dynamics is literally magic. Used it on a guy who was pulling away, and he asked me out the next day.", lang: "en" },
    { name: "D***a", rating: 5, text: "Aku yang super pemalu sekarang jadi tahu cara pake 'Silent Power'. Cowok di kantor tiba-tiba pada notice.", lang: "id" },
    { name: "L***y", rating: 5, text: "Never thought psychology could be applied to dating this effectively. Highly recommend!", lang: "en" },
    { name: "W***n", rating: 4, text: "Bahasanya gampang dimengerti. Bonusnya banyak banget dan sangat membantu.", lang: "id" },
    { name: "T***a", rating: 5, text: "I tried the mystery techniques and it drove my husband crazy in a good way. We feel like newlyweds again.", lang: "en" },
    { name: "F***i", rating: 5, text: "Ex aku yang udah nikah sama cewe lain sampe kepo terus, ilmunya emang gila sih.", lang: "id" },
    { name: "C***e", rating: 3, text: "Good book, but some techniques take a lot of confidence to pull off. Still practicing.", lang: "en" },
    { name: "N***a", rating: 5, text: "Dari sekedar 'teman curhat' sekarang aku jadi prioritas utama. Nangis banget akhirnya ngerti cara mainnya.", lang: "id" },
    { name: "K***y", rating: 5, text: "Worth every penny. The bonuses alone are worth more than the price.", lang: "en" },
    { name: "B***a", rating: 5, text: "Aku nerapin ilmu ini ke gebetan yang toxic, akhirnya aku yang pegang kendali sekarang.", lang: "id" },
    { name: "E***a", rating: 5, text: "This actually works. I was skeptical but the text game examples are spot on.", lang: "en" },
    { name: "V***a", rating: 5, text: "Nyesel baru tau ilmu ini sekarang. Kalau aja dari dulu tau, gak bakal diselingkuhin.", lang: "id" },
    { name: "S***h", rating: 5, text: "The Femme Fatale Secrets bonus is my favorite. Unleashed a side of me I didn't know existed.", lang: "en" },
    { name: "I***a", rating: 5, text: "Suami yang cuek banget tiba-tiba beliin bunga. Padahal aku cuma ubah cara diamku. Magic!", lang: "id" },
    { name: "A***y", rating: 5, text: "My SMV definitely went up after reading this. Men treat me with so much more respect now.", lang: "en" },
    { name: "P***i", rating: 4, text: "Gila sih ini dark feminine beneran bikin aura kita beda. Cuma harganya lumayan tapi sangat worth it.", lang: "id" },
    { name: "M***L", rating: 5, text: "I love how practical the 30-day workbook is. Keeps you accountable.", lang: "en" },
    { name: "G***a", rating: 5, text: "Jurus hot-cold nya ampuh banget buat cowok yang suka ghosting.", lang: "id" },
    { name: "R***l", rating: 3, text: "Informative, but I wish there were more video examples.", lang: "en" },
    { name: "Y***i", rating: 5, text: "Bonus How to Please Your Man nya... wow. Suami makin lengket hahaha.", lang: "id" },
    { name: "N***e", rating: 5, text: "This is the holy grail for women who are tired of being the 'nice girl'.", lang: "en" },
    { name: "Z***a", rating: 5, text: "Baru baca setengah tapi udah berasa perubahannya. Mantap pokoknya.", lang: "id" },
    { name: "O***a", rating: 5, text: "Great insights on emotional control. Helps not just in dating but in career too.", lang: "en" },
    { name: "U***a", rating: 5, text: "Sekarang aku ngerti kenapa cewek biasa aja bisa dapet cowok tajir. Ternyata ini rahasianya.", lang: "id" },
    { name: "H***n", rating: 5, text: "I read Robert Greene's book before, but this summarizes it perfectly for modern dating.", lang: "en" },
    { name: "Q***a", rating: 5, text: "Gak bohong, ilmu ini bener-bener bikin cowok takut kehilangan kita.", lang: "id" }
];

const DarkFeminineTSX = () => {"""
content = content.replace("const DarkFeminineTSX = () => {", mock_reviews)

# 3. Add States and Functions for Auth/Reviews
states_and_functions = """
    // Auth & Reviews State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [userReview, setUserReview] = useState<any>(null);
    const [userEmailSession, setUserEmailSession] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [showReviewsCount, setShowReviewsCount] = useState(10);
    const [dbReviews, setDbReviews] = useState<any[]>([]);

    const fetchDbReviews = async () => {
        const { data } = await supabase.from('darkfeminine_reviews').select('*').order('created_at', { ascending: false });
        if (data) setDbReviews(data);
    };

    const fetchUserReview = async (email: string) => {
        const { data } = await supabase.from('darkfeminine_reviews').select('*').eq('user_email', email).maybeSingle();
        if (data) {
            setUserReview(data);
            setReviewText(data.comment);
            setReviewRating(data.rating);
        } else {
            setUserReview(null);
            setReviewText("");
            setReviewRating(5);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsLoggedIn(true);
                setUserEmailSession(session.user.email || "");
                fetchUserReview(session.user.email || "");
            }
            const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    setIsLoggedIn(true);
                    setUserEmailSession(session.user.email || "");
                    fetchUserReview(session.user.email || "");
                } else {
                    setIsLoggedIn(false);
                    setUserEmailSession("");
                    setUserReview(null);
                }
            });
            return () => { authListener.subscription.unsubscribe(); };
        };
        checkSession();
        fetchDbReviews();
    }, []);

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
                { redirectTo: `${window.location.origin}/reset-password` }
            );
            if (error) throw error;
            toast({ title: "Reset Email Terkirim", description: "Cek email Anda untuk instruksi reset password." });
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast({ title: "Logout Berhasil" });
    };

    const submitReview = async () => {
        if (!reviewText) return;
        setIsLoginLoading(true);
        try {
            const payload = {
                user_email: userEmailSession,
                name: userEmailSession.split('@')[0],
                rating: reviewRating,
                comment: reviewText
            };
            if (userReview) {
                await supabase.from('darkfeminine_reviews').update(payload).eq('id', userReview.id);
                toast({ title: "Review diupdate" });
            } else {
                await supabase.from('darkfeminine_reviews').insert([payload]);
                toast({ title: "Review ditambahkan" });
            }
            fetchUserReview(userEmailSession);
            fetchDbReviews();
        } catch (error: any) {
            toast({ title: "Gagal submit review", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };

    const deleteReview = async () => {
        if (!userReview) return;
        setIsLoginLoading(true);
        try {
            await supabase.from('darkfeminine_reviews').delete().eq('id', userReview.id);
            toast({ title: "Review dihapus" });
            fetchUserReview(userEmailSession);
            fetchDbReviews();
        } catch (error: any) {
            toast({ title: "Gagal menghapus review", description: error.message, variant: "destructive" });
        } finally {
            setIsLoginLoading(false);
        }
    };
"""

content = re.sub(r'const \{ toast \} = useToast\(\);', 'const { toast } = useToast();\\n' + states_and_functions, content)

# 4. Insert Review Section Before Checkout Form
review_section = """
                    {/* REVIEWS SECTION */}
                    <section style={{ background: 'var(--bg-primary)', padding: '44px 0' }}>
                        <div className="df-wrap df-fade-in">
                            <div className="df-section-label">ULASAN PELANGGAN</div>
                            <h2 className="df-section-h2" style={{ fontSize: '28px', marginBottom: '8px' }}>Review Real Customer</h2>
                            <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                                (Anda bisa memberikan ulasan setelah membeli dan login dengan email anda) <br/>
                                Ulasan pasti disensor untuk privasi anda.
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
                                {!isLoggedIn ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ color: 'var(--cream)', fontSize: '15px', marginBottom: '12px' }}>Sudah membeli? Login untuk memberikan ulasan.</p>
                                        <button onClick={() => setShowLoginModal(true)} style={{ background: 'var(--purple)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                            Login dengan Email
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <div style={{ fontSize: '15px', color: 'var(--cream)' }}>
                                                Halo, <strong>{userEmailSession.split('@')[0]}</strong>
                                            </div>
                                            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Logout</button>
                                        </div>
                                        
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Beri Rating:</div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {[1,2,3,4,5].map(star => (
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
                                            placeholder="Tulis ulasan jujur Anda di sini..."
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '14px', borderRadius: '8px', minHeight: '100px', fontFamily: 'var(--font-body)', fontSize: '15px', outline: 'none', marginBottom: '12px' }}
                                        />
                                        
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={submitReview} disabled={isLoginLoading} style={{ flex: 1, background: 'var(--purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: isLoginLoading ? 0.7 : 1 }}>
                                                {isLoginLoading ? 'Memproses...' : (userReview ? 'Update Ulasan' : 'Kirim Ulasan')}
                                            </button>
                                            {userReview && (
                                                <button onClick={deleteReview} disabled={isLoginLoading} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Display Reviews */}
                            <div>
                                {[...dbReviews, ...MOCK_REVIEWS].slice(0, showReviewsCount).map((r, i) => (
                                    <div key={i} style={{ background: 'var(--bg-section)', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cream)' }}>{r.name}</div>
                                                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} size={14} fill={j < r.rating ? "var(--gold-light)" : "transparent"} color={j < r.rating ? "var(--gold-light)" : "var(--muted)"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--green-wa)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(37,211,102,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                                ✓ Verified Buyer
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '15px', color: 'var(--cream)', lineHeight: 1.6, marginTop: '8px' }}>{r.comment || r.text}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {showReviewsCount < [...dbReviews, ...MOCK_REVIEWS].length && (
                                <button onClick={() => setShowReviewsCount(30)} style={{ width: '100%', background: 'transparent', border: '1px solid var(--purple-light)', color: 'var(--purple-light)', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'all 0.2s' }}>
                                    ▾ Buka Review Lain ({[...dbReviews, ...MOCK_REVIEWS].length - showReviewsCount} lagi)
                                </button>
                            )}

                        </div>
                    </section>
"""

content = content.replace('{/* CHECKOUT FORM */}', review_section + '\\n                    {/* CHECKOUT FORM */}')

# 5. Insert Login Modal
login_modal = """
            {/* LOGIN MODAL */}
            {showLoginModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '32px 24px', border: '1px solid rgba(139,92,246,0.3)', position: 'relative' }}>
                        <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--white)', fontWeight: 700, marginBottom: '8px' }}>Login Akun</h3>
                            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Masuk untuk memberikan ulasan. Jika belum punya akun, akan otomatis dibuat saat Anda membeli.</p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--cream)', marginBottom: '8px', fontWeight: 600 }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--muted)' }} size={18} />
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
                                <label style={{ display: 'block', fontSize: '14px', color: 'var(--cream)', marginBottom: '8px', fontWeight: 600 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--muted)' }} size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '14px 44px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '15px' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoginLoading} style={{ width: '100%', background: 'var(--purple)', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginTop: '8px', transition: 'background 0.2s', opacity: isLoginLoading ? 0.7 : 1 }}>
                                {isLoginLoading ? 'Memproses...' : 'Login Sekarang'}
                            </button>
                        </form>
                        
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button onClick={handleForgotPassword} disabled={isLoginLoading} style={{ background: 'transparent', border: 'none', color: 'var(--gold-light)', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
                                Lupa Password? (Isi email lalu klik ini)
                            </button>
                        </div>
                    </div>
                </div>
            )}
"""

content = content.replace('<Toaster />', '<Toaster />\\n' + login_modal)

with open("ai/src/universal/darkfeminine.tsx", "w", encoding="utf-8") as f:
    f.write(content)
