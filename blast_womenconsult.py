"""
Blast WA — Women AI Consultant promo
Target: semua PAID feminine/dark feminine dari global_product
Delay: 5 menit antar nomor
Laporan ke admin WA saat selesai
"""

import requests
import time

# --- CONFIG ---
SUPABASE_URL = "https://nlrgdhpmsittuwiiindq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo"

WAPI_URL     = "https://api.elvisiongroup.com/api/send"
WAPI_TOKEN   = "rvpwk8dkih9m"
WAPI_SESSION = "renata"

ADMIN_PHONES = ["6281383838013", "6285664733499"]

MESSAGE = (
    "Hello ladies 💜\n\n"
    "Kita adakan *Project Independent Women* 🚀\n\n"
    "Simak bagaimana banyak independent woman di kami mendapatkan *3x ROAS dalam 1 minggu*, "
    "menghasilkan *3 juta rupiah* dari rumah — tanpa modal besar, tanpa pengalaman iklan sebelumnya.\n\n"
    "👉 https://ai.elvisiongroup.com/womenconsultant\n\n"
    "Hanya *Rp4.000/hari* selama 1 tahun penuh.\n\n"
    "Silahkan cek websitenya ya 🙏"
)

KEYWORDS = ["feminin", "dark feminine", "feminine"]
DELAY_SECONDS = 300  # 5 menit


def clean_phone(raw: str) -> str:
    digits = "".join(filter(str.isdigit, raw))
    if digits.startswith("0"):
        digits = "62" + digits[1:]
    elif digits.startswith("8"):
        digits = "62" + digits
    return digits


def fetch_recipients() -> list:
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    url = f"{SUPABASE_URL}/rest/v1/global_product?select=name,phone,email,product_name&status=eq.PAID&limit=1000"
    r = requests.get(url, headers=headers, timeout=15)
    r.raise_for_status()
    all_paid = r.json()

    seen_phones = set()
    recipients = []
    for row in all_paid:
        pname = row.get("product_name", "")
        if not any(k in pname.lower() for k in KEYWORDS):
            continue
        phone = row.get("phone", "").strip()
        if not phone:
            continue
        cp = clean_phone(phone)
        if not cp or cp in seen_phones:
            continue
        seen_phones.add(cp)
        recipients.append({
            "name": row.get("name", "Kak"),
            "phone": cp,
            "product_name": pname,
        })
    return recipients


def send_wa(phone: str, message: str) -> bool:
    payload = {
        "session": WAPI_SESSION,
        "token": WAPI_TOKEN,
        "to": phone,
        "message": message,
    }
    try:
        r = requests.post(WAPI_URL, json=payload, timeout=15)
        return r.ok
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False


# ── MAIN ──────────────────────────────────────────────────────────────────────
recipients = fetch_recipients()
total = len(recipients)
print(f"Total recipients: {total}")
print(f"Delay per message: {DELAY_SECONDS}s (5 menit)")
print(f"Estimated duration: {total * DELAY_SECONDS / 60:.0f} menit\n")

sent = 0
failed = 0
failed_list = []

for i, rec in enumerate(recipients):
    print(f"[{i+1}/{total}] Sending to {rec['phone']} ({rec['name'][:25]}) ...", end=" ", flush=True)
    ok = send_wa(rec["phone"], MESSAGE)
    if ok:
        sent += 1
        print("OK")
    else:
        failed += 1
        failed_list.append(rec["phone"])
        print("FAILED")

    if i < total - 1:
        print(f"  waiting {DELAY_SECONDS}s ...\n")
        time.sleep(DELAY_SECONDS)

# ── LAPORAN KE ADMIN ──────────────────────────────────────────────────────────
report = (
    f"✅ *Blast WA Selesai — Women AI Consultant*\n\n"
    f"Total target: {total}\n"
    f"Terkirim: {sent}\n"
    f"Gagal: {failed}\n"
)
if failed_list:
    report += f"\nGagal ke:\n" + "\n".join(failed_list)

for admin in ADMIN_PHONES:
    send_wa(admin, report)
    print(f"\n[REPORT] Sent to admin {admin}")

print(f"\n{'='*45}")
print(f"  SELESAI. Sent: {sent} | Failed: {failed}")
print(f"{'='*45}")
