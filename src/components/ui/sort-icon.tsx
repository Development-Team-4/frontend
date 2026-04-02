import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { SortField } from '@/shared/types';

interface SortIconProps {
  field: SortField;
  currentSortField: SortField;
  sortDir: 'asc' | 'desc';
}

export const SortIcon = ({
  field,
  currentSortField,
  sortDir,
}: SortIconProps) => {
  if (currentSortField !== field)
    return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;

  return sortDir === 'asc' ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  );
};
