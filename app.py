from flask import Flask, render_template, request, jsonify
from queue import Queue
import random
import time

app = Flask(__name__)

# Define waste categories
WASTE_TYPES = ["Plastic", "Organic", "Metal", "Glass", "Paper", "E-Waste"]

# Each type has its own queue
waste_bins = {wtype: Queue() for wtype in WASTE_TYPES}

# To store log messages
processing_log = []

def log(message):
    timestamp = time.strftime("%H:%M:%S")
    processing_log.append(f"[{timestamp}] {message}")
    # Keep log short
    if len(processing_log) > 50:
        processing_log.pop(0)

@app.route("/")
def index():
    return render_template("index.html", waste_types=WASTE_TYPES)

# API: Get current bins
@app.route("/api/bins")
def get_bins():
    bins_data = {w: list(waste_bins[w].queue) for w in WASTE_TYPES}
    return jsonify(bins_data)

# API: Generate random batch
@app.route("/api/generate", methods=["POST"])
def generate_batch():
    n = request.json.get("n", 10)
    batch = [random.choice(WASTE_TYPES) for _ in range(n)]
    log(f"Generated batch: {batch}")
    return jsonify({"batch": batch})

# API: Process a batch into queues
@app.route("/api/process", methods=["POST"])
def process_batch():
    items = request.json.get("items", [])
    for item in items:
        waste_bins[item].put(item)
        log(f"Enqueued {item}")
    return jsonify({"status": "processed"})

# API: Add one item
@app.route("/api/add", methods=["POST"])
def add_item():
    item = request.json.get("item")
    if item in waste_bins:
        waste_bins[item].put(item)
        log(f"Added single item: {item}")
        return jsonify({"status": "added"})
    return jsonify({"error": "Invalid item"}), 400

# API: Dequeue one item
@app.route("/api/dequeue/<wtype>", methods=["POST"])
def dequeue_item(wtype):
    if wtype in waste_bins and not waste_bins[wtype].empty():
        removed = waste_bins[wtype].get()
        log(f"Dequeued {removed} from {wtype}")
        return jsonify({"status": "dequeued", "item": removed})
    return jsonify({"error": "Queue empty"}), 400

# API: Reset system
@app.route("/api/reset", methods=["POST"])
def reset_system():
    for q in waste_bins.values():
        with q.mutex:
            q.queue.clear()
    processing_log.clear()
    log("System reset")
    return jsonify({"status": "reset"})

# API: Get log
@app.route("/api/log")
def get_log():
    return jsonify({"log": processing_log})

if __name__ == "__main__":
    app.run(debug=True)
python app.py
