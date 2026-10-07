const TOTAL_MISSIONS = 3;
let cleared = JSON.parse(localStorage.getItem("uWhoMissionCleared") || "[]").map(Number);

function save() {
  localStorage.setItem("uWhoMissionCleared", JSON.stringify(cleared));
  updateUI();
}

function isCleared(n) {
  return cleared.includes(Number(n));
}

function updateUI() {
  const count = cleared.length;
  
  document.getElementById("progressText").textContent = `${count} / ${TOTAL_MISSIONS}`;
  document.getElementById("flowerCenterText").textContent = count === TOTAL_MISSIONS ? "✿" : `${count}/3`;

  [1, 2, 3].forEach(n => {
    const petal = document.getElementById(`petal${n}`);
    if (isCleared(n)) {
      petal.classList.add("active");
    } else {
      petal.classList.remove("active");
    }
  });

  const zones = ["A", "B", "C"];
  zones.forEach((z, idx) => {
    const el = document.getElementById(`zone${z}`);
    if (isCleared(idx + 1)) {
      el.classList.add("done");
      el.querySelector("strong").textContent = "완료 ✓";
    } else {
      el.classList.remove("done");
      el.querySelector("strong").textContent = "미완료";
    }
  });

  const rewardSec = document.getElementById("rewardSection");
  if (count === TOTAL_MISSIONS) {
    rewardSec.style.display = "block";
  } else {
    rewardSec.style.display = "none";
  }
}

function processQR(n) {
  n = Number(n);
  if (n >= 1 && n <= 3 && !isCleared(n)) {
    cleared.push(n);
    cleared.sort((a, b) => a - b);
    save();
  }
}

function resetProgress() {
  if (confirm("진행상태를 초기화하시겠습니까?")) {
    cleared = [];
    save();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const n = new URLSearchParams(window.location.search).get("mission");
  if (n) {
    processQR(n);
  }
  updateUI();
});
