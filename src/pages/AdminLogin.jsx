import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/ui/Icon'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/admin/projects')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="w-full bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="shield" className="text-white text-lg" />
            </div>
            <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
              Admin Console
            </span>
          </div>
          <button className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
            Help
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
              Enter your credentials to access the portfolio admin dashboard.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full px-4 py-3 pr-10 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <Icon
                    name="mail"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-10 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                  >
                    <Icon name={showPassword ? 'visibility' : 'visibility_off'} />
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon name="progress_activity" className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Restricted Access. Authorized personnel only.
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
        © 2024 Portfolio Admin System. All rights reserved.
      </footer>
    </div>
  )
}
