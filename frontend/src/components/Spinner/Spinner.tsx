import "./Spinner.css"
import { AnimatePresence, motion } from "motion/react"
import { PiSpinner } from "react-icons/pi"

const spinnerContainerExit = { opacity: 0 }
const spinnerInitial = { rotate: 0 }
const spinnerAnimate = { rotate: 360 }
const spinnerExit = { opacity: 0 }
const spinnerTransition = { repeat: Infinity, duration: 2, ease: "linear" }

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
          exit={spinnerContainerExit}
        >
          <motion.div
            key="spinner"
            className="spinner"
            initial={spinnerInitial}
            animate={spinnerAnimate}
            exit={spinnerExit}
            transition={spinnerTransition}
          >
            <PiSpinner size={64} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Spinner
