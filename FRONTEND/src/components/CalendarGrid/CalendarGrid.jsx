import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isSameMonth,
  parseISO,
  startOfToday
} from 'date-fns';
import './calendarGrid.css';

const CalendarGrid = ({ bookedDates = [], selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Check if date is in the past
  const isPastDate = (date) => {
    const today = startOfToday();
    return isBefore(date, today);
  };

  // Check if date is booked
  const isBookedDate = (date) => {
    return bookedDates.some(bookedDate => 
      isSameDay(parseISO(bookedDate), date)
    );
  };

  // Check if date is selected
  const isSelectedDate = (date) => {
    return selectedDate && isSameDay(selectedDate, date);
  };

  // Get date status for styling
  const getDateStatus = (date) => {
    if (isPastDate(date)) return 'past';
    if (isBookedDate(date)) return 'booked';
    if (isSelectedDate(date)) return 'selected';
    return 'available';
  };

  // Handle date click
  const handleDateClick = (date) => {
    // Only allow selection of available dates
    if (!isPastDate(date) && !isBookedDate(date)) {
      onDateSelect(date);
    }
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="calendar-grid-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button 
          type="button"
          onClick={goToPreviousMonth}
          className="calendar-nav-btn"
        >
          ←
        </button>
        
        <div className="calendar-month-year">
          <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
          <button 
            type="button"
            onClick={goToToday}
            className="today-btn"
          >
            Today
          </button>
        </div>
        
        <button 
          type="button"
          onClick={goToNextMonth}
          className="calendar-nav-btn"
        >
          →
        </button>
      </div>

      {/* Calendar Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot booked"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot past"></span>
          <span>Past</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot selected"></span>
          <span>Selected</span>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-days-grid">
        {days.map(date => {
          const status = getDateStatus(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const dayNumber = format(date, 'd');
          
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`calendar-day ${status} ${!isCurrentMonth ? 'other-month' : ''}`}
              onClick={() => handleDateClick(date)}
              disabled={status === 'past' || status === 'booked'}
              title={
                status === 'past' ? 'Past date' :
                status === 'booked' ? 'Already booked' :
                status === 'selected' ? 'Selected date' :
                'Available for booking'
              }
            >
              <span className="day-number">{dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="selected-date-display">
          <strong>Selected Date:</strong> {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;