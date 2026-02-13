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
}