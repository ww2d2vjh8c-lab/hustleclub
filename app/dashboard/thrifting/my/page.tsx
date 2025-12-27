import { requireUser } from "@/lib/auth"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { deleteItem } from "@/app/actions/thrifting/deleteItem"

export default async function MyListingsPage() {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()

  const { data: items } = await supabase
    .from("thrift_items")
    .select("*")
    .eq("user_id", user.id)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Listings</h1>

      {items?.map(item => (
        <form key={item.id} action={deleteItem}>
          <input type="hidden" name="id" value={item.id} />
          <p>{item.title} — ₹{item.price}</p>
          <button className="text-red-600 underline">Delete</button>
        </form>
      ))}
    </div>
  )
}