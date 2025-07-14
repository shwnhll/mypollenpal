import { supabase } from '../lib/supabase'

export async function getAllCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('population', { ascending: false })

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  return data
}

export async function getCityBySlug(slug) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching city:', error)
    return null
  }

  return data
}
