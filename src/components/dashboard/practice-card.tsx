
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type PracticeCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  label: string;
  iconColor?: string;
};

export function PracticeCard({
  title,
  description,
  icon: Icon,
  href,
  label,
  iconColor = "text-primary",
}: PracticeCardProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="card-body gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl bg-base-200 p-3 ${iconColor}`}>
            <Icon size={25} />
          </div>

          <span className="badge badge-outline badge-sm">
            AI Powered
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold">{title}</h3>

          <p className="text-sm leading-relaxed text-base-content/60">
            {description}
          </p>
        </div>

        <a
          href={href}
          className="btn btn-outline btn-primary mt-2 justify-between"
        >
          {label}
          <ArrowRight size={17} />
        </a>
      </div>
    </div>
  );
}
