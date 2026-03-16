# Trigger Purchase Event for Ebook Uang Panas

Copy and paste the command below into your terminal to send a server-side Purchase event to Meta.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "event_name": "Purchase",
        "event_time": '$(date +%s)',
        "action_source": "website",
        "event_id": "TEST_PURCHASE_'$(date +%s)'",
        "event_source_url": "https://elvision.id/ebook-uang-panas",
        "user_data": {
          "em": "f660ab912ec121d1b1e928a0bb4bc617d5d7958fbe8ce99161d0954818e6cec8",
          "ph": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
        },
        "custom_data": {
          "content_ids": ["ebook_uangpanas"],
          "content_type": "product",
          "content_name": "Ebook Uang Panas",
          "currency": "IDR",
          "value": 100000
        }
      }
    ],
    "access_token": "EAAGuZBVYmBugBQYG9x8wm6tgO42yx51pZBvu6ZCGW0kpedxCz0dhWKoZCZCsLCm0aQgtrj02ZC9JQobZB7T1XhXtdpYHxOJvVDtTw0KTosvi0lT3PsGZCdBYaA0ijVNwGQPrsLWwTPXK6knZC6TF7QpfA0uuKsB9ieU2MGjdmqh8E7FnUOFTsZA2Srf19zUZCDtkYzmPAZDZD"
  }' \
  "https://graph.facebook.com/v19.0/3319324491540889/events"
```

## How to Check Stats

After running the above command, you can use this command to check the event stats (though the dashboard is the best place for the visual breakdown you described):

```bash
curl -G \
  -d "aggregation=1d" \
  -d "event=Purchase" \
  -d "access_token=EAAGuZBVYmBugBQYG9x8wm6tgO42yx51pZBvu6ZCGW0kpedxCz0dhWKoZCZCsLCm0aQgtrj02ZC9JQobZB7T1XhXtdpYHxOJvVDtTw0KTosvi0lT3PsGZCdBYaA0ijVNwGQPrsLWwTPXK6knZC6TF7QpfA0uuKsB9ieU2MGjdmqh8E7FnUOFTsZA2Srf19zUZCDtkYzmPAZDZD" \
  "https://graph.facebook.com/v19.0/3319324491540889/stats"
```
