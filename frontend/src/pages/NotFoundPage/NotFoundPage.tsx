import "./NotFoundPage.css"
import { Link } from "react-router"
import { HiOutlineFaceFrown } from "react-icons/hi2"
import Header from "../../components/Header/Header.tsx"
import Footer from "../../components/Footer/Footer.tsx"

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <div className="not-found-page-container">
        <HiOutlineFaceFrown size={64} />
        <h1 className="not-found-page-title">404 Not Found</h1>
        <Link to="/" replace>
          Return Home
        </Link>
      </div>
      <Footer />
    </>
  )
}
