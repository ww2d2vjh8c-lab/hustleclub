import Link from "next/link";
import SubmitButton from "../../../../components/SubmitButton";
import { applyForClippingJob } from "../../../actions/clipping/applyForClippingJob";

export default function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <form action={applyForClippingJob}>
      <input type="hidden" name="jobId" value={params.id} />
      <SubmitButton>Apply for Job</SubmitButton>
    </form>
  );
}