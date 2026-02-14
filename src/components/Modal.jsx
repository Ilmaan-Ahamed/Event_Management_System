import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { getPortalRoot } from '../utils/portalRoot'; // Fixed import path
import styles from '../styles/Modal.module.css';

const Modal = ({ children, onClose }) => { // Fixed prop name
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose(); // Fixed function name
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]); // Fixed dependency

    // Prevent Body Scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose(); // Fixed function name
    };

    // Create portal to render modal outside main DOM tree
    return ReactDOM.createPortal(
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button 
                    className={styles.closeButton}
                    onClick={onClose} // Fixed prop name
                    aria-label="Close modal"
                >
                    × {/* Fixed: changed "x" to multiplication sign */}
                </button>
                {children}
            </div>
        </div>,
        getPortalRoot()
    );
};

export default Modal;