ocument.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            { title: 'Monthly Book Club Meeting', start: '2023-11-10' },
            { title: 'Next Book Review', start: '2023-11-20' }
        ]
    });
    calendar.render();
});