import React from 'react'
import { Button } from "@/components/ui/button";
type Props = {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / pageSize);
 
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4 mt-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          className="cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span className="text-sm sm:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className="cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="cursor-pointer border rounded px-2 py-1 text-sm sm:text-base"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}

export default Pagination