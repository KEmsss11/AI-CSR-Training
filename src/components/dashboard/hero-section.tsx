
import {
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

export function HeroSection() {
  return (
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
  );
}
