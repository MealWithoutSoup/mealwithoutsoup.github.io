import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid with config
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
})

export function MermaidDiagram({ syntax, imageUrl, caption }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!syntax || !containerRef.current) return

    const renderDiagram = async () => {
      try {
        setError(null)
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, syntax)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      }
    }

    renderDiagram()
  }, [syntax])

  // If we have an image URL and no mermaid syntax, show the image
  if (imageUrl && !syntax) {
    return (
      <figure className="flex flex-col gap-2">
        <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
          <img
            src={imageUrl}
            alt={caption || 'Technical diagram'}
            className="w-full h-auto"
          />
        </div>
        {caption && (
          <figcaption className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // If we have mermaid syntax, render the diagram
  if (syntax) {
    return (
      <figure className="flex flex-col gap-2">
        <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 overflow-x-auto">
          {error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div ref={containerRef} className="flex justify-center" />
          )}
        </div>
        {caption && (
          <figcaption className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return null
}
