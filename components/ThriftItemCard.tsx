import DeleteThriftItemButton from "@/components/DeleteThriftItemButton"

type Props = {
  id: string
  title: string
  description: string | null
  price: number
  isOwner?: boolean
}

export default function ThriftItemCard({
  id,
  title,
  description,
  price,
  isOwner,
}: Props) {
  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm">{description}</p>}
      <p className="font-medium">₹{price}</p>

      {isOwner && (
        <div className="pt-2">
          <DeleteThriftItemButton itemId={id} />
        </div>
      )}
    </div>
  )
}