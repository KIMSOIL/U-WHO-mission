// 미션 3개 (A, B, C 구역)
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
  
  // 카운터 업데이트
  document.getElementById("progressText").textContent = `${count} / ${TOTAL_MISSIONS}`;
  document.getElementById("flowerCenterText").textContent = count === 3 ? "✿" : `${count}/3`;

  // 꽃잎 애니메이션 상태 업데이트
  [1, 2, 3].forEach(n => {
    const petal = document.getElementById(`petal${n}`);
    if (isCleared(n)) {
      petal.classList.add("active");
    } else {
      petal.classList.remove("active");
    }
  });

  // 구역별 텍스트 업데이트
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

  // 3개 모았을 때 보상 영역 표시
  const rewardSec = document.getElementById("rewardSection");
  if (count === TOTAL_MISSIONS) {
    rewardSec.style.display = "block";
  } else {
    rewardSec.style.display = "none";
  }
}

// QR 스캔 진입 처리 (?mission=1 -> A, ?mission=2 -> B, ?mission=3 -> C)
function processQR(n) {
  n = Number(n);
  if (n >= 1 && n <= 3 && !isCleared(n)) {
    cleared.push(n);
    cleared.sort((a, b) => a - b);
    save();
    
    // 주소창 깔끔하게 제거 (?mission=1 파라미터 삭제)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// 모바일 기본 카메라 열기 호출
function openCamera() {
  // 모바일 환경에서 기본 카메라 또는 QR 스캐너를 띄우도록 모바일 intent 호출
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    alert("기본 카메라 App을 열어 전시장 QR을 스캔해주세요!");
  } else {
    alert("모바일 기기의 기본 카메라 앱으로 전시장 QR을 스캔해 주세요.");
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
