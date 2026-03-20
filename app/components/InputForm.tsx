"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type GeneratePayload = {
  businessType: string;
  targetAudience: string;
  goal: string;
};

type InputFormProps = {
  onSubmit: (payload: GeneratePayload) => Promise<void>;
  isLoading: boolean;
};

const initialState: GeneratePayload = {
  businessType: "",
  targetAudience: "",
  goal: "",
};

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<GeneratePayload>(initialState);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/65 p-6 backdrop-blur-xl"
    >
      {([
        ["businessType", "Business Type", "e.g. Boutique coffee shop"],
        ["targetAudience", "Target Audience", "e.g. Busy remote professionals"],
        ["goal", "Content Goal", "e.g. Drive foot traffic this weekend"],
      ] as const).map(([key, label, placeholder]) => (
        <label key={key} className="group block space-y-2">
          <span className="text-sm font-medium text-slate-300 transition-colors group-focus-within:text-cyan-200">{label}</span>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={formData[key]}
            onChange={(event) => setFormData((prev) => ({ ...prev, [key]: event.target.value }))}
            placeholder={placeholder}
            required
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/80 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]"
          />
        </label>
      ))}

      <motion.button
        type="submit"
        whileHover={{ y: -2, boxShadow: "0 0 28px rgba(34, 211, 238, 0.45)" }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Generating..." : "Generate Content"}
      </motion.button>
      <p className="text-xs text-slate-500">API hook placeholder: POST /api/generate-content</p>
    </motion.form>
  );
}
