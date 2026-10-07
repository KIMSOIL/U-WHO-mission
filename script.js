const TOTAL_MISSIONS = 3;
let cleared = JSON.parse(localStorage.getItem("uWhoMissionCleared") || "[]").map(Number);
let html5QrCode = null;
let isScanningHandled = false; // 중복 스캔 이동 방지 플래그

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
        // 주소창에서 ?mission=N 파라미터를 제거하여 깔끔한 메인 상태 유지
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 150);
    }
  }
}

// 실시간 웹 카메라 스캐너 시작
function startScanner() {
  isScanningHandled = false;
  const modal = document.getElementById("scannerModal");
  if (modal) modal.style.display = "flex";
  
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 220, height: 220 } },
    (decodedText) => {
      if (isScanningHandled) return; // 이미 인식되어 이동 중이면 무시

      // mission=1, mission=2, mission=3 매칭
      const match = decodedText.match(/mission=([1-3])/i);
      if (match && match[1]) {
        isScanningHandled = true; // 중복 감지 방지
        const missionNum = match[1];

        // 상대 경로로 이동 (현재 도메인/경로 유지)
        const targetSearch = `?mission=${missionNum}`;
        
        // 카메라 종료 여부와 상관없이 즉시 페이지 이동
        try {
          html5QrCode.stop().catch(() => {});
        } catch(e) {}
        
        window.location.search = targetSearch;
      }
    },
    (errorMessage) => {
      // 스캔 중 단순 미인식 오류 무시
    }
  ).catch(err => {
    alert("카메라 권한을 허용해 주셔야 스캔이 가능합니다.");
    if (modal) modal.style.display = "none";
  });
}

function stopScanner() {
  const modal = document.getElementById("scannerModal");
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      if (modal) modal.style.display = "none";
    }).catch(() => {
      if (modal) modal.style.display = "none";
    });
  } else {
    if (modal) modal.style.display = "none";
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
