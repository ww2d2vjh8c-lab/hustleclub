import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../../lib/supabase-server'
import { createCourse } from '@/app/actions/createCourse'

export default async function NewCoursePage() {
  // Verify user is authenticated
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Share your knowledge and build your course library</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <form action={createCourse} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={255}
                placeholder="e.g., Introduction to Web Development"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Give your course a clear, descriptive title</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what students will learn in this course..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Write a compelling description to attract learners</p>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-600">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  max="10000"
                  placeholder="99.99"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Set the price for your course</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Course
            </button>

            {/* Info message */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your course will be created as a draft and not visible to others until you publish it.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}