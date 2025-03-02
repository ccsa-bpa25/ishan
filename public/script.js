let currentDate = new Date();
let events = [];
let selectedEventIndex = -1;  // To keep track of the event being updated or deleted

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendar-body');
    
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let dayOfWeek = firstDay.getDay();
    let calendarHTML = '';
    
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            const dayNumber = i * 7 + j - dayOfWeek + 1;
            
            if (dayNumber > 0 && dayNumber <= daysInMonth) {
                const hasEvent = events.some(event => new Date(event.date).getDate() === dayNumber);
                const eventClass = hasEvent ? 'event-day' : '';
                
                calendarHTML += `<td class="${eventClass}" onclick="openEventModal(${dayNumber})">${dayNumber}</td>`;
            } else {
                calendarHTML += '<td></td>';
            }
        }
        calendarHTML += '</tr>';
    }
    
    calendarBody.innerHTML = calendarHTML;
}

function openEventModal(day) {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'flex';
    
    // Find the event for the clicked day, if any
    const event = events.find(event => new Date(event.date).getDate() === day);

    // If an event exists, show the Update/Delete buttons, otherwise show the Add form
    if (event) {
        document.getElementById('modalTitle').textContent = "Update Event";
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDetails').value = event.details;
        selectedEventIndex = events.indexOf(event);
        
        // Show Update and Delete buttons
        document.getElementById('updateDeleteButtons').style.display = 'block';
    } else {
        document.getElementById('modalTitle').textContent = "Add Event";
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDetails').value = '';
        selectedEventIndex = -1;
        
        // Hide Update and Delete buttons
        document.getElementById('updateDeleteButtons').style.display = 'none';
    }

    // Handle form submission for adding or updating events
    document.getElementById('eventForm').onsubmit = function (e) {
        e.preventDefault();
        
        const title = document.getElementById('eventTitle').value;
        const details = document.getElementById('eventDetails').value;
        
        if (selectedEventIndex === -1) {
            // Add new event
            events.push({ date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`, title, details });
        } else {
            // Update existing event
            events[selectedEventIndex] = { date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`, title, details };
        }
        
        renderCalendar();
        closeModal();
    };
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDetails').value = '';
    document.getElementById('updateDeleteButtons').style.display = 'none';
}

function updateEvent() {
    const title = document.getElementById('eventTitle').value;
    const details = document.getElementById('eventDetails').value;

    // Update the event
    events[selectedEventIndex] = { date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${new Date(events[selectedEventIndex].date).getDate()}`, title, details };

    renderCalendar();
    closeModal();
}

function deleteEvent() {
    // Delete the event
    events.splice(selectedEventIndex, 1);
    
    renderCalendar();
    closeModal();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Initial render
renderCalendar();
