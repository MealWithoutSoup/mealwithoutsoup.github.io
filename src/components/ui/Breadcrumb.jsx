import { Link } from 'react-router-dom'

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>}
          {item.href ? (
            <Link
              to={item.href}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-primary">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
