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

    return (
    <div className={styles.adminPanel}>
      <h3>Event Analytics</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Total Events</h4>
          <p className={styles.statNumber}>{totalEvents}</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>Completed</h4>
          <p className={styles.statNumber}>{completedEvents}</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>Upcoming</h4>
          <p className={styles.statNumber}>{upcomingEvents}</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>High Priority</h4>
          <p className={styles.statNumber}>{highPriorityEvents}</p>
        </div>
      </div>

      <div className={styles.categoryBreakdown}>
        <h4>Events by Category</h4>

        <div className={styles.categoryList}>
          {Object.entries(categoryCount).map(([category, count]) => (

            <div key={category} className={styles.categoryItem}>
              <span className={styles.categoryName}>{category}</span>
                <div className={styles.categoryBar}>
                    <div 
                    className={styles.categoryFill}
                    style={{ width: `${(count / totalEvents) * 100}%` }}
                    />
                </div>
              <span className={styles.categoryCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


};

export default AdminPanel;