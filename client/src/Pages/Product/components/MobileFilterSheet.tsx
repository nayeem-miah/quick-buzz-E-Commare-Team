import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface MobileFilterSheetProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

const MobileFilterSheet = ({ isOpen, children, onClose }: MobileFilterSheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-gray-950/40" />
      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-bold text-gray-950">Filter products</p>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
        <button type="button" onClick={onClose} className="btn mt-4 w-full border-0 bg-orange-400 text-gray-950 hover:bg-orange-500">
          Show Results
        </button>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
