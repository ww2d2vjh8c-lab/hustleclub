import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // Check authentication
    const { data: authData, error: authError } = await supabase.auth.getClaims()
    if (authError || !authData?.claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const userId = authData.claims.sub
    const courseId = resolvedParams.id

    // Get the request body
    const body = await request.json()
    const { published } = body

    // Update the course publish status
    const { data, error } = await supabase
      .from('courses')
      .update({ is_published: published })
      .eq('id', courseId)
      .eq('user_id', userId) // Ensure user can only update their own courses
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}