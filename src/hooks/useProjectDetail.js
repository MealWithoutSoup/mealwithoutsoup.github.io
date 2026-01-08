import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export function useProjectDetail(projectId) {
  const [project, setProject] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    async function fetchProjectDetail() {
      try {
        setLoading(true)
        setError(null)

        // Fetch project with challenges (only visible projects)
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select(`
            *,
            project_challenges (
              id,
              core_challenge,
              image_url,
              mermaid_syntax,
              problem_items,
              solution_items,
              result_items,
              display_order
            )
          `)
          .eq('id', projectId)
          .eq('visibility', true)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          const { project_challenges, ...projectData } = data
          setProject(projectData)

          // Sort challenges by display_order
          const sortedChallenges = (project_challenges || []).sort(
            (a, b) => a.display_order - b.display_order
          )
          setChallenges(sortedChallenges)
        }
      } catch (err) {
        console.error('Error fetching project detail:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetail()
  }, [projectId])

  return { project, challenges, loading, error }
}
