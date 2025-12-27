import { redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/getUserWithRole";
import CreateClippingJob from "./CreateClippingJob";

export default async function CreateJobPage() {
  const userData = await getUserWithRole();

  const isCreator =
    userData?.role === "creator" || userData?.role === "admin";

  if (!isCreator) redirect("/dashboard/clipping");

  return <CreateClippingJob />;
}