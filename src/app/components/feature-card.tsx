import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "green" | "purple";
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    green: "bg-primary/10 text-primary",
    purple: "bg-secondary/10 text-secondary",
  };

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h3 className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl">{title}</h3>
      <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
    </div>
  );
}