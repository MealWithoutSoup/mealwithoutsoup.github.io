import { Icon } from './Icon'

export function Accordion({ title, icon, children, defaultOpen = false }) {
  return (
    <details className="group/accordion" open={defaultOpen}>
      <summary className="list-none cursor-pointer">
        <div className="flex items-center justify-between pb-2 border-b border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            <Icon
              name={icon}
              className="text-text-secondary-light dark:text-text-secondary-dark group-hover/accordion:text-primary transition-colors"
            />
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover/accordion:text-primary transition-colors">
              {title}
            </h2>
          </div>
          <Icon
            name="expand_more"
            className="text-text-secondary-light dark:text-text-secondary-dark transform group-open/accordion:rotate-180 transition-transform duration-300"
          />
        </div>
      </summary>
      <div className="pt-8">
        {children}
      </div>
    </details>
  )
}
