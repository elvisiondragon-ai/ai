#!/bin/bash

# ------------------------------------------------------------------
# Facebook CAPI Test Script
# ------------------------------------------------------------------
# Usage: 
# 1. Open this file and replace YOUR_ACCESS_TOKEN_HERE with your token.
# 2. If using the "Test Events" tab in Events Manager, replace TESTxxxxx with your code.
# 3. Run: bash test_capi.sh
# ------------------------------------------------------------------

ACCESS_TOKEN="YOUR_ACCESS_TOKEN_HERE"
TEST_EVENT_CODE="TESTxxxxx" 
PIXEL_ID="3319324491540889"
FBC_VALUE="fb.1.1769479257481.PAZXh0bgNhZW0BMABhZGlkAasq7s0QTABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafmiYftILqmMu6zF8mYGI13K8QrFPc5-ikvTxHPBgox6NVAqN_R3QALYUMUVA_aem_rDcwm2Z8sxnKoQE055HA9Q"

echo "Sending test event to Facebook CAPI for Pixel $PIXEL_ID..."

curl -X POST \
  "https://graph.facebook.com/v19.0/$PIXEL_ID/events?access_token=$ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "data": [
    {
      "event_name": "TestEvent",
      "event_time": '$(date +%s)',
      "action_source": "website",
      "user_data": {
        "fbc": "'"$FBC_VALUE"'",
        "client_user_agent": "Curl/Terminal Test"
      }
    }
  ],
  "test_event_code": "'"$TEST_EVENT_CODE"'"
}'

echo -e "\n\nRequest completed."
