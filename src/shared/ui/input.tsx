import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  "flex h-11 w-full rounded-xl border bg-input py-2.5 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input bg-input focus:border-primary focus:ring-primary/20",
        outline: "border-border bg-input focus:border-primary focus:ring-primary/20",
        filled: "border-transparent bg-input focus:bg-input focus:border-primary",
        subtle: "border-transparent bg-input focus:bg-input focus:border-primary",
        underlined: "border-0 border-b-2 border-border rounded-none bg-transparent focus:border-primary",
        floating: "border-2 border-border bg-input focus:border-primary focus:shadow-lg focus:shadow-primary/10",
      },
      size: {
        default: "h-11 py-2.5",
        sm: "h-9 px-3 py-2 text-sm rounded-lg",
        lg: "h-12 px-5 py-3 text-base rounded-2xl",
        xl: "h-14 px-6 py-4 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, size, className }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
