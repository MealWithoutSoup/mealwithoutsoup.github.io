import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { AdminHeader } from '../components/layout/AdminHeader'
import { Footer } from '../components/layout/Footer'
import { Icon } from '../components/ui/Icon'

const STATUS_COLORS = {
  published: 'text-green-600 dark:text-green-400',
  draft: 'text-gray-500 dark:text-gray-400',
  archived: 'text-yellow-600 dark:text-yellow-400',
}

const STATUS_DOT_COLORS = {
  published: 'bg-green-500',
  draft: 'bg-gray-400',
  archived: 'bg-yellow-500',
}

const TAG_COLORS = {
  'UI/UX Design': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Mobile App': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Branding': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Web App': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const ITEMS_PER_PAGE = 5

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'featured', label: 'Featured' },
  { value: 'projects', label: 'Projects' },
  { value: 'labs', label: 'Labs' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const VISIBILITY_OPTIONS = [
  { value: '', label: 'All Visibility' },
  { value: 'true', label: 'Visible' },
  { value: 'false', label: 'Hidden' },
]

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Newest First' },
  { value: 'created_at-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
  { value: 'start_date-desc', label: 'Start Date (Latest)' },
  { value: 'start_date-asc', label: 'Start Date (Earliest)' },
]

export function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at-desc')

  // Dropdown visibility
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const navigate = useNavigate()

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      // Parse sort option
      const [sortField, sortDirection] = sortBy.split('-')

      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortDirection === 'asc' })

      // Search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      }

      // Category filter
      if (categoryFilter) {
        query = query.eq('category', categoryFilter)
      }

      // Status filter
      if (statusFilter) {
        query = query.eq('project_status', statusFilter)
      }

      // Visibility filter
      if (visibilityFilter) {
        query = query.eq('visibility', visibilityFilter === 'true')
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error, count } = await query.range(from, to)

      if (error) throw error
      setProjects(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, categoryFilter, statusFilter, visibilityFilter, sortBy])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowFilterDropdown(false)
        setShowSortDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      fetchProjects()
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project')
    }
  }

  const handleToggleVisibility = async (id, currentVisibility) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ visibility: !currentVisibility })
        .eq('id', id)

      if (error) throw error
      fetchProjects()
    } catch (err) {
      console.error('Error toggling visibility:', err)
      alert('Failed to update visibility')
    }
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getTagColor = (tag) => TAG_COLORS[tag] || TAG_COLORS.default

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <AdminHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
              Portfolio Projects
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Manage your portfolio entries, track status, and update content.
            </p>
          </div>
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="add" />
            New Project
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by project title, tech stack, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown)
                setShowSortDropdown(false)
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary transition-colors ${
                (categoryFilter || statusFilter || visibilityFilter)
                  ? 'border-primary'
                  : 'border-border-light dark:border-border-dark'
              }`}
            >
              <Icon name="filter_list" />
              Filter
              {(categoryFilter || statusFilter || visibilityFilter) && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-50 p-4">
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility Filter */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                      Visibility
                    </label>
                    <select
                      value={visibilityFilter}
                      onChange={(e) => {
                        setVisibilityFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {VISIBILITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {(categoryFilter || statusFilter || visibilityFilter) && (
                    <button
                      onClick={() => {
                        setCategoryFilter('')
                        setStatusFilter('')
                        setVisibilityFilter('')
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown)
                setShowFilterDropdown(false)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary transition-colors"
            >
              <Icon name="sort" />
              Sort
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-50 py-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value)
                      setShowSortDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.value
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-primary-light dark:text-text-primary-dark hover:bg-background-light dark:hover:bg-background-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Project Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Skill Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <Icon name="progress_activity" className="text-primary animate-spin text-3xl" />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-text-secondary-light dark:text-text-secondary-dark">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                    {/* Preview */}
                    <td className="px-4 py-4">
                      {project.proj_cover_image_url ? (
                        <img
                          src={project.proj_cover_image_url}
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="folder" className="text-primary text-xl" />
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {project.title}
                      </p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        ID: #{project.id.slice(0, 8)}
                      </p>
                    </td>

                    {/* Tech Stack */}
                    <td className="px-4 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {project.tags?.slice(0, 3).join(', ') || '-'}
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.category && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTagColor(project.category)}`}>
                            {project.category}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {formatDate(project.start_date)}
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <Icon name="visibility" className="text-base" />
                        {project.view_count || 0}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[project.project_status || 'draft']}`} />
                        <span className={`text-sm capitalize ${STATUS_COLORS[project.project_status || 'draft']}`}>
                          {project.project_status || 'Draft'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(project.id, project.visibility)}
                          className={`p-2 transition-colors ${
                            project.visibility
                              ? 'text-green-500 hover:text-green-600'
                              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
                          }`}
                          title={project.visibility ? '공개 (클릭하여 비공개로 변경)' : '비공개 (클릭하여 공개로 변경)'}
                        >
                          <Icon name={project.visibility ? 'visibility' : 'visibility_off'} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/projects/${project.id}`)}
                          className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" />
                        </button>
                        <Link
                          to={`/project/${project.id}`}
                          target="_blank"
                          className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                          title="View"
                        >
                          <Icon name="open_in_new" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="chevron_left" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-text-secondary-light dark:text-text-secondary-dark">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-10 h-10 rounded-lg font-medium border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary transition-colors`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
