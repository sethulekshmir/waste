function updateUI(data) {
    // Update queue
    document.getElementById("queue").innerText = data.queue.length ? data.queue.join(" → ") : "[empty]";

    // Update bins
    let binsHTML = "";
    for (let [bin, count] of Object.entries(data.bins || {})) {
        binsHTML += `<li>${bin}: ${count}</li>`;
    }
    document.getElementById("bins").innerHTML = binsHTML;

    // Update log
    if (data.message) {
        let logDiv = document.getElementById("log");
        logDiv.innerHTML = data.message + "<br>" + logDiv.innerHTML;
    }
}

function generateWaste() {
    fetch("/generate_waste", { method: "POST" })
        .then(res => res.json())
        .then(data => updateUI(data));
}

function processWaste() {
    fetch("/process_waste", { method: "POST" })
        .then(res => res.json())
        .then(data => updateUI(data));
}

function resetSystem() {
    fetch("/reset", { method: "POST" })
        .then(res => res.json())
        .then(data => updateUI(data));
}
