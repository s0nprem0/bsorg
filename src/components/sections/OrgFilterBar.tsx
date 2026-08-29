import { SearchInput } from '@/components/ui/SearchInput';
import { Filter, ArrowDownUp, MapPin, LayoutGrid } from 'lucide-react';
import { ORG_BROWSER, SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import { CAMPUSES } from '@/data/campuses';
import { ORG_CATEGORIES } from '@/lib/orgIndex';
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
  category: string;
  onCategoryChange: (value: string) => void;
  program: string;
  onProgramChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  campusId: string | null;
  onCampusChange: (value: string) => void;
  programs: string[];
}

export default function OrgFilterBar({
  localQuery,
  setLocalQuery,
  orgType,
  onTypeChange,
  category,
  onCategoryChange,
  program,
  onProgramChange,
  sortBy,
  onSortChange,
  campusId,
  onCampusChange,
  programs,
}: OrgFilterBarProps) {
  return (
    <div className="mb-8 space-y-3">
      <div className="w-full sm:max-w-md">
        <SearchInput
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          onClear={() => setLocalQuery('')}
          placeholder="Search by name, acronym, or tags..."
          aria-label="Search organizations"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
        <Select value={orgType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
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

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <LayoutGrid className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="All">All Categories</SelectItem>
            {ORG_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat} title={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={program} onValueChange={onProgramChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Programs" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {programs.map(p => (
              <SelectItem key={p} value={p} title={p === 'All' ? '' : p}>
                {p === 'All' ? 'All Programs' : abbreviateProgram(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={campusId ?? 'All'} onValueChange={onCampusChange}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Campuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Campuses</SelectItem>
            {CAMPUSES.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={value => onSortChange(value as SortOption)}>
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.ASC}>A-Z (Alphabetical)</SelectItem>
            <SelectItem value={SORT_OPTIONS.DESC}>Z-A (Reverse)</SelectItem>
            <SelectItem value={SORT_OPTIONS.NEWEST}>Newest Founded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
