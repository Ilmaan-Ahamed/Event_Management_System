import React, { useState, useEffect, lazy, Suspense } from "react";
import EventList from './components/EventList';
import EventForm from './components/EventForm'; 
import Modal from './components/Modal';
import styles from './styles/App.module.css';

// Lazy load Admin Panel for performance optimization
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const INITIAL_EVENTS = [
    {
        id: 1,
        title: 'Team Meeting',
        description: 'Weekly Team Development Progress',
        date: '2026-01-29',
        category: 'Work',
        priority: 'Medium',
        status: 'Past',
        completed: true
    },
    {
        id: 2,
        title: 'Birthday Party',
        description: 'Ahmed\'s birthday Celebrations',
        date: '2026-03-17',
        category: 'Personal',
        priority: 'High',
        status: 'Upcoming',
        completed: false
    },
    {
        id: 3,
        title: 'Java Development Conference',
        description: 'Tech Meet Up 2026',
        date: '2026-02-28',
        category: 'Work',
        priority: 'Low',
        status: 'Upcoming',
        completed: false
    },
];

function App() {
    // state for events data - Load from Local Storage or use Initial
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('eventora_events');
        return savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
    });

    // Save to Local Storage whenever events change
    useEffect(() => {
        localStorage.setItem('eventora_events', JSON.stringify(events));
    }, [events]);

    // State for UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState(''); // New search state
    const [currentCategoryFilter, setCurrentCategoryFilter] = useState('all'); // New category filter

    // Event Handlers 
    const handleAddEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            status: new Date(eventData.date) >= new Date().setHours(0,0,0,0) ? 'Upcoming' : 'Past'
        };
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const handleEditEvent = (updatedEvent) => {
        setEvents(events.map(event =>
            event.id === updatedEvent.id ? {
                ...updatedEvent,
                status: new Date(updatedEvent.date) >= new Date().setHours(0,0,0,0) ? 'Upcoming' : 'Past'
            } : event
        ));
        setEditingEvent(null);
        setIsModalOpen(false);
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(event => event.id !== id));
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    // Advanced Filtering
    const filteredEvents = events.filter(event => {
        // Search Filter
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             event.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Status Filter
        let matchesStatus = true;
        if (currentFilter === 'Upcoming') matchesStatus = event.status === 'Upcoming';
        else if (currentFilter === 'Past') matchesStatus = event.status === 'Past';
        else if (currentFilter === 'Completed') matchesStatus = event.completed;

        // Category Filter
        const matchesCategory = currentCategoryFilter === 'all' || event.category === currentCategoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Unique categories for the dropdown
    const categoriesList = ['all', ...new Set(events.map(e => e.category))];

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>🔰 Eventora 🔰</h1>
                    <p>Modern Event Management Application</p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.controls}>
                    <div className={styles.actionGroup}>
                        <button
                            className={styles.addButton}
                            onClick={() => {
                                setEditingEvent(null);
                                setIsModalOpen(true);
                            }}
                        >
                            + Add New Event
                        </button>
                        
                        <div className={styles.searchWrapper}>
                            <input 
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <span className={styles.searchIcon}>🔍</span>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <div className={styles.filter}>
                            <label> Status: </label>
                            <select 
                                value={currentFilter}
                                onChange={(e) => setCurrentFilter(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">All Status</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Past">Past</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className={styles.filter}>
                            <label> Category: </label>
                            <select 
                                value={currentCategoryFilter}
                                onChange={(e) => setCurrentCategoryFilter(e.target.value)}
                                className={styles.filterSelect}
                            >
                                {categoriesList.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className={styles.resultsCount}>
                    Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </div>

                <EventList 
                    events={filteredEvents}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteEvent}
                />

                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)}>
                        <EventForm
                            event={editingEvent}
                            onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </Modal>
                )}

                <section className={styles.adminSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Admin Panel</h2>
                        <div className={styles.headerLine}></div>
                    </div>
                    <Suspense fallback={<div className={styles.loading}> Loading Admin Panel... </div>}>
                        <AdminPanel events={events}/>
                    </Suspense>
                </section>
            </main>

            <footer>
                <p>© Eventora 2026 | Built for Excellence</p>
            </footer>
        </div>
    );
}

export default App;