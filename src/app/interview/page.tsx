
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { InterviewChat } from "@/components/interview/interview-chat";

export const metadata = {
  title: "AI Interview Practice | CSR Coach AI",
  description: "Practice BPO interviews with your local AI interviewer.",
};

export default function InterviewPage() {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
          <InterviewChat />
        </main>
      </div>

      <Sidebar />
    </div>
  );
}
