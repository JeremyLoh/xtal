import "./Pagination.css"
import { memo, useCallback, useMemo } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { PiCaretDoubleLeftBold, PiCaretDoubleRightBold } from "react-icons/pi"
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

  const handleFirstPageClick = useCallback(() => {
    if (currentPage === 1) {
      return
    }
    onPageClick(1)
  }, [currentPage, onPageClick])

  const handleLastPageClick = useCallback(() => {
    if (currentPage === totalPages) {
      return
    }
    onPageClick(totalPages)
  }, [currentPage, totalPages, onPageClick])

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
        keyProp="pagination-first-page-button"
        className="pagination-first-page-button"
        data-testid="pagination-first-page-button"
        disabled={currentPage === 1}
        onClick={handleFirstPageClick}
      >
        <PiCaretDoubleLeftBold size={16} />
      </Button>
      <Button
        keyProp="pagination-previous-button"
        className="pagination-previous-button"
        data-testid="pagination-previous-button"
        disabled={currentPage <= 1}
        onClick={handlePreviousClick}
      >
        <FaChevronLeft size={16} />
        {!isMobile && <span>Previous</span>}
      </Button>
      <div className="pagination-content">
        {pages.map((pageNumber: number) => {
          if (pageNumber > totalPages || pageNumber <= 0) {
            return null
          }
          return (
            <Button
              keyProp={`pagination-page-${pageNumber}`}
              key={`pagination-page-${pageNumber}`}
              className={`pagination-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>
      <Button
        keyProp="pagination-next-button"
        className="pagination-next-button"
        data-testid="pagination-next-button"
        disabled={totalPages <= 0 || totalPages === currentPage}
        onClick={handleNextClick}
      >
        {!isMobile && <span>Next</span>}
        <FaChevronRight size={16} />
      </Button>
      <Button
        keyProp="pagination-last-page-button"
        className="pagination-last-page-button"
        data-testid="pagination-last-page-button"
        disabled={currentPage === totalPages}
        onClick={handleLastPageClick}
      >
        <PiCaretDoubleRightBold size={16} />
      </Button>
    </nav>
  )
}

export default memo(Pagination)
