const BIN_CAPACITY = 20;
const bins = { biodegradable: 0, recyclable: 0, hazardous: 0 };

const sizeUnits = { small: 1, medium: 2, large: 3 };
const wasteClassification = {
  organic: "biodegradable",
  paper: "biodegradable",
  plastic: "recyclable",
  metal: "recyclable",
  glass: "recyclable",
  chemical: "hazardous"
};

document.getElementById("wasteForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const size = document.getElementById("wasteSize").value;
  const material = document.getElementById("wasteMaterial").value;

  if (!(size in sizeUnits) || !(material in wasteClassification)) {
    showMessage("❌ Invalid input", "red");
    return;
  }

  const binType = wasteClassification[material];
  const units = sizeUnits[size];

  if (bins[binType] + units <= BIN_CAPACITY) {
    bins[binType] += units;
    showMessage(`✅ Added ${units} units of ${material} to ${binType} bin`, "green");
  } else {
    showMessage(`⚠️ ${capitalize(binType)} bin is full!`, "orange");
  }
  updateBins();
});

function updateBins() {
  document.getElementById("bioCount").innerText = bins.biodegradable;
  document.getElementById("recycleCount").innerText = bins.recyclable;
  document.getElementById("hazardCount").innerText = bins.hazardous;

  document.getElementById("bioBar").style.width = (bins.biodegradable / BIN_CAPACITY * 100) + "%";
  document.getElementById("recycleBar").style.width = (bins.recyclable / BIN_CAPACITY * 100) + "%";
  document.getElementById("hazardBar").style.width = (bins.hazardous / BIN_CAPACITY * 100) + "%";
}

function showMessage(msg, color) {
  const m = document.getElementById("message");
  m.innerText = msg;
  m.style.color = color;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
