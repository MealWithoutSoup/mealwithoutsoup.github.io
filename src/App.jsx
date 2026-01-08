import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider'
import { MainPage } from './pages/MainPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
