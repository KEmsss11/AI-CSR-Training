
import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="navbar sticky top-0 z-30 border-b border-base-300 bg-base-100 px-4 lg:px-8">
      <div className="flex-none lg:hidden">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-square btn-ghost"
          aria-label="Open navigation menu"
        >
          <LayoutDashboard size={21} />
        </label>
      </div>

      <div className="flex-1">
        <div>
          <h1 className="text-lg font-bold">Dashboard</h1>
          <p className="text-xs text-base-content/60">
            Your personal training workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">Welcome, Trainee!</p>
          <p className="text-xs text-base-content/60">
            Aspiring Customer Service Representative
          </p>
        </div>

        <div className="avatar placeholder">
          <div className="w-10 rounded-full bg-primary text-primary-content">
            <span className="font-bold">T</span>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
