
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Headphones,
  History,
  ChartNoAxesCombined,
  Settings,
  BrainCircuit,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "AI Interview", href: "/interview", icon: MessageSquare },
  { label: "Customer Roleplay", href: "#roleplay", icon: Headphones },
  { label: "Practice History", href: "#history", icon: History },
  { label: "My Progress", href: "#progress", icon: ChartNoAxesCombined },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="drawer-side z-40">
      <label
        htmlFor="dashboard-drawer"
        aria-label="Close navigation menu"
        className="drawer-overlay"
      />

      <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
        <div className="flex h-20 items-center gap-3 border-b border-base-300 px-6">
          <div className="rounded-xl bg-primary p-2 text-primary-content">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold">CSR Coach AI</h2>
            <p className="text-xs text-base-content/50">
              Training Platform
            </p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-base-content/40">
            Workspace
          </p>

          <ul className="menu gap-1 p-0">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                (item.href === "/" && pathname === "/") ||
                (item.href === "/interview" && pathname === "/interview");

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={isActive ? "active font-semibold" : ""}
                    >
                    <Icon size={19} />
                    {item.label}
                </Link>
                </li>
              );
            })}
          </ul>

          <div className="divider my-5" />

          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-base-content/40">
            Account
          </p>

          <ul className="menu p-0">
            <li>
              <a href="#settings">
                <Settings size={19} />
                Settings
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-base-300 p-4">
          <div className="rounded-xl bg-base-200 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={17} className="text-primary" />
              Training Tip
            </div>

            <p className="mt-2 text-xs leading-relaxed text-base-content/60">
              Practice regularly and focus on empathy, active listening,
              and clear communication.
            </p>

            <Link
                href="/#practice"
                className="mt-3 flex items-center gap-1 text-xs font-bold text-primary"
                >
                Start learning
                <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
