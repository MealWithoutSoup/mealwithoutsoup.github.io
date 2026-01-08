import { Link } from 'react-router-dom'
import { Tag } from '../ui/Tag'

export function FeaturedCard({ project }) {
  const { id, title, description, thumbnail_url, tags = [] } = project

  // Format date range
  const dateRange = project.end_date
    ? `${project.start_date} - ${project.end_date}`
    : `${project.start_date} - Present`

  return (
    <Link to={`/project/${id}`}>
      <article className="group relative flex flex-col bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark hover:shadow-md hover:border-primary/50 transition-all duration-300">
        {/* Image */}
        <div className="aspect-video w-full overflow-hidden bg-background-light dark:bg-background-dark">
          {thumbnail_url ? (
            <div
              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${thumbnail_url}')` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 flex-grow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                {title}
              </h3>
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {dateRange}
              </span>
            </div>
            {description && (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
