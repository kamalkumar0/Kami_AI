from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


@app.route("/")
def index():
    return render_template("index.html")



@app.route("/chat", methods=["POST"])
def chat():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY .env mein set nahi hai"}), 500

    data     = request.json
    model    = data.get("model", "llama-3.3-70b-versatile")
    messages = data.get("messages", [])
    system   = data.get("system", "")

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}] + messages,
        "max_tokens": 900,
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        res      = requests.post(GROQ_API_URL, json=payload, headers=headers, timeout=30)
        res_data = res.json()

        if "error" in res_data:
            return jsonify({"error": res_data["error"]["message"]}), 400

        reply = res_data["choices"][0]["message"]["content"]
        return jsonify({"reply": reply})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. Try again."}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)