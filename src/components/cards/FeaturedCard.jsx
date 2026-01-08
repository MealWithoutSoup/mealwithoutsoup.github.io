import { Link } from 'react-router-dom'
import { Tag } from '../ui/Tag'

export function FeaturedCard({ project }) {
  const { id, title, description, thumbnail_url, proj_cover_image_url, tags = [] } = project
  const imageUrl = proj_cover_image_url || thumbnail_url

  // Format date range
  const dateRange = project.end_date
    ? `${project.start_date} - ${project.end_date}`
    : `${project.start_date} - Present`

  return (
    <Link to={`/project/${id}`}>
      <article className="neumorphic-card rounded-2xl overflow-hidden p-5">
        {/* Image */}
        <div className="neumorphic-inset aspect-video w-full rounded-xl overflow-hidden">
          {imageUrl ? (
            <div
              className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-4 flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
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
