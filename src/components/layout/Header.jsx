import { Link } from 'react-router-dom'
import { ThemeToggle } from '../ui/ThemeToggle'

const navLinks = [
  { label: 'Featured', href: '/#featured' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Labs & Playground', href: '/#labs' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-[960px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Home Link */}
        <Link
          to="/"
          className="text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors font-bold"
        >
          JaeHong's Portfolio
        </Link>

        {/* Right Side - Navigation + Theme Toggle */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
