```from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

watch_history = []

@app.route("/")
def home():
    return {"status": "running"}

@app.route("/load", methods=["POST"])
def load_video():
    url = request.json.get("url")

    try:
        ydl_opts = {
            "quiet": True,
            "noplaylist": True,

            # 🔥 IMPORTANT: helps bypass bot detection
            "cookiefile": "cookies.txt",  # <-- REQUIRED for many videos

            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
                "Referer": "https://www.youtube.com/",
                "Accept-Language": "en-US,en;q=0.9"
            },

            "extractor_args": {
                "youtube": {
                    "player_client": ["android", "web"]
                }
            }
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        # pick best formats safely
        formats = info.get("formats", [])

        best_video = None
        best_audio = None

        for f in formats:
            if f.get("vcodec") != "none":
                best_video = f
            if f.get("acodec") != "none" and f.get("vcodec") == "none":
                best_audio = f

        video_data = {
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration"),
            "video_url": best_video["url"] if best_video else None,
            "audio_url": best_audio["url"] if best_audio else None
        }

        watch_history.insert(0, video_data)

        return jsonify(video_data)

    except Exception as e:
        return jsonify({
            "error": str(e),
            "fix": "Add cookies.txt or update yt-dlp"
        }), 400


@app.route("/history")
def history():
    return jsonify(watch_history)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)```
