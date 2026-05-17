type PillVariant = 'default' | 'outline' | 'soft' | 'success' | 'danger';

type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

const VARIANTS: Record<PillVariant, string> = {
  default:
    'bg-black text-white border border-black',
  outline:
    'bg-white text-black border border-neutral-300',
  soft:
    'bg-neutral-100 text-neutral-700 border border-transparent',
  success:
    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  danger:
    'bg-red-100 text-red-700 border border-red-200',
};

const SIZES = {
  sm: 'h-6 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-base gap-2',
};

const Pill: React.FC<PillProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  icon,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        rounded ? 'rounded-full' : 'rounded-lg',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};

export default Pill;