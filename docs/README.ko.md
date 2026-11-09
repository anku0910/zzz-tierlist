<div align="center">

# 젠레스 존 제로 티어 리스트 메이커

**Zenless Zone Zero 티어 리스트 × 2축 차트 제작 도구 — 순수 프론트엔드, 빌드 불필요, 완전 오프라인**

[![Platform](https://img.shields.io/badge/Platform-Web_2026-0a0a0c?style=flat-square&labelColor=0a0a0c&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/anku0910/zzz-tierlist)
[![Build](https://img.shields.io/badge/Build-None_Needed-d4ff3f?style=flat-square&labelColor=0a0a0c)](https://github.com/anku0910/zzz-tierlist)
[![Runtime](https://img.shields.io/badge/Runtime-100%25_Offline-4c1?style=flat-square)](https://github.com/anku0910/zzz-tierlist)
[![i18n](https://img.shields.io/badge/i18n-zh--TW_·_en_·_ja_·_ko-4a90d9?style=flat-square)](#다국어)
[![License](https://img.shields.io/github/license/anku0910/zzz-tierlist?style=flat-square)](../LICENSE)
[![Stars](https://img.shields.io/github/stars/anku0910/zzz-tierlist?style=flat-square&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist/stargazers)
[![PRs](https://img.shields.io/badge/PRs-Welcome-ff4655?style=flat-square)](https://github.com/anku0910/zzz-tierlist/pulls)

[繁體中文](../README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

</div>

---

## 소개

Zenless Zone Zero(젠레스 존 제로) 커뮤니티 도구: **티어 리스트**와 **강력함 × 사용 편의성 2축 차트**를 만들 수 있습니다. 순수 vanilla JavaScript로 빌드도 백엔드도 필요 없으며, 모든 에셋이 로컬에 있어 `file://` 로 직접 열어도 완전히 작동합니다.

UI는 "그래파이트 블랙 × 네온 라임"의 ZZZ 네이티브 디자인이며, 4개 언어(繁體中文／English／日本語／한국어)를 지원합니다. UI 문구와 캐릭터 이름 모두 즉시 전환됩니다.

## 시작하기

**온라인(GitHub Pages)**

1. `Settings → Pages` 로 이동
2. Source를 `Deploy from a branch`, Branch를 `main` / `(root)` 로 설정
3. `https://anku0910.github.io/zzz-tierlist/` 접속

**로컬**

```bash
git clone https://github.com/anku0910/zzz-tierlist.git
cd zzz-tierlist
python -m http.server 8000
# http://127.0.0.1:8000/ 열기
```

또는 `index.html` 을 직접 열어도 됩니다(`file://` 지원).

## 기능

- **티어 리스트**: 드래그/클릭으로 배치, 더블클릭으로 보관함으로 복귀, 티어 이름·색상 편집, "직업 표시" 필터(표시에만 영향, 데이터 불변)
- **2축 차트**: 클릭/드래그로 배치, 도트 드래그, 겹친 도트는 더블클릭으로 순환 선택, **방향키/WASD 미세 조정**(Shift로 가속), Y/X 축 이름 편집, "직업 표시" 필터, PNG 내보내기(canvas 수동 드로잉)
- **배치 상태 분리**: 티어 리스트와 차트의 배치가 서로 영향을 주지 않습니다
- **에이전트 보관함**(오른쪽 사이드바 공용): 검색(**各言語 캐릭터 이름 지원**), 14진영 로고 필터, 직업/속성/정렬, "특수" 속성 분류
- **3가지 이미지 모드**: 일러스트/치비/아바타(Inter-Knot 아이콘). 카드 우클릭으로 개별 전환
- **특수 속성 배지**: 流明/凜刃/烈霜/玄墨 캐릭터에 전용 배지와 점 표시
- **다국어**: zh-TW/English/日本語/한국어, 브라우저 언어 자동 감지 및 즉시 전환
- **내보내기**: 티어 리스트 PNG(html2canvas + canvas 폴백), 차트 PNG, 공유 링크, JSON 가져오기/내보내기, 미리보기
- **사용법**: 첫 방문 시 자동 표시, 언제든 다시 열기 가능
- **개인화**: 첫 사용 시 이름을 묻고 기본 제목을 자동 생성
- **저장**: localStorage `zzz-tierlist-v2`, 이전 저장본 자동 마이그레이션

## 프로젝트 구조

| 파일 | 설명 |
|---|---|
| `index.html` | 셸: 헤더 + 뷰 탭 + main/sidebar |
| `styles.css` | 디자인 시스템(그래파이트 블랙 × 네온 라임) |
| `i18n.js` | 4개 언어 사전 + `data-i18n` 바인딩 + `i18n:change` 이벤트 |
| `app.js` | 상태/필터/드래그 앤 드롭/내보내기/사용법 |
| `chart.js` | 2축 차트 모듈(DOM 백분율 도트) |
| `data.js` | 63명 캐릭터 데이터 + `AGENT_NAMES` 다국어 이름 + 진영/속성 색상표 |
| `assets/zzz/` | 일러스트/치비/아바타/스티커 예비/14진영 로고(전부 로컬) |
| `tools/` | 에셋 수집 및 자동 검증 스크립트(개발용) |

## 데이터 모델(data.js)

- `AGENTS` 레코드: `id / name / fullName / faction / role / attribute / specialAttribute / rank / img / imgSquare / imgRound / imgProfile / available`
- `faction` 은 문자열 또는 **배열**(복수 진영: 0호 안비 = 교활한 토끼굴 + 오볼 분대)
- `AGENT_NAMES`: en/ja/ko 표시 이름 맵(`I18N.agentName()` 은 zh-TW에서 `name` 을 직접 사용)
- `FACTIONS`(14) 및 `ROLE_COLORS`/`ATTRIBUTE_COLORS`/`FACTION_LOGOS`/`FACTION_COLORS` 색상표

## 다국어

- 헤더의 셀렉트로 전환. 선택은 `localStorage` 에 저장되며, 미선택 시 브라우저 언어를 자동 감지
- 정적 문자열: `data-i18n` 속성(`-html`/`-placeholder`/`-title` 변형 포함)을 `applyStatic()` 이 번역
- 동적 콘텐츠: `setLocale()` 이 `i18n:change` 이벤트를 발생시키면 `app.js` 가 보관함·티어 카드·차트를 다시 그립니다

## 에셋 파이프라인(개발)

```bash
python tools/fetch_zzz_assets.py --dry-run   # 수집 계획 확인(쓰기 없음)
python tools/fetch_zzz_assets.py             # 수집 + assets/zzz/ 배치
```

소스는 Fandom의 `api.php` 엔드포인트(Cloudflare가 403으로 차단하는 `/wiki/*` HTML 미사용). 스로틀링과 재시도 내장. **실행 시점은 완전 오프라인** — 사이트는 Fandom에 의존하지 않습니다.

## 개발 및 검증

```bash
pip install playwright && playwright install msedge
python tools/verify_theweb.py   # 51개 자동 검사, 스크린샷은 _verify/ 에 저장
```

## 디자인 시스템

- 그래파이트 블랙 `#0a0a0c`, 패널 3단계 `#131316 / #1a1a1f / #222228`, 단일 강조색 네온 라임 `#d4ff3f`
- 정원 요소(랭크 배지, 차트 도트, 아바타, 상태 점)를 제외하고 모서리 반경 0. clip-path 사선 컷은 내보내기 영역 밖에만 사용
- PNG 내보내기 영역은 hex/rgba만 사용(html2canvas 호환). 테마 색상 변경 시 `app.js` 와 `chart.js` 의 드로잉도 동기화 필요

## 라이선스

[MIT](../LICENSE) © 2026 anku0910
