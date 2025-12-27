"use client"

import Link from "next/link"
import PublishToggle from "@/components/PublishToggle"
import DeleteCourseButton from "@/components/DeleteCourseButton"

interface CourseCardProps {
  id: string
  title: string
  description?: string | null
  price: number
  isPublished: boolean
  manageLinkHref: string
}

export default function CourseCard({
  id,
  title,
  description,
  price,
  isPublished,
  manageLinkHref,
}: CourseCardProps) {
  const safePrice =
    typeof price === "number" ? price.toFixed(2) : "0.00"

  return (
    <div className="border rounded p-4 space-y-2">
      {/* Title */}
      <h3 className="font-semibold text-lg">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* Price */}
      <p className="font-medium">₹{safePrice}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        {/* Publish / Unpublish */}
        <PublishToggle
          courseId={id}
          isPublished={isPublished}
        />

        {/* Delete */}
        <DeleteCourseButton courseId={id} />

        {/* Manage */}
        <Link
          href={manageLinkHref}
          className="text-sm underline"
        >
          Manage
        </Link>
      </div>
    </div>
  )
}