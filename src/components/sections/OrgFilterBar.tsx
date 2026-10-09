import { SearchInput } from '@/components/ui/SearchInput';
import { ArrowDownUp, MapPin, LayoutGrid, GraduationCap, Shapes } from 'lucide-react';
import { ORG_BROWSER, SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import { ORG_CATEGORIES } from '@/lib/orgIndex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';

export interface FilterState {
  orgType: string;
  category: string;
  program: string;
  sortBy: SortOption;
  campusId: string | null;
}

interface OrgFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  state: FilterState;
  dispatch: (key: string, value: string | null) => void;
  programs: string[];
  campuses: { id: number; name: string; count: number }[];
}

export default function OrgFilterBar({
  query,
  onQueryChange,
  state,
  dispatch,
  programs,
  campuses,
}: OrgFilterBarProps) {
  return (
    <div className="mb-8 space-y-3">
      <div className="w-full sm:max-w-md">
        <SearchInput
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onClear={() => onQueryChange('')}
          placeholder="Search by name, acronym, or tags..."
          aria-label="Search organizations"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
        {/* Type is settable from the home and footer links, so it needs a
            control here too, or it is a filter you can enter but not change. */}
        <Select
          value={state.orgType}
          onValueChange={value => dispatch('type', value)}
        >
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <Shapes className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {ORG_BROWSER.ORG_TYPE_OPTIONS.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={state.category}
          onValueChange={value => dispatch('category', value)}
        >
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

        <Select
          value={state.program}
          onValueChange={value => dispatch('program', value)}
        >
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
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

        <Select
          value={state.campusId ?? 'All'}
          onValueChange={value =>
            dispatch('campusId', value === 'All' ? null : value)
          }
        >
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Campuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Campuses</SelectItem>
            {campuses.map(campus => (
              <SelectItem key={campus.id} value={String(campus.id)}>
                {campus.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={state.sortBy}
          onValueChange={value => dispatch('sort', value as SortOption)}
        >
          <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <ArrowDownUp className="h-4 w-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.ASC}>A-Z (Alphabetical)</SelectItem>
            <SelectItem value={SORT_OPTIONS.DESC}>Z-A (Reverse)</SelectItem>
            <SelectItem value={SORT_OPTIONS.CAMPUS}>By campus</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}