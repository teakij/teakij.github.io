# AORR

## 1. Target과 완료 기준
- 목표는 정적 `HTML/CSS/JavaScript`만으로 만든 반응형 개인 프로페셔널 웹사이트를 GitHub Pages에 배포하는 것이다.
- 완료 기준은 다음과 같다.
- `Games` 메뉴가 상단 내비게이션에 존재한다.
- 지렁이 게임이 키보드와 모바일 터치로 조작된다.
- 데스크톱, 태블릿, 모바일에서 레이아웃이 깨지지 않는다.
- 로컬 검증에서 HTML 구조, 내부 링크, CSS 반응형, JavaScript 오류, 게임 입력, 로컬 HTTP 응답, GitHub Pages 호환성이 통과한다.
- 프로필 참고 자료와 게임 세부 규칙 중 확인되지 않은 내용은 `[사람 확인 필요]`로 남긴다.

## 2. Act: Codex가 수행할 최소 수정
- Codex는 한 번의 Retry에서 원인 하나만 고친다.
- 수정 범위는 실패 fingerprint와 직접 연결된 최소 파일만 포함한다.
- 우선순위는 HTML 구조, CSS 반응형, JavaScript 게임 로직, 콘텐츠, 배포 설정 순이다.
- Codex는 Claude가 이미 확인한 테스트를 다시 실행하지 않는다.
- Claude CLI를 사용할 수 없을 때만 `CODEX_FALLBACK` 모드로 Codex가 수정과 테스트를 모두 수행한다.

## 3. Observe: Claude가 실행할 테스트와 수집할 결과
- Verifier 역할은 Claude Code CLI Sonnet이 맡는다.
- Claude는 변경 전과 변경 후에 동일한 검증 묶음을 실행한다.
- 검증 범위는 다음과 같다.
- 파일 존재와 상대 경로
- HTML 구조와 내부 링크
- CSS 반응형
- JavaScript 오류
- 지렁이 게임 기능과 입력
- 로컬 HTTP 응답
- `375px`, `768px`, `1440px`
- GitHub Pages 호환성
- Claude는 각 실행마다 실패 항목, 핵심 오류, 관련 파일·라인, fingerprint를 보고한다.
- 실패 기록에는 실행 주체와 모델, 명령, exit code, 핵심 오류, 관련 파일·라인, fingerprint, 최종 상태를 포함한다.

## 4. Reason: 실패 원인 분류
- 실패는 아래 분류 중 하나로만 기록한다.
- `HTML`
- `CSS`
- `JAVASCRIPT`
- `GAME`
- `CONTENT`
- `TEST`
- `ENVIRONMENT`
- `GITHUB`
- `DEPLOYMENT`
- `UNKNOWN`
- 한 Retry에서는 원인 하나만 다룬다.
- 동일 fingerprint가 2회 반복되면 같은 원인의 재수정이 아니라 중지 판단을 우선한다.

## 5. Repeat: Codex 최소 수정 → Claude 동일 테스트 재실행
- 흐름은 `Claude 변경 전 테스트 → 실패 보고 → Codex 최소 수정 → Claude 동일 테스트 재실행`이다.
- 실패하면 Claude가 새 결과와 fingerprint를 다시 보고한다.
- Codex는 새 fingerprint가 가리키는 원인 하나만 다시 고친다.
- Retry는 오류당 최대 3회다.
- 테스트 삭제, 완화, 우회는 금지한다.
- Claude의 전체 검증이 통과해야만 `PASSED`가 된다.

## 6. Stop과 HITL 조건
- 다음 조건이면 즉시 멈추고 `HITL_REQUIRED`로 전환한다.
- 프로필 내용이나 게임 규칙처럼 `[사람 확인 필요]`가 해소되지 않아 구현 결정을 못 할 때
- 배포 직전 사용자 승인이 필요한 경우
- Claude CLI 인증이 복구되지 않아 Verifier를 사용할 수 없을 때
- 동일 fingerprint 2회 반복으로 더 진행해도 의미가 없을 때
- 배포가 실패하거나 GitHub 권한/토큰 문제가 의심될 때
- 코드만으로 판단할 수 없는 디자인 판단이 필요할 때
- 중지 상태가 지속되면 `BLOCKED`로 전환한다.

## 7. Self-Correcting TDD Loop
- 기본 모드는 `Codex = Worker`, `Claude Code CLI Sonnet = Verifier`다.
- Claude는 변경 전 테스트를 실행하고, Codex는 그 결과를 바탕으로 최소 수정만 한다.
- Codex는 Claude가 실행한 테스트를 중복 실행하지 않는다.
- Claude가 사용할 실제 모델명은 아래와 같다.
- 현재 확인 결과 `claude` 명령은 존재하지만 `claude auth status`가 `loggedIn: false`라서 Verifier 실행이 불가하다.
- 따라서 현재 세션에서는 `CODEX_FALLBACK` 모드를 사용한다.
- 실제 Sonnet 모델명은 로그인되지 않아 확인할 수 없으므로 `[사람 확인 필요]`다.
- `Sonnet 5` 사용 가능 여부 역시 로그인 후 재확인해야 하므로 `[사람 확인 필요]`다.
- `Claude CLI`를 사용할 수 있게 되면 해당 시점의 실제 모델명을 `AORR.md`와 `MEMORY.md`에 기록한다.

### 상태
- `READY`: 검증 준비 완료
- `ACTING`: Codex가 최소 수정 중
- `VERIFYING`: Claude가 동일 테스트 검증 중
- `RETRYING`: 실패 fingerprint 기반 최소 재수정 중
- `PASSED`: Claude 전체 검증 통과
- `DEPLOY_APPROVAL_REQUIRED`: 배포 전 사용자 승인 대기
- `DEPLOYED`: GitHub Pages 배포 완료
- `BLOCKED`: 더 진행할 수 없는 막힘 상태
- `HITL_REQUIRED`: 사람 확인이 필요한 상태

### 개발 루프 표

| 루프 | 입력 | Codex Act | Claude Verify | 통과 기준 | 다음 상태 |
|---|---|---|---|---|---|
| 1. 사이트 골격 | 저장소 구조, 메뉴, 반응형 기준 | 최소 HTML 뼈대와 내비게이션만 수정 | 파일 존재, 내부 링크, 로컬 HTTP, `375px/768px/1440px` 확인 | 레이아웃이 깨지지 않고 다음 기능을 얹을 수 있음 | `ACTING` → `VERIFYING` → `PASSED` |
| 2. 콘텐츠 반영 | `CV.pdf` 또는 사용자 제공 이력 정보 | 확인된 프로필만 채우고 미확인은 `[사람 확인 필요]` | HTML 구조, 콘텐츠 누락, 링크 확인 | 허위 정보 없이 프로필 섹션이 완성됨 | `ACTING` → `VERIFYING` → `PASSED` |
| 3. 테마 적용 | 다크 테마, 메트릭스 느낌, 페이스북 등등 | 최소 CSS 변수, 배경, 카드, 타이포 조정 | CSS 반응형, 가독성, 모바일 레이아웃 확인 | 어두운 테마가 유지되고 읽기 쉬움 | `ACTING` → `VERIFYING` → `PASSED` |
| 4. Games 연결 | `Games` 메뉴, 게임 진입 방식 | 상단 메뉴와 게임 섹션 앵커만 연결 | 내부 링크, 스크롤 이동, 로컬 HTTP 확인 | 게임 진입 경로가 명확함 | `ACTING` → `VERIFYING` → `PASSED` |
| 5. 게임 핵심 | 지렁이 게임 규칙, 입력 방식 | 이동, 먹이, 충돌, 점수의 최소 구현 | JavaScript 오류, 키보드·터치 입력, 게임 기능 확인 | 게임이 실제로 플레이 가능함 | `ACTING` → `VERIFYING` → `PASSED` |
| 6. 랜덤 적 | 랜덤하게 움직이는 적 `[사람 확인 필요]` | 관련 파일 한 개만 수정해 적 동작 추가 | 게임 기능, 충돌, 난이도, 오류 확인 | 적이 게임을 깨지 않고 동작함 | `ACTING` → `VERIFYING` → `PASSED` |
| 7. 배포 준비 | GitHub Pages 경로, 토큰 파일 | 배포 관련 정적 경로와 링크만 정리 | GitHub Pages 호환성, 자산 경로 확인 | 배포 가능 상태임 | `DEPLOY_APPROVAL_REQUIRED` |
| 8. 배포 | 사용자 승인 후 배포 | 배포 실행 전 최소 최종 점검 | 배포 결과와 공개 URL 확인 | Pages에서 정상 표시됨 | `DEPLOYED` |

### 실행 규칙
- `READY`에서 시작한다.
- Claude 변경 전 테스트가 성공하면 `PASSED`로 간다.
- 실패하면 `RETRYING`으로 간다.
- Retry는 반드시 하나의 원인과 최소 파일만 수정한다.
- Claude CLI가 불가하면 `CODEX_FALLBACK`으로 처리하고, 이유를 기록한 뒤 Codex가 수정과 테스트를 모두 수행한다.
- 실행 순서: `CHANGE_REQUEST.md` 확인 → 모호성 정리 → 이후 루프 반영.
- `CHANGE_REQUEST.md`에 실제 변경 요청이 없으면 `STEP9_HITL_REQUIRED`로 중단한다.
