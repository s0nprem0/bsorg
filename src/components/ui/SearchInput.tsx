import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/shadcn/input';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onClear, ...props }, ref) => {
    return (
      <div
        className={cn('relative group flex items-center', containerClassName)}
      >
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground z-10 transition-colors group-focus-within:text-primary" />
        <Input
          ref={ref}
          value={value}
          className={cn('pl-10 pr-10 h-11 bg-muted/50 shadow-sm', className)}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
