import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../ui/Icon'

export function AdminHeader({ showLogout = true }) {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <header className="w-full bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="shield" className="text-white text-lg" />
          </div>
          <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
            Admin Console
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
          >
            <Icon name="home" />
            메인페이지
          </Link>
          {showLogout && user && (
            <>
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
              >
                <Icon name="logout" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
