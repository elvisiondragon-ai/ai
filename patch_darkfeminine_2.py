import re

with open("ai/src/universal/darkfeminine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix literal newlines in JSX that show up in UI
content = content.replace("\\n                    {/* CHECKOUT FORM */}", "                    {/* CHECKOUT FORM */}")
content = content.replace("\\n                    {/* REVIEWS SECTION */}", "                    {/* REVIEWS SECTION */}")

# 2. Fix the button text
old_btn = "▾ Buka Review Lain ({[...dbReviews, ...MOCK_REVIEWS].length - showReviewsCount} lagi)"
new_btn = "▾ Buka Review Lain"
content = content.replace(old_btn, new_btn)

# 3. Define the new MOCK_REVIEWS with the testimonials included and names as censored emails
new_mock_reviews = """const MOCK_REVIEWS = [
    { name: "anisahf***@gmail.com", rating: 5, text: "Demi allah sis, baru 2 minggu praktekin jurus 7... cowok yang dulu ghosting gue TIBA-TIBA nge-DM lagi. Padahal gue ga ngapa-ngapain. Cuma DIEM. Ternyata itu ilmunya 😭🔥", lang: "id" },
    { name: "sari.p***@yahoo.com", rating: 5, text: "Suami gue yang tadinya cuek, sekarang GELISAH kalau gue keluar rumah. Bukan karena posesif. Tapi karena dia mulai TAKUT KEHILANGAN. Jurus 1 doang udah sedahsyat ini.", lang: "id" },
    { name: "rina.a***@gmail.com", rating: 5, text: "Ex gue nikah sama cewek lain. 6 bulan kemudian gue apply dark feminine, gue dapet cowok yang 10x lebih ganteng dan kaya. Dan tau ga? Ex gue NGESTALK ig gue sekarang setiap hari. Karma is real 💅", lang: "id" },
    { name: "dindaa***@yahoo.com", rating: 5, text: "Gue introvert parah, bahkan ngomong sama barista aja gugup. Tapi setelah baca jurus 12 soal 'aura diam', cowok-cowok di kantor mulai NOTICE gue. Bos gue sendiri bilang 'ada yang beda dari lo'. Padahal gue cuma UBAH CARA DIAM gue 😭✨", lang: "id" },
    { name: "megaw***@gmail.com", rating: 5, text: "Gue career woman yang selalu dibilang 'terlalu kuat' sama cowok. Setelah apply jurus push-pull, sekarang CEO tempat gue kerja yang ngejar-ngejar gue. Bukan gue yang berubah jadi lemah, tapi gue jadi TAU KAPAN harus lembut 🔥👠", lang: "id" },
    { name: "wulans***@hotmail.com", rating: 5, text: "Single mom 2 anak. Udah pasrah ga bakal ada yang mau. Baca ebook ini, praktekin jurus mystery... dalam 3 bulan ada 4 cowok mapan yang serius approach. Yang gue pilih? Dokter. Dan dia SAYANG banget sama anak-anak gue 🥹💜", lang: "id" },
    { name: "tasya.l***@gmail.com", rating: 5, text: "Anak kuliahan yang selalu jadi 'sahabat'. Cowok yang gue suka malah curhat soal cewek lain ke gue. Setelah apply jurus 3 dan 7, DIA YANG NEMBAK DULUAN. Temen-temen gue sampe bingung 'lo ngapain sih?' 😂💅", lang: "id" },
    { name: "fitri.h***@gmail.com", rating: 5, text: "Nikah 8 tahun, suami udah kayak robot. Pulang kerja langsung HP. Gue praktekin jurus hot-cold selama 2 minggu... dia PANIK. Sekarang tiap weekend dia yang PLAN date night. Bahkan mulai kirim bunga lagi kayak waktu pacaran 🌹😍", lang: "id" },
    { name: "jesicca***@gmail.com", rating: 5, text: "The abundance mindset chapter changed my life! I stopped chasing and now he's the one double texting.", lang: "en" },
    { name: "maria.v***@yahoo.com", rating: 5, text: "Push-pull dynamics is literally magic. Used it on a guy who was pulling away, and he asked me out the next day.", lang: "en" },
    { name: "lucy.h***@hotmail.com", rating: 5, text: "Never thought psychology could be applied to dating this effectively. Highly recommend!", lang: "en" },
    { name: "tara.w***@gmail.com", rating: 5, text: "I tried the mystery techniques and it drove my husband crazy in a good way. We feel like newlyweds again.", lang: "en" },
    { name: "chloe.m***@gmail.com", rating: 3, text: "Good book, but some techniques take a lot of confidence to pull off. Still practicing.", lang: "en" },
    { name: "kathy.s***@yahoo.com", rating: 5, text: "Worth every penny. The bonuses alone are worth more than the price.", lang: "en" },
    { name: "emily.r***@gmail.com", rating: 5, text: "This actually works. I was skeptical but the text game examples are spot on.", lang: "en" },
    { name: "sarah.b***@hotmail.com", rating: 5, text: "The Femme Fatale Secrets bonus is my favorite. Unleashed a side of me I didn't know existed.", lang: "en" },
    { name: "amelia.c***@gmail.com", rating: 5, text: "My SMV definitely went up after reading this. Men treat me with so much more respect now.", lang: "en" },
    { name: "maya.l***@yahoo.com", rating: 5, text: "I love how practical the 30-day workbook is. Keeps you accountable.", lang: "en" },
    { name: "rachel.d***@gmail.com", rating: 3, text: "Informative, but I wish there were more video examples.", lang: "en" },
    { name: "natalie.j***@hotmail.com", rating: 5, text: "This is the holy grail for women who are tired of being the 'nice girl'.", lang: "en" },
    { name: "olivia.k***@gmail.com", rating: 5, text: "Great insights on emotional control. Helps not just in dating but in career too.", lang: "en" },
    { name: "helen.p***@yahoo.com", rating: 5, text: "I read Robert Greene's book before, but this summarizes it perfectly for modern dating.", lang: "en" },
    { name: "cindy99***@gmail.com", rating: 4, text: "Bahasanya gampang dimengerti. Bonusnya banyak banget dan sangat membantu.", lang: "id" },
    { name: "nadilasd***@gmail.com", rating: 5, text: "Dari sekedar 'teman curhat' sekarang aku jadi prioritas utama. Nangis banget akhirnya ngerti cara mainnya.", lang: "id" },
    { name: "bella.p***@yahoo.com", rating: 5, text: "Aku nerapin ilmu ini ke gebetan yang toxic, akhirnya aku yang pegang kendali sekarang.", lang: "id" },
    { name: "viona.r***@gmail.com", rating: 5, text: "Nyesel baru tau ilmu ini sekarang. Kalau aja dari dulu tau, gak bakal diselingkuhin.", lang: "id" },
    { name: "putri.s***@hotmail.com", rating: 4, text: "Gila sih ini dark feminine beneran bikin aura kita beda. Cuma harganya lumayan tapi sangat worth it.", lang: "id" },
    { name: "gisel.t***@gmail.com", rating: 5, text: "Jurus hot-cold nya ampuh banget buat cowok yang suka ghosting.", lang: "id" },
    { name: "yuni.w***@yahoo.com", rating: 5, text: "Bonus How to Please Your Man nya... wow. Suami makin lengket hahaha.", lang: "id" },
    { name: "zahra.y***@gmail.com", rating: 5, text: "Baru baca setengah tapi udah berasa perubahannya. Mantap pokoknya.", lang: "id" },
    { name: "ulfa.z***@hotmail.com", rating: 5, text: "Sekarang aku ngerti kenapa cewek biasa aja bisa dapet cowok tajir. Ternyata ini rahasianya.", lang: "id" },
    { name: "qonita.x***@gmail.com", rating: 5, text: "Gak bohong, ilmu ini bener-bener bikin cowok takut kehilangan kita.", lang: "id" }
];"""

content = re.sub(r'const MOCK_REVIEWS = \[.*?\];', new_mock_reviews, content, flags=re.DOTALL)

with open("ai/src/universal/darkfeminine.tsx", "w", encoding="utf-8") as f:
    f.write(content)
