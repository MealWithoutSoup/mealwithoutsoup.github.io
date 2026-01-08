import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export function useProjects(category = null) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('projects')
          .select('*')
          .eq('visibility', true)
          .order('start_date', { ascending: false })

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        setProjects(data || [])
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [category])

  return { projects, loading, error }
}
