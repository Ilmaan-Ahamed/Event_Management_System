import React, { useState, useEffect } from "react";
import styles from '../styles/EventForm.module.css';

const EventForm = ({ event, onSubmit, onCancel }) => { // Fixed component name
    // Initialize form state
    const [formData, setFormData] = useState({ // Fixed: useState instead of useEffect
        title: '',
        description: '',
        date: '',
        category: 'Personal',
        priority: 'Medium',
        completed: false,
    });

    // Populate form if editing existing event
    useEffect(() => {
        if (event) {
            setFormData({
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
    const handleInputChange = (e) => { // Fixed function name
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission 
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title.trim() || !formData.date) {
            alert('Please Fill in all Required fields'); // Fixed spelling
            return;
        }
        
        // Ensure the data includes the id if editing
        const submitData = event ? { ...formData, id: event.id } : formData;
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}> {/* Fixed: onSubmit */}
            <h2>{event ? 'Edit Event' : 'Add New Event'}</h2>

            {/* Text input */}
            <div className={styles.formGroup}>
                <label htmlFor="title">Event Title *</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value={formData.title}
                    onChange={handleInputChange} {/* Fixed function name */}
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
                    onChange={handleInputChange} {/* Fixed function name */}
                    placeholder="Enter event description"
                    rows="4"    
                />
            </div>

            {/* Date input */}
            <div className={styles.formGroup}>
                <label htmlFor="date">Date *</label>
                <input 
                    type="date" {/* Fixed: changed from "text" to "date" */}
                    id="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange} {/* Fixed function name */}
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
                                onChange={handleInputChange} {/* Fixed function name */}
                            />
                            <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span> {/* Fixed: added () */}
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
                    onChange={handleInputChange} {/* Fixed function name */}
                    className={styles.select}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option> 
                    <option value="High">High</option>   
                </select>
            </div>

            {/* CheckBox */}
            <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}> {/* Fixed class name */}
                    <input 
                        type="checkbox" 
                        name="completed"
                        checked={formData.completed}
                        onChange={handleInputChange} {/* Fixed function name */}
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

export default EventForm; // Fixed export name