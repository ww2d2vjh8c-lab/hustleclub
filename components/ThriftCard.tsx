import Link from "next/link"

interface Props {
  id: string
  title: string
  price: number
  category?: string
}

export default function ThriftCard({ id, title, price, category }: Props) {
  return (
    <div className="border rounded p-4 space-y-1">
      <h3 className="font-semibold">{title}</h3>
      <p>₹{price}</p>
      {category && <p className="text-sm text-gray-500">{category}</p>}
      <Link href={`/dashboard/thrifting/${id}`} className="underline text-sm">
        View
      </Link>
    </div>
  )
}