import { FaGithubSquare } from "react-icons/fa"
import "./Footer.css"

function Footer() {
  return (
    <footer>
      <span>&copy; Jeremy_Loh</span>
      <a
        id="footer-github-link"
        href="https://github.com/JeremyLoh/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Github link for Jeremy Loh"
      >
        <FaGithubSquare size={28} />
      </a>
    </footer>
  )
}

export default Footer
