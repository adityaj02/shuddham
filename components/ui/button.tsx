"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import "./gooey-nav.css" // Reuse particle animations

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer relative overflow-visible",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  withGooeyEffect?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withGooeyEffect = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const spawnParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!withGooeyEffect) return;
      const target = e.currentTarget;
      
      requestAnimationFrame(() => {
        const particleCount = 8;
        const animationTime = 400;
        
        for (let i = 0; i < particleCount; i++) {
          const t = animationTime * 2 + (Math.random() - 0.5) * 400;
          const angle = (Math.random() * 360) * (Math.PI / 180);
          const dist = 30 + Math.random() * 40;
          const endX = dist * Math.cos(angle);
          const endY = dist * Math.sin(angle);
          const rotate = (Math.random() - 0.5) * 200;

          const particle = document.createElement('span');
          const point = document.createElement('span');
          particle.classList.add('particle');
          
          const colors = ['#17281a', '#4c644d', '#cbe7ca', '#8ba889'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          particle.style.setProperty('--start-x', '0px');
          particle.style.setProperty('--start-y', '0px');
          particle.style.setProperty('--end-x', `${endX}px`);
          particle.style.setProperty('--end-y', `${endY}px`);
          particle.style.setProperty('--time', `${t}ms`);
          particle.style.setProperty('--scale', `${0.8 + Math.random() * 0.5}`);
          particle.style.setProperty('--rotate', `${rotate}deg`);

          point.classList.add('point');
          point.style.background = randomColor;
          
          particle.appendChild(point);
          target.appendChild(particle);

          setTimeout(() => {
            try { target.removeChild(particle); } catch { /* ignore */ }
          }, t);
        }
      });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      spawnParticles(e);
      if (onClick) onClick(e);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref || (asChild ? undefined : buttonRef)}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
