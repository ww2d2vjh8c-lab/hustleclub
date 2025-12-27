type Props = {
  title: string
  value: string | number
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}