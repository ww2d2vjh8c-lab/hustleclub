import { applyForClippingJob } from "@/app/actions/clipping/applyForClippingJob"
import { SubmitButton } from "@/components/SubmitButton"

export default function Page({
  params,
}: {
  params: { id: string }
}) {
  return (
    <form action={applyForClippingJob}>
      <input type="hidden" name="jobId" value={params.id} />
      <SubmitButton>Apply for Job</SubmitButton>
    </form>
  )
}