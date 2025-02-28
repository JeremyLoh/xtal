import "./Pagination.css"

type PaginationProps = {
  className?: string
  currentPage: number
}

function Pagination(props: PaginationProps) {
  return (
    <nav
      className={`pagination-container ${props.className}`}
      role="navigation"
      aria-label="pagination"
    >
      <ul className="pagination-content">
        <li className="pagination-item">{props.currentPage}</li>
      </ul>
    </nav>
  )
}

export default Pagination
