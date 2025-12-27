import { createItem } from "@/app/actions/thrifting/createItem"

export default function SellItemPage() {
  return (
    <form action={createItem} className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Sell Item</h1>

      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <input name="price" type="number" required />
      <input name="category" placeholder="Category" />
      <input name="condition" placeholder="Condition" />

      <button className="border px-4 py-2">Publish</button>
    </form>
  )
}