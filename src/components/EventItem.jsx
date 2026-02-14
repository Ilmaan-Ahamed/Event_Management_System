import React from "react";
import styles from '../styles/EventItem.module.css';

const EventItem = ({ event, onEdit, onDelete }) => {
    // Format date for display
    const formatdate = (datestring) => {
        return new Date(datestring).toLocaleDateString('en-US', {
            weekday : 'short',
            year    : 'numeric',
            month   : 'short',
            day     : 'numeric'
        });
    };

    // Priority styling
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High' : 
                return styles.priorityHigh;
            case 'Medium' :
                return styles.priorityMedium 
            case 'Low' :
                return styles.priorityLow;
        }
    };

    // Category Styling
    const getCategoryClass = (category) => {
        switch (category) {
            case 'Work' :
                return styles.categoryWork;
            case 'Personal' :
                return styles.categoryPersonal;
            case 'Social' :
                return styles.categorySocial;
            default :
                return styles.categoryPersonal;
        }
    };

    return(
        <div className={`${styles.eventCard} ${event.completed ? styles.completed : ''}`}>
            <div className={styles.eventHeader}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <span className={`${styles.priorityBadge} ${getPriorityClass(event.priority)}`}>
                    {event.priority}
                </span>
            </div>

            <p className={styles.eventdescription}>{eventdescription}</p>

            <div className={styles.eventDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLable}>Date:</span>
                    <span className={styles.detailValue}>{formatdate(event.date)}</span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailLable}>Status :</span>
                    <span className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}>{event.status} </span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Category:</span>
                    <span className={`${styles.categoryBadge} ${getCategoryClass(event.category)}`}>{event.category}</span>
                </div>
            </div>

            
        </div>
    )
    
}