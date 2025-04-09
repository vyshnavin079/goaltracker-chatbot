from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

genai.configure(api_key="AIzaSyDi9dguUXe03mjj1eayIFMALyJpIq_Fb4A")
model = genai.GenerativeModel("gemini-2.0-flash")

@app.route("/")
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory('.', path)

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        prompt = data.get("contents")[0]["parts"][0]["text"]
        response = model.generate_content(prompt)
        if response and response.text:
            return jsonify({"text": response.text})
        else:
            return jsonify({"text": "I apologize, I couldn't generate a response."}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"text": "An error occurred while processing your request."}), 500

if __name__ == "__main__":
    app.run(port=3000, debug=True)