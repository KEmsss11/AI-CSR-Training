
import { Sparkles } from "lucide-react";

export function WelcomeSection() {
  return (
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
  );
}
