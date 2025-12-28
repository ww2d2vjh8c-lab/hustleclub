import SubmitButton from "../../../../components/SubmitButton";
import { createClippingJob } from "../../../actions/clipping/createClippingJob";

export default function CreateClippingJobPage() {
  return (
    <form action={createClippingJob} className="space-y-4">
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />

      <input name="platform" placeholder="Platform" required />

      <input
        name="reward"
        type="number"
        placeholder="Reward"
        required
      />

      <SubmitButton>Create Clipping Job</SubmitButton>
    </form>
  );
}