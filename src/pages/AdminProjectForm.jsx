import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { AdminHeader } from '../components/layout/AdminHeader'
import { Icon } from '../components/ui/Icon'
import { Footer } from '../components/layout/Footer'

const CATEGORY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'projects', label: 'Projects' },
  { value: 'labs', label: 'Labs & Playground' },
]

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const emptyChallenge = {
  id: null,
  core_challenge: '',
  image_url: '',
  mermaid_syntax: '',
  problem_items: [''],
  solution_items: [''],
  result_items: [''],
}

export function AdminProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  // Project form state
  const [project, setProject] = useState({
    title: '',
    category: 'projects',
    project_status: 'draft',
    proj_cover_image_url: '',
    proj_description: '',
    proj_url: '',
    start_date: '',
    end_date: '',
    tags: [],
  })
  const [uploadingCover, setUploadingCover] = useState(false)

  // Challenges form state
  const [challenges, setChallenges] = useState([{ ...emptyChallenge }])

  const fetchProject = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (projectError) throw projectError

      setProject({
        title: projectData.title || '',
        category: projectData.category || 'projects',
        project_status: projectData.project_status || 'draft',
        proj_cover_image_url: projectData.proj_cover_image_url || '',
        proj_description: projectData.proj_description || '',
        proj_url: projectData.proj_url || '',
        start_date: projectData.start_date || '',
        end_date: projectData.end_date || '',
        tags: projectData.tags || [],
      })

      // Fetch challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('project_challenges')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true })

      if (challengesError) throw challengesError

      if (challengesData && challengesData.length > 0) {
        setChallenges(
          challengesData.map((c) => ({
            id: c.id,
            core_challenge: c.core_challenge || '',
            image_url: c.image_url || '',
            mermaid_syntax: c.mermaid_syntax || '',
            problem_items: c.problem_items?.length > 0 ? c.problem_items : [''],
            solution_items: c.solution_items?.length > 0 ? c.solution_items : [''],
            result_items: c.result_items?.length > 0 ? c.result_items : [''],
          }))
        )
      }
    } catch (err) {
      console.error('Error fetching project:', err)
      alert('Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isEditing) {
      fetchProject()
    }
  }, [isEditing, fetchProject])

  const handleProjectChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!project.tags.includes(tagInput.trim())) {
        setProject((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleCoverImageUpload = async (file) => {
    if (!file) return

    setUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop().toLowerCase()
      const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `covers/${fileName}`

      // Determine content type
      const contentTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
      }

      const { error: uploadError } = await supabase.storage
        .from('portfoilo_images')
        .upload(filePath, file, {
          contentType: contentTypes[fileExt] || file.type,
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfoilo_images')
        .getPublicUrl(filePath)

      handleProjectChange('proj_cover_image_url', publicUrl)
    } catch (err) {
      console.error('Error uploading cover image:', err)
      alert(`이미지 업로드 실패: ${err.message}\n\nSupabase Dashboard에서 'portfoilo_images' 버킷이 생성되어 있고, Storage Policies가 설정되어 있는지 확인해주세요.`)
    } finally {
      setUploadingCover(false)
    }
  }

  const handleChallengeChange = (index, field, value) => {
    setChallenges((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleListItemChange = (challengeIndex, listType, itemIndex, value) => {
    setChallenges((prev) => {
      const updated = [...prev]
      const list = [...updated[challengeIndex][listType]]
      list[itemIndex] = value
      updated[challengeIndex] = { ...updated[challengeIndex], [listType]: list }
      return updated
    })
  }

  const handleAddListItem = (challengeIndex, listType) => {
    setChallenges((prev) => {
      const updated = [...prev]
      updated[challengeIndex] = {
        ...updated[challengeIndex],
        [listType]: [...updated[challengeIndex][listType], ''],
      }
      return updated
    })
  }

  const handleRemoveListItem = (challengeIndex, listType, itemIndex) => {
    setChallenges((prev) => {
      const updated = [...prev]
      const list = updated[challengeIndex][listType].filter((_, i) => i !== itemIndex)
      updated[challengeIndex] = {
        ...updated[challengeIndex],
        [listType]: list.length > 0 ? list : [''],
      }
      return updated
    })
  }

  const handleAddChallenge = () => {
    setChallenges((prev) => [...prev, { ...emptyChallenge }])
  }

  const handleRemoveChallenge = (index) => {
    if (challenges.length <= 1) return
    setChallenges((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (challengeIndex, file) => {
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop().toLowerCase()
      const fileName = `challenge-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `challenges/${fileName}`

      // Determine content type
      const contentTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
      }

      const { error: uploadError } = await supabase.storage
        .from('portfoilo_images')
        .upload(filePath, file, {
          contentType: contentTypes[fileExt] || file.type,
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfoilo_images')
        .getPublicUrl(filePath)

      handleChallengeChange(challengeIndex, 'image_url', publicUrl)
    } catch (err) {
      console.error('Error uploading image:', err)
      alert(`이미지 업로드 실패: ${err.message}\n\nSupabase Dashboard에서 'portfoilo_images' 버킷이 생성되어 있고, Storage Policies가 설정되어 있는지 확인해주세요.`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!project.title.trim()) {
      alert('Project title is required')
      return
    }

    if (!project.start_date) {
      alert('Start date is required')
      return
    }

    setSaving(true)

    try {
      let projectId = id

      // Create or update project
      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update({
            title: project.title,
            category: project.category,
            project_status: project.project_status,
            proj_cover_image_url: project.proj_cover_image_url || null,
            proj_description: project.proj_description || null,
            proj_url: project.proj_url || null,
            start_date: project.start_date,
            end_date: project.end_date || null,
            tags: project.tags,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            title: project.title,
            category: project.category,
            project_status: project.project_status,
            proj_cover_image_url: project.proj_cover_image_url || null,
            proj_description: project.proj_description || null,
            proj_url: project.proj_url || null,
            start_date: project.start_date,
            end_date: project.end_date || null,
            tags: project.tags,
          })
          .select()
          .single()

        if (error) throw error
        projectId = data.id
      }

      // Delete existing challenges if editing
      if (isEditing) {
        const { error: deleteError } = await supabase
          .from('project_challenges')
          .delete()
          .eq('project_id', id)

        if (deleteError) throw deleteError
      }

      // Insert challenges
      const challengesToInsert = challenges
        .filter((c) => c.core_challenge.trim())
        .map((c, index) => ({
          project_id: projectId,
          core_challenge: c.core_challenge,
          image_url: c.image_url || null,
          mermaid_syntax: c.mermaid_syntax || null,
          problem_items: c.problem_items.filter((item) => item.trim()),
          solution_items: c.solution_items.filter((item) => item.trim()),
          result_items: c.result_items.filter((item) => item.trim()),
          display_order: index,
        }))

      if (challengesToInsert.length > 0) {
        const { error: challengeError } = await supabase
          .from('project_challenges')
          .insert(challengesToInsert)

        if (challengeError) throw challengeError
      }

      navigate('/admin/projects')
    } catch (err) {
      console.error('Error saving project:', err)
      alert('Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <AdminHeader />
        <main className="flex-grow flex items-center justify-center">
          <Icon name="progress_activity" className="text-primary animate-spin text-4xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <AdminHeader />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/admin/projects" className="text-primary hover:underline">
            Admin
          </Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <Link to="/admin/projects" className="text-primary hover:underline">
            Projects
          </Link>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">
            {isEditing ? 'Edit Project' : 'New Project'}
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
              {isEditing ? 'Edit Project Details' : 'Create New Project'}
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Update general project information, tech stack, and detailed problem analysis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="save" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <section className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="info" className="text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                프로젝트 정보
              </h2>
            </div>

            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange('title', e.target.value)}
                  placeholder="Enter project title"
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Category
                  </label>
                  <select
                    value={project.category}
                    onChange={(e) => handleProjectChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Status
                  </label>
                  <select
                    value={project.project_status}
                    onChange={(e) => handleProjectChange('project_status', e.target.value)}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={project.start_date}
                    onChange={(e) => handleProjectChange('start_date', e.target.value)}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={project.end_date}
                    onChange={(e) => handleProjectChange('end_date', e.target.value)}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    진행 중이면 비워두세요
                  </p>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  프로젝트 설명
                </label>
                <textarea
                  value={project.proj_description}
                  onChange={(e) => handleProjectChange('proj_description', e.target.value)}
                  placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  프로젝트 URL
                </label>
                <input
                  type="url"
                  value={project.proj_url}
                  onChange={(e) => handleProjectChange('proj_url', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Tech Stack / Tags */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Icon name="close" className="text-sm" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="기술 태그 입력 (Press Enter)"
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  커버 이미지
                </label>
                {project.proj_cover_image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                    <img
                      src={project.proj_cover_image_url}
                      alt="Cover"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleProjectChange('proj_cover_image_url', '')}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:border-primary transition-colors bg-background-light dark:bg-background-dark">
                    {uploadingCover ? (
                      <Icon name="progress_activity" className="text-4xl text-primary animate-spin" />
                    ) : (
                      <>
                        <Icon name="image" className="text-4xl text-primary mb-2" />
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          클릭하여 커버 이미지 업로드
                        </span>
                        <span className="text-xs text-primary mt-2">SELECT FILE</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverImageUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* Challenges */}
          {challenges.map((challenge, challengeIndex) => (
            <section
              key={challengeIndex}
              className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Icon name="build" className="text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    핵심 기술적 챌린지 {challenges.length > 1 ? `#${challengeIndex + 1}` : ''}
                  </h2>
                </div>
                {challenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChallenge(challengeIndex)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Icon name="delete" />
                    Delete Challenge
                  </button>
                )}
              </div>

              {/* Core Problem */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="flag" className="text-primary" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    핵심 문제
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={challenge.core_challenge}
                      onChange={(e) =>
                        handleChallengeChange(challengeIndex, 'core_challenge', e.target.value)
                      }
                      placeholder="e.g., High Latency in Review Retrieval"
                      className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Diagrams */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="auto_awesome" className="text-text-primary-light dark:text-text-primary-dark" />
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    다이어그램
                  </span>
                </div>
                {challenge.image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                    <img
                      src={challenge.image_url}
                      alt="Technical diagram"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleChallengeChange(challengeIndex, 'image_url', '')}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:border-primary transition-colors bg-background-light dark:bg-background-dark">
                    <Icon name="cloud_upload" className="text-4xl text-primary mb-2" />
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Drag and drop or click to replace
                    </span>
                    <span className="text-xs text-primary mt-2">SELECT FILE</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(challengeIndex, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  Recommended size: 1920×1080px. High contrast diagrams work best.
                </p>
              </div>

              {/* Mermaid Syntax (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Mermaid Diagram Syntax (Optional)
                </label>
                <textarea
                  value={challenge.mermaid_syntax}
                  onChange={(e) =>
                    handleChallengeChange(challengeIndex, 'mermaid_syntax', e.target.value)
                  }
                  placeholder="Enter mermaid diagram syntax..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                />
              </div>

              {/* Problem Cause */}
              <ListSection
                title="문제 원인"
                icon="error"
                iconColor="text-red-500"
                items={challenge.problem_items}
                onItemChange={(itemIndex, value) =>
                  handleListItemChange(challengeIndex, 'problem_items', itemIndex, value)
                }
                onAddItem={() => handleAddListItem(challengeIndex, 'problem_items')}
                onRemoveItem={(itemIndex) =>
                  handleRemoveListItem(challengeIndex, 'problem_items', itemIndex)
                }
                addButtonText="Add Another Cause"
              />

              {/* Solution Process */}
              <ListSection
                title="해결 과정"
                icon="build"
                iconColor="text-yellow-500"
                items={challenge.solution_items}
                onItemChange={(itemIndex, value) =>
                  handleListItemChange(challengeIndex, 'solution_items', itemIndex, value)
                }
                onAddItem={() => handleAddListItem(challengeIndex, 'solution_items')}
                onRemoveItem={(itemIndex) =>
                  handleRemoveListItem(challengeIndex, 'solution_items', itemIndex)
                }
                addButtonText="Add Another Step"
              />

              {/* Result */}
              <ListSection
                title="결과"
                icon="check_circle"
                iconColor="text-green-500"
                items={challenge.result_items}
                onItemChange={(itemIndex, value) =>
                  handleListItemChange(challengeIndex, 'result_items', itemIndex, value)
                }
                onAddItem={() => handleAddListItem(challengeIndex, 'result_items')}
                onRemoveItem={(itemIndex) =>
                  handleRemoveListItem(challengeIndex, 'result_items', itemIndex)
                }
                addButtonText="Add Another Result"
              />
            </section>
          ))}

          {/* Add New Problem Button */}
          <button
            type="button"
            onClick={handleAddChallenge}
            className="w-full py-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl text-primary hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="add" className="text-primary" />
            </div>
            <span className="font-medium">Add New Problem</span>
          </button>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-6 py-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="save" />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

// Reusable List Section Component
function ListSection({ title, icon, iconColor, items, onItemChange, onAddItem, onRemoveItem, addButtonText }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name={icon} className={iconColor} />
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
            {title}
          </span>
        </div>
        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          List Items
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onItemChange(index, e.target.value)}
              placeholder={`Enter ${title.toLowerCase()} item...`}
              className="flex-grow px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"
            >
              <Icon name="delete" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddItem}
        className="flex items-center gap-1 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <Icon name="add_circle" className="text-sm" />
        {addButtonText}
      </button>
    </div>
  )
}
