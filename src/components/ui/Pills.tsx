import React from 'react';

type PillVariant = 'default' | 'outline' | 'soft' | 'success' | 'danger';

type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

type PillsProps = {
  items: string[];
  variant?: PillVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const VARIANTS: Record<PillVariant, string> = {
  default:
    'bg-foreground text-background border border-transparent',
  outline:
    'bg-transparent text-foreground border border-border',
  soft:
    'bg-surface-2 text-foreground-secondary border border-border/50',
  success:
    'bg-success/10 text-success border border-success/20',
  danger:
    'bg-error/10 text-error border border-error/20',
};

const SIZES = {
  sm: 'h-6 px-2 text-xs gap-1.5',
  md: 'h-7 px-2.5 text-sm gap-2',
  lg: 'h-9 px-3.5 text-sm font-medium gap-2',
};

const Pill: React.FC<PillProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  icon,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center justify-center transition-colors',
        rounded ? 'rounded-full' : 'rounded-md',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
    >
      {icon && <span className="flex items-center opacity-80">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};

const Pills: React.FC<PillsProps> = ({
  items,
  variant = 'soft',
  size = 'sm',
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, index) => (
        <Pill key={index} variant={variant} size={size}>
          {item}
        </Pill>
      ))}
    </div>
  );
};

export type { PillProps, PillsProps };
export { Pill, Pills };
export default Pill;