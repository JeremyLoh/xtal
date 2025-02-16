import "./Spinner.css"
import { AnimatePresence, motion } from "motion/react"
import { PiSpinner } from "react-icons/pi"

type SpinnerProps = {
  isLoading: boolean
}

const Spinner = ({ isLoading }: SpinnerProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="spinner-container"
          data-testid="loading-spinner"
          exit={{ opacity: 0 }}
        >
          <div className="spinner-content">
            <motion.div
              className="spinner"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
              <PiSpinner size={120} />
            </motion.div>
            <span className="spinner-text">LOADING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Spinner
