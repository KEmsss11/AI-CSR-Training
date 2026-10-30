
import {
  LayoutDashboard,
  MessageSquare,
  Headphones,
  History,
  ChartNoAxesCombined,
  Settings,
  BrainCircuit,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Phone,
  HeartPulse,
  Landmark,
  ShoppingCart,
  Sparkles,
  Activity,
  ChevronRight,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

const navigation = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "AI Interview", href: "#interview", icon: MessageSquare },
  { label: "Customer Roleplay", href: "#roleplay", icon: Headphones },
  { label: "Practice History", href: "#history", icon: History },
  { label: "My Progress", href: "#progress", icon: ChartNoAxesCombined },
];

const categories = [
  { name: "Telecommunications", icon: Phone, color: "text-primary" },
  { name: "Healthcare", icon: HeartPulse, color: "text-success" },
  { name: "Banking", icon: Landmark, color: "text-warning" },
  { name: "E-commerce", icon: ShoppingCart, color: "text-secondary" },
];

const activities = [
  {
    title: "Customer Complaint Handling",
    category: "Telecommunications",
    score: 85,
    date: "Recent practice",
  },
  {
    title: "HR Interview Simulation",
    category: "General Customer Service",
    score: 92,
    date: "Previous practice",
  },
  {
    title: "Refund Request Scenario",
    category: "E-commerce",
    score: 78,
    date: "Previous practice",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex min-h-screen flex-col">
          {/* HEADER */}
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

          {/* MAIN CONTENT */}
          <main className="flex-1 space-y-8 p-4 md:p-8">

            {/* WELCOME SECTION */}
            <section id="overview" className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles size={17} />
                AI-POWERED BPO TRAINING
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Welcome to CSR Coach AI
              </h2>

              <p className="max-w-2xl text-base-content/60">
                Build your confidence, improve your communication skills,
                and prepare for your next customer service job.
              </p>
            </section>

            {/* HERO CARD */}
            <section className="card overflow-hidden bg-primary text-primary-content shadow-lg">
              <div className="card-body gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-3">
                  <div className="badge border-none bg-primary-content/20 text-primary-content">
                    <BrainCircuit size={14} className="mr-1" />
                    YOUR AI TRAINING PARTNER
                  </div>

                  <h3 className="text-2xl font-bold md:text-3xl">
                    Ready to become a better CSR?
                  </h3>

                  <p className="text-sm leading-relaxed opacity-80">
                    Practice real-world customer conversations and
                    interview questions with your AI training partner.
                  </p>

                  <a
                    href="#practice"
                    className="btn mt-2 border-none bg-primary-content text-primary hover:bg-primary-content/90"
                  >
                    Start Practicing
                    <ArrowRight size={17} />
                  </a>
                </div>

                <div className="hidden rounded-2xl bg-primary-content/10 p-8 md:block">
                  <BrainCircuit size={110} strokeWidth={1.2} />
                </div>
              </div>
            </section>

            {/* STATISTICS */}
            <section id="progress" className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Your Training Overview</h3>
                <p className="text-sm text-base-content/60">
                  Track your learning progress.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="stat rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <div className="stat-figure text-primary">
                    <Activity size={27} />
                  </div>
                  <div className="stat-title">Practice Sessions</div>
                  <div className="stat-value text-primary">0</div>
                  <div className="stat-desc">Start your first session</div>
                </div>

                <div className="stat rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <div className="stat-figure text-success">
                    <Target size={27} />
                  </div>
                  <div className="stat-title">Average Score</div>
                  <div className="stat-value text-success">--</div>
                  <div className="stat-desc">No evaluations yet</div>
                </div>

                <div className="stat rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <div className="stat-figure text-warning">
                    <Clock size={27} />
                  </div>
                  <div className="stat-title">Practice Time</div>
                  <div className="stat-value text-warning">0h</div>
                  <div className="stat-desc">Your learning journey starts here</div>
                </div>

                <div className="stat rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <div className="stat-figure text-secondary">
                    <Trophy size={27} />
                  </div>
                  <div className="stat-title">Achievements</div>
                  <div className="stat-value text-secondary">0</div>
                  <div className="stat-desc">Earn your first achievement</div>
                </div>
              </div>
            </section>

            {/* PRACTICE OPTIONS */}
            <section id="practice" className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Choose Your Training</h3>
                <p className="text-sm text-base-content/60">
                  Select a simulation to begin practicing.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <article
                  id="interview"
                  className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <MessageSquare size={27} />
                      </div>
                      <span className="badge badge-primary badge-outline">
                        AI INTERVIEW
                      </span>
                    </div>

                    <h4 className="card-title mt-3">
                      HR Interview Simulation
                    </h4>

                    <p className="text-sm leading-relaxed text-base-content/60">
                      Answer realistic HR interview questions. Practice
                      introducing yourself, discussing your strengths,
                      and handling challenging questions.
                    </p>

                    <div className="card-actions mt-4 justify-end">
                      <button className="btn btn-primary btn-sm" disabled>
                        Coming Soon
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>

                <article
                  id="roleplay"
                  className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                        <Headphones size={27} />
                      </div>
                      <span className="badge badge-secondary badge-outline">
                        CUSTOMER ROLEPLAY
                      </span>
                    </div>

                    <h4 className="card-title mt-3">
                      Customer Service Simulation
                    </h4>

                    <p className="text-sm leading-relaxed text-base-content/60">
                      Handle angry customers, billing concerns, complaints,
                      refund requests, and technical support situations.
                    </p>

                    <div className="card-actions mt-4 justify-end">
                      <button className="btn btn-secondary btn-sm" disabled>
                        Coming Soon
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* INDUSTRY CATEGORIES */}
            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Training Specializations</h3>
                <p className="text-sm text-base-content/60">
                  Explore different BPO industries.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div
                      key={category.name}
                      className="card border border-base-300 bg-base-100 shadow-sm"
                    >
                      <div className="card-body flex-row items-center gap-3 p-4">
                        <Icon size={25} className={category.color} />
                        <span className="text-sm font-semibold">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section id="history" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Recent Practice</h3>
                  <p className="text-sm text-base-content/60">
                    Your previous training activity.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Practice Scenario</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.title}>
                        <td className="font-semibold">{activity.title}</td>
                        <td>
                          <span className="badge badge-ghost">
                            {activity.category}
                          </span>
                        </td>
                        <td>
                          <span className="font-bold text-success">
                            {activity.score}%
                          </span>
                        </td>
                        <td className="text-base-content/60">
                          {activity.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-base-300 pt-5 text-center text-xs text-base-content/50">
              CSR Coach AI · AI-powered customer service training platform
            </footer>
          </main>
        </div>

        {/* SIDEBAR */}
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
                {navigation.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className={index === 0 ? "active font-semibold" : ""}
                      >
                        <Icon size={19} />
                        {item.label}
                      </a>
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

                <a
                  href="#practice"
                  className="mt-3 flex items-center gap-1 text-xs font-bold text-primary"
                >
                  Start learning
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
