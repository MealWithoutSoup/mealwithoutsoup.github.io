import { useEffect, useRef, useState } from 'react'

// CDN에서 Mermaid 로드
let mermaidPromise = null
const loadMermaid = () => {
  if (mermaidPromise) return mermaidPromise

  mermaidPromise = new Promise((resolve, reject) => {
    if (window.mermaid) {
      resolve(window.mermaid)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
      })
      resolve(window.mermaid)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return mermaidPromise
}

export function MermaidDiagram({ syntax, imageUrl, caption }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!syntax || !containerRef.current) return

    const renderDiagram = async () => {
      try {
        setError(null)
        setLoading(true)

        const mermaid = await loadMermaid()
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, syntax)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      } finally {
        setLoading(false)
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
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
          <div ref={containerRef} className={`flex justify-center ${loading ? 'hidden' : ''}`} />
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
