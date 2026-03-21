import Image from "next/image";

export function SelfieHeroScene() {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-[35rem] overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#f8efe8_0%,#efe4da_100%)] shadow-[0_26px_70px_rgba(24,22,20,0.08)] sm:h-[32rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%)]" />
      <div className="absolute inset-5 rounded-[1.7rem] border border-white/55 bg-white/22" />
      <div className="absolute inset-[1.7rem] overflow-hidden rounded-[1.6rem] border border-black/6 bg-[#f7d8d0] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]">
        <Image src="/selfie-together-poster.svg" alt="Selfie Together poster art" fill className="object-cover" sizes="(min-width: 1024px) 35rem, 100vw" priority />
      </div>

      <div className="absolute inset-x-7 top-7 h-11 rounded-full border border-white/45 bg-white/18" />
      <div className="absolute inset-x-12 top-[3.2rem] h-px bg-white/45" />

      <div className="absolute left-7 top-7 h-16 w-16 rounded-tl-[1.6rem] border-l-2 border-t-2 border-white/65" />
      <div className="absolute right-7 top-7 h-16 w-16 rounded-tr-[1.6rem] border-r-2 border-t-2 border-white/65" />
      <div className="absolute bottom-7 left-7 h-16 w-16 rounded-bl-[1.6rem] border-b-2 border-l-2 border-white/65" />
      <div className="absolute bottom-7 right-7 h-16 w-16 rounded-br-[1.6rem] border-b-2 border-r-2 border-white/65" />

      <a
        href="https://dribbble.com/shots/10191755-Selfie-Together"
        target="_blank"
        rel="noreferrer"
        className="absolute right-8 top-8 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#5b1d80]"
      >
        Dribbble reference
      </a>

      <div className="absolute bottom-5 left-5 rounded-[1.35rem] border border-black/8 bg-white/92 px-4 py-3 shadow-[0_20px_45px_rgba(24,22,20,0.08)]">
        <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#20584f]">DIY Content Note</p>
        <p className="mt-1 text-sm font-medium text-[#181614]">One shoot can become your caption, reel hook, hashtag set, and the next few posts on your calendar.</p>
      </div>
    </div>
  );
}
