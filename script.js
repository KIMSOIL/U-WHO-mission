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
  document.getElementById("missionStatus").textContent = `${count} / ${TOTAL_MISSIONS}`;
  renderDots(document.getElementById("homeDots"));
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

// QR 스캔 시 자동으로 미션 완료 처리
function processQR(n){
  n = Number(n);
  if(!missions[n]) {
    goHome();
    return;
  }

  if(!isCleared(n)){
    cleared.push(n);
    cleared.sort((a,b)=>a-b);
    save();
  }

  if(cleared.length === TOTAL_MISSIONS){
    showScreen("complete");
  } else {
    document.getElementById("missionZone").textContent = missions[n].zone;
    document.getElementById("missionTitle").textContent = missions[n].title;
    document.getElementById("missionDesc").textContent = missions[n].desc;
    showScreen("mission");
  }
}

function resetProgress(){
  if(confirm("진행상태를 초기화할까요?")){
    cleared = [];
    save();
    goHome();
  }
}

function routeFromQR(){
  const n = new URLSearchParams(location.search).get("mission");
  if(n) {
    processQR(n);
  } else {
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
