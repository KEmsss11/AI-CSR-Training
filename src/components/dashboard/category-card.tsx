
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type CategoryCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconColor?: string;
};

export function CategoryCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor = "text-primary",
}: CategoryCardProps) {
  return (
    <a
      href={href}
      className="card border border-base-300 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
    >
      <div className="card-body flex-row items-center gap-4 p-4">
        <div className={`rounded-xl bg-base-200 p-3 ${iconColor}`}>
          <Icon size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{title}</h3>

          <p className="mt-1 text-xs leading-relaxed text-base-content/60">
            {description}
          </p>
        </div>

        <ArrowUpRight
          size={18}
          className="shrink-0 text-base-content/40"
        />
      </div>
    </a>
  );
}
