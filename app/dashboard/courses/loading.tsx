export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Status Badge Skeleton */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse flex-1" />
                  <div className="h-5 bg-gray-200 rounded w-16 ml-2 animate-pulse" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>

                {/* Price Skeleton */}
                <div className="h-7 bg-gray-200 rounded w-20 animate-pulse mb-4" />
              </div>

              {/* Footer Link Skeleton */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
