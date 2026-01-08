import { Icon } from '../ui/Icon'

function ListItem({ text, bulletColor }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 size-1.5 rounded-full ${bulletColor} shrink-0`} />
      <span className="text-sm md:text-base leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
        {text}
      </span>
    </li>
  )
}

function Column({ title, icon, items, bulletColor, headerColor }) {
  if (!items || items.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <h3 className={`text-lg font-bold flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-2 ${headerColor}`}>
        <Icon name={icon} className="text-xl" />
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <ListItem key={index} text={item} bulletColor={bulletColor} />
        ))}
      </ul>
    </div>
  )
}

export function ProblemSolutionResult({ problemItems, solutionItems, resultItems }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Column
        title="Problem"
        icon="error_outline"
        items={problemItems}
        bulletColor="bg-red-500"
        headerColor="text-red-600 dark:text-red-400"
      />
      <Column
        title="Solution"
        icon="lightbulb"
        items={solutionItems}
        bulletColor="bg-primary"
        headerColor="text-primary"
      />
      <Column
        title="Result"
        icon="check_circle"
        items={resultItems}
        bulletColor="bg-green-500"
        headerColor="text-green-600 dark:text-green-400"
      />
    </div>
  )
}
