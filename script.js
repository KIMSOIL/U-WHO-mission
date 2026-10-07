const missions = {
  1: {
    zone: "ZONE 01",
    title: "작품 속 꽃을 찾아보세요.",
    desc: "ZONE 01의 작품들을 천천히 둘러보세요. 작품 속에 숨겨진 꽃 모양을 발견했다면 정답을 선택하세요.",
    type: "choice",
    question: "작품을 둘러보며 발견한 꽃은 몇 개였나요?",
    options: ["2개", "3개", "4개", "5개"],
    answer: "3개",
    hint: "※ 임시 미션입니다. 실제 전시에서는 숨겨진 요소의 개수를 바꿔주세요."
  },
  2: {
    zone: "ZONE 02",
    title: "전시 속 단서를 찾아보세요.",
    desc: "ZONE 02의 작품들을 살펴보고, 여러 작품에서 반복해서 등장하는 하나의 키워드를 찾아보세요.",
    type: "text",
    question: "작품들에서 발견한 공통 키워드를 입력하세요.",
    answer: ["BLOOM", "꽃", "BLOOMING"],
    hint: "힌트: 이번 전시의 핵심 이미지와 연결되는 단어입니다."
  },
  3: {
    zone: "ZONE 03",
    title: "마지막 단서를 완성하세요.",
    desc: "ZONE 03을 충분히 둘러본 뒤, 전시장 곳곳에서 본 요소들을 떠올려 마지막 문장을 완성해보세요.",
    type: "choice",
    question: "이번 전시에서 작품이 피어나는 과정을 가장 잘 표현한 것은?",
    options: ["관찰 → 기록 → 보관", "고민 → 제작 → 수정 → 완성", "수집 → 판매 → 배송", "검색 → 복사 → 저장"],
    answer: "고민 → 제작 → 수정 → 완성",
    hint: "※ 임시 미션입니다. 실제 전시의 스토리에 맞게 교체해주세요."
  }
};

let currentMission = null;
let cleared = JSON.parse(localStorage.getItem("uWhoMissionCleared") || "[]").map(Number);

function save(){ localStorage.setItem("uWhoMissionCleared", JSON.stringify(cleared)); updateUI(); }
function isCleared(n){ return cleared.includes(Number(n)); }

function updateUI(){
  const count = cleared.length;
  document.getElementById("progressText").textContent = `${count} / 3`;
  document.getElementById("homeStatus").textContent = `${count} / 3 CLEARED`;
  document.getElementById("navCount").textContent = count;
  document.getElementById("missionStatus").textContent = `${count} / 3`;
  renderDots(document.getElementById("homeDots"));
  if(document.getElementById("modalDots")) renderDots(document.getElementById("modalDots"));
}

function renderDots(el){
  if(!el) return;
  el.innerHTML = [1,2,3].map(n=>`<span class="dot ${isCleared(n)?"done":""}"></span>`).join("");
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
  updateUI();
}

function goHome(){ showScreen("home"); }
function showHomeGuide(){ showScreen("guide"); }

function openMission(n){
  n = Number(n);
  if(!missions[n]) return;
  currentMission = n;
  const m = missions[n];
  document.getElementById("missionZone").textContent = m.zone;
  document.getElementById("missionEyebrow").textContent = `MISSION ${String(n).padStart(2,"0")}`;
  document.getElementById("missionTitle").textContent = m.title;
  document.getElementById("missionDesc").textContent = m.desc;
  const area = document.getElementById("missionContent");
  const feedback = document.getElementById("feedback");
  feedback.className = "feedback";
  feedback.textContent = "";

  if(isCleared(n)){
    area.innerHTML = `<div class="clear-box"><div class="clear-icon">✓</div><h3>MISSION CLEAR</h3><p>이미 완료한 미션입니다.</p></div>`;
    showScreen("mission");
    return;
  }

  if(m.type === "choice"){
    area.innerHTML = `<div class="mission-card"><div class="question">${m.question}</div><div class="options">${m.options.map(o=>`<button class="option" onclick="answerChoice('${escapeAttr(o)}')">${o}</button>`).join("")}</div><p class="hint">${m.hint}</p></div>`;
  } else {
    area.innerHTML = `<div class="mission-card"><div class="question">${m.question}</div><input id="answerInput" class="text-input" placeholder="정답을 입력하세요" autocomplete="off"><button class="submit" onclick="answerText()">정답 제출</button><p class="hint">${m.hint}</p></div>`;
  }
  showScreen("mission");
}

function escapeAttr(s){ return s.replaceAll("'","&#39;"); }

function answerChoice(value){
  const m = missions[currentMission];
  if(value === m.answer) clearMission(currentMission);
  else fail("아쉽습니다. 전시를 조금 더 살펴보고 다시 시도해보세요.");
}

function answerText(){
  const input = document.getElementById("answerInput");
  const value = (input.value || "").trim().toUpperCase();
  const m = missions[currentMission];
  const ok = m.answer.some(a => value === a.toUpperCase());
  if(ok) clearMission(currentMission);
  else fail("정답이 아닙니다. 작품 속 단서를 다시 찾아보세요.");
}

function fail(msg){
  const f = document.getElementById("feedback");
  f.className = "feedback no";
  f.textContent = "✕ " + msg;
}

function clearMission(n){
  if(!isCleared(n)) cleared.push(Number(n));
  cleared.sort((a,b)=>a-b);
  save();
  const f = document.getElementById("feedback");
  f.className = "feedback ok";
  f.textContent = "✓ MISSION CLEAR!";
  setTimeout(()=>{
    if(cleared.length === 3) showScreen("complete");
    else openMission(n);
  }, 700);
}

// 모달 표시 방식 수정 (hidden 대신 classList 제어)
function showStatus(){
  const modal = document.getElementById("statusModal");
  modal.classList.add("active");
  document.getElementById("modalTitle").textContent = `${cleared.length} / 3 CLEARED`;
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

// QR 주소의 ?mission=1, ?mission=2, ?mission=3을 읽어서 해당 미션으로 바로 진입
function routeFromQR(){
  const n = new URLSearchParams(location.search).get("mission");
  if(n && missions[n]) openMission(Number(n));
  else goHome();
}

document.addEventListener("DOMContentLoaded", ()=>{
  updateUI();
  routeFromQR();
});
