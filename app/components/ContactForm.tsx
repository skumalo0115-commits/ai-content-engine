"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error || "Your message could not be sent right now.");
      }

      setSuccess(data.message || "Your message has been sent.");
      setFormData(initialState);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Your message could not be sent right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel rounded-[32px] p-6 sm:p-7"
    >
      <div className="rounded-[24px] bg-[#f6f2eb] p-4">
        <p className="editorial-label text-xs">Contact Form</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#181614]">Send your message directly from the website.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f584f]">
          Share what you need help with, what kind of business you run, or what you want improved. Your message will be delivered straight to the contact inbox once email sending is configured.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#433d36]">Your Name</span>
          <input
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            placeholder="Jonny Bonny"
            required
            className="w-full rounded-[1.1rem] border border-black/8 bg-[#fbfaf7] px-4 py-3 text-sm text-[#181614] placeholder:text-[#9b9288] outline-none transition focus:border-[#20584f]/30 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[#433d36]">Your Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            required
            className="w-full rounded-[1.1rem] border border-black/8 bg-[#fbfaf7] px-4 py-3 text-sm text-[#181614] placeholder:text-[#9b9288] outline-none transition focus:border-[#20584f]/30 focus:bg-white"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#433d36]">Subject</span>
        <input
          value={formData.subject}
          onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
          placeholder="What do you need help with?"
          required
          className="w-full rounded-[1.1rem] border border-black/8 bg-[#fbfaf7] px-4 py-3 text-sm text-[#181614] placeholder:text-[#9b9288] outline-none transition focus:border-[#20584f]/30 focus:bg-white"
        />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#433d36]">Message</span>
        <textarea
          value={formData.message}
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          placeholder="Tell us about your business, the issue, or what you want changed."
          required
          rows={7}
          className="w-full rounded-[1.1rem] border border-black/8 bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#181614] placeholder:text-[#9b9288] outline-none transition focus:border-[#20584f]/30 focus:bg-white"
        />
      </label>

      {error ? <div className="mt-4 rounded-2xl border border-[#e6b5ab] bg-[#f8ebe6] px-4 py-3 text-sm text-[#7c5645]">{error}</div> : null}
      {success ? <div className="mt-4 rounded-2xl border border-[#b7dbc9] bg-[#e9f5ef] px-4 py-3 text-sm text-[#20584f]">{success}</div> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-[#7a7269]">Use this form for support, partnerships, and launch questions. Replies will go to the email address you enter above.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="interactive-pop inline-flex items-center justify-center rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2723] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </motion.form>
  );
}
