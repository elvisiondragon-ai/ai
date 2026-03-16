import re
import json
from datetime import datetime

# 🎯 Target Keywords symbolizing "Desperation" or "Seeking Hope"
PAIN_KEYWORDS = [
    r"relate", r"posisi ini", r"suami selingkuh", r"toxic", r"capek banget", 
    r"ingin nyerah", r"butuh solusi", r"trauma", r"diselingkuhi", r"gak dihargai",
    r"tunggu jodoh", r"kesepian", r"hampa", r"sadar diri", r"sakit hati"
]

def analyze_comments(comments_data):
    """
    Analyzes a list of comments and weights them based on 'desperation' markers.
    """
    results = []
    
    for comment in comments_data:
        text = comment.get('text', '').lower()
        score = 0
        matches = []
        
        for pattern in PAIN_KEYWORDS:
            if re.search(pattern, text):
                score += 10 # Base score for keyword match
                matches.append(pattern)
        
        # Increased weight for emotional intensity (exclamation marks, caps)
        if "!!!" in text or text.isupper():
            score += 5
            
        if score > 0:
            results.append({
                "user": comment.get('user', 'Anonymous'),
                "text": text,
                "score": score,
                "matches": matches,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
    # Sort by highest score (highest desperation)
    return sorted(results, key=lambda x: x['score'], reverse=True)

# 🧪 TEST DATA (Simulating Scraped Comments from IG/TikTok)
mock_comments = [
    {"user": "@susi_99", "text": "Relate banget kak.. aku sedang di posisi ini, suami selingkuh tapi aku gak berani pergi."},
    {"user": "@indria_v", "text": "Keren banget ka videonya!"},
    {"user": "@rara_cantik", "text": "AKU CAPEK BANGET!!! Gak pernah dihargai sama sekali di rumah sendiri."},
    {"user": "@melati_88", "text": "Masih percaya nunggu jodoh itu cukup, ternyata malah hampa."},
    {"user": "@user_test", "text": "Gimana ya cara move on yang bener? Trauma banget."},
]

if __name__ == "__main__":
    print("🚀 Running Social Listening Architecture for Dark Feminine...")
    findings = analyze_comments(mock_comments)
    
    print(f"\n✅ Found {len(findings)} Potential High-Intent Leads:\n")
    for lead in findings:
        print(f"👤 User: {lead['user']}")
        print(f"🔴 Score: {lead['score']} (Matches: {', '.join(lead['matches'])})")
        print(f"💬 Text: \"{lead['text']}\"")
        print("-" * 40)

    # Save to a potential lead file
    with open('/tmp/leads_detection.json', 'w') as f:
        json.dump(findings, f, indent=4)
