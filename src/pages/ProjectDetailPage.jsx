import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectDetail } from '../hooks/useProjectDetail'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Tag } from '../components/ui/Tag'
import { Icon } from '../components/ui/Icon'
import { ChallengeSection } from '../components/project/ChallengeSection'
import { ProblemSolutionResult } from '../components/project/ProblemSolutionResult'
import { MermaidDiagram } from '../components/project/MermaidDiagram'

export function ProjectDetailPage() {
  const { id } = useParams()
  const { project, challenges, loading, error } = useProjectDetail(id)
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Icon name="progress_activity" className="text-primary animate-spin text-4xl" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <Icon name="error" className="text-red-500 text-4xl" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {error || 'Project not found'}
          </p>
          <Link
            to="/"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Icon name="arrow_back" className="text-lg" />
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const currentChallenge = challenges[currentChallengeIndex]

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const dateRange = project.end_date
    ? `${formatDate(project.start_date)} - ${formatDate(project.end_date)}`
    : `${formatDate(project.start_date)} - Present`

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: project.category || 'Projects', href: '/' },
    { label: project.title },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {project.category || 'Project'}
            </span>
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {dateRange}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            {project.title}
          </h1>

          {/* 프로젝트 설명 */}
          {project.proj_description && (
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6 whitespace-pre-line">
              {project.proj_description}
            </p>
          )}

          {/* 프로젝트 링크 */}
          {project.proj_url && (
            <a
              href={project.proj_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Icon name="link" className="text-lg" />
              프로젝트 보기
              <Icon name="open_in_new" className="text-sm" />
            </a>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} label={tag} variant="primary" />
              ))}
            </div>
          )}
        </div>

        {/* Challenges Section */}
        {challenges.length > 0 && (
          <div className="space-y-8">
            {/* Top Challenge Navigation (if multiple) */}
            {challenges.length > 1 && (
              <div className="flex items-center justify-between py-4 border-y border-border-light dark:border-border-dark">
                {/* Previous Challenge */}
                <button
                  onClick={() => setCurrentChallengeIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentChallengeIndex === 0}
                  className={`flex items-center gap-3 group ${
                    currentChallengeIndex === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:text-primary'
                  }`}
                >
                  <Icon name="arrow_back" className="text-xl" />
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                      Previous
                    </div>
                    <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                      {currentChallengeIndex > 0
                        ? challenges[currentChallengeIndex - 1].core_challenge?.slice(0, 30) + '...'
                        : ''}
                    </div>
                  </div>
                </button>

                {/* Next Challenge */}
                <button
                  onClick={() => setCurrentChallengeIndex((prev) => Math.min(challenges.length - 1, prev + 1))}
                  disabled={currentChallengeIndex === challenges.length - 1}
                  className={`flex items-center gap-3 group ${
                    currentChallengeIndex === challenges.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:text-primary'
                  }`}
                >
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                      Next
                    </div>
                    <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                      {currentChallengeIndex < challenges.length - 1
                        ? challenges[currentChallengeIndex + 1].core_challenge?.slice(0, 30) + '...'
                        : ''}
                    </div>
                  </div>
                  <Icon name="arrow_forward" className="text-xl" />
                </button>
              </div>
            )}

            {/* Current Challenge Content */}
            {currentChallenge && (
              <div className="space-y-8">
                {/* Core Challenge */}
                <ChallengeSection challenge={currentChallenge} />

                {/* Diagram */}
                {(currentChallenge.image_url || currentChallenge.mermaid_syntax) && (
                  <div>
                    <h3 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider flex items-center gap-2 mb-4">
                      <Icon name="schema" className="text-primary" />
                      Technical Diagram
                    </h3>
                    <MermaidDiagram
                      syntax={currentChallenge.mermaid_syntax}
                      imageUrl={currentChallenge.image_url}
                    />
                  </div>
                )}

                {/* Problem / Solution / Result */}
                {(currentChallenge.problem_items?.length > 0 ||
                  currentChallenge.solution_items?.length > 0 ||
                  currentChallenge.result_items?.length > 0) && (
                  <div>
                    <h3 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider flex items-center gap-2 mb-6">
                      <Icon name="analytics" className="text-primary" />
                      Analysis
                    </h3>
                    <ProblemSolutionResult
                      problemItems={currentChallenge.problem_items}
                      solutionItems={currentChallenge.solution_items}
                      resultItems={currentChallenge.result_items}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bottom Pagination */}
            {challenges.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {/* Prev Arrow */}
                <button
                  onClick={() => setCurrentChallengeIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentChallengeIndex === 0}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                    currentChallengeIndex === 0
                      ? 'border-border-light dark:border-border-dark text-border-light dark:text-border-dark cursor-not-allowed'
                      : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary'
                  }`}
                >
                  <Icon name="chevron_left" />
                </button>

                {/* Page Numbers */}
                {challenges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChallengeIndex(index)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all font-medium ${
                      index === currentChallengeIndex
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next Arrow */}
                <button
                  onClick={() => setCurrentChallengeIndex((prev) => Math.min(challenges.length - 1, prev + 1))}
                  disabled={currentChallengeIndex === challenges.length - 1}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                    currentChallengeIndex === challenges.length - 1
                      ? 'border-border-light dark:border-border-dark text-border-light dark:text-border-dark cursor-not-allowed'
                      : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary'
                  }`}
                >
                  <Icon name="chevron_right" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Challenges Message */}
        {challenges.length === 0 && (
          <div className="text-center py-12">
            <Icon name="info" className="text-text-secondary-light dark:text-text-secondary-dark text-4xl mb-4" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              No challenges documented for this project yet.
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="arrow_back" />
            Back to all projects
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
