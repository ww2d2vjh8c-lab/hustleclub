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
    const jobId = resolvedParams.id

    // Get the request body
    const body = await request.json()
    const { active } = body

    // Update the job active status
    const { data, error } = await supabase
      .from('clipping_jobs')
      .update({ is_active: active })
      .eq('id', jobId)
      .eq('user_id', userId) // Ensure user can only update their own jobs
      .select()
      .single()

    if (error) {
      console.error('Error updating clipping job:', error)
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
    }

    return NextResponse.json({ success: true, job: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}