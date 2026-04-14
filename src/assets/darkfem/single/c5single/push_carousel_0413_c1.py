import os
import json
import subprocess
import time

TOKEN = "EAARivNfjDnEBQoKU2ZB7Vaqb6fzVZAEjcRn3L4dsyJuZAR1LD0CBlemJfDMPZCZC5GRjsO2y4Dojpt6e1LmIFs04NAZAJoHGaePwqFMhVv1gTVZAMcW1ZACZCf2UUyjsAZA2qbbSWm7GXH3ZB4Ho3c07n7pBQglZBMz7aCiVEkL4KwNazZCtQlrxNSct4SH9CKR3l1iu4aQZDZD"
ACC_ID = "act_1605154943634257"
ADSET_ID = "120240622730450757" # From the md file
PAGE_ID = "518894044637696"
INSTAGRAM_USER_ID = "17841400529912607"
DEST_URL = "https://ai.elvisiongroup.com/darkfeminine"
BASE_DIR = "/Users/eldragon/git/el/mcp/iklan/darkfem_0413/c1"

def run_curl_post(url, fields):
    cmd = ["curl", "-s", "-X", "POST", url]
    for key, value in fields.items():
        if key in ["filename", "source"] and os.path.exists(value):
            cmd.extend(["-F", f"{key}=@{value}"])
        else:
            cmd.extend(["-F", f"{key}={value}"])
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout

def upload_image(path):
    print(f"  [+] Uploading Image: {os.path.basename(path)}")
    fields = {"access_token": TOKEN, "filename": path}
    res = run_curl_post(f"https://graph.facebook.com/v24.0/{ACC_ID}/adimages", fields)
    try:
        data = json.loads(res)
        filename_key = os.path.basename(path)
        return data["images"][filename_key]["hash"]
    except Exception as e:
        print(f"  [!] Image Upload Failed: {res}")
        return None

images = [
    "df_0413_c1_s1_1776094006614.png",
    "df_0413_c1_s2_1776094060387.png",
    "df_0413_c1_s3_1776094080684.png",
    "df_0413_c1_s4_1776094099286.png"
]

primary_text = """Dulu Rini selalu ada untuk semua orang.

Selalu duluan balas.
Selalu adjust.
Selalu maafkan.

Hasilnya? Diabaikan. Tidak dilihat. Lelah dalam diam.

Lalu dia berhenti — bukan berhenti mencintai.
Tapi berhenti menghapus dirinya sendiri.

Tidak ada drama. Tidak ada ultimatum.
Hanya 1 perubahan cara dia membawa dirinya.

Dan suaminya mulai berubah.
Sendiri.

👉 52 Jurus Dark Feminine — untuk istri yang sudah cukup lelah mencoba cara yang salah."""

headline = "DARI DIABAIKAN — KE DIPRIORITASKAN. INI CERITA RINI."
description = "Bukan soal lebih baik lagi. Tapi soal berhenti menjadi yang paling mudah diabaikan."

def push_carousel_ad():
    print("Uploading images for carousel...")
    image_hashes = []
    for img in images:
        path = os.path.join(BASE_DIR, img)
        h = upload_image(path)
        if h:
            image_hashes.append(h)
        else:
            print("Failed to upload all images, stopping.")
            return

    # Create child attachments
    child_attachments = []
    for h in image_hashes:
        child_attachments.append({
            "link": DEST_URL,
            "image_hash": h,
            "name": headline,
            "description": description,
            "call_to_action": {"type": "LEARN_MORE", "value": {"link": DEST_URL}}
        })

    creative_spec = {
        "page_id": PAGE_ID,
        "instagram_user_id": INSTAGRAM_USER_ID,
        "link_data": {
            "link": DEST_URL,
            "message": primary_text,
            "child_attachments": child_attachments
        }
    }

    # Create Creative
    res_creative = run_curl_post(f"https://graph.facebook.com/v24.0/{ACC_ID}/adcreatives", {
        "name": f"Creative_Carousel_DF_0413_C1_{int(time.time())}",
        "object_story_spec": json.dumps(creative_spec),
        "access_token": TOKEN
    })

    try:
        creative_id = json.loads(res_creative)["id"]
        print(f"  [+] Carousel Creative Created: {creative_id}")

        res_ad = run_curl_post(f"https://graph.facebook.com/v24.0/{ACC_ID}/ads", {
            "name": "df_0413_c1_Rini_Transformation",
            "adset_id": ADSET_ID,
            "creative": json.dumps({"creative_id": creative_id}),
            "status": "ACTIVE",
            "access_token": TOKEN
        })

        ad_response = json.loads(res_ad)
        if "id" in ad_response:
            print(f"  [+] Carousel Ad Live! ID: {ad_response['id']}")
        else:
            print(f"  [!] Failed to push ad: {res_ad}")
    except Exception as e:
         print(f"  [!] Failed to finalize ad: {res_creative} | Error: {e}")

if __name__ == "__main__":
    push_carousel_ad()
