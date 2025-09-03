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
     <div className='flex items-center justify-end space-x-4 mt-4'>
        <Button className='cursor-pointer' onClick={() => onPageChange(currentPage -1)} disabled={currentPage === 1}>
            prev
        </Button>
        <span> 
            page {currentPage} of {totalPages}
        </span>
        <Button className='cursor-pointer mr-2' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            next
        </Button>

        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className='cursor-pointer'>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option> 
        </select>
     </div>
  )
}

export default Pagination