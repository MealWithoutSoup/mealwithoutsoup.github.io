import { useRef, useEffect } from 'react'
import { Icon } from './Icon'

export function Accordion({ title, icon, children, defaultOpen = false, isOpen, onToggle }) {
  const detailsRef = useRef(null)

  // 외부에서 isOpen이 제어될 때 details 상태 동기화
  useEffect(() => {
    if (isOpen !== undefined && detailsRef.current) {
      detailsRef.current.open = isOpen
    }
  }, [isOpen])

  const handleToggle = (e) => {
    if (onToggle) {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <details
      ref={detailsRef}
      className="group/accordion"
      open={isOpen !== undefined ? isOpen : defaultOpen}
    >
      <summary className="list-none cursor-pointer" onClick={handleToggle}>
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
      {/* 애니메이션 래퍼 */}
      <div className="grid grid-rows-[0fr] group-open/accordion:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
        <div className="overflow-hidden">
          <div className="pt-8">
            {children}
          </div>
        </div>
      </div>
    </details>
  )
}
