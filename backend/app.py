from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)


# ---------------- AI EVENT CLASSIFICATION ----------------

def classify_event(event_text):
    text = event_text.lower()

    university_keywords = [
        "university",
        "college",
        "campus",
        "igdtuw",
        "dtu",
        "nsut",
        "student club",
        "department",
        "institute",
        "auditorium"
    ]

    for keyword in university_keywords:
        if keyword in text:
            return "University Event"

    return "External Event"


# ---------------- HOME ROUTE ----------------

@app.route("/")
def home():
    return jsonify({
        "message": "KHOJ backend is connected!"
    })


# ---------------- TEST DATABASE ----------------

@app.route("/test-db")
def test_db():
    try:
        response = supabase.table("events").select("*").execute()

        return jsonify({
            "message": "Database connection successful!",
            "events": response.data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- GET APPROVED EVENTS ----------------

@app.route("/events", methods=["GET"])
def get_events():
    try:
        response = supabase.table("events") \
            .select("*") \
            .eq("status", "approved") \
            .execute()

        return jsonify({
            "events": response.data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- GET PENDING EVENTS ----------------

@app.route("/pending-events", methods=["GET"])
def get_pending_events():
    try:
        response = supabase.table("events") \
            .select("*") \
            .eq("status", "pending") \
            .execute()

        return jsonify({
            "pending_events": response.data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- ADD NEW EVENT ----------------

@app.route("/add-event", methods=["POST"])
def add_event():
    try:
        data = request.get_json()

        response = supabase.table("events").insert({
            "title": data.get("title"),
            "description": data.get("description"),
            "event_type": data.get("event_type"),
            "organizer": data.get("organizer"),
            "category": data.get("category"),
            "event_date": data.get("event_date"),
            "registration_deadline": data.get("registration_deadline"),
            "mode": data.get("mode"),
            "venue": data.get("venue"),
            "is_paid": data.get("is_paid", False),
            "fee": data.get("fee", 0),
            "official_link": data.get("official_link"),
            "registration_link": data.get("registration_link"),
            "ai_summary": data.get("ai_summary"),
            "status": "pending"
        }).execute()

        return jsonify({
            "message": "Event submitted successfully!",
            "event": response.data
        }), 201

    except Exception as error:
        print("ADD EVENT ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500


# ---------------- APPROVE EVENT ----------------

@app.route("/approve-event/<event_id>", methods=["PATCH"])
def approve_event(event_id):
    try:
        response = supabase.table("events") \
            .update({"status": "approved"}) \
            .eq("id", event_id) \
            .execute()

        if not response.data:
            return jsonify({
                "error": "Event not found!"
            }), 404

        return jsonify({
            "message": "Event approved successfully!",
            "event": response.data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- REJECT EVENT ----------------

@app.route("/reject-event/<event_id>", methods=["PATCH"])
def reject_event(event_id):
    try:
        response = supabase.table("events") \
            .update({"status": "rejected"}) \
            .eq("id", event_id) \
            .execute()

        if not response.data:
            return jsonify({
                "error": "Event not found!"
            }), 404

        return jsonify({
            "message": "Event rejected successfully!",
            "event": response.data
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- AI CLASSIFICATION API ----------------

@app.route("/classify-event", methods=["POST"])
def classify_event_api():
    try:
        data = request.get_json()

        title = data.get("title", "")
        description = data.get("description", "")
        organizer = data.get("organizer", "")
        venue = data.get("venue", "")

        event_text = f"{title} {description} {organizer} {venue}"

        event_type = classify_event(event_text)

        return jsonify({
            "message": "Event classified successfully!",
            "event_type": event_type
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":
    app.run(debug=True)