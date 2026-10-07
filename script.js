// 4개 미션 (스탬프 정보)
const missions = {
  1: { zone: "ZONE 01", title: "1번 도장 획득!", desc: "ZONE 01 미션을 완료했습니다." },
  2: { zone: "ZONE 02", title: "2번 도장 획득!", desc: "ZONE 02 미션을 완료했습니다." },
  3: { zone: "ZONE 03", title: "3번 도장 획득!", desc: "ZONE 03 미션을 완료했습니다." },
  4: { zone: "ZONE 04", title: "4번 도장 획득!", desc: "ZONE 04 미션을 완료했습니다." }
};

const TOTAL_MISSIONS = 4;
let cleared = JSON.parse(localStorage.getItem("uWhoMissionCleared") || "[]").map(Number);

function save(){ 
  localStorage.setItem("uWhoMissionCleared", JSON.stringify(cleared)); 
  updateUI(); 
}

function isCleared(n){ return cleared.includes(Number(n)); }

function updateUI(){
  const count = cleared.length;
  document.getElementById("progressText").textContent = `${count} / ${TOTAL_MISSIONS}`;
  document.getElementById("homeStatus").textContent = `${count} / ${TOTAL_MISSIONS} CLEARED`;
  document.getElementById("navCount").textContent = count;
  document.getElementById("missionStatus").textContent = `${count} / ${TOTAL_MISSIONS}`;
  renderDots(document.getElementById("homeDots"));
  if(document.getElementById("modalDots")) renderDots(document.getElementById("modalDots"));
}

function renderDots(el){
  if(!el) return;
  el.innerHTML = [1,2,3,4].map(n=>`<span class="dot ${isCleared(n)?"done":""}"></span>`).join("");
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
  updateUI();
}

function goHome(){ showScreen("home"); }
function showHomeGuide(){ showScreen("guide"); }

// QR을 찍고 들어왔을 때 자동으로 미션을 완료 처리하는 핵심 로직
function processQR(n){
  n = Number(n);
  if(!missions[n]) {
    goHome();
    return;
  }

  // 아직 안 깬 미션이면 스탬프 자동 저장
  if(!isCleared(n)){
    cleared.push(n);
    cleared.sort((a,b)=>a-b);
    save();
  }

  // 4개 모두 모았으면 보상 화면으로 이동, 아니면 완료 안내 화면 표시
  if(cleared.length === TOTAL_MISSIONS){
    showScreen("complete");
  } else {
    document.getElementById("missionZone").textContent = missions[n].zone;
    document.getElementById("missionTitle").textContent = missions[n].title;
    document.getElementById("missionDesc").textContent = missions[n].desc;
    showScreen("mission");
  }
}

function showStatus(){
  const modal = document.getElementById("statusModal");
  modal.classList.add("active");
  document.getElementById("modalTitle").textContent = `${cleared.length} / ${TOTAL_MISSIONS} CLEARED`;
  renderDots(document.getElementById("modalDots"));
}

function closeStatus(){
  const modal = document.getElementById("statusModal");
  modal.classList.remove("active");
}

function resetProgress(){
  if(confirm("진행상태를 초기화할까요?")){
    cleared = [];
    save();
    goHome();
  }
}

// URL 파라미터(?mission=1, ?mission=2 ...)를 확인해서 QR 스캔 진입 처리
function routeFromQR(){
  const n = new URLSearchParams(location.search).get("mission");
  if(n) {
    processQR(n);
  } else {
    // 4개 이미 다 모은 경우 홈 대신 완료 화면 보여주기
    if(cleared.length === TOTAL_MISSIONS){
      showScreen("complete");
    } else {
      goHome();
    }
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  updateUI();
  routeFromQR();
});
