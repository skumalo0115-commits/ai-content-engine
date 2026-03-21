"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import type { GeneratePayload, PlanKey } from "@/app/lib/types";

type InputFormProps = {
  onSubmit: (payload: GeneratePayload) => Promise<void>;
  isLoading: boolean;
  isDisabled?: boolean;
  currentPlan: PlanKey;
  remainingFreeGenerations: number;
  helperMessage?: string | null;
};

const initialState: GeneratePayload = {
  businessType: "",
  targetAudience: "",
  goal: "",
};

export function InputForm({
  onSubmit,
  isLoading,
  isDisabled = false,
  currentPlan,
  remainingFreeGenerations,
  helperMessage,
}: InputFormProps) {
  const [formData, setFormData] = useState<GeneratePayload>(initialState);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: "easeOut" }} className="glass-panel space-y-5 rounded-[28px] p-6">
      <div className="flex flex-col gap-3 rounded-[1.5rem] bg-[#f6f2eb] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="editorial-label text-xs">{currentPlan === "pro" ? "Pro plan active" : "Free plan active"}</p>
          <p className="mt-2 text-sm text-[#5f584f]">
            {currentPlan === "pro" ? "Unlimited generations are active in this browser." : `${remainingFreeGenerations} of 5 free generations left today.`}
          </p>
        </div>
        <p className="max-w-sm text-xs leading-5 text-[#7a7269]">Keep your brief specific and outcome-focused for the cleanest captions, hooks, and hashtags.</p>
      </div>

      {([
        ["businessType", "Business Type", "e.g. Boutique coffee shop"],
        ["targetAudience", "Target Audience", "e.g. Busy remote professionals"],
        ["goal", "Content Goal", "e.g. Drive foot traffic this weekend"],
      ] as const).map(([key, label, placeholder]) => (
        <label key={key} className="group block space-y-2">
          <span className="text-sm font-medium text-[#433d36] transition-colors group-focus-within:text-[#20584f]">{label}</span>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={formData[key]}
            onChange={(event) => setFormData((prev) => ({ ...prev, [key]: event.target.value }))}
            placeholder={placeholder}
            required
            disabled={isDisabled}
            className="w-full rounded-[1.2rem] border border-black/8 bg-[#fbfaf7] px-4 py-3 text-sm text-[#181614] placeholder:text-[#9b9288] outline-none transition focus:border-[#20584f]/30 focus:bg-white disabled:cursor-not-allowed disabled:opacity-55"
          />
        </label>
      ))}

      <motion.button
        type="submit"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        disabled={isLoading || isDisabled}
        className="w-full rounded-[1.2rem] bg-[#181614] px-4 py-3 text-sm font-semibold text-[#f8f4ee] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Generating..." : "Generate Content"}
      </motion.button>
      <p className="text-xs leading-5 text-[#7a7269]">
        {helperMessage || "Live provider uses OpenRouter when configured. Otherwise, the app serves polished demo content for localhost testing."}
      </p>
    </motion.form>
  );
}
