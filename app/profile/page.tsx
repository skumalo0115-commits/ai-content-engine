"use client";

import { useEffect, useState } from "react";
import { MarketingShell } from "@/app/components/MarketingShell";
import { useAuth } from "@/app/components/AuthProvider";
import { heroSlides } from "@/app/lib/hero-slides";

export default function ProfilePage() {
  const { user, isAuthReady, updateProfile, openAuthModal } = useAuth();
  const [heroImage] = useState(() => heroSlides[Math.floor(Math.random() * heroSlides.length)]?.src || "/hero-slide-1.png");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
  });
  const hasLocalEdits = Boolean(form.firstName || form.lastName || form.email || form.company || form.role);
  const visibleForm =
    !hasLocalEdits && user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          company: user.company,
          role: user.role,
        }
      : form;

  useEffect(() => {
    if (isAuthReady && !user) {
      openAuthModal({ mode: "signin", redirectTo: "/profile", closeRedirectTo: "/" });
    }
  }, [isAuthReady, openAuthModal, user]);

  if (!isAuthReady) {
    return (
      <MarketingShell>
        <div
          className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(244,240,232,0.82)]" />
        <section className="glass-panel mx-auto mt-12 max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="editorial-label text-xs">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#181614]">Loading your account...</h1>
        </section>
      </MarketingShell>
    );
  }

  if (!user) {
    return (
      <MarketingShell>
        <div
          className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(244,240,232,0.82)]" />
        <section className="glass-panel mx-auto mt-12 max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="editorial-label text-xs">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#181614]">Sign in to open your profile.</h1>
        </section>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <div
        className="pointer-events-none fixed inset-0 -z-[9] bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[8] bg-[rgba(244,240,232,0.82)]" />

      <section className="space-y-6 pt-8">
        <p className="editorial-label text-xs">Profile</p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#181614]">Keep your account details ready for every visit.</h1>
        <p className="max-w-3xl text-base leading-7 text-[#5f584f]">
          Update your name, email, company, and role so the experience stays personalized on this browser.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="relative h-[18rem]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(24,22,20,0.2))]" />
            <div className="absolute bottom-5 left-5 rounded-[1.2rem] bg-white/92 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[#20584f]">Saved Profile</p>
              <p className="mt-1 text-lg font-semibold text-[#181614]">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-1 text-sm text-[#5f584f]">{user.email}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void updateProfile(visibleForm);
          }}
          className="glass-panel rounded-[2rem] p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#433d36]">First name</span>
              <input
                value={visibleForm.firstName}
                onChange={(event) => setForm((current) => ({ ...(hasLocalEdits ? current : visibleForm), firstName: event.target.value }))}
                className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#433d36]">Last name</span>
              <input
                value={visibleForm.lastName}
                onChange={(event) => setForm((current) => ({ ...(hasLocalEdits ? current : visibleForm), lastName: event.target.value }))}
                className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-[#433d36]">Email</span>
              <input
                type="email"
                value={visibleForm.email}
                readOnly
                className="w-full rounded-[1rem] border border-black/8 bg-[#f4efe7] px-4 py-3 text-sm text-[#7b7267] outline-none"
              />
              <p className="text-xs text-[#7b7267]">Email is currently managed by Firebase Authentication.</p>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#433d36]">Company</span>
              <input
                value={visibleForm.company}
                onChange={(event) => setForm((current) => ({ ...(hasLocalEdits ? current : visibleForm), company: event.target.value }))}
                className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#433d36]">Role</span>
              <input
                value={visibleForm.role}
                onChange={(event) => setForm((current) => ({ ...(hasLocalEdits ? current : visibleForm), role: event.target.value }))}
                className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6b6257]">Name is synced with Firebase. Company and role stay saved on this browser for now.</p>
            <button type="submit" className="interactive-pop rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white">
              Save profile
            </button>
          </div>
        </form>
      </section>
    </MarketingShell>
  );
}
