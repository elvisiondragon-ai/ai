import requests
import json
import os

# Configuration
API_URL = "https://watzapp.web.id/api/message"
API_KEY = "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8"
EBOOK_LINK = "https://ai.elvisiongroup.com/darkfeminine?free-ebook"

# Recipients List (11 entries)
recipients = [
  {
    "name": "Sri Purwaningsih",
    "phone": "087837896373"
  },
  {
    "name": "Rika Swastikarani",
    "phone": "+628111773475"
  },
  {
    "name": "Lina",
    "phone": "081805876178"
  },
  {
    "name": "Karimah",
    "phone": "08984947748"
  },
  {
    "name": "Tenny Anathasia",
    "phone": "081342787118"
  },
  {
    "name": "Merrynda Lyanova",
    "phone": "081807088485"
  },
  {
    "name": "Natasha",
    "phone": "087771292897"
  },
  {
    "name": "Xena",
    "phone": "087889888399"
  },
  {
    "name": "Fatimahhakki",
    "phone": "082162440993"
  },
  {
    "name": "Novita s",
    "phone": "081357863265"
  },
  {
    "name": "Tenny Anathasia",
    "phone": "081342787118"
  }
]

def send_message(name, phone):
    # Format and clean phone number
    clean_phone = ''.join(filter(str.isdigit, phone))
    if clean_phone.startswith('0'):
        clean_phone = '62' + clean_phone[1:]
    elif clean_phone.startswith('8'):
        clean_phone = '62' + clean_phone
    
    # Message content
    message = f"Hai kak {name}, kamu mendapatkan free ebook untuk dark feminine versi lebih lanjut {EBOOK_LINK}"
    
    # Correct Payload fields: 'token' and 'to'
    payload = {
        "token": API_KEY,
        "to": clean_phone,
        "message": message
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        print(f"✅ Sent to {name} ({clean_phone}): {response.status_code} - {response.text}")
        return True
    except requests.exceptions.HTTPError as err:
        print(f"❌ Failed for {name} ({clean_phone}): {err} - {response.text if 'response' in locals() else ''}")
    except Exception as e:
        print(f"❌ Error occurred for {name} ({clean_phone}): {e}")
    return False

if __name__ == "__main__":
    print(f"Starting to send {len(recipients)} messages...")
    success_count = 0
    for person in recipients:
        if send_message(person['name'], person['phone']):
            success_count += 1
    
    print(f"\nCompleted! {success_count}/{len(recipients)} messages sent successfully.")
