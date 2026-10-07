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
options: [
"관찰 → 기록 → 보관",
"고민 → 제작 → 수정 → 완성",
"수집 → 판매 → 배송",
"검색 → 복사 → 저장"
],
answer: "고민 → 제작 → 수정 → 완성",
hint: "※ 임시 미션입니다. 실제 전시의 스토리에 맞게 교체해주세요."
}
};

// 현재 미션
let currentMission = null;

// 완료한 미션 불러오기
let cleared = JSON.parse(
localStorage.getItem("uWhoMissionCleared") || "[]"
).map(Number);

// 진행상태 저장
function save() {
localStorage.setItem(
"uWhoMissionCleared",
JSON.stringify(cleared)
);

updateUI();
}

// 미션 완료 여부
function isCleared(n) {
return cleared.includes(Number(n));
}

// 화면의 진행상태 업데이트
function updateUI() {
const count = cleared.length;

const progressText = document.getElementById("progressText");
const homeStatus = document.getElementById("homeStatus");
const navCount = document.getElementById("navCount");
const missionStatus = document.getElementById("missionStatus");

if (progressText) {
progressText.textContent = `${count} / 3`;
}

if (homeStatus) {
homeStatus.textContent = `${count} / 3 CLEARED`;
}

if (navCount) {
navCount.textContent = count;
}

if (missionStatus) {
missionStatus.textContent = `${count} / 3`;
}

renderDots(document.getElementById("homeDots"));
renderDots(document.getElementById("modalDots"));
}

// 진행상태 점 표시
function renderDots(el) {
if (!el) return;

el.innerHTML = [1, 2, 3]
.map(
n =>
`<span class="dot ${isCleared(n) ? "done" : ""}"></span>`
)
.join("");
}

// 화면 이동
function showScreen(id) {
document
.querySelectorAll(".screen")
.forEach(screen => screen.classList.remove("active"));

const target = document.getElementById(id);

if (target) {
target.classList.add("active");
}

window.scrollTo({
top: 0,
behavior: "smooth"
});

updateUI();
}

// 홈
function goHome() {
showScreen("home");
}

// 홈 안내
function showHomeGuide() {
showScreen("guide");
}

// 미션 열기
function openMission(n) {
n = Number(n);

if (!missions[n]) return;

currentMission = n;

const m = missions[n];

document.getElementById("missionZone").textContent = m.zone;

document.getElementById("missionEyebrow").textContent =
`MISSION ${String(n).padStart(2, "0")}`;

document.getElementById("missionTitle").textContent =
m.title;

document.getElementById("missionDesc").textContent =
m.desc;

const area = document.getElementById("missionContent");
const feedback = document.getElementById("feedback");

feedback.className = "feedback";
feedback.textContent = "";

// 이미 완료한 미션
if (isCleared(n)) {
area.innerHTML = `       <div class="clear-box">         <div class="clear-icon">✓</div>         <h3>MISSION CLEAR</h3>         <p>이미 완료한 미션입니다.</p>       </div>
    `;

```
showScreen("mission");
return;
```

}

// 선택형 미션
if (m.type === "choice") {

```
area.innerHTML = `
  <div class="mission-card">

    <div class="question">
      ${m.question}
    </div>

    <div class="options">

      ${m.options
        .map(
          option => `
            <button
              class="option"
              onclick="answerChoice('${escapeAttr(option)}')"
            >
              ${option}
            </button>
          `
        )
        .join("")}

    </div>

    <p class="hint">
      ${m.hint}
    </p>

  </div>
`;
```

}

// 텍스트 입력형 미션
else {

```
area.innerHTML = `
  <div class="mission-card">

    <div class="question">
      ${m.question}
    </div>

    <input
      id="answerInput"
      class="text-input"
      placeholder="정답을 입력하세요"
      autocomplete="off"
    >

    <button
      class="submit"
      onclick="answerText()"
    >
      정답 제출
    </button>

    <p class="hint">
      ${m.hint}
    </p>

  </div>
`;
```

}

showScreen("mission");
}

// 작은따옴표 처리
function escapeAttr(s) {
return String(s).replaceAll("'", "'");
}

// 선택형 정답 확인
function answerChoice(value) {

const m = missions[currentMission];

if (value === m.answer) {

```
clearMission(currentMission);
```

} else {

```
fail(
  "아쉽습니다. 전시를 조금 더 살펴보고 다시 시도해보세요."
);
```

}
}

// 텍스트 정답 확인
function answerText() {

const input = document.getElementById("answerInput");

if (!input) return;

const value = (input.value || "")
.trim()
.toUpperCase();

const m = missions[currentMission];

const ok = m.answer.some(
answer =>
value === String(answer).toUpperCase()
);

if (ok) {

```
clearMission(currentMission);
```

} else {

```
fail(
  "정답이 아닙니다. 작품 속 단서를 다시 찾아보세요."
);
```

}
}

// 오답 메시지
function fail(msg) {

const f = document.getElementById("feedback");

if (!f) return;

f.className = "feedback no";
f.textContent = "✕ " + msg;
}

// 미션 완료
function clearMission(n) {

if (!isCleared(n)) {
cleared.push(Number(n));
}

cleared.sort((a, b) => a - b);

save();

const f = document.getElementById("feedback");

if (f) {
f.className = "feedback ok";
f.textContent = "✓ MISSION CLEAR!";
}

setTimeout(() => {

```
if (cleared.length === 3) {

  showScreen("complete");

} else {

  openMission(n);

}
```

}, 700);
}

// ============================
// STATUS 팝업
// ============================

// 상태 팝업 열기
function showStatus() {

const modal =
document.getElementById("statusModal");

if (!modal) return;

// hidden 속성 해제
modal.hidden = false;

// CSS가 display를 덮어쓰는 경우를 대비
modal.style.display = "flex";

// 제목 업데이트
const title =
document.getElementById("modalTitle");

if (title) {
title.textContent =
`${cleared.length} / 3 CLEARED`;
}

// 점 업데이트
renderDots(
document.getElementById("modalDots")
);
}

// 상태 팝업 닫기
function closeStatus() {

const modal =
document.getElementById("statusModal");

if (!modal) return;

// hidden 처리
modal.hidden = true;

// 강제로 숨김
modal.style.display = "none";
}

// 팝업 바깥쪽 클릭 시 닫기
function handleModalOutsideClick(event) {

const modal =
document.getElementById("statusModal");

if (!modal) return;

if (event.target === modal) {
closeStatus();
}
}

// ============================
// 진행상태 초기화
// ============================

function resetProgress() {

if (
confirm("진행상태를 초기화할까요?")
) {

```
cleared = [];

save();

goHome();
```

}
}

// ============================
// QR 미션 연결
// ============================
//
// QR 주소 예시:
//
// https://사이트주소/?mission=1
// https://사이트주소/?mission=2
// https://사이트주소/?mission=3
//
// QR을 찍으면 해당 미션으로 바로 이동
// ============================

function routeFromQR() {

const n =
new URLSearchParams(location.search)
.get("mission");

if (n && missions[n]) {

```
openMission(Number(n));
```

} else {

```
goHome();
```

}
}

// ============================
// 페이지 시작
// ============================

document.addEventListener(
"DOMContentLoaded",
() => {

```
updateUI();

routeFromQR();


// 팝업 바깥쪽 클릭
const modal =
  document.getElementById("statusModal");

if (modal) {

  modal.addEventListener(
    "click",
    handleModalOutsideClick
  );

}


// ESC 키로 팝업 닫기
document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeStatus();
    }

  }
);
```

}
);
