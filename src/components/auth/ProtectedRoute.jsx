import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../ui/Icon'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Icon name="progress_activity" className="text-primary animate-spin text-4xl" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return children
}
