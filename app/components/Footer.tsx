import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} AI Content Engine</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-cyan-200">Terms</Link>
          <Link href="#" className="hover:text-cyan-200">Privacy</Link>
          <Link href="#" className="hover:text-cyan-200">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
