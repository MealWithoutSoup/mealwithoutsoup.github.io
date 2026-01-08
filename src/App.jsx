import { Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { AdminLogin } from './pages/AdminLogin'
import { AdminProjects } from './pages/AdminProjects'
import { AdminProjectForm } from './pages/AdminProjectForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainPage />} />
      <Route path="/project/:id" element={<ProjectDetailPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/new"
        element={
          <ProtectedRoute>
            <AdminProjectForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/:id"
        element={
          <ProtectedRoute>
            <AdminProjectForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
