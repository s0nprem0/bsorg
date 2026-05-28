import { SearchInput } from '@/components/ui/SearchInput';
import { Filter, ArrowDownUp } from 'lucide-react';
import { ORG_BROWSER, SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';

interface OrgFilterBarProps {
  localQuery: string;
  setLocalQuery: (value: string) => void;
  orgType: string;
  onTypeChange: (value: string) => void;
  program: string;
  onProgramChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  programs: string[];
}

export default function OrgFilterBar({
  localQuery,
  setLocalQuery,
  orgType,
  onTypeChange,
  program,
  onProgramChange,
  sortBy,
  onSortChange,
  programs,
}: OrgFilterBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2 mb-8">
      <div className="lg:col-span-2">
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Search
        </label>
        <SearchInput
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          onClear={() => setLocalQuery('')}
          placeholder="Search by name, acronym, or tags..."
          aria-label="Search organizations"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Type
        </label>
        <Select value={orgType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {ORG_BROWSER.ORG_TYPE_OPTIONS.map(type => (
              <SelectItem key={`org-type-${type}`} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Program
        </label>
        <Select value={program} onValueChange={onProgramChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Programs" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {programs.map(p => (
              <SelectItem key={p} value={p} title={p === 'All' ? '' : p}>
                {p === 'All' ? 'All Programs' : abbreviateProgram(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Sort
        </label>
        <Select value={sortBy} onValueChange={value => onSortChange(value as SortOption)}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.ASC}>
              A-Z (Alphabetical)
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.DESC}>Z-A (Reverse)</SelectItem>
            <SelectItem value={SORT_OPTIONS.NEWEST}>
              Newest Founded
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
