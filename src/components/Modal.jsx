import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import ReactDOM from "react-dom";
import { BiX } from "react-icons/bi";
import useClickOutside from "../hooks/useClickOutside";

const Modal = ({ children, title, isVisible, setIsVisible }) => {
  /* close modal onclick outside */
  const modalBody = useRef();
  useClickOutside(modalBody, () => setIsVisible(false));

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          transition={{ duration: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-0 left-0 w-screen h-screen bg-darkener-500 z-[100] py-32 flex justify-center overflow-y-auto ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          } duration-300`}
        >
          <motion.div
            ref={modalBody}
            transition={{ duration: 0.3 }}
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            className={`w-[90vw] sm:w-[600px] bg-white rounded-xl shadow-card-400 h-fit`}
          >
            {!!title && (
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <p className="text-xl font-medium">{title}</p>
                <BiX className="text-2xl cursor-pointer" onClick={makeInvisible} />
              </div>
            )}
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("portal")
  );
};

export default Modal;
