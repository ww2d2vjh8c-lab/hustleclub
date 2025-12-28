import { applyForClippingJob } from "@/app/actions/clipping/applyForClippingJob";
import { SubmitButton } from "@/components/SubmitButton";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  async function applyAction(formData: FormData) {
    "use server";

    const jobId = formData.get("jobId") as string;
    await applyForClippingJob(jobId);
  }

  return (
    <form action={applyAction}>
      <input type="hidden" name="jobId" value={params.id} />
      <SubmitButton>Apply for Job</SubmitButton>
    </form>
  );
}