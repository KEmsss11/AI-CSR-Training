
"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { InterviewChat } from "@/components/interview/interview-chat";
import {
  InterviewSetup,
  type InterviewConfig,
} from "@/components/interview/interview-setup";

export default function InterviewPage() {
  const [config, setConfig] = useState<InterviewConfig | null>(null);

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
          {config === null ? (
            <InterviewSetup onStart={setConfig} />
          ) : (
            <InterviewChat config={config} />
          )}
        </main>
      </div>

      <Sidebar />
    </div>
  );
}
