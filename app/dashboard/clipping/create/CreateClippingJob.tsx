"use client";

import { useState } from "react";
import { createClippingJob } from "@/app/actions/clipping/createClippingJob";
import { SubmitButton } from "@/components/SubmitButton";

export default function CreateClippingJob() {
  const [error, setError] = useState("");

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Create Clipping Job</h1>
      <p className="text-gray-600">
        Post a paid UGC clipping opportunity for creators.
      </p>

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded">
          {error}
        </p>
      )}

      <form
        action={async (formData) => {
          const result: any = await createClippingJob(formData);

          if (result?.error) {
            setError(result.error);
          }
        }}
        className="space-y-4 bg-gray-50 p-5 rounded-lg border"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            name="title"
            placeholder="YouTube Shorts Editor"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Looking for an editor to clip long-form videos into viral shorts…"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            name="platform"
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select platform</option>
            <option>Instagram</option>
            <option>YouTube</option>
            <option>TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Reward (₹)
          </label>
          <input
            name="reward"
            type="number"
            placeholder="500"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <SubmitButton className="w-full">Publish Job</SubmitButton>
      </form>
    </div>
  );
}