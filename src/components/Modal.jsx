// Modal.jsx
import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { getPortalRoot } from '../utils/portal.Root';
import styles from '../styles/Modal.module.css';

const Modal = ({ children, onclose }) => {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onclose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onclose]);

    // Prevent Body Scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    const handleBackdropClick = (e) =>{
        if (e.target === e.currentTarget) onclose();
    };

    // Create portal to render modal outside main DOM tree
    return ReactDOM.createPortal(
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button 
                  className={styles.closeButton}
                  onClick={onclose}
                  aria-label="Close modal"
                >
                    x
                </button>
                {children}
            </div> 
        </div>,
        getPortalRoot()
    );
};

export default Modal;