import React, {useState, useEffect} from "react";
import styles from '../styles/EventForm.module.css';

const EventFrom = ({ event, onSubmit, onCancel}) => {
    // Initalize form state
    const [formData, setFormDate] = useEffect({
        title : '',
        description : '',
        date : '',
        category : 'Personal',
        priority : 'Medium',
        completed : false,
    });

    // Populate form if editing existing event
    useEffect(() =>{
        if(event){
            setFormDate({
                title: event.title,
                description: event.description,
                date: event.date,
                category: event.category,
                priority: event.priority,
                completed: event.completed || false,
                        });
                }
    }, [event]);

    // Handle input changes for all fields
    const handleinputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormDate(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission 
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title.trim() || !formData.date){
            alert('Please Fill in all Requried fields')
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onsubmit={handleSubmit} className={styles.form}>
            <h2>{event ? 'Edit Event' : 'Add New Event'}</h2>

            {/* Text input */}
            <div className={styles.formGroup}>
                <label htmlFor="title">Event Title *</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        value={formData.title}
                        onChange={handleinputChange}
                        placeholder="Enter Event title"
                        required
                    />
            </div>

            {/* Text Area */}
            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                    <textarea 
                        name="description" 
                        id="description"
                        value={formData.description}
                        onChange={handleinputChange}
                        placeholder="Enter event description"
                        rows="4"    
                    />
            </div>

            {/* Date input */}
            <div className={styles.formGroup}>
                <label htmlFor="date">Date *</label>
                    <input 
                        type="text"
                        id="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleinputChange}
                        required
                    />
            </div>

            {/* Radio Buttons for Category */}
            <div className={styles.formGroup}>
                <label>Category</label>
                    <div className={styles.radioGroup}>
                        {['Personal', 'Work', 'Social', 'Education'].map(category => (
                            <label key={category} className={styles.radioLabel}>  
                                <input 
                                    type="radio" 
                                    name="category"
                                    value={category}
                                    checked={formData.category === category}
                                    onChange={handleinputChange}
                                />
                                <span>{category.charAt(0).toUpperCase + category.slice(1)}</span>
                            </label>
                        ))}
                    </div>
            </div>

            {/* Select DropDown for Priority */}
            <div className={styles.formGroup}>
                <label htmlFor="priority">Priority</label>
                    <select 
                        name="priority" 
                        id="priority"
                        value={formData.priority}
                        onChange={handleinputChange}
                        className={styles.select}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option> 
                        <option value="High">High</option>   
                    </select>
            </div>

            {/* CheckBox */}
            <div className={styles.formGroup}>
                <label className={styles.checkboxLable}>
                    <input 
                        type="checkbox" 
                        name="completed"
                        checked={formData.completed}
                        onChange={handleinputChange}
                    />
                    <span>Mark as completed </span>
                </label>
            </div>

            {/* Form Buttons */}
            <div className={styles.formButtons}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelButton}    
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={styles.submitButton}
                >
                    {event ? 'Update Event' : 'Add Event'}
                </button>
            </div>
        </form>
    );
};

export default EventFrom;