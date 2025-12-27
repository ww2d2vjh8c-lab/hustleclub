import { createSupabaseServerClient } from "@/lib/supabase-server"
import { deleteItem } from "@/app/actions/thrifting/deleteItem"

export default async function ItemPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createSupabaseServerClient()

  const { data: item } = await supabase
    .from("thrift_items")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!item) return null

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{item.title}</h1>
      <p>{item.description}</p>
      <p className="font-semibold">₹{item.price}</p>

      <form action={deleteItem}>
        <input type="hidden" name="id" value={item.id} />
        <button className="text-red-600 underline">
          Delete Item
        </button>
      </form>
    </div>
  )
}