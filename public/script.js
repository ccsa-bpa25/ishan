/*const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
)*/

let currentDate = new Date();
let events = [];
let selectedEventIndex = -1;  // To keep track of the event being updated or deleted

function renderCalendar() {
    console.log('inside render calendar');
    const monthYear = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendar-body');
    
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const syear = year.toString();
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let dayOfWeek = firstDay.getDay();
    
     //const emonthYear = document.getElementById('monthYear');
   // const ecalendarBody = document.getElementById('calendar-body');
    
    //const emonth = currentDate.getMonth();
    //const eyear = currentDate.getFullYear();
    
    //const efirstDayT = new Date(eyear, emonth, 1);
    const isoString1 = firstDay.toISOString(); // Converts to ISO string
    const efirstDay = isoString1.split('T')[0];
   
    
    //const elastDayT = new Date(eyear, emonth + 1, 0);
    const isoString2 = lastDay.toISOString(); // Converts to ISO string
    const elastDay = isoString2.split('T')[0];
    
    //const daysInMonth = lastDay.getDate();
    
    const calData = {
        
        efirstday: efirstDay,
        elastday: elastDay 
      };

    fetch('/api/getevents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify(calData)
      })
    .then(response => response.json())
      .then(data => {
        if (data.message) {
         // document.getElementById('message').innerHTML = `<p style="color: green;">${data.message}</p>`;
       console.log(data.message);
             events = data.message.map(item => {
    return {
        title: item.name, // Rename 'name' to 'fullName'
        date: item.eventdate,      // Rename 'age' to 'years'
        details: item.description
    };
});
            console.log(events);
/*for (const key in data.message()) {
    events.push({ key: key, value: data.message()[key] });
}*/
            //events=data.message;
//console.log(events);
        } else {
          document.getElementById('message').innerHTML = `<p style="color: red;">${data.error}</p>`;
        }
    
    let calendarHTML = '';
        //const date1 = new Date();
    
        let smonth = (currentDate.getMonth() + 1).toString(); 
        //let smonth=month.toString();
    smonth = smonth.padStart(2, '0');
        
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            const dayNumber = i * 7 + j - dayOfWeek + 1;
            
            if (dayNumber > 0 && dayNumber <= daysInMonth) {
                let sdayNumber=dayNumber.toString();
                sdayNumber = sdayNumber.padStart(2, '0');
                console.log(sdayNumber);
                console.log(events.some(event => new Date(event.date).getDate()=== dayNumber));
                
                //const hasEvent = events.some(event => new Date(event.date).getDate() === dayNumber);
                const exactDate = syear+"-"+smonth+"-"+sdayNumber;
                console.log(exactDate);
                const hasEvent = events.some(event => {
    const eventDate = new Date(event.date).toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
    return eventDate === exactDate;
});
                
                
                const eventClass = hasEvent ? 'event-day' : '';
                //console.log('event-day');
                calendarHTML += `<td class="${eventClass}" onclick="openEventModal(${dayNumber})">${dayNumber}</td>`;
            } else {
                calendarHTML += '<td></td>';
            }
        }
        calendarHTML += '</tr>';
    }
    
    calendarBody.innerHTML = calendarHTML;
        })
}

function openEventModal(day) {
    alert("inside open event modal");
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
        const eventdate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
        
        if (selectedEventIndex === -1) {
            // Add new event
            events.push({ date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`, title, details });
            const signupData = {
        username: title,
        password: details,
        eventdate: eventdate 
      };
    

            fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      })
                
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          document.getElementById('message').innerHTML = `<p style="color: green;">${data.message}</p>`;
        } else {
          document.getElementById('message').innerHTML = `<p style="color: red;">${data.error}</p>`;
        }
      })
      .catch(error => {
        document.getElementById('message').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      });
            
      
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
    alert("inside update calendar");
    const title = document.getElementById('eventTitle').value;
    const details = document.getElementById('eventDetails').value;

    // Update the event
    events[selectedEventIndex] = { date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${new Date(events[selectedEventIndex].date).getDate()}`, title, details };

    renderCalendar();
    closeModal();
}

function deleteEvent() {
    alert("inside delete calendar");
    // Delete the event
    events.splice(selectedEventIndex, 1);
    
    renderCalendar();
    closeModal();
}

function previousMonth() {
    events=[];    
    alert("inside previous calendar");
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
      //console.log("inside next month.");
   
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    
}

// Initial render
renderCalendar();

