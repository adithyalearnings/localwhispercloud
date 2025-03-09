
import { cn } from "@/lib/utils";

type AnimationProps = {
  delay?: number;
  duration?: number;
  className?: string;
};

export const fadeIn = ({ delay = 0, duration = 500, className = "" }: AnimationProps) => {
  return cn(
    "animate-fade-in opacity-0",
    className,
    `[animation-delay:${delay}ms]`,
    `[animation-duration:${duration}ms]`,
    "[animation-fill-mode:forwards]"
  );
};

export const fadeUp = ({ delay = 0, duration = 600, className = "" }: AnimationProps) => {
  return cn(
    "animate-fade-up opacity-0",
    className,
    `[animation-delay:${delay}ms]`,
    `[animation-duration:${duration}ms]`,
    "[animation-fill-mode:forwards]"
  );
};

export const blurIn = ({ delay = 0, duration = 400, className = "" }: AnimationProps) => {
  return cn(
    "animate-blur-in opacity-0",
    className,
    `[animation-delay:${delay}ms]`,
    `[animation-duration:${duration}ms]`,
    "[animation-fill-mode:forwards]"
  );
};
