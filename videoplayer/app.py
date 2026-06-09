from flask import Flask, request, jsonify
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
            "format": "best"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        video_data = {
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration"),
            "stream_url": info.get("url")
        }

        watch_history.insert(0, video_data)

        return jsonify(video_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/history")
def history():
    return jsonify(watch_history)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)