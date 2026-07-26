import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SortDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SortDropdown = ({ value, options, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 min-w-48 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100"
      >
        {value}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-gray-200/80">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${value === option ? 'bg-orange-50 font-semibold text-orange-700' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-orange-600'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
