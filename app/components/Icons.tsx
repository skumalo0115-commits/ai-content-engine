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
