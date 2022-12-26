import { AnimatePresence, motion } from "framer-motion";
import ReactDOM from "react-dom";

const Popup = ({ text, type }) => {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {text && (
        <motion.div
          transition={{ duration: 0.3, type: "spring", stiffness: 80 }}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          className={`z-[200] fixed shadow-card-200 bottom-8 right-8 py-3 px-4 border rounded-xl text-lg font-medium ${
            type ? "border-green-500 bg-green-200 text-green-500" : "border-red-500 bg-red-200 text-red-500"
          }`}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("portal")
  );
};

export default Popup;
