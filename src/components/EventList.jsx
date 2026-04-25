import React from "react";
import EventItem from './EventItem';
import styles from '../styles/EventList.module.css';

const EventList = ({ events, onEdit, onDelete }) => {
    // Conditional Rending for Empty State
    if (events.length === 0){
        return (
            <div className={styles.emptyState}>
                <p>No events match the current filters yet. Try adjusting the search, date range, or categories.</p>
            </div>
        );
    }

    return (
        <div className={styles.eventList}>
            <h2>Events ({events.length})</h2>

            <div className={styles.listContainer}>
                {/* Using map to render list items with unique keys */}
                {events.map(event => (
                    <EventItem
                        key      = {event.id} // Unique key for list items
                        event    = {event}
                        onEdit   = {onEdit}
                        onDelete = {onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;