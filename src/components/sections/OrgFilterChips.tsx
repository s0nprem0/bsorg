import { X } from 'lucide-react';

interface OrgFilterChipsProps {
  chips: { label: string; key: string }[];
  onRemove: (key: string) => void;
}

export default function OrgFilterChips({ chips, onRemove }: OrgFilterChipsProps) {
  if (!chips.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map(chip => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-foreground"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
