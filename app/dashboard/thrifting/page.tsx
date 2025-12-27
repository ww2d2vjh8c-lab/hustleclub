import Link from "next/link"
import { requireUser } from "@/lib/auth"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import ThriftItemCard from "@/components/ThriftItemCard"

export default async function ThriftingPage() {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase
    .from("thrift_items")
    .select("id, title, description, price, user_id")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thrifting</h1>

        <Link
          href="/dashboard/thrifting/sell"
          className="underline text-sm"
        >
          Sell an item
        </Link>
      </div>

      {items && items.length === 0 && (
        <p className="text-sm text-gray-500">
          No items yet. Be the first to sell.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <ThriftItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            isOwner={item.user_id === user.id}
          />
        ))}
      </div>
    </div>
  )
}