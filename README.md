# 포식자와 피식자, 누가 먼저 변할까?

고등학교 통합과학2 수업에서 사용하는 포식자-피식자 동역학 자료 해석 학습지입니다. 그래프의 시간 지연, 음성 피드백, 변인 조작 결과를 해석하고 선택형 심화 활동에서 생태학적 규칙과 수학식의 각 항을 연결합니다.

## 로컬 실행

Windows에서는 `start-local.bat`을 더블 클릭하거나 다음 명령을 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:5173/predator-prey-simulation-2/`를 엽니다.

## 포함 기능

- 기본 20분 활동 5개와 활동별 예상 시간 안내
- 포식자-피식자 그래프 추론, 순환 관계, 변인 탐구, 주장 검토, 개념 종합
- 작성 내용과 답안 확인 상태의 브라우저 자동 저장
- 기본 진행률과 분리된 3~5분 선택형 수학 심화 활동
- 데스크톱, 태블릿, 모바일 반응형 화면

## 검증

```bash
npm test
npm run build
```

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 포함되어 있습니다. 저장소의 **Settings → Pages → Build and deployment**에서 Source를 **GitHub Actions**로 선택한 뒤 `main` 브랜치에 push하면 테스트와 빌드 후 자동 배포됩니다.

배포 주소: <https://suimaire.github.io/predator-prey-simulation-2/>

현재 `vite.config.ts`의 기본 경로는 `/predator-prey-simulation-2/`입니다. GitHub 저장소 이름이 다르면 이 값을 `/<저장소 이름>/`으로 바꾸세요.
