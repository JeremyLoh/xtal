import "./ProfileHistoryPage.css"
import { useEffect } from "react"

function ProfileHistoryPage() {
  useEffect(() => {
    document.title = "xtal - profile - history"
  }, [])

  return (
    <div className="profile-history-page-container">
      <h2>Podcast Listen History</h2>
      <p>Not available. Start listening to some podcasts!</p>
    </div>
  )
}

export default ProfileHistoryPage
