# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio landing page for GitHub Pages deployment.

**Stack**: Vite + React 19 + Tailwind CSS v4 + Supabase + react-router-dom + mermaid

**Deploy Target**: https://mealwithoutsoup.github.io/

## Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Build for production → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
npm run deploy   # Build + deploy to GitHub Pages (gh-pages -d dist)
```

## Implementation Progress

### Completed (Public Pages)
- [x] Main Page - 검색, Featured Work, Projects/Labs 아코디언
- [x] Project Detail Page - 프로젝트 상세, challenges 페이지네이션, Mermaid 다이어그램
- [x] Supabase 연동 - projects, project_challenges 테이블 조회
- [x] 다크모드 - localStorage 저장, 시스템 설정 감지
- [x] Visibility 필터링 - 퍼블릭 페이지에서 visibility=true인 프로젝트만 표시

### Completed (Admin Pages)
- [x] Auth Context & Hook - Supabase Auth 연동 (signIn, signOut, session 관리)
- [x] Admin Login - 이메일/비밀번호 로그인 페이지
- [x] ProtectedRoute - 인증 보호 래퍼 컴포넌트
- [x] AdminHeader - Admin 전용 헤더 (사용자 정보, 로그아웃)
- [x] AdminProjects - 프로젝트 관리 대시보드
  - 프로젝트 테이블 (커버이미지, 제목, 태그, 카테고리, 날짜, 상태)
  - Visibility 토글 (visibility/visibility_off 아이콘)
  - 검색, 페이지네이션
  - Edit/View/Delete 액션
- [x] AdminProjectForm - 프로젝트 CRUD 폼
  - General Info (제목, 카테고리, 상태, 날짜, 태그)
  - 커버 이미지 업로드
  - Challenge 섹션 (동적 추가/삭제)
  - Problem/Solution/Result 리스트
  - 다이어그램 이미지/Mermaid 문법

### Completed (UI/UX)
- [x] 뉴모피즘 카드 디자인 - FeaturedCard, ProjectCard, LabCard
  - `.neumorphic-card` / `.neumorphic-inset` CSS 클래스
  - 라이트/다크 모드 그림자 효과
  - hover 애니메이션 (translateY -8px)
  - 기존 테마 색상 사용 (`primary`, `text-primary-light/dark`)

### TODO (Next Tasks)
- [ ] 검색 기능 구현 (메인 페이지)
- [ ] 필터링 기능 구현 (카테고리, 태그 등)

## Architecture

### Routes
```
/                      → MainPage (public, visibility=true만)
/project/:id           → ProjectDetailPage (public, visibility=true만)
/admin                 → AdminLogin
/admin/projects        → AdminProjects (Protected)
/admin/projects/new    → AdminProjectForm (Protected)
/admin/projects/:id    → AdminProjectForm (Protected)
```

### File Structure
```
src/
├── config/supabase.js              # Supabase client
├── context/
│   ├── themeContext.js             # Theme context definition
│   ├── ThemeProvider.jsx           # Theme provider component
│   ├── authContext.js              # Auth context definition
│   └── AuthProvider.jsx            # Auth provider (Supabase Auth)
├── hooks/
│   ├── useTheme.js                 # Dark mode hook
│   ├── useAuth.js                  # Auth hook (user, signIn, signOut)
│   ├── useProjects.js              # Fetch projects (visibility=true)
│   └── useProjectDetail.js         # Fetch project with challenges
├── components/
│   ├── layout/
│   │   ├── Header.jsx              # Public header
│   │   ├── Footer.jsx              # Public footer
│   │   └── AdminHeader.jsx         # Admin header (logout)
│   ├── auth/
│   │   └── ProtectedRoute.jsx      # Auth guard wrapper
│   ├── ui/Icon, ThemeToggle, Tag, SearchBar, TrendingTags, Accordion, Breadcrumb
│   ├── cards/FeaturedCard, ProjectCard, LabCard
│   └── project/ChallengeSection, ProblemSolutionResult, MermaidDiagram
├── pages/
│   ├── MainPage.jsx
│   ├── ProjectDetailPage.jsx
│   ├── AdminLogin.jsx              # 로그인 페이지
│   ├── AdminProjects.jsx           # 프로젝트 대시보드
│   └── AdminProjectForm.jsx        # 프로젝트 생성/수정 폼
├── App.jsx                         # Router setup
└── main.jsx                        # Entry (BrowserRouter + ThemeProvider + AuthProvider)
```

### Design Guidelines
1. **Styling**: Tailwind CSS + Material Symbols Outlined 아이콘 사용. 하드코딩 스타일링 금지.
2. **Dark Mode**: `ThemeProvider` + `useTheme` hook 패턴
3. **Theme Variables**: `src/index.css`의 `@theme` 변수 사용 (예: `bg-card-light dark:bg-card-dark`)
4. **Colors**:
   - `primary: #137fec` (강조 색상)
   - `background-light: #f6f7f8`, `background-dark: #101922`
   - `neu-light: #eef0f2`, `neu-dark: #1c2630` (뉴모피즘 배경)
5. **Neumorphic Components**:
   - `.neumorphic-card` - 외부 그림자 카드 (hover시 위로 이동)
   - `.neumorphic-inset` - 내부 음각 그림자 (이미지/아이콘 영역)

### Supabase

#### Storage
- **버킷명**: `portfoilo_images`
- **용도**: 커버 이미지, Challenge 다이어그램 이미지 저장
- **경로 패턴**:
  - 커버: `covers/cover-{timestamp}-{random}.{ext}`
  - 챌린지: `challenges/challenge-{timestamp}-{random}.{ext}`

#### Database Tables
- **projects**: 프로젝트 기본 정보
- **project_challenges**: 프로젝트 도전 과제 (1:N 관계)

### Environment Setup
`.env.local` 파일 필요:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### DB Structure

```sql
-- 1. 프로젝트 기본 정보 테이블
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'projects',      -- featured, projects, labs
    proj_description TEXT,
    project_status TEXT DEFAULT 'draft',   -- draft, published
    proj_cover_image_url TEXT,             -- 커버 이미지 URL
    visibility BOOLEAN DEFAULT false,      -- 공개 여부
    start_date VARCHAR(7) NOT NULL,        -- YYYY.MM 형식
    end_date VARCHAR(7),                   -- NULL = 진행 중
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 프로젝트 도전 과제 테이블
CREATE TABLE project_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    core_challenge TEXT NOT NULL,
    image_url TEXT,
    mermaid_syntax TEXT,
    problem_items TEXT[] DEFAULT '{}',
    solution_items TEXT[] DEFAULT '{}',
    result_items TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Storage Policies (portfoilo_images 버킷)
-- INSERT: 인증된 사용자만 업로드 가능
-- SELECT: 공개 읽기
```

### Documentation
- https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- https://supabase.com/docs/guides/storage/uploads/standard-uploads
- https://tailwindcss.com/docs/installation/using-vite
