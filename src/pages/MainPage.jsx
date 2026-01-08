import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
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

export function MainPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { projects: featuredProjects, loading: featuredLoading } = useProjects('featured')
  const { projects: projects, loading: projectsLoading } = useProjects('projects')
  const { projects: labs, loading: labsLoading } = useProjects('labs')

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
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <FeaturedCard key={project.id} project={project} />
              ))}
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
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  icon={PROJECT_ICONS[index % PROJECT_ICONS.length]}
                  iconColor={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                />
              ))}
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
          ) : labs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {labs.map((lab, index) => (
                <LabCard
                  key={lab.id}
                  project={lab}
                  icon={LAB_ICONS[index % LAB_ICONS.length]}
                  gradient={LAB_GRADIENTS[index % LAB_GRADIENTS.length]}
                />
              ))}
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
