export default function LoadingDashboard() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}