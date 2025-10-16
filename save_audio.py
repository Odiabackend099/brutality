import json

# Your API response (paste the full JSON here)
response = {
    "data": {
        "audio": "fffb98c4ff83a3e21b0e1ddc8001c5b0e583b2b4000d8f78bb8e..."  # Your full hex string
    }
}

# Decode and save
audio_hex = response['data']['audio']
audio_bytes = bytes.fromhex(audio_hex)

with open('calling-hour.mp3', 'wb') as f:
    f.write(audio_bytes)

print("✅ Audio saved as calling-hour.mp3")
