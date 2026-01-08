import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function ProjectCard({ project, icon = 'folder' }) {
  const { id, title, description, tags = [] } = project

  return (
    <Link to={`/project/${id}`} className="block">
      <div className="neumorphic-card rounded-2xl p-5 h-full">
        {/* Icon Area */}
        <div className="flex items-center justify-between mb-4">
          <div className="neumorphic-inset p-3 rounded-xl">
            <Icon name={icon} className="text-[24px] text-primary" />
          </div>
          <Icon
            name="arrow_forward"
            className="text-text-secondary-light dark:text-text-secondary-dark opacity-50 group-hover:opacity-100 transition-opacity text-[20px]"
          />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-text-primary-light dark:text-text-primary-dark mb-2">
          {title}
        </h3>

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
