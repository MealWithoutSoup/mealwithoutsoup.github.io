import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../ui/Icon'

export function AdminHeader() {
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
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
              {user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
        >
          <Icon name="logout" />
          Logout
        </button>
      </div>
    </header>
  )
}
