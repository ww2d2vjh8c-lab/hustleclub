"use client"

import { createCourse } from "@/app/actions/createCourse"
import { toast } from "sonner"

export default function NewCoursePage() {
  async function action(formData: FormData) {
    try {
      await createCourse(formData)
      toast.success("Course created successfully")
    } catch {
      toast.error("Failed to create course")
    }
  }

  return (
    <form action={action} className="space-y-4">
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create</button>
    </form>
  )
}