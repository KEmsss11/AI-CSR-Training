
import {
  MessageSquare,
  Headphones,
  Clock3,
  Trophy,
  Phone,
  HeartPulse,
  Landmark,
  ShoppingCart,
  MonitorCog,
  Headset,
} from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { HeroSection } from "@/components/dashboard/hero-section";
import { StatCard } from "@/components/dashboard/stat-card";
import { PracticeCard } from "@/components/dashboard/practice-card";
import { CategoryCard } from "@/components/dashboard/category-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 md:p-6 lg:p-8">
          <WelcomeSection />

          <HeroSection />

          {/* Dashboard statistics */}
          <section id="progress" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Your Progress</h2>
              <p className="text-sm text-base-content/60">
                Track your training performance
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Practice Sessions"
                value="12"
                description="Total sessions completed"
                icon={MessageSquare}
              />

              <StatCard
                title="Average Score"
                value="85%"
                description="Across completed sessions"
                icon={Trophy}
                iconColor="text-success"
              />

              <StatCard
                title="Practice Time"
                value="8.5 hrs"
                description="Total training time"
                icon={Clock3}
                iconColor="text-info"
              />

              <StatCard
                title="Skills Improved"
                value="6"
                description="Skills practiced so far"
                icon={Headphones}
                iconColor="text-secondary"
              />
            </div>
          </section>

          {/* Main practice activities */}
          <section id="practice" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Start Practicing</h2>
              <p className="text-sm text-base-content/60">
                Choose a training activity to improve your skills
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PracticeCard
                title="AI Interview Practice"
                description="Prepare for BPO interviews with an AI interviewer. Practice common questions and receive feedback on your answers."
                icon={MessageSquare}
                href="#interview"
                label="Start Interview"
              />

              <PracticeCard
                title="Customer Roleplay"
                description="Practice real-world customer conversations, handle complaints, and develop your communication skills."
                icon={Headphones}
                href="#roleplay"
                label="Start Roleplay"
                iconColor="text-secondary"
              />
            </div>
          </section>

          {/* Training categories */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Training Categories</h2>
              <p className="text-sm text-base-content/60">
                Explore different customer service industries
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <CategoryCard
                title="Telecommunications"
                description="Mobile plans, billing, and network concerns"
                icon={Phone}
                href="#telco"
              />

              <CategoryCard
                title="Healthcare"
                description="Patient support and appointment inquiries"
                icon={HeartPulse}
                href="#healthcare"
                iconColor="text-error"
              />

              <CategoryCard
                title="Banking"
                description="Account assistance and financial inquiries"
                icon={Landmark}
                href="#banking"
                iconColor="text-info"
              />

              <CategoryCard
                title="E-commerce"
                description="Orders, refunds, and delivery concerns"
                icon={ShoppingCart}
                href="#ecommerce"
                iconColor="text-success"
              />

              <CategoryCard
                title="Technical Support"
                description="Troubleshooting and technical assistance"
                icon={MonitorCog}
                href="#technical-support"
                iconColor="text-warning"
              />

              <CategoryCard
                title="General Customer Service"
                description="Communication and customer care fundamentals"
                icon={Headset}
                href="#general"
                iconColor="text-secondary"
              />
            </div>
          </section>

          {/* Recent practice history */}
          <section>
            <RecentActivity />
          </section>

          <footer className="border-t border-base-300 py-5 text-center text-xs text-base-content/50">
            CSR Coach AI — Build your confidence, one conversation at a time.
          </footer>
        </main>
      </div>

      <Sidebar />
    </div>
  );
}
