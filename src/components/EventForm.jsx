import React, {useState, useEffect} from "react";
import styles from '../styles/EventFrom.moudle.css';

const EventFrom = ({ event, onsubmit, oncancel}) => {
    // Initalize form state
    const [formData, setFormDate] = useEffect({
        title : '',
        description : '',
        date : '',
        category : 'personal',
        priority : 'medium',
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
        onsubmit(formData);
    };
}