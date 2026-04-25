import React, { useState } from "react";
import styles from '../styles/EventItem.module.css';

const EventItem = ({ event, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (dateString) => {
        const eventDate = new Date(dateString);
        eventDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today!";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return `${diffDays} days left`;
    };

    // Priority styling
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return styles.priorityHigh;
            case 'Medium': return styles.priorityMedium;
            case 'Low': return styles.priorityLow;
            default: return styles.priorityMedium;
        }
    };

    // Category Styling
    const getCategoryClass = (category) => {
        switch (category) {
            case 'Work': return styles.categoryWork;
            case 'Personal': return styles.categoryPersonal;
            case 'Social': return styles.categorySocial;
            default: return styles.categoryPersonal;
        }
    };

    const truncatedDescription = event.description.length > 120 ? event.description.slice(0, 120) + '…' : event.description;

    const handleToggle = () => setExpanded(prev => !prev);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <div
            className={`${styles.eventCard} ${event.completed ? styles.completed : ''} ${event.priority === 'High' ? styles.highPriorityCard : ''}`}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
        >
            {event.priority === 'High' && <div className={styles.priorityIndicator}></div>}

            <div className={styles.eventHeader}>
                <div className={styles.titleArea}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <span className={`${styles.priorityBadge} ${getPriorityClass(event.priority)}`}>
                        {event.priority}
                    </span>
                </div>
                {event.status === 'Upcoming' && !event.completed && (
                    <div className={`${styles.countdown} ${getDaysRemaining(event.date).includes('ago') ? styles.overdue : ''}`}>
                        {getDaysRemaining(event.date)}
                    </div>
                )}
            </div>

            <p className={styles.eventDescription}>{expanded ? event.description : truncatedDescription}</p>

            {expanded && event.recurrence && (
                <div className={styles.expandedSection}>
                    <span className={styles.detailLabel}>🔁 Recurrence</span>
                    <span className={styles.detailValue}>{event.recurrence}</span>
                </div>
            )}

            <div className={styles.eventDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>📅 Date</span>
                    <span className={styles.detailValue}>{formatDate(event.date)}</span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>📊 Status</span>
                    <span className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}>{event.status}</span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>🏷️ Category</span>
                    <span className={`${styles.categoryBadge} ${getCategoryClass(event.category)}`}>{event.category}</span>
                </div>
            </div>

            <div className={styles.eventActions}>
                <div className={styles.statusSection}>
                    {event.completed && (
                        <span className={styles.completedLabel}>
                            <span className={styles.checkIcon}>✓</span> Completed
                        </span>
                    )}
                </div>

                <div className={styles.actionButtons}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(event); }}
                        className={styles.editButton}
                        aria-label="Edit event"
                    >
                        Edit
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                        className={styles.deleteButton}
                        aria-label="Delete Event"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventItem;