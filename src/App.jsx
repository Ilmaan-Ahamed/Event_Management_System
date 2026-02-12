import React,{useState, lazy, Suspense} from "react";
import EventList from './components/EventList';
import EventFrom from './components/EventForm';
import Modal     from './components/Modal';
import styles    from './styles/App.module.css';

// Lazy load Admin Panel For performance optimization
const AdminPanel = lazy(() => import('./components/AdminPanel'));

function App() {
    // state for events data
    const [events, setEvents] = useState([
        {
            id          :  1,
            title       : 'Team Meeting',
            description : 'Wekly Team Development Progress',
            date        : '2026-01-29',
            category    : 'Work',
            priotity    : 'Medium',
            status      : 'Past',
            completed   : true
        },
        {
            id          :  2,
            title       : 'BithDay Party',
            description : 'Ahamed\s bithday Celebrations',
            date        : '2026-03-17',
            category    : 'Personal',
            priotity    : 'High',
            status      : 'Up-comming',
            completed   : false
        },
        {
            id          :  3,
            title       : 'Java Devolpment Conference',
            description : 'Tech Meet Up 2026',
            date        : '2026-02-28',
            category    : 'Work',
            priotity    : 'Low',
            status      : 'Up-comming',
            completed   : false
        },
    ]);

    // State for from modal
    const [isModalOpen, setIsModalOpen]  = useState(false);
    const [editingEvent,setEditingEvent] = useState(null);
    const [currentFilter, setCurrentFiller] = useState('all');

    // Event Handlers 
        // Add event
    const handleAddEvent =(eventData) =>{
        const newEvent ={
            ...eventData,
            id: Date.now(), // Simple ID Generation Using terney operators
            status: new Date(eventData.date) >= new Date() ? 
                                                'Up-Comming' : 'Past' 
        };
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

        // Edit event 
    const handleEditEvent = (updatedEvent) =>{
        setEvents(events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        ));
        setEditingEvent(null);
        setIsModalOpen(false);
    };

        // Delete event 
    const handleDeleteEvent= (id) =>{
        if (window,confirm('Are you sure you want to delete this event?'))
        {
            setEvents(event.filter(event => event.id !==id));
        }
    };

        // Click event
    const handleEditClick = (event) =>{
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    // Filter events based on selection
    const filteredEvents = events.filter(event => {
        if (currentFilter === 'all') 
            return true;

        if (currentFilter === 'Up-Comming')

            return event.status === 'Up-Comming';

        if (currentFilter === 'Past')
            return event.status === 'Past';

        if (currentFilter === 'Completed')
            return event.completed;

        return true;
    });


    // HTML work into the React Component
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
                            onChange={(e) => setCurrentFiller(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Events</option>
                            <option value="Up-Comming">Up-Coming</option>
                            <option value="Past">Past</option>
                            <option value="completed">Completed</option>
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
                        <Eventfrorm
                            event={editingEvent}
                            onSubmit={editingEvent ? handleEditClick : handleAddEvent}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </Modal>
                )}

                {/* Suspences for lazy loading */}
                <section>
                    <h2>Admin Panel</h2>
                    <Suspense fallback={<div className={styles.loading}> Loading Admin Panel... </div>}>
                        <AdminPanel events={events}/>
                    </Suspense>
                </section>
            </main>









        </div>
    )
}

export default App;