import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { Tag } from '../ui/Tag'

const iconColors = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-primary',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600',
}

export function ProjectCard({ project, icon = 'folder', iconColor = 'blue' }) {
  const { id, title, description, tags = [] } = project

  return (
    <Link
      to={`/project/${id}`}
      className="group block bg-card-light dark:bg-card-dark rounded-lg p-4 border border-border-light dark:border-border-dark hover:border-primary hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconColors[iconColor]}`}>
          <Icon name={icon} className="text-[24px]" />
        </div>
        <Icon
          name="arrow_forward"
          className="text-border-light dark:text-border-dark group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]"
        />
      </div>

      <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark bg-background-light dark:bg-background-dark px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
