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
}