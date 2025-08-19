import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakIndicatorProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakIndicator = ({ streak, className, size = 'md' }: StreakIndicatorProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28
  };

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-streak',
      sizeClasses[size],
      className
    )}>
      <Flame size={iconSizes[size]} className="animate-pulse" />
      <span>{streak}-day streak</span>
    </div>
  );
};