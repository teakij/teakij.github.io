# MEMORY

## Goal
- 반응형 개인 프로페셔널 웹사이트를 정적 `HTML/CSS/JS`로 만들고 `Games` 메뉴와 지렁이 게임을 GitHub Pages에 배포한다.

## Scope / Out of Scope
- Scope: 정적 사이트, 반응형 레이아웃, `Games` 메뉴, 키보드·터치 지렁이 게임, GitHub Pages 배포.
- Out of Scope: 백엔드, 외부 서비스, 프레임워크 추가, 확인되지 않은 개인정보 생성, 과도한 재작성.

## Execution
- Mode: `CODEX_FALLBACK`
- Claude model: `[사람 확인 필요]`
- Last test: `PASS` (step 7 site state restored)
- Current commit: `07a8f1c`
- Last normal commit·URL: `https://teakij.github.io`
- Git status: step 9 change request still empty; no code changes applied
- Rollback criteria: keep step 7 site state; wait for concrete change request before implementation

## Current State
- 상태: `STEP9_HITL_REQUIRED` change request is placeholder-only
- 완료 루프: `STEP1_ANALYSIS`, `AORR`, `Self-Correcting TDD 설계`, `Loop 1`, `Step 5`, `Step 6`, `Step 7`, `Step 8`, `Step 9`
- 다음 루프: actual change request from user
- Retry: `0`
- fingerprint: `empty change request`
- blocker: actual change request is missing
- 마지막 정상 commit·URL: `https://teakij.github.io`

## Acceptance
- `Games` 메뉴가 동작한다.
- 지렁이 게임이 키보드와 모바일 터치로 조작된다.
- 데스크톱·태블릿·모바일에서 레이아웃이 유지된다.
- 로컬 검증과 GitHub Pages 호환성이 통과한다.

## Guardrails
- 확인되지 않은 개인 정보 생성 금지.
- 기존 콘텐츠 임의 삭제 금지.
- 테스트 삭제·완화 금지.
- 대규모 재작성 금지.
- 백엔드·외부 서비스·프레임워크 임의 추가 금지.
- 토큰 출력·로그·코드·문서·Git 저장 금지.

## Retry / HITL
- Retry는 오류당 최대 3회다.
- 동일 fingerprint 2회면 중지한다.
- 한 Retry에서는 원인 하나와 최소 파일만 수정한다.
- Claude CLI가 불가하면 `CODEX_FALLBACK`만 사용한다.
- 배포 전과 `[사람 확인 필요]` 해소 불가 시 `HITL_REQUIRED`로 둔다.

## Recent Loops
| Loop | 상태 | 실행 모드·모델 | 변경 파일 | 테스트 결과 | Retry | 다음 작업 |
|---|---|---|---|---|---|---|
| Step 7 전체 구현 | 완료 | `CODEX_FALLBACK`, Claude 미로그인 | `index.html`, `styles.css`, `script.js`, `snake-game.js` | PASS | 0 | restore step 8 docs |
| Step 8 change request capture | 완료 | `CODEX_FALLBACK`, Claude 미로그인 | `CHANGE_REQUEST.md`, `AORR.md`, `MEMORY.md` | N/A | 0 | wait for concrete change request |
| Step 9 change request execution | HITL_REQUIRED | `CODEX_FALLBACK`, Claude 미로그인 | `CHANGE_REQUEST.md`, `AORR.md`, `MEMORY.md` | N/A | 0 | provide real change request |

## Notes
- 실제 Sonnet 모델명과 `Sonnet 5` 가능 여부는 Claude 로그인 후 재확인 필요하다.
