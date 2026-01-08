export function Tag({ label, variant = 'default' }) {
  const baseClasses = 'px-2.5 py-1 text-xs font-medium rounded-md'

  const variants = {
    default: 'bg-background-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark',
    primary: 'bg-primary/10 text-primary border border-primary/20',
  }

  return (
    <span className={`${baseClasses} ${variants[variant]}`}>
      {label}
    </span>
  )
}
