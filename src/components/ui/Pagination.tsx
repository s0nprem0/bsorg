import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          group flex h-11 w-11 items-center justify-center
          rounded-2xl border border-white/10
          bg-white/3
          text-neutral-400
          backdrop-blur-xl
          transition-all duration-300
          hover:border-white/20
          hover:bg-white/6
          hover:text-white
          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <ChevronLeft
          size={18}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      </button>

      <div
        className="
          flex items-center gap-2 rounded-2xl
          border border-white/10
          bg-white/3
          p-2 backdrop-blur-xl
        "
      >
        {generatePages().map((page, index) =>
          typeof page === 'string' ? (
            <span
              key={index}
              className="px-2 text-sm text-neutral-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                relative flex h-10 min-w-10
                items-center justify-center
                rounded-xl px-3 text-sm font-medium
                transition-all duration-300
                ${
                  currentPage === page
                    ? `
                      bg-white text-black
                      shadow-[0_0_30px_rgba(255,255,255,0.15)]
                    `
                    : `
                      text-neutral-400
                      hover:bg-white/6
                      hover:text-white
                    `
                }
              `}
            >
              {currentPage === page && (
                <div
                  className="
                    absolute inset-0 rounded-xl
                    border border-white/20
                  "
                />
              )}

              <span className="relative z-10">
                {page}
              </span>
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          group flex h-11 w-11 items-center justify-center
          rounded-2xl border border-white/10
          bg-white/3
          text-neutral-400
          backdrop-blur-xl
          transition-all duration-300
          hover:border-white/20
          hover:bg-white/6
          hover:text-white
          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <ChevronRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
};

export default Pagination;