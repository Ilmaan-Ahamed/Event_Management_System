import React from "react";
import styles from '../styles/AdminPanel.module.css';

const AdminPanel =({ events }) => {
    // Calculate Statistics
    const totalEvents     = events.length;
    const completedEvents = events.filter(e => e.completed).length;
    const upcomingEvents  = events.filter(e => e.status === 'Up-Comming').length;
    const highPriorityEvents = events.filter(e => e.priority === 'High').length;

    // Group by category
    const categoryCount = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
}, {});



}