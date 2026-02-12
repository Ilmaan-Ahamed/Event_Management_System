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
                                                'Up-Comming' : 'past' 
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

        if (currentFilter === 'completed')
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

        











        </div>
    )
}

export default App;