"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { primaryNavLinks, siteConfig } from "@/app/lib/site";
import { useAuth } from "./AuthProvider";
import { BrandLogoIcon, CrownIcon, MenuIcon, XIcon } from "./Icons";
import { UpgradeButton } from "./UpgradeButton";
import { getStoredPlan, planChangeEventName } from "@/app/lib/usage";

type NavbarProps = {
  currentPlan?: string;
  usageLabel?: string;
  showStartFree?: boolean;
};

export function Navbar({ currentPlan, usageLabel, showStartFree = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthReady, runAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const initials = useMemo(() => {
    if (!user) {
      return "";
    }

    const first = user.firstName?.trim().charAt(0) || "";
    const last = user.lastName?.trim().charAt(0) || "";
    return `${first}${last}`.toUpperCase() || user.email.slice(0, 2).toUpperCase();
  }, [user]);
  const navLinks = primaryNavLinks.filter((link) => !(pathname === "/" && link.href === "/"));

  useEffect(() => {
    const syncPlan = () => setPlan(getStoredPlan());
    syncPlan();

    window.addEventListener(planChangeEventName, syncPlan as EventListener);
    window.addEventListener("storage", syncPlan);

    return () => {
      window.removeEventListener(planChangeEventName, syncPlan as EventListener);
      window.removeEventListener("storage", syncPlan);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-black/6 bg-[rgba(247,244,238,0.88)] backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#20584f] sm:text-sm sm:tracking-[0.28em]">
            <BrandLogoIcon className="h-9 w-9" />
            <span className="max-w-[9rem] leading-tight sm:max-w-none">{siteConfig.name.toUpperCase()}</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-[#4d463f] lg:flex">
            {navLinks.map((link) => (
              <button key={link.href} type="button" onClick={() => runAuthenticated({ redirectTo: link.href })} className="nav-pill">
                {link.label}
              </button>
            ))}
            <button type="button" onClick={() => runAuthenticated({ redirectTo: "/dashboard" })} className="nav-pill">
              Dashboard
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {usageLabel ? (
            <div className="hidden rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-xs text-[#585148] sm:block">{usageLabel}</div>
          ) : null}
          {currentPlan ? (
            <div className="hidden items-center gap-2 rounded-full bg-[#e6efeb] px-3 py-1.5 text-xs text-[#20584f] sm:inline-flex">
              <CrownIcon className="h-3.5 w-3.5" />
              {currentPlan}
            </div>
          ) : null}
          {isAuthReady && !user && showStartFree ? (
            <button
              type="button"
              onClick={() => runAuthenticated({ redirectTo: "/dashboard" })}
              className="interactive-pop hidden rounded-full border border-black/6 bg-white px-4 py-2 text-sm font-medium text-[#181614] hover:border-[#20584f]/30 hover:text-[#181614] sm:inline-flex"
            >
              <span className="relative z-[1]">Start Free</span>
            </button>
          ) : null}
          {isAuthReady && plan !== "pro" ? (
            <UpgradeButton
              compact
              label="Upgrade"
              className="interactive-pop hidden rounded-full bg-[#181614] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2b2723] sm:inline-flex"
            />
          ) : null}
          {isAuthReady && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="interactive-pop hidden h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-sm font-semibold text-[#181614] lg:inline-flex"
              >
                <span className="relative z-[1]">{initials}</span>
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-14 hidden w-44 rounded-[1.2rem] border border-black/8 bg-white p-2 shadow-[0_20px_40px_rgba(24,22,20,0.08)] lg:block">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full rounded-[0.9rem] px-3 py-2 text-left text-sm font-medium text-[#181614] transition hover:bg-[#f3efe8]"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="mt-1 w-full rounded-[0.9rem] px-3 py-2 text-left text-sm font-medium text-[#8d4d44] transition hover:bg-[#f9ece8]"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="interactive-pop inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-[#181614] lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="border-t border-black/6 bg-[rgba(247,244,238,0.98)] px-4 pb-4 pt-3 lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            {currentPlan ? (
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#e6efeb] px-3 py-1.5 text-xs text-[#20584f]">
                <CrownIcon className="h-3.5 w-3.5" />
                {currentPlan}
              </div>
            ) : null}
            {usageLabel ? <div className="rounded-[1.1rem] border border-black/6 bg-white/80 px-4 py-3 text-sm text-[#585148]">{usageLabel}</div> : null}
            {plan !== "pro" ? (
              <UpgradeButton
                label="Upgrade to Pro"
                compact
                className="interactive-pop inline-flex w-full items-center justify-center rounded-[1.1rem] bg-[#181614] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]"
              />
            ) : null}
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  runAuthenticated({ redirectTo: link.href });
                }}
                className="w-full rounded-[1.1rem] border border-black/6 bg-white px-4 py-3 text-left text-sm font-medium text-[#181614]"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                runAuthenticated({ redirectTo: "/dashboard" });
              }}
              className="w-full rounded-[1.1rem] border border-black/6 bg-white px-4 py-3 text-left text-sm font-medium text-[#181614]"
            >
              Dashboard
            </button>
            {!user && showStartFree ? (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  runAuthenticated({ redirectTo: "/dashboard" });
                }}
                className="w-full rounded-[1.1rem] border border-black/8 bg-white px-4 py-3 text-left text-sm font-semibold text-[#181614]"
              >
                Start Free
              </button>
            ) : null}
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full rounded-[1.1rem] border border-black/6 bg-white px-4 py-3 text-left text-sm font-medium text-[#181614]"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="w-full rounded-[1.1rem] border border-[#d7b3ac] bg-[#f9ece8] px-4 py-3 text-left text-sm font-medium text-[#8d4d44]"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
