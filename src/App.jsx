import React, { useState, lazy, Suspense } from "react";
import EventList from './components/EventList';
import EventForm from './components/EventForm'; // Fixed import
import Modal from './components/Modal';
import styles from './styles/App.module.css';

// Lazy load Admin Panel for performance optimization
const AdminPanel = lazy(() => import('./components/AdminPanel'));

function App() {
    // state for events data
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Team Meeting',
            description: 'Weekly Team Development Progress',
            date: '2026-01-29',
            category: 'Work',
            priority: 'Medium', // Fixed spelling
            status: 'Past',
            completed: true
        },
        {
            id: 2,
            title: 'BirthDay Party', // Fixed spelling
            description: 'Ahmed\'s birthday Celebrations', // Fixed escape
            date: '2026-03-17',
            category: 'Personal',
            priority: 'High', // Fixed spelling
            status: 'Upcoming', // Consistent spelling
            completed: false
        },
        {
            id: 3,
            title: 'Java Development Conference', // Fixed spelling
            description: 'Tech Meet Up 2026',
            date: '2026-02-28',
            category: 'Work',
            priority: 'Low', // Fixed spelling
            status: 'Upcoming', // Consistent spelling
            completed: false
        },
    ]);

    // State for form modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [currentFilter, setCurrentFilter] = useState('all'); // Fixed variable name

    // Event Handlers 
    // Add event
    const handleAddEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            status: new Date(eventData.date) >= new Date() ? 'Upcoming' : 'Past' // Consistent spelling
        };
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    // Edit event 
    const handleEditEvent = (updatedEvent) => {
        setEvents(events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        ));
        setEditingEvent(null);
        setIsModalOpen(false);
    };

    // Delete event 
    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) // Fixed comma
        {
            setEvents(events.filter(event => event.id !== id));
        }
    };

    // Click event
    const handleEditClick = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    // Filter events based on selection
    const filteredEvents = events.filter(event => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'Upcoming') return event.status === 'Upcoming'; // Consistent
        if (currentFilter === 'Past') return event.status === 'Past';
        if (currentFilter === 'Completed') return event.completed;
        return true;
    });

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <h1>🔰 Eventora 🔰</h1>
                <p>Modern Event Management Application</p>
            </header>

            <main className={styles.main}>
                <div className={styles.controls}>
                    <button
                        className={styles.addButton}
                        onClick={() => {
                            setEditingEvent(null);
                            setIsModalOpen(true);
                        }}
                    >
                        + Add New Event
                    </button>

                    <div className={styles.filter}>
                        <label> Filter By: </label>
                        <select 
                            value={currentFilter}
                            onChange={(e) => setCurrentFilter(e.target.value)} // Fixed
                            className={styles.filterSelect}
                        >
                            <option value="all">All Events</option>
                            <option value="Upcoming">Upcoming</option> // Consistent
                            <option value="Past">Past</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                
                <EventList 
                    events={filteredEvents}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteEvent}
                />

                {/* React Portal for Modal */}
                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)}>
                        <EventForm // Fixed component name
                            event={editingEvent}
                            onSubmit={editingEvent ? handleEditEvent : handleAddEvent} // Fixed handler
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </Modal>
                )}

                {/* Suspense for lazy loading */}
                <section className={styles.adminSection}>
                    <h2>Admin Panel</h2>
                    <Suspense fallback={<div className={styles.loading}> Loading Admin Panel... </div>}>
                        <AdminPanel events={events}/>
                    </Suspense>
                </section>
            </main>

            <footer>
                <p>| Eventora 2026 | </p>
            </footer>
        </div>
    );
}

export default App;