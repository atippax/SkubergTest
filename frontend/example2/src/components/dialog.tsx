import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
};

export const Modal = ({
  isOpen,
  onClose,
  header,
  content,
  actions,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white  w-fit rounded-2xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              {header}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 text-lg"
              >
                ×
              </button>
            </div>

            <div className="mb-4">{content}</div>
            <div className="flex justify-end gap-2">{actions}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
