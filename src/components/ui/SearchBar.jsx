import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

export function SearchBar({ value, onChange, placeholder = 'Search...', suggestions = [] }) {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef(null)

  const showSuggestions = isFocused && value.trim().length > 0 && suggestions.length > 0

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 키보드 네비게이션
  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selected = suggestions[selectedIndex]
      if (selected) {
        window.location.href = `/project/${selected.id}`
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false)
    }
  }

  // 입력 변경 시 선택 인덱스 초기화
  const handleChange = (e) => {
    onChange(e.target.value)
    setSelectedIndex(-1)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Icon name="search" className="text-text-secondary-light dark:text-text-secondary-dark" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        className={`block w-full pl-10 pr-3 py-3 border border-border-light dark:border-border-dark leading-5 bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-lg shadow-sm transition-all ${
          showSuggestions ? 'rounded-t-xl rounded-b-none' : 'rounded-xl'
        }`}
        placeholder={placeholder}
      />

      {/* 자동완성 드롭다운 */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-card-light dark:bg-card-dark border border-t-0 border-border-light dark:border-border-dark rounded-b-xl shadow-lg overflow-hidden z-50">
          {suggestions.slice(0, 6).map((item, index) => (
            <Link
              key={item.id}
              to={`/project/${item.id}`}
              onClick={() => setIsFocused(false)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors ${
                index === selectedIndex ? 'bg-primary/10' : ''
              }`}
            >
              <Icon
                name={item.category === 'labs' ? 'science' : item.category === 'featured' ? 'star' : 'folder'}
                className="text-primary text-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-text-primary-light dark:text-text-primary-dark font-medium truncate">
                  {item.title}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                  {item.category || 'project'}
                  {item.tags?.length > 0 && ` · ${item.tags.slice(0, 2).join(', ')}`}
                </p>
              </div>
              <Icon name="arrow_forward" className="text-text-secondary-light dark:text-text-secondary-dark" />
            </Link>
          ))}
          {suggestions.length > 6 && (
            <div className="px-4 py-2 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center border-t border-border-light dark:border-border-dark">
              +{suggestions.length - 6}개 더 있음
            </div>
          )}
        </div>
      )}
    </div>
  )
}
