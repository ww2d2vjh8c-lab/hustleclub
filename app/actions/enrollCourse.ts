'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'


/**
 * Server Action to enroll user in a course
 *
 * Rules:
 * - User can only enroll in published courses
 * - User can enroll only once (unique constraint)
 * - All validation server-side
 * - RLS enforced
 */
export async function enrollCourse(formData: FormData) {
  try {
    const courseId = formData.get('courseId')?.toString()

    if (!courseId) {
      throw new Error('Course ID is required')
    }

    const supabase = await createSupabaseServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Authentication required. Please sign in to enroll.')
    }

    // Verify course exists and is published
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      throw new Error('Course not found or is not published.')
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (existingEnrollment) {
      throw new Error('You are already enrolled in this course.')
    }

    // Create enrollment
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
      })

    if (enrollError) {
      console.error('Supabase enrollment error:', enrollError)
      
      // Handle duplicate enrollment constraint
      if (enrollError.code === '23505') {
        throw new Error('You are already enrolled in this course.')
      }
      
      throw new Error('Failed to enroll in course. Please try again.')
    }

    // Set success flash message
    
    // Redirect to course page
    redirect(`/courses/${courseId}`)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.'

    console.error('enrollCourse error:', errorMessage, error)
    throw error
  }
}
