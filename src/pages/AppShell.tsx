import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import type { LucideIcon } from "lucide-react";
import { Home, ListChecks, PlusCircle, Ticket } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Manage", path: "/manage", icon: ListChecks },
  { label: "Create", path: "/create", icon: PlusCircle },
  { label: "Joined", path: "/joined", icon: Ticket },
];

function isActivePath(current: string, itemPath: string): boolean {
  if (itemPath === "/home") return current === "/home";
  return current.startsWith(itemPath);
}

export default function AppShell(): React.JSX.Element {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-lyne-surface font-body text-lyne-ink">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-lyne-divider bg-white px-4 py-6 lg:flex">
          <div className="mb-10 flex items-center gap-1.5 px-2">
            <span className="font-display text-xl font-bold tracking-tight">
              LineLogic
            </span>
            <span className="mb-3 h-1.5 w-1.5 rounded-full bg-lyne-lime-400" />
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(location.pathname, item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium transition-colors ${
                    active
                      ? "bg-lyne-surface-muted text-lyne-purple-700"
                      : "text-lyne-body hover:bg-lyne-surface-muted hover:text-lyne-purple-700"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-2 pt-6">
            <p className="font-body text-xs text-lyne-muted">
              © 2026 LineLogic Technologies
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-lyne-divider bg-white/95 backdrop-blur lg:hidden">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(location.pathname, item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-lyne-purple-700" : "text-lyne-muted"
                }`}
                strokeWidth={2}
              />
              <span
                className={`font-body text-[11px] font-medium ${
                  active ? "text-lyne-purple-700" : "text-lyne-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}