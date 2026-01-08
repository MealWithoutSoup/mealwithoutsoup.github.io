import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function LabCard({ project, icon = 'science' }) {
  const { id, title, description } = project

  return (
    <Link to={`/project/${id}`} className="block">
      <div className="neumorphic-card rounded-2xl p-4">
        {/* Icon Area */}
        <div className="neumorphic-inset h-20 rounded-xl mb-3 flex items-center justify-center">
          <Icon name={icon} className="text-3xl text-primary" />
        </div>

        {/* Content */}
        <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
