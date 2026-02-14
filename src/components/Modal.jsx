// Modal.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { getPortalRoot } from "../utils/portal.Root"; // Fixed import path
import styles from "../styles/Modal.module.css";

const Modal = ({ children, onClose }) => {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent Body Scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Create portal to render modal outside main DOM tree
    return ReactDOM.createPortal(
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button 
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>
                {children}
            </div>
        </div>,
        getPortalRoot()
    );
};

export default Modal;