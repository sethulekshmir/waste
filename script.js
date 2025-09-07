async function fetchBins() {
  const res = await fetch("/api/bins");
  const data = await res.json();
  const binsDiv = document.getElementById("bins");
  binsDiv.innerHTML = "";

  for (const [type, items] of Object.entries(data)) {
    const div = document.createElement("div");
    div.className = "bin";
    div.innerHTML = `<h3>${type}</h3><p>${items.join(", ") || "Empty"}</p>
                     <button onclick="dequeueItem('${type}')">Dequeue</button>`;
    binsDiv.appendChild(div);
  }
}

async function fetchLog() {
  const res = await fetch("/api/log");
  const data = await res.json();
  document.getElementById("log").textContent = data.log.join("\n");
}

async function generateBatch() {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n: 8 })
  });
  const data = await res.json();
  const container = document.getElementById("batchContainer");
  container.innerHTML = data.batch.map(item => `<span>${item}</span>`).join(" ");
  container.dataset.items = JSON.stringify(data.batch);
  fetchLog();
}

async function processBatch() {
  const container = document.getElementById("batchContainer");
  const items = JSON.parse(container.dataset.items || "[]");
  if (items.length === 0) return alert("No batch to process!");

  await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  container.innerHTML = "";
  container.dataset.items = "[]";
  fetchBins();
  fetchLog();
}

async function dequeueItem(type) {
  await fetch(`/api/dequeue/${type}`, { method: "POST" });
  fetchBins();
  fetchLog();
}

async function resetSystem() {
  await fetch("/api/reset", { method: "POST" });
  document.getElementById("batchContainer").innerHTML = "";
  fetchBins();
  fetchLog();
}

setInterval(() => {
  fetchBins();
  fetchLog();
}, 2000);

fetchBins();
fetchLog();
