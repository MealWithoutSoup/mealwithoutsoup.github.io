import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

// 조회수 증가 함수 (세션 기반 중복 방지)
async function incrementViewCount(projectId) {
  const viewedKey = `viewed-${projectId}`

  // 이미 이 세션에서 본 프로젝트인지 확인
  if (sessionStorage.getItem(viewedKey)) {
    return
  }

  // 즉시 세션에 기록하여 중복 호출 방지 (React Strict Mode 대응)
  sessionStorage.setItem(viewedKey, 'true')

  try {
    // RPC 함수 호출 (race condition 방지)
    const { error } = await supabase.rpc('increment_view_count', {
      project_id: projectId
    })

    if (error) {
      // RPC 함수가 없는 경우 직접 업데이트 시도
      if (error.code === 'PGRST202') {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ view_count: supabase.rpc('view_count + 1') })
          .eq('id', projectId)

        if (updateError) {
          console.error('Error incrementing view count:', updateError)
          // 실패 시 sessionStorage 롤백
          sessionStorage.removeItem(viewedKey)
          return
        }
      } else {
        console.error('Error calling increment_view_count:', error)
        // 실패 시 sessionStorage 롤백
        sessionStorage.removeItem(viewedKey)
        return
      }
    }
  } catch (err) {
    console.error('Error incrementing view count:', err)
    // 실패 시 sessionStorage 롤백
    sessionStorage.removeItem(viewedKey)
  }
}

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

          // 조회수 증가 (데이터 로드 성공 후)
          incrementViewCount(projectId)
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
