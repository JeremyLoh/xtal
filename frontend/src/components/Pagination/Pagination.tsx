import "./Pagination.css"
import { memo, useCallback, useMemo } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import Button from "../ui/button/Button.tsx"

type PaginationProps = {
  className?: string
  currentPage: number
  totalPages: number
  onPreviousPageClick: (currentPage: number) => void
  onNextPageClick: (currentPage: number) => void
  onPageClick: (pageNumber: number) => void
}

function Pagination({
  className,
  currentPage,
  totalPages,
  onPreviousPageClick,
  onNextPageClick,
  onPageClick,
}: PaginationProps) {
  const { isMobile } = useScreenDimensions()

  const handlePreviousClick = useCallback(() => {
    onPreviousPageClick(currentPage)
  }, [currentPage, onPreviousPageClick])

  const handleNextClick = useCallback(() => {
    onNextPageClick(currentPage)
  }, [currentPage, onNextPageClick])

  const handlePageClick = useCallback(
    (pageNumber: number) => {
      if (pageNumber === currentPage) {
        return
      }
      onPageClick(pageNumber)
    },
    [currentPage, onPageClick]
  )

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
      <Button
        className="pagination-previous-button"
        disabled={currentPage <= 1}
        onClick={handlePreviousClick}
      >
        <FaChevronLeft size={16} />
        <span>Previous</span>
      </Button>
      <ul className="pagination-content">
        {pages.map((pageNumber: number) => {
          if (pageNumber > totalPages || pageNumber <= 0) {
            return null
          }
          return (
            <li
              key={`pagination-page-${pageNumber}`}
              className={`pagination-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </li>
          )
        })}
      </ul>
      <Button
        className="pagination-next-button"
        disabled={totalPages <= 0 || totalPages === currentPage}
        onClick={handleNextClick}
      >
        <span>Next</span>
        <FaChevronRight size={16} />
      </Button>
    </nav>
  )
}

export default memo(Pagination)
