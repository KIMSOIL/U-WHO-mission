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
  
  // 헤더 및 중앙 카운터
  const progressText = document.getElementById("progressText");
  const flowerCenterText = document.getElementById("flowerCenterText");
  if (progressText) progressText.textContent = `${count} / ${TOTAL_MISSIONS}`;
  if (flowerCenterText) flowerCenterText.textContent = count === TOTAL_MISSIONS ? "✿" : `${count}/3`;

  // 꽃잎 활성화
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

  // 하단 A, B, C 구역 상태 표시
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

  // 보상 영역
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
      alert(`🎉 ZONE 0${n} 도장이 채워졌습니다!`);
    } else {
      alert(`이미 도장을 받은 ZONE 0${n} 구역입니다.`);
    }
  }
}

// 실시간 카메라 스캐너 시작
function startScanner() {
  const modal = document.getElementById("scannerModal");
  if (modal) modal.style.display = "flex";
  
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 220, height: 220 } },
    (decodedText) => {
      // 💡 정규식을 사용해 주소 형태에 상관없이 mission=1, mission=2, mission=3 인식을 감지
      const match = decodedText.match(/mission=([1-3])/i);
      
      if (match && match[1]) {
        const missionNum = Number(match[1]);
        
        // 스캐너 중지 후 도장 처리 진행
        stopScanner().then(() => {
          processQR(missionNum);
        });
      }
    },
    (errorMessage) => {
      // 스캔 도중 미인식 오류 무시
    }
  ).catch(err => {
    alert("카메라 접근 권한을 허용해 주세요.");
    if (modal) modal.style.display = "none";
  });
}

// 카메라 끄기
function stopScanner() {
  return new Promise((resolve) => {
    const modal = document.getElementById("scannerModal");
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().then(() => {
        if (modal) modal.style.display = "none";
        resolve();
      }).catch(() => {
        if (modal) modal.style.display = "none";
        resolve();
      });
    } else {
      if (modal) modal.style.display = "none";
      resolve();
    }
  });
}

function resetProgress() {
  if (confirm("진행상태를 초기화하시겠습니까?")) {
    cleared = [];
    save();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 주소창 파라미터 체크 (?mission=1 등)
  const n = new URLSearchParams(window.location.search).get("mission");
  if (n) {
    processQR(n);
  }
  updateUI();
});
