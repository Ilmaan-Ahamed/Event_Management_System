import React, { useState, useEffect, lazy, Suspense } from "react";
import EventList from './components/EventList';
import EventForm from './components/EventForm'; 
import Modal from './components/Modal';
import AuthPage from './components/AuthPage';
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
    const [sortBy, setSortBy] = useState('date');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilters, setCategoryFilters] = useState(() => {
        const saved = localStorage.getItem('eventora_category_filters');
        return saved ? JSON.parse(saved) : ['all'];
    });
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [theme, setTheme] = useState(() => localStorage.getItem('eventora_theme') || 'light');
    const [authMode, setAuthMode] = useState('login');
    const [authError, setAuthError] = useState('');
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('eventora_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('eventora_users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    // Event Handlers 
    const handleAddEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            recurrence: eventData.recurrence || 'None',
            status: new Date(eventData.date) >= new Date().setHours(0,0,0,0) ? 'Upcoming' : 'Past'
        };
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const handleEditEvent = (updatedEvent) => {
        setEvents(events.map(event =>
            event.id === updatedEvent.id ? {
                ...updatedEvent,
                recurrence: updatedEvent.recurrence || 'None',
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

    const toggleCategoryFilter = (category) => {
        if (category === 'all') {
            setCategoryFilters(['all']);
            return;
        }

        setCategoryFilters(prev => {
            const selected = prev.includes('all') ? [] : [...prev];
            if (selected.includes(category)) {
                const nextFilters = selected.filter(item => item !== category);
                return nextFilters.length ? nextFilters : ['all'];
            }
            return [...selected, category];
        });
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleLogin = ({ email, password }) => {
        const matchedUser = users.find(
            (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password
        );

        if (!matchedUser) {
            setAuthError('Invalid email or password. Please try again.');
            return;
        }

        setUser({ name: matchedUser.name, email: matchedUser.email });
        setAuthError('');
    };

    const handleSignUp = ({ name, email, password, confirmPassword }) => {
        if (!name || !email || !password || !confirmPassword) {
            setAuthError('Please fill in all required fields.');
            return;
        }
        if (password !== confirmPassword) {
            setAuthError('Passwords do not match.');
            return;
        }
        if (users.some((account) => account.email.toLowerCase() === email.toLowerCase())) {
            setAuthError('An account already exists with that email.');
            return;
        }

        const newAccount = { name, email, password };
        setUsers((prevUsers) => [...prevUsers, newAccount]);
        setUser({ name, email });
        setAuthError('');
    };

    const handleLogout = () => {
        setUser(null);
        setAuthMode('login');
        setAuthError('');
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
        const matchesCategory = categoryFilters.includes('all') || categoryFilters.includes(event.category);

        // Priority Filter
        const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;

        // Date range filter
        const eventDate = new Date(event.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        const matchesRange = (!from || eventDate >= from) && (!to || eventDate <= to);

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesRange;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'priority') {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.date) - new Date(b.date);
    });

    // Unique categories for the dropdown
    const categoriesList = ['all', ...new Set(events.map(e => e.category))];

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('eventora_theme', theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('eventora_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('eventora_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('eventora_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('eventora_category_filters', JSON.stringify(categoryFilters));
    }, [categoryFilters]);

    return (
        <div className={styles.App}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1>🔰 Eventora 🔰</h1>
                        <p>Modern Event Management Application</p>
                    </div>
                    <button
                        className={styles.themeToggle}
                        onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
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
                            <label htmlFor="statusFilter">Status:</label>
                            <select
                                id="statusFilter"
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
                            <label htmlFor="sortBy">Sort by:</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="date">Date</option>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </select>
                        </div>

                        <div className={styles.filter}>
                            <label htmlFor="priorityFilter">Priority:</label>
                            <select
                                id="priorityFilter"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <div className={styles.filter}>
                            <label htmlFor="fromDate">From:</label>
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className={styles.filterSelect}
                            />
                        </div>
                        <div className={styles.filter}>
                            <label htmlFor="toDate">To:</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className={styles.filterSelect}
                            />
                        </div>
                    </div>

                    <div className={styles.categoryFilterGroup} aria-label="Category filters">
                        <span className={styles.filterLabel}>Categories:</span>
                        {categoriesList.map(category => (
                            <button
                                key={category}
                                type="button"
                                className={`${styles.categoryChip} ${categoryFilters.includes('all') || categoryFilters.includes(category) ? styles.categoryChipActive : ''}`}
                                onClick={() => toggleCategoryFilter(category)}
                            >
                                {category === 'all' ? 'All' : category}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className={styles.resultsCount}>
                    Showing {sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'}
                </div>

                <EventList 
                    events={sortedEvents}
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