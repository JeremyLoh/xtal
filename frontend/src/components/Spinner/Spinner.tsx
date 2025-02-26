import "./Spinner.css"
import { AnimatePresence, motion } from "motion/react"
import { PiSpinner } from "react-icons/pi"

type SpinnerProps = {
  isLoading: boolean
}

const Spinner = ({ isLoading }: SpinnerProps) => {
  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="spinner-container"
          className="spinner-container"
          data-testid="loading-spinner"
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="spinner"
            className="spinner"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            <PiSpinner size={120} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Spinner
