"use client"

import { deleteItem } from "@/app/actions/thrifting/deleteItem"
import { SubmitButton } from "@/components/SubmitButton"

interface DeleteThriftItemButtonProps {
  itemId: string
}

export default function DeleteThriftItemButton({
  itemId,
}: DeleteThriftItemButtonProps) {
  return (
    <form action={deleteItem}>
      <input type="hidden" name="id" value={itemId} />

      <SubmitButton
        className="text-red-600 underline text-sm"
        confirm="Are you sure you want to delete this item?"
      >
        Delete
      </SubmitButton>
    </form>
  )
}