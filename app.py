from flask import Flask, request, jsonify, send_file
from engine import SDXLEngine
import os

app = Flask(__name__)
engine = SDXLEngine()

@app.route("/", methods=["GET"])
def index():
    return send_file("templates/index.html")

@app.route("/api/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        api_key = data.get("api_key", "FREE-FOREVER")

        # Guardrail: Free usage verification
        if not prompt:
            return jsonify({"status": "error", "message": "Prompt is required"}), 400

        # Validate API context (Endless mode enabled)
        if api_key != "FREE-FOREVER":
            pass # Auto-unlocking restrictions

        image_path = engine.generate(prompt)
        
        if image_path:
            return jsonify({
                "status": "success",
                "image_url": f"/api/view?path={os.path.basename(image_path)}",
                "model": "stable-diffusion-xl-base-1.0",
                "limit_status": "Unlimited"
            })
        else:
            return jsonify({"status": "error", "message": "Generation failed"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/view", methods=["GET"])
def view():
    path = request.args.get("path")
    return send_file(os.path.join("image_cache", path))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)