"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeedIcon, SkillsIcon, AccountIcon } from "./icons";

const TABS = [
  { href: "/feed", label: "Feed", Icon: FeedIcon },
  { href: "/skills", label: "Skills", Icon: SkillsIcon },
  { href: "/account", label: "Account", Icon: AccountIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur">
      <ul className="flex items-center justify-around">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-tight transition-colors"
              >
                <span className={active ? "text-ink-950" : "text-ink-400"}>
                  <Icon active={active} />
                </span>
                <span className={active ? "text-ink-950" : "text-ink-400"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
