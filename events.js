// js/events.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUpcomingEvents();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').min = today;
    
    document.getElementById('addEventForm').addEventListener('submit', addEvent);
});

async function loadUpcomingEvents() {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true });
            
        if (error) throw error;
        
        displayEvents(events, 'upcoming');
        
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Error loading events: ' + error.message);
    }
}

async function loadPastEvents() {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .lt('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: false });
            
        if (error) throw error;
        
        displayEvents(events, 'past');
        
    } catch (error) {
        console.error('Error loading past events:', error);
        alert('Error loading past events: ' + error.message);
    }
}

function displayEvents(events, type) {
    const tbody = document.getElementById('eventsTable');
    const countElement = document.getElementById('eventsCount');
    
    countElement.textContent = events.length;
    
    if (events.length === 0) {
        const message = type === 'upcoming' ? 
            'Hakuna matukio yajayo kwa sasa' : 
            'Hakuna matukio yaliyopita';
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">${message}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = events.map(event => {
        const eventDate = new Date(event.event_date);
        const now = new Date();
        const isToday = eventDate.toDateString() === now.toDateString();
        
        return `
            <tr>
                <td>
                    <strong>${event.event_name}</strong>
                    ${isToday ? '<span style="color: #e74c3c; margin-left: 5px;">(LEO)</span>' : ''}
                </td>
                <td>${formatDate(event.event_date)}</td>
                <td>${event.event_time || '-'}</td>
                <td>${event.location}</td>
                <td>
                    <span class="event-type" style="
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 0.8rem;
                        background: ${getEventTypeColor(event.event_type)};
                        color: white;
                    ">${getEventTypeName(event.event_type)}</span>
                </td>
                <td>${getTargetAudienceName(event.target_audience)}</td>
                <td>
                    <button onclick="viewEvent('${event.id}')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">👁️ Angalia</button>
                    <button onclick="deleteEvent('${event.id}')" class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;">🗑️ Futa</button>
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sw-TZ', options);
}

function getEventTypeColor(type) {
    const colors = {
        'ibada': '#e74c3c',
        'mkutano': '#3498db',
        'kifamilia': '#9b59b6',
        'shughuli': '#27ae60',
        'misaada': '#e67e22'
    };
    return colors[type] || '#95a5a6';
}

function getEventTypeName(type) {
    const names = {
        'ibada': 'Ibada',
        'mkutano': 'Mkutano',
        'kifamilia': 'Kifamilia',
        'shughuli': 'Shughuli',
        'misaada': 'Misaada'
    };
    return names[type] || type;
}

function getTargetAudienceName(audience) {
    const names = {
        'wote': 'Wote',
        'wakaka': 'Wakaka',
        'wadada': 'Wadada'
    };
    return names[audience] || audience;
}

async function addEvent(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('casfeta_user'));
    
    const eventData = {
        event_name: document.getElementById('eventName').value,
        event_type: document.getElementById('eventType').value,
        event_date: document.getElementById('eventDate').value,
        event_time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        target_audience: document.getElementById('targetAudience').value,
        description: document.getElementById('eventDescription').value
    };
    
    try {
        const { data, error } = await supabase
            .from('events')
            .insert([eventData]);
            
        if (error) throw error;
        
        alert('✅ Tukio limeundwa kikamilifu!');
        document.getElementById('addEventForm').reset();
        loadUpcomingEvents();
        
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event: ' + error.message);
    }
}

function showPastEvents() {
    loadPastEvents();
    document.querySelector('h3').textContent = 'Matukio Yaliyopita';
}

function showUpcomingEvents() {
    loadUpcomingEvents();
    document.querySelector('h3').textContent = 'Matukio Yajayo';
}

async function deleteEvent(eventId) {
    if (!confirm('Je, una uhakika unataka kufuta tukio hili?')) return;
    
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);
            
        if (error) throw error;
        
        alert('✅ Tukio limefutwa kikamilifu!');
        loadUpcomingEvents();
        
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event: ' + error.message);
    }
}

function viewEvent(eventId) {
    alert('👁️ Angalia utafutwa baadaye... Tukio ID: ' + eventId);
}
