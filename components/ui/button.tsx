import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tap-target touch-manipulation",
  {
    variants: {
      variant: {
        default: "text-white active:scale-95 fiora-btn-primary",
        destructive: "text-white active:scale-95 fiora-btn-destructive",
        outline:
          "border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 active:scale-95 text-neutral-900",
        secondary: "text-white active:scale-95 fiora-btn-secondary",
        ghost:
          "hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 text-neutral-900",
        link: "underline-offset-4 hover:underline active:scale-95 fiora-btn-link",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px] min-w-[44px]",
        sm: "h-8 rounded-md px-3 text-xs min-h-[36px] min-w-[36px]",
        lg: "h-12 rounded-lg px-8 min-h-[48px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-8 w-8 min-h-[36px] min-w-[36px]",
        "icon-lg": "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
