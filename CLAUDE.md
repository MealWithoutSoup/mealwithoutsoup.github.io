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

### TODO (Admin Pages)
- [ ] Admin Login - Supabase Auth JWT 로그인
- [ ] Admin Projects - 프로젝트 관리 대시보드
- [ ] Project Form - 프로젝트 CRUD 폼

## Architecture

### Routes
```
/                 → MainPage (public)
/project/:id      → ProjectDetailPage (public)
/admin            → AdminLogin (TODO)
/admin/projects   → AdminProjects (TODO)
```

### Pages (see design/ folder for mockups)
- **Main Page**: Portfolio landing with search, featured work, projects accordion, labs section
- **Project Detail**: Individual project view with challenges
- **Admin Login**: Owner-only JWT authentication via Supabase Auth (TODO)
- **Admin Projects**: Project management dashboard (TODO)
- **Project Form**: Create/Update form for projects (TODO)



### Design Guidelines
1. **Styling**: 디자인 목업 구현 시 Tailwind CSS와 Lucide React Icon을 적극 활용한다. 하드코딩 스타일링 금지.
2. **Dark Mode**: 다크모드 전환 로직은 (`ThemeProvider` + `useTheme` hook) 패턴을 따른다.
3. **Header**: 모든 페이지의 헤더는 `components/layout/Header.jsx`를 공통으로 사용한다.
4. **Theme Variables**: `src/index.css`의 `@theme` 변수를 사용한다. (예: `bg-card-light dark:bg-card-dark`)
5. - Colors: `primary: #137fec`, `background-light: #f6f7f8` `background-dark: #101922`

### File Structure
```
src/
├── config/supabase.js              # Supabase client
├── context/
│   ├── themeContext.js             # Theme context definition
│   └── ThemeProvider.jsx           # Theme provider component
├── hooks/
│   ├── useTheme.js                 # Dark mode hook
│   ├── useProjects.js              # Fetch projects by category
│   └── useProjectDetail.js         # Fetch project with challenges
├── components/
│   ├── layout/Header.jsx, Footer.jsx
│   ├── ui/Icon, ThemeToggle, Tag, SearchBar, TrendingTags, Accordion, Breadcrumb
│   ├── cards/FeaturedCard, ProjectCard, LabCard
│   └── project/ChallengeSection, ProblemSolutionResult, MermaidDiagram
├── pages/
│   ├── MainPage.jsx
│   └── ProjectDetailPage.jsx
├── App.jsx                         # Router setup
└── main.jsx                        # Entry point with BrowserRouter
```

### Tailwind v4 Integration
Uses `@tailwindcss/vite` plugin. Theme defined in `src/index.css` with `@theme` directive.

### Supabase
- Public: projects, project_challenges 테이블 조회 (RLS로 누구나 SELECT 가능)
- Admin: JWT 인증 후 CRUD (TODO)

### Environment Setup
`.env.local` 파일 필요:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### DB structure

```sql
-- 1. 프로젝트 기본 정보 테이블 (부모)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT, -- featured, projects, labs
    
    -- 시작일과 종료일을 분리하여 정렬 기능 확보 (형식: YYYY.MM)
    -- '2024.01' 형태로 저장하면 문자열 비교만으로 최신순 정렬이 가능합니다.
    start_date VARCHAR(7) NOT NULL, 
    end_date VARCHAR(7),           -- NULL 허용 (NULL일 경우 '진행 중'으로 처리)
    
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 프로젝트 상세 도전 과제 테이블 (자식)
CREATE TABLE project_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- 부모 삭제 시 자동 삭제
    core_challenge TEXT NOT NULL,
    image_url TEXT, -- Supabase Storage의 Public URL 저장용
    mermaid_syntax TEXT,
    
    -- 3단 그리드 데이터 (PostgreSQL Array 타입)
    problem_items TEXT[] DEFAULT '{}',
    solution_items TEXT[] DEFAULT '{}',
    result_items TEXT[] DEFAULT '{}',
    
    display_order INTEGER DEFAULT 0, -- 한 프로젝트 내 여러 문제의 순서 정렬
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 인덱스 생성 (조회 성능 최적화)
CREATE INDEX idx_projects_start_date ON projects (start_date DESC);

-- 4. RLS(Row Level Security) 설정
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_challenges ENABLE ROW LEVEL SECURITY;

-- [조회 정책] 누구나 읽을 수 있음
CREATE POLICY "Allow public select on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public select on challenges" ON project_challenges FOR SELECT USING (true);

-- [관리 정책] 인증된 관리자(본인)만 모든 작업 가능
-- 'your-email@example.com' 부분을 본인의 Supabase 계정 이메일로 수정하세요.
CREATE POLICY "Admin full access on projects" ON projects 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'your-email@example.com');

CREATE POLICY "Admin full access on challenges" ON project_challenges 
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'email' = 'your-email@example.com');
```

### documentaion
https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

https://tailwindcss.com/docs/installation/using-vite

https://uiverse.io/Sashank02/new-warthog-10
