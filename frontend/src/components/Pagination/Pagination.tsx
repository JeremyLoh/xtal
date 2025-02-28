import "./Pagination.css"
import { memo, useCallback } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

type PaginationProps = {
  className?: string
  currentPage: number
  totalPages: number
  onPreviousPageClick: (currentPage: number) => void
  onNextPageClick: (currentPage: number) => void
}

function Pagination({
  className,
  currentPage,
  totalPages,
  onPreviousPageClick,
  onNextPageClick,
}: PaginationProps) {
  const handlePreviousClick = useCallback(() => {
    onPreviousPageClick(currentPage)
  }, [currentPage, onPreviousPageClick])

  const handleNextClick = useCallback(() => {
    onNextPageClick(currentPage)
  }, [currentPage, onNextPageClick])

  return (
    <nav
      className={`pagination-container ${className}`}
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="pagination-previous-button"
        disabled={currentPage <= 1}
        onClick={handlePreviousClick}
      >
        <FaChevronLeft size={16} />
        <span>Previous</span>
      </button>
      <ul className="pagination-content">
        <li className="pagination-item active">{currentPage}</li>
      </ul>
      <button
        className="pagination-next-button"
        disabled={totalPages <= 0 || totalPages === currentPage}
        onClick={handleNextClick}
      >
        <span>Next</span>
        <FaChevronRight size={16} />
      </button>
    </nav>
  )
}

export default memo(Pagination)
