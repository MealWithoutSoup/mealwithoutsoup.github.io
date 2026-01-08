import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

const gradients = {
  indigo: 'from-indigo-500 to-purple-500',
  green: 'from-green-400 to-cyan-500',
  orange: 'from-orange-400 to-red-500',
  gray: 'from-gray-700 to-black',
  blue: 'from-blue-400 to-indigo-500',
  pink: 'from-pink-400 to-rose-500',
}

export function LabCard({ project, icon = 'science', gradient = 'indigo' }) {
  const { id, title, description } = project

  return (
    <Link
      to={`/project/${id}`}
      className="bg-background-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/30 transition-colors cursor-pointer block"
    >
      {/* Gradient Icon Area */}
      <div
        className={`h-24 bg-gradient-to-br ${gradients[gradient]} rounded mb-3 flex items-center justify-center text-white`}
      >
        <Icon name={icon} className="text-3xl" />
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
    </Link>
  )
}
