import { Icon } from '../ui/Icon'

export function ChallengeSection({ challenge }) {
  const { core_challenge } = challenge

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 md:p-8 shadow-sm border border-border-light dark:border-border-dark border-l-4 border-l-primary">
      <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-4">
        <Icon name="flag" className="text-lg" />
        <span>Core Challenge</span>
      </div>
      <p className="text-lg md:text-xl leading-relaxed text-text-primary-light dark:text-text-secondary-dark">
        {core_challenge}
      </p>
    </div>
  )
}
