# U! WHO? Exhibition Mission

QR 3개를 어디서든 순서와 관계없이 시작할 수 있는 임시 미션 웹사이트입니다.

## QR 주소
사이트 주소가 `https://USERNAME.github.io/U-WHO-MISSION/`이라면:

- Mission 1: `...?mission=1`
- Mission 2: `...?mission=2`
- Mission 3: `...?mission=3`

## 미션 내용 변경
`script.js`의 `missions` 부분만 수정하면 됩니다.

## 주의
현재 완료 상태는 방문자의 휴대폰 브라우저 `localStorage`에 저장됩니다.
즉, 같은 휴대폰/브라우저에서는 QR을 바꿔 찍어도 진행 상태가 유지됩니다.
다른 기기에서는 별도의 진행 상태로 시작합니다.
