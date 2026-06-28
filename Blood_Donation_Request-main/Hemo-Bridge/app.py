from flask import Flask, render_template, request, jsonify

import random
import string
import time
import requests as req

app = Flask(__name__)


# ==========================================
# ===== IN-MEMORY STORAGE (No DB yet) ======
# ==========================================

donors = [
    { "name": "Akshay", "type": "O+", "age": 25, "phone": "+919876543210", "location": "Madhapur, Hyd", "distance": 1.2 },
    { "name": "Priya Sharma",   "type": "A+", "age": 29, "phone": "+918765432109", "location": "Secunderabad, Hyd", "distance": 2.4 },
    { "name": "Rajesh Kumar",   "type": "B+", "age": 31, "phone": "+917654321098", "location": "Gachibowli, Hyd", "distance": 3.8 },
    { "name": "Kiran Reddy",    "type": "O-", "age": 27, "phone": "+916543210987", "location": "Jubilee Hills, Hyd", "distance": 5.1 }
]

blood_requests = [
    { "name": "Ravi Kumar",     "type": "AB+", "units": 2, "hospital": "Care Hospital",   "location": "Banjara Hills", "urgency": "normal",   "time": "10 min ago" },
    { "name": "Sumit Sen",      "type": "A-",  "units": 4, "hospital": "Yashoda Hospital","location": "Somajiguda",    "urgency": "urgent",   "time": "23 min ago" },
    { "name": "Baby of Anitha", "type": "O-",  "units": 3, "hospital": "Apollo Hospital", "location": "Jubilee Hills", "urgency": "critical", "time": "5 min ago" }
]

blood_stock = {
    "O+": 85, "A+": 60, "B+": 45, "AB+": 95,
    "O-": 12, "A-": 30, "B-": 22, "AB-": 8
}

# OTP store: { phone: { otp, expires_at } }
otp_store = {}

# Gemini API Key (moved from frontend to backend for security)
GEMINI_API_KEY = ""
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
# ==========================================
# ========== HELPER FUNCTIONS ==============
# ==========================================

def generate_otp(length=4):
    return ''.join(random.choices(string.digits, k=length))

def success(data=None, message="Success"):
    return jsonify({ "status": "success", "message": message, "data": data })

def error(message="Error", code=400):
    return jsonify({ "status": "error", "message": message }), code


# ==========================================
# ============= MAIN ROUTE =================
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# =========== DONORS API ===================
# ==========================================

@app.route("/api/donors", methods=["GET"])
def get_donors():
    """
    GET /api/donors
    Query params:
      - blood_type : filter by blood type (e.g. O+)
      - search     : search by name or location
      - sort       : 'distance' or 'name'
    """
    blood_type = request.args.get("blood_type", "").strip()
    search     = request.args.get("search", "").lower().strip()
    sort_by    = request.args.get("sort", "distance")

    filtered = donors[:]  # copy

    # Filter by blood type
    if blood_type:
        filtered = [d for d in filtered if d["type"] == blood_type]

    # Filter by search keyword
    if search:
        filtered = [
            d for d in filtered
            if search in d["name"].lower() or search in d["location"].lower()
        ]

    # Sort
    if sort_by == "name":
        filtered.sort(key=lambda d: d["name"])
    else:
        filtered.sort(key=lambda d: d["distance"])

    return success(filtered)


@app.route("/api/donors", methods=["POST"])
def register_donor():
    """
    POST /api/donors
    Body (JSON):
      name, type, age, phone, location
    """
    data = request.get_json()

    # Validate required fields
    required = ["name", "type", "age", "phone", "location"]
    for field in required:
        if not data or not data.get(field):
            return error(f"Missing field: {field}")

    name     = data["name"].strip()
    btype    = data["type"].strip()
    age      = int(data["age"])
    phone    = data["phone"].strip()
    location = data["location"].strip()

    # Validation rules
    if age < 18 or age > 65:
        return error("Donor age must be between 18 and 65.")

    valid_types = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    if btype not in valid_types:
        return error("Invalid blood type.")

    # Check duplicate phone
    for d in donors:
        if d["phone"] == phone:
            return error("A donor with this phone number already exists.")

    # Create donor
    new_donor = {
        "name":     name,
        "type":     btype,
        "age":      age,
        "phone":    phone,
        "location": location,
        "distance": round(random.uniform(0.5, 10.0), 1)  # Random until GPS provided
    }

    donors.append(new_donor)
    return success(new_donor, "Donor registered successfully!")


# ==========================================
# =========== REQUESTS API =================
# ==========================================

@app.route("/api/requests", methods=["GET"])
def get_requests():
    """
    GET /api/requests
    Returns all active blood requests sorted by urgency (critical first)
    """
    urgency_order = {"critical": 0, "urgent": 1, "normal": 2}
    sorted_requests = sorted(
        blood_requests,
        key=lambda r: urgency_order.get(r["urgency"], 3)
    )
    return success(sorted_requests)


@app.route("/api/requests", methods=["POST"])
def submit_request():
    """
    POST /api/requests
    Body (JSON):
      name, type, units, phone, hospital, location, urgency
    Note: OTP must be verified before calling this endpoint.
    """
    data = request.get_json()

    required = ["name", "type", "units", "phone", "hospital", "location", "urgency"]
    for field in required:
        if not data or not data.get(field):
            return error(f"Missing field: {field}")

    name     = data["name"].strip()
    btype    = data["type"].strip()
    units    = int(data["units"])
    phone    = data["phone"].strip()
    hospital = data["hospital"].strip()
    location = data["location"].strip()
    urgency  = data["urgency"].strip()

    valid_urgencies = ["normal", "urgent", "critical"]
    if urgency not in valid_urgencies:
        return error("Invalid urgency level.")

    valid_types = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    if btype not in valid_types:
        return error("Invalid blood type.")

    if units < 1 or units > 10:
        return error("Units must be between 1 and 10.")

    new_request = {
        "name":     name,
        "type":     btype,
        "units":    units,
        "phone":    phone,
        "hospital": hospital,
        "location": location,
        "urgency":  urgency,
        "time":     "Just now"
    }

    blood_requests.insert(0, new_request)  # Add to top
    return success(new_request, "Blood request submitted successfully!")


# ==========================================
# ============= OTP API ====================
# ==========================================

@app.route("/api/otp/send", methods=["POST"])
def send_otp():
    """
    POST /api/otp/send
    Body (JSON): { "phone": "9876543210" }
    Generates a 4-digit OTP valid for 5 minutes.
    (SMS sending needs Twilio/Fast2SMS — simulated for now)
    """
    data = request.get_json()
    phone = data.get("phone", "").strip() if data else ""

    if not phone or len(phone) < 10:
        return error("Please provide a valid phone number.")

    otp = generate_otp()
    expires_at = time.time() + 300  # 5 minutes from now

    otp_store[phone] = {
        "otp": otp,
        "expires_at": expires_at
    }

    # TODO: Integrate Twilio/Fast2SMS here to send real SMS
    # For now we print to console (development mode)
    print(f"[HemoBridge OTP] Phone: {phone} | OTP: {otp}")

    # In production: remove otp from response!
    # Returning it now so frontend can test without SMS service
    return success(
        { "otp_preview": otp },  # REMOVE in production
        f"OTP sent to {phone}"
    )


@app.route("/api/otp/verify", methods=["POST"])
def verify_otp():
    """
    POST /api/otp/verify
    Body (JSON): { "phone": "9876543210", "otp": "1234" }
    """
    data = request.get_json()
    phone = data.get("phone", "").strip() if data else ""
    otp   = data.get("otp", "").strip() if data else ""

    if not phone or not otp:
        return error("Phone and OTP are required.")

    record = otp_store.get(phone)

    if not record:
        return error("No OTP found for this number. Please request a new one.")

    if time.time() > record["expires_at"]:
        del otp_store[phone]
        return error("OTP has expired. Please request a new one.")

    if record["otp"] != otp:
        return error("Incorrect OTP. Please try again.")

    # OTP verified — remove from store (one-time use)
    del otp_store[phone]
    return success(None, "OTP verified successfully!")


# ==========================================
# =========== BLOOD STOCK API ==============
# ==========================================

@app.route("/api/blood-stock", methods=["GET"])
def get_blood_stock():
    """
    GET /api/blood-stock
    Returns current blood stock levels for all types.
    """
    return success(blood_stock)


@app.route("/api/blood-stock", methods=["POST"])
def update_blood_stock():
    """
    POST /api/blood-stock
    Body (JSON): { "type": "O+", "units": 90 }
    Update stock for a specific blood type (admin use).
    """
    data = request.get_json()
    btype = data.get("type", "").strip() if data else ""
    units = data.get("units")

    if btype not in blood_stock:
        return error("Invalid blood type.")

    if units is None or int(units) < 0:
        return error("Units must be a non-negative number.")

    blood_stock[btype] = int(units)
    return success(blood_stock, f"Blood stock for {btype} updated to {units} units.")


# ==========================================
# =========== GEOCODING PROXY ==============
# ==========================================

@app.route("/api/geocode", methods=["GET"])
def geocode():
    """
    GET /api/geocode?lat=17.4483&lon=78.3741
    Proxies Nominatim reverse geocoding through backend.
    Avoids CORS issues and rate limits on frontend.
    """
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return error("lat and lon are required.")

    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
        response = req.get(url, headers={
            "Accept-Language": "en",
            "User-Agent": "HemoBridgeApp/1.0"
        }, timeout=5)
        data = response.json()

        if data and data.get("display_name"):
            parts = data["display_name"].split(", ")
            short_address = ", ".join(parts[:3])
            return success({ "address": short_address, "full": data["display_name"] })
        else:
            return success({ "address": f"{lat}, {lon}", "full": f"{lat}, {lon}" })

    except Exception as e:
        print(f"Geocoding error: {e}")
        return success({ "address": f"{lat}, {lon}", "full": f"{lat}, {lon}" })


# ==========================================
# =========== GEMINI CHAT PROXY ============
# ==========================================

@app.route("/api/chat", methods=["POST"])
def chat_proxy():
    """
    POST /api/chat
    Body (JSON):
      {
        "message": "Who needs blood urgently?",
        "history": [ { "role": "user", "parts": [{"text": "..."}] }, ... ],
        "app_state": {
          "donors": [...],
          "requests": [...],
          "blood_stock": {...},
          "current_address": "...",
          "coordinates": "..."
        }
      }
    Proxies Gemini API — keeps API key safe on server side.
    """
    data = request.get_json()

    if not data or not data.get("message"):
        return error("Message is required.")

    message     = data["message"]
    history     = data.get("history", [])
    app_state   = data.get("app_state", {})

    # Build system prompt with live app state
    system_prompt = f"""You are HemoBot, a friendly virtual assistant for Hemo-Bridge — India's fastest blood matching network.

LIVE APP STATE:
- Blood Stock: {app_state.get('blood_stock', blood_stock)}
- Registered Donors: {app_state.get('donors', donors)}
- Emergency Requests: {app_state.get('requests', blood_requests)}
- User Location: {app_state.get('current_address', 'Not tracked')}
- Coordinates: {app_state.get('coordinates', 'Not tracked')}

RULES:
1. Be helpful, concise, and empathetic.
2. For nearest donors, sort by distance and suggest contacting via the Donors page.
3. Mention critical/urgent requests when relevant.
4. Explain blood compatibility correctly. O- is universal donor, AB+ is universal recipient.
5. Never hallucinate data not in the live state above.
"""

  # Build request body for Gemini
    gemini_body = {
        "contents": history + [{ "role": "user", "parts": [{ "text": message }] }],
        "systemInstruction": {
            "parts": [{ "text": system_prompt }]
        },
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 500
        }
    }

    try:
        response = req.post(
            GEMINI_URL,
            json=gemini_body,
            headers={
                "Authorization": f"Bearer {GEMINI_API_KEY}",
                "Content-Type": "application/json"
            },
            timeout=15
        )
        gemini_data = response.json()
        print("=" * 50)
        print("GEMINI STATUS CODE:", response.status_code)
        print("GEMINI RAW RESPONSE:", gemini_data)
        print("=" * 50)

        candidates = gemini_data.get("candidates", [])
        if candidates and candidates[0].get("content"):
            bot_reply = candidates[0]["content"]["parts"][0]["text"]
            return success({ "reply": bot_reply })
        else:
            print("Gemini unexpected response:", gemini_data)
            return error("HemoBot could not generate a response. Please try again.")

    except Exception as e:
        print(f"Gemini proxy error: {e}")
        return error("HemoBot is temporarily unavailable.")
    
# ==========================================
# =============== RUN ======================
# ==========================================

import os
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
