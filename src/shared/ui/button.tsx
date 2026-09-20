import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-sky-500 text-primary-foreground hover:from-primary-hover hover:to-sky-600 shadow-md hover:shadow-lg",
        destructive: "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-border bg-surface-subtle hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-secondary-border shadow-sm hover:shadow-md",
        ghost: "hover:bg-surface-hover hover:text-primary transition-colors",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover transition-colors",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-md hover:shadow-lg animate-float",
        gradient: "bg-gradient-to-r from-primary via-sky-500 to-cyan-400 text-white hover:shadow-glow transition-all duration-300",
        subtle: "bg-surface-subtle text-muted-foreground hover:bg-surface-hover hover:text-foreground border border-border",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-lg",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 py-2 text-xs",
        lg: "h-12 rounded-xl px-8 py-3 text-base",
        xl: "h-14 rounded-xl px-10 py-4 text-lg",
        icon: "h-11 w-11 rounded-lg",
        "icon-sm": "h-9 w-9 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
