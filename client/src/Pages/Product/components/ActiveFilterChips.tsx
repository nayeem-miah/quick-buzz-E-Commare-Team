import { X } from 'lucide-react';
import { ActiveFilterChip } from '../types';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onClearAll: () => void;
}

const ActiveFilterChips = ({ chips, onClearAll }: ActiveFilterChipsProps) => {
  if (!chips.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-orange-100"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-sm font-semibold text-gray-500 transition hover:text-orange-600">
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilterChips;
