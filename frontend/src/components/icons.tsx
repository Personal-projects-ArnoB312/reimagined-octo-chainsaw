export function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <path d="M7.5 9h9M7.5 13h9M7.5 17h5.5" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}

export function SkillsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
      />
      <circle cx="9" cy="9.5" r="1.3" fill="currentColor" />
      <circle cx="9" cy="14.5" r="1.3" fill="currentColor" />
      <path d="M12.3 9.5h4.7M12.3 14.5h4.7" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}

export function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
      <path
        d="M4.8 19.5c1.1-3.3 4-5 7.2-5s6.1 1.7 7.2 5"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-8 0 .7 12.1A1.8 1.8 0 0 0 9.5 21h5a1.8 1.8 0 0 0 1.8-1.9L17 7"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
