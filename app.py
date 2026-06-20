from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

LANGUAGETOOL_URL = "http://languagetool:8010/v2/check"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/check", methods=["POST"])
def check_text():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        response = requests.post(
            LANGUAGETOOL_URL,
            data={"text": text, "language": "en-US"},
            timeout=15
        )
        result = response.json()

        errors = []
        corrected_text = text
        offset_shift = 0

        for match in result.get("matches", []):
            original_phrase = text[match["offset"]:match["offset"] + match["length"]]
            suggestion = match["replacements"][0]["value"] if match["replacements"] else original_phrase
            explanation = match["message"]

            errors.append({
                "original": original_phrase,
                "correction": suggestion,
                "explanation": explanation
            })

            start = match["offset"] + offset_shift
            end = start + match["length"]
            corrected_text = corrected_text[:start] + suggestion + corrected_text[end:]
            offset_shift += len(suggestion) - match["length"]

        return jsonify({
            "corrected_text": corrected_text,
            "errors": errors
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
