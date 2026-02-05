import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function ProjectCard({ project, icon = 'folder' }) {
  const { id, title, description, proj_cover_image_url, tags = [], start_date, end_date } = project

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
  }

  const dateRange = end_date
    ? `${formatDate(start_date)} - ${formatDate(end_date)}`
    : `${formatDate(start_date)} - Present`

  return (
    <Link to={`/project/${id}`} className="block">
      <div className="neumorphic-card rounded-2xl p-4 h-full">
        {/* Image/Icon Area */}
        <div className="neumorphic-inset aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          {proj_cover_image_url ? (
            <div
              className="w-full h-full bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${proj_cover_image_url}')` }}
            />
          ) : (
            <Icon name={icon} className="text-4xl text-primary" />
          )}
        </div>

        {/* Title & Date */}
        <h3 className="font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-1">
          {title}
        </h3>
        {start_date && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
            {dateRange}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-auto">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
