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

// QR 인식 시 도장 저장 및 주소 정리
function processQR(n) {
  n = Number(n);
  if (n >= 1 && n <= 3) {
    if (!isCleared(n)) {
      cleared.push(n);
      cleared.sort((a, b) => a - b);
      save();
      
      // 알림 후 URL에서 ?mission=1 지워주어 깔끔하게 메인 상태로 유지
      setTimeout(() => {
        alert(`🎉 ZONE 0${n} 도장을 획득했습니다!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    }
  }
}

// 웹 화면 내 카메라 스캐너 시작
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
      // 💡 QR 인식 시, 해당 구역 주소로 '강제 페이지 이동(Location Redirect)' 수행!
      const match = decodedText.match(/mission=([1-3])/i);
      if (match && match[1]) {
        const missionNum = match[1];
        
        // 카메라를 끄고 바로 이동
        stopScanner().then(() => {
          window.location.href = `https://kimsoil.github.io/U-WHO-mission/?mission=${missionNum}`;
        });
      }
    },
    (errorMessage) => {
      // 스캔 중 단순 오류 무시
    }
  ).catch(err => {
    alert("카메라 접근 권한이 필요합니다.");
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
  // 접속 주소에 mission 번호가 있는지 확인
  const n = new URLSearchParams(window.location.search).get("mission");
  if (n) {
    processQR(n);
  }
  updateUI();
});
