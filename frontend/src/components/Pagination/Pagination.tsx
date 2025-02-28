import "./Pagination.css"
import { memo, useCallback, useMemo } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"

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
  const { isMobile } = useScreenDimensions()

  const handlePreviousClick = useCallback(() => {
    onPreviousPageClick(currentPage)
  }, [currentPage, onPreviousPageClick])

  const handleNextClick = useCallback(() => {
    onNextPageClick(currentPage)
  }, [currentPage, onNextPageClick])

  const pages = useMemo(() => {
    return isMobile
      ? [currentPage]
      : [
          currentPage - 3,
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3,
        ]
  }, [currentPage, isMobile])

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
        {pages.map((pageNumber: number) => {
          if (pageNumber > totalPages || pageNumber <= 0) {
            return null
          }
          return (
            <li
              className={`pagination-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
            >
              {pageNumber}
            </li>
          )
        })}
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
