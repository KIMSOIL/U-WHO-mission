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
  
  const progressText = document.getElementById("progressText");
  const flowerCenterText = document.getElementById("flowerCenterText");
  if (progressText) progressText.textContent = `${count} / ${TOTAL_MISSIONS}`;
  if (flowerCenterText) flowerCenterText.textContent = count === TOTAL_MISSIONS ? "✿" : `${count}/3`;

  [1, 2, 3].forEach(n => {
    const petal = document.getElementById(`petal${n}`);
    if (petal) {
      if (isCleared(n)) {
        petal.classList.add("active");
      } else {
        petal.classList.remove("active");
      }
    }
  });

  const zones = ["A", "B", "C"];
  zones.forEach((z, idx) => {
    const el = document.getElementById(`zone${z}`);
    if (el) {
      if (isCleared(idx + 1)) {
        el.classList.add("done");
        el.querySelector("strong").textContent = "완료 ✓";
      } else {
        el.classList.remove("done");
        el.querySelector("strong").textContent = "미완료";
      }
    }
  });

  const rewardSec = document.getElementById("rewardSection");
  if (rewardSec) {
    rewardSec.style.display = count === TOTAL_MISSIONS ? "block" : "none";
  }
}

function processQR(n) {
  n = Number(n);
  if (n >= 1 && n <= 3) {
    if (!isCleared(n)) {
      cleared.push(n);
      cleared.sort((a, b) => a - b);
      save();
      
      setTimeout(() => {
        alert(`🎉 ZONE 0${n} 도장을 획득했습니다!`);
        // 주소창의 ?mission=N 제거하여 메인 상태로 깔끔하게 정리
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 100);
    }
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
