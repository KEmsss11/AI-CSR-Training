
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-base-content/60">
            {title}
          </p>

          <div className={`rounded-xl bg-base-200 p-2 ${iconColor}`}>
            <Icon size={20} />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {value}
          </h3>

          <p className="mt-1 text-xs text-base-content/50">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
