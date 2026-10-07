const TOTAL_MISSIONS = 3;
let cleared = JSON.parse(localStorage.getItem("uWhoMissionCleared") || "[]").map(Number);
let html5QrCode = null;

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
  if (n >= 1 && n <= 3 && !isCleared(n)) {
    cleared.push(n);
    cleared.sort((a, b) => a - b);
    save();
    alert(`ZONE 0${n} 도장을 획득했습니다!`);
  }
}

// 실시간 카메라 스캐너 시작
function startScanner() {
  document.getElementById("scannerModal").style.display = "flex";
  
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  html5QrCode.start(
    { facingMode: "environment" }, // 후면 카메라 우선
    { fps: 10, qrbox: { width: 220, height: 220 } },
    (decodedText) => {
      // QR을 읽었을 때 실행
      try {
        const url = new URL(decodedText);
        const missionNum = url.searchParams.get("mission");
        if (missionNum) {
          processQR(missionNum);
          stopScanner();
        }
      } catch (e) {
        // 주소 형태가 아닐 경우 처리하지 않음
      }
    },
    (errorMessage) => {
      // 스캔 중 오류는 무시 (지속 스캔)
    }
  ).catch(err => {
    alert("카메라 권한을 허용해 주셔야 스캔이 가능합니다.");
    stopScanner();
  });
}

// 카메라 끄기
function stopScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      document.getElementById("scannerModal").style.display = "none";
    }).catch(() => {
      document.getElementById("scannerModal").style.display = "none";
    });
  } else {
    document.getElementById("scannerModal").style.display = "none";
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
