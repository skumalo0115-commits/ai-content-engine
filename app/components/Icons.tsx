import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true" {...props} />;
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </BaseIcon>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 2 1.7 4.8L18.5 8.5l-4.8 1.7L12 15l-1.7-4.8L5.5 8.5l4.8-1.7Z" />
      <path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z" />
    </BaseIcon>
  );
}

export function HashIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 3 7 21" />
      <path d="M17 3 15 21" />
      <path d="M4 9h16" />
      <path d="M3 15h16" />
    </BaseIcon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </BaseIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4 4L19 6" />
    </BaseIcon>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m4 18 2-10 6 5 6-5 2 10Z" />
      <path d="M4 18h16" />
    </BaseIcon>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 4h12a2 2 0 0 1 2 2v14l-8-4-8 4V6a2 2 0 0 1 2-2Z" />
    </BaseIcon>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 14a8 8 0 1 0-16 0" />
      <path d="m12 12 4-4" />
      <path d="M12 12v2" />
    </BaseIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3c2.5 1.8 5.4 2.7 8 3v5c0 4.7-2.9 8.6-8 10-5.1-1.4-8-5.3-8-10V6c2.6-.3 5.5-1.2 8-3Z" />
    </BaseIcon>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M13 2 5 13h5l-1 9 8-11h-5Z" />
    </BaseIcon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </BaseIcon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3a8.7 8.7 0 0 0-7.5 13.2L3 21l5-1.4A8.7 8.7 0 1 0 12 3Z" />
      <path d="M9 9.5c.4 2.2 2 4 4.2 4.5l1.1-1.1c.3-.3.8-.4 1.1-.2l1.5.8c.4.2.6.8.4 1.2-.5.9-1.4 1.6-2.5 1.7-4.7.2-8.5-3.6-8.2-8.2.1-1.1.8-2 1.7-2.5.4-.2 1 0 1.2.4l.8 1.5c.2.3.1.8-.2 1.1Z" />
    </BaseIcon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 8h3V3h-3a5 5 0 0 0-5 5v3H6v5h3v5h5v-5h3l1-5h-4V8a1 1 0 0 1 1-1Z" />
    </BaseIcon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v7" />
      <path d="M8 7.5h.01" />
      <path d="M12 17v-4a2 2 0 1 1 4 0v4" />
      <path d="M12 10v7" />
    </BaseIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </BaseIcon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </BaseIcon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </BaseIcon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 3 21 21" />
      <path d="M10.6 6.2A11.8 11.8 0 0 1 12 6c6.2 0 10 6 10 6a18 18 0 0 1-4 4.7" />
      <path d="M6.7 6.8C4 8.5 2 12 2 12s3.8 6 10 6c1.1 0 2.2-.2 3.1-.5" />
      <path d="M14.1 14.2A3.2 3.2 0 0 1 9.8 9.9" />
    </BaseIcon>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M21.8 12.2c0-.7-.1-1.4-.2-2h-9.4v3.8h5.4a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" fill="#4285F4" />
      <path d="M12.2 22c2.7 0 4.9-.9 6.5-2.3l-3.3-2.6c-.9.6-2 .9-3.2.9-2.5 0-4.5-1.7-5.3-4H3.6v2.7A9.8 9.8 0 0 0 12.2 22Z" fill="#34A853" />
      <path d="M6.9 14c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V7.3H3.6A9.8 9.8 0 0 0 2.6 12c0 1.6.4 3.1 1 4.4L6.9 14Z" fill="#FBBC05" />
      <path d="M12.2 5.9c1.4 0 2.7.5 3.7 1.4l2.7-2.7A9.4 9.4 0 0 0 12.2 2a9.8 9.8 0 0 0-8.6 5.3L6.9 10c.8-2.3 2.8-4.1 5.3-4.1Z" fill="#EA4335" />
    </svg>
  );
}

export function BrandLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="32" height="32" rx="11" fill="#181614" />
      <path d="M11 23.5c5.8-1.1 10.2-5.2 11.5-11 1.7 3.2 1.6 7-.4 10.1 2 .6 3.4 2.3 3.9 4.4-3.7-.6-6.5-1-9.3-1-2.2 0-4 .2-6 .8l.3-3.3Z" fill="#6DE0C2" />
      <circle cx="14" cy="13" r="2.3" fill="#FFF5EC" />
      <path d="M20.8 10.8 23 6.8l1.2 3.1 3.3 1.1-3.2 1.2-1.2 3.1-1.4-3.1-3.1-1.2 3.2-1.2Z" fill="#FFF5EC" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </BaseIcon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </BaseIcon>
  );
}
