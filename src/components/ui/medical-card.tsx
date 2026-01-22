import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MedicalCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MedicalCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  children,
  className,
  onClick,
}: MedicalCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "medical-card text-left w-full group",
        onClick && "cursor-pointer",
        className
      )}
    >
      {Icon && (
        <div className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          "bg-primary/10"
        )}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </Wrapper>
  );
}
