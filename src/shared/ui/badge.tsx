import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-primary to-sky-500 text-primary-foreground hover:from-primary-hover hover:to-sky-600 shadow-sm hover:shadow-md",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-secondary-border shadow-sm",
        destructive: "border-transparent bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-700 shadow-sm hover:shadow-md",
        outline: "text-foreground border-border bg-background hover:border-primary hover:text-primary transition-colors",
        success: "border-transparent bg-gradient-to-r from-success to-green-600 text-success-foreground hover:from-success/90 hover:to-green-700 shadow-sm hover:shadow-md",
        warning: "border-transparent bg-gradient-to-r from-warning to-amber-600 text-warning-foreground hover:from-warning/90 hover:to-amber-700 shadow-sm hover:shadow-md",
        accent: "border-transparent bg-gradient-to-r from-accent to-sky-500 text-accent-foreground hover:from-accent-hover hover:to-sky-600 shadow-sm hover:shadow-md animate-pulse-gentle",
        subtle: "border-border text-muted-foreground bg-surface-subtle hover:bg-surface-hover hover:text-foreground",
        ghost: "text-muted-foreground hover:bg-surface-hover hover:text-foreground border border-transparent",
        dot: "border-transparent bg-primary-light text-primary-foreground relative pl-6",
        pulse: "border-transparent bg-primary text-primary-foreground animate-pulse-glow shadow-glow",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-2xs",
        lg: "px-4 py-1.5 text-sm",
        xl: "px-5 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {variant === 'dot' && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };

