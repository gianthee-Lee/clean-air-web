# 🧊 클린에어 예약센터 — 에어컨 청소 예약 홈페이지

포항 및 인근 지역 에어컨 청소 예약을 위한 원페이지 랜딩 사이트입니다.
관리자 페이지에서 예약 관리, 일정 확인, 사이트 설정을 할 수 있습니다.

---

## 📦 실행 방법

### 1. 필수 설치
- [Node.js](https://nodejs.org/) (v18 이상)

### 2. 로컬 실행
`서버시작.bat` 파일을 더블클릭하거나, 터미널에서:
```bash
cd clean-air
npm install
npm run dev
```
- 고객 페이지: `http://localhost:3000`
- 관리자 페이지: `http://localhost:3000/admin`

### 3. 관리자 초기 비밀번호
```
admin1234
```
관리자 페이지 → 설정 탭에서 변경할 수 있습니다.

---

## ⭐ Supabase 설정 (필수 — 관리 기능 사용을 위해)

관리자 기능(예약 관리, 설정 변경)을 사용하려면 Supabase를 연결해야 합니다.
Supabase 없이도 고객 페이지는 기본값으로 표시됩니다.

### 1단계: Supabase 프로젝트 만들기
1. [https://supabase.com](https://supabase.com) 에 가입합니다 (무료).
2. 로그인 후 **"New Project"** 를 클릭합니다.
3. 프로젝트 이름: `clean-air` (아무거나 가능)
4. 비밀번호를 설정하고 **"Create new project"** 를 클릭합니다.
5. 프로젝트가 생성될 때까지 1~2분 기다립니다.

### 2단계: 테이블 만들기
1. 왼쪽 메뉴에서 **"SQL Editor"** 를 클릭합니다.
2. **"New query"** 를 클릭합니다.
3. 프로젝트 폴더의 `supabase-setup.sql` 파일 내용을 전부 복사해서 붙여넣습니다.
4. **"Run"** 버튼을 클릭합니다.
5. "Success" 메시지가 나오면 완료!

### 3단계: URL과 Key 복사
1. 왼쪽 메뉴에서 **"Project Settings"** (⚙️ 아이콘) 를 클릭합니다.
2. **"API"** 탭을 클릭합니다.
3. 아래 두 값을 복사합니다:
   - **Project URL**: `https://xxxxx.supabase.co` 형태
   - **anon public key**: `eyJhbGciOi...` 형태의 긴 문자열

### 4단계: .env.local 파일 만들기
프로젝트 폴더(`clean-air/`)에 `.env.local` 파일을 만들고 아래 내용을 붙여넣습니다:
```
NEXT_PUBLIC_SUPABASE_URL=https://ryrklhxmmyltjwrnbphw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_CN89-OVsezrwHVnp88Jbog_1oZMfF2H
```

### 5단계: 서버 재시작
`.env.local`을 만든 후 서버를 껐다가 다시 켜야 적용됩니다.

---

## ✏️ 수정 방법

### 관리자 페이지에서 수정 가능한 항목
`http://localhost:3000/admin` → 설정 탭에서:
- 전화번호
- 카카오톡 채널 링크
- 업체명
- 서비스 지역
- 주소, 운영시간, 사업자 정보
- 관리자 비밀번호

### 코드에서 직접 수정하는 항목
📁 **`src/data/siteData.js`**

| 수정할 내용 | 찾아야 할 변수 |
|-------------|---------------|
| 메인 화면 문구 | `HERO_DATA` |
| 서비스 소개 항목 | `SERVICES` |
| 청소 가능 제품 | `PRODUCTS` |
| 가격표 💰 | `PRICING`, `PRICING_NOTES` |
| 작업 과정 | `PROCESS_STEPS` |
| 작업 전후 사진 | `GALLERY_ITEMS` |
| 고객 후기 | `REVIEWS` |
| FAQ | `FAQ_DATA` |
| 예약 폼 옵션 | `AIRCON_TYPES`, `TIME_SLOTS` |

### 사진 추가 방법
1. `public/images/` 폴더에 사진 파일을 넣으세요.
2. `siteData.js`의 `GALLERY_ITEMS`에서 `imageSrc`를 수정하세요:
```js
{ label: "작업 전", description: "...", imageSrc: "/images/before.jpg" },
```

---

## 🚀 Vercel 무료 배포 방법

### 방법 1: GitHub 연동 (추천)
1. [GitHub](https://github.com)에 가입하고 새 저장소를 만듭니다.
2. 프로젝트를 업로드합니다:
```bash
cd clean-air
git init
git add .
git commit -m "첫 배포"
git remote add origin https://github.com/내아이디/내저장소.git
git push -u origin main
```
3. [Vercel](https://vercel.com)에 GitHub 로그인 → "New Project" → 저장소 선택 → Deploy
4. **중요!** Vercel Settings → Environment Variables에 아래 추가:
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase Key
5. 배포 완료! `https://내프로젝트.vercel.app` 주소가 생깁니다.

---

## 🌐 자체 도메인 연결 방법

1. 도메인을 구매합니다 (가비아, 카페24, Namecheap 등).
2. Vercel 대시보드 → Settings → Domains → 도메인 입력
3. DNS 레코드 설정:
   - **A 레코드**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

---

## 📁 프로젝트 구조

```
clean-air/
├── public/images/              ← 사진 파일 넣는 곳
├── src/
│   ├── app/
│   │   ├── globals.css         ← 전체 스타일
│   │   ├── layout.js           ← HTML 기본 구조
│   │   ├── page.js             ← 고객 메인 페이지
│   │   ├── admin/
│   │   │   ├── page.js         ← 관리자 로그인
│   │   │   └── dashboard/
│   │   │       └── page.js     ← 관리자 대시보드
│   │   └── api/
│   │       ├── reservation/route.js  ← 예약 API
│   │       ├── settings/route.js     ← 설정 API
│   │       └── admin/auth/route.js   ← 로그인 API
│   ├── components/
│   │   ├── Header.js ~ Footer.js     ← 고객 페이지 섹션들
│   │   ├── MobileBottomBar.js        ← 모바일 하단 버튼
│   │   └── admin/
│   │       ├── ReservationList.js    ← 예약 목록 관리
│   │       ├── CalendarView.js       ← 달력 뷰
│   │       └── SettingsPanel.js      ← 사이트 설정
│   ├── data/
│   │   └── siteData.js         ← 가격/후기/FAQ 등 데이터
│   └── lib/
│       └── supabase.js         ← Supabase 연결 설정
├── supabase-setup.sql          ← Supabase 테이블 생성 SQL
├── 서버시작.bat                ← 더블클릭으로 서버 시작
└── .env.local                  ← Supabase URL/Key (직접 만들기)
```
