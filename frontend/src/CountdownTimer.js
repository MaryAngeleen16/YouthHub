import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CountdownTimer.css';
const CountdownTimer = () => {
  const [events, setEvents] = useState([]);
  const [earliestEvent, setEarliestEvent] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:4001/api/events');
          setEvents(response.data.events); // Corrected to extract the events array
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
      
    fetchEvents();
  }, []);
  

  useEffect(() => {
    if (events.length > 0) {
      // Find the event with the latest start time
      const latestEvent = events.reduce((prev, current) => {
        const prevTime = new Date(prev.schedule || prev.timeStarts);
        const currentTime = new Date(current.schedule || current.timeStarts);
        return prevTime > currentTime ? prev : current;
      });
  
      setEarliestEvent(latestEvent);
    }
  }, [events]);
  
  useEffect(() => {
    if (earliestEvent) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const eventTime = new Date(earliestEvent.schedule || earliestEvent.timeStarts);
        const timeDiff = eventTime.getTime() - now.getTime();
        setTimeRemaining(Math.max(0, timeDiff));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [earliestEvent]);
  const formatTime = (time) => {
    const pad = (num) => {
      return num < 10 ? '0' + num : num;
    };
  
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
  
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };
  

  useEffect(() => {
    console.log("Events:", events);
  }, [events]);
  
  useEffect(() => {
    console.log("Earliest Event:", earliestEvent);
  }, [earliestEvent]);
  
  useEffect(() => {
    console.log("Time Remaining:", timeRemaining);
  }, [timeRemaining]);


  return (
    <div>
      {earliestEvent && (
        <div>
          <h2>Countdown Timer for Recent Event</h2>
          <p>Event Name: {earliestEvent.title}</p>
          <p>Date: {new Date(earliestEvent.schedule || earliestEvent.timeStarts).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
                })}</p>
          <p className='text-countdown'>{formatTime(timeRemaining)}</p>
        </div>
      )}
    </div>
  );

      };
  
export default CountdownTimer;
