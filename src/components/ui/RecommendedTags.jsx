export function RecommendedTags({ tags, onTagClick }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium mr-1">
        Recommended:
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className="px-3 py-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-primary hover:text-primary rounded-full transition-colors text-text-secondary-light dark:text-text-secondary-dark"
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
