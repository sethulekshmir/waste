from flask import Flask, render_template, jsonify, request
import random
from queue import Queue

app = Flask(__name__)

CATEGORIES = ["Plastic", "Metal", "Organic", "Glass"]

# Initialize bins and queue
bins = {cat: 0 for cat in CATEGORIES}
waste_queue = Queue()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_waste', methods=['POST'])
def generate_waste():
    # Generate one random waste and add to queue
    item = random.choice(CATEGORIES)
    waste_queue.put(item)
    return jsonify(item=item, queue=list(waste_queue.queue))

@app.route('/process_waste', methods=['POST'])
def process_waste():
    global bins
    if not waste_queue.empty():
        item = waste_queue.get()   # FIFO
        bins[item] += 1
        return jsonify(message=f"{item} added to {item} bin.", bins=bins, queue=list(waste_queue.queue))
    else:
        return jsonify(message="Queue is empty.", bins=bins, queue=[])

@app.route('/reset', methods=['POST'])
def reset():
    global bins, waste_queue
    bins = {cat: 0 for cat in CATEGORIES}
    waste_queue = Queue()
    return jsonify(message="System reset successfully", bins=bins, queue=[])

if __name__ == "__main__":
    app.run(debug=True)
