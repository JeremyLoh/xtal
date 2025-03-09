import "./Footer.css"
import { FaGithubSquare } from "react-icons/fa"

function Footer() {
  return (
    <footer>
      <span className="footer-subtitle">Listen to the World</span>
      <span>&copy; Jeremy_Loh</span>
      <a
        id="footer-github-link"
        href="https://github.com/JeremyLoh/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Github link for Jeremy Loh"
      >
        <FaGithubSquare size={28} className="footer-icon" />
      </a>
    </footer>
  )
}

export default Footer
