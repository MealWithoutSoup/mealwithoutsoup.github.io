import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useDebounce } from '../hooks/useDebounce'
import { Header } from '../components/layout/Header'
import { SearchBar } from '../components/ui/SearchBar'
import { TrendingTags } from '../components/ui/TrendingTags'
import { Accordion } from '../components/ui/Accordion'
import { Icon } from '../components/ui/Icon'
import { FeaturedCard } from '../components/cards/FeaturedCard'
import { ProjectCard } from '../components/cards/ProjectCard'
import { LabCard } from '../components/cards/LabCard'
import { Footer } from '../components/layout/Footer'

const TRENDING_TAGS = ['React', 'TypeScript', 'Design Systems', 'D3.js', 'UI/UX']

const PROJECT_ICONS = ['dataset', 'palette', 'shopping_cart', 'code', 'memory', 'cloud']
const PROJECT_COLORS = ['blue', 'purple', 'orange', 'green', 'red', 'blue']

const LAB_ICONS = ['brush', 'animation', 'functions', 'terminal', 'science', 'auto_awesome']
const LAB_GRADIENTS = ['indigo', 'green', 'orange', 'gray', 'blue', 'pink']

// 필터링 함수
const filterProjects = (projects, query) => {
  if (!query.trim()) return projects
  const q = query.toLowerCase()
  return projects.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.proj_description?.toLowerCase().includes(q) ||
    p.tags?.some(tag => tag.toLowerCase().includes(q))
  )
}

export function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(searchQuery, 300)

  const { projects: featuredProjects, loading: featuredLoading } = useProjects('featured')
  const { projects: projects, loading: projectsLoading } = useProjects('projects')
  const { projects: labs, loading: labsLoading } = useProjects('labs')

  // URL 동기화 (디바운스된 값 사용)
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [debouncedQuery, setSearchParams])

  // 필터링된 결과 (즉시 반영)
  const filteredFeatured = useMemo(
    () => filterProjects(featuredProjects, searchQuery),
    [featuredProjects, searchQuery]
  )
  const filteredProjects = useMemo(
    () => filterProjects(projects, searchQuery),
    [projects, searchQuery]
  )
  const filteredLabs = useMemo(
    () => filterProjects(labs, searchQuery),
    [labs, searchQuery]
  )

  // 전체 결과 수
  const totalResults = filteredFeatured.length + filteredProjects.length + filteredLabs.length
  const isSearching = searchQuery.trim().length > 0

  const handleTagClick = (tag) => {
    setSearchQuery(tag)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />

      <main className="w-full lg:w-[70%] max-w-5xl mx-auto flex-grow flex flex-col px-6 py-12 md:py-16 gap-12">
        {/* Search Section */}
        <section className="flex flex-col gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search projects, labs, or technologies..."
          />
          <TrendingTags tags={TRENDING_TAGS} onTagClick={handleTagClick} />
        </section>

        {/* Featured Work Section */}
        <section id="featured" className="flex flex-col gap-8 scroll-mt-20">
          <div className="flex items-center gap-3 pb-2 border-b border-border-light dark:border-border-dark">
            <Icon name="star" className="text-primary" />
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Featured Work
            </h2>
          </div>

          {featuredLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="progress_activity" className="text-primary animate-spin text-3xl" />
            </div>
          ) : filteredFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredFeatured.map((project) => (
                <FeaturedCard key={project.id} project={project} />
              ))}
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
              <Icon name="search_off" className="text-5xl mb-3" />
              <p>"{searchQuery}"에 대한 Featured 검색 결과가 없습니다</p>
            </div>
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-center py-8">
              No featured projects yet.
            </p>
          )}
        </section>

        {/* Projects Accordion */}
        <section id="projects" className="scroll-mt-20">
        <Accordion title="Projects" icon="folder_open">
          {projectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="progress_activity" className="text-primary animate-spin text-3xl" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  icon={PROJECT_ICONS[index % PROJECT_ICONS.length]}
                  iconColor={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                />
              ))}
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
              <Icon name="search_off" className="text-5xl mb-3" />
              <p>"{searchQuery}"에 대한 Projects 검색 결과가 없습니다</p>
            </div>
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-center py-8">
              No projects yet.
            </p>
          )}
        </Accordion>
        </section>

        {/* Labs Accordion */}
        <section id="labs" className="scroll-mt-20">
        <Accordion title="Labs & Playground" icon="science">
          {labsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="progress_activity" className="text-primary animate-spin text-3xl" />
            </div>
          ) : filteredLabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredLabs.map((lab, index) => (
                <LabCard
                  key={lab.id}
                  project={lab}
                  icon={LAB_ICONS[index % LAB_ICONS.length]}
                  gradient={LAB_GRADIENTS[index % LAB_GRADIENTS.length]}
                />
              ))}
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
              <Icon name="search_off" className="text-5xl mb-3" />
              <p>"{searchQuery}"에 대한 Labs 검색 결과가 없습니다</p>
            </div>
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-center py-8">
              No labs yet.
            </p>
          )}
        </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  )
}
