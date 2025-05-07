import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Header from "../../components/Header/Header.tsx"
import Footer from "../../components/Footer/Footer.tsx"

const footerStyle = { marginTop: "auto" }

export default function SuspenseFallbackPage() {
  return (
    <>
      <LoadingDisplay loading={true} />
      <Header />
      <div style={footerStyle}>
        <Footer />
      </div>
    </>
  )
}
