const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const meetingPopup = document.getElementById('meetingPopup');
const closePopup = document.getElementById('closePopup');
const meetingDetails = document.getElementById('meetingDetails');

// Example meeting data
const meetings = {
    '2024-11-20': 'Discuss "To Kill a Mockingbird"',
    '2024-12-15': 'Discuss "Pride and Prejudice"',
    '2025-01-10': 'Discuss "1984"'
};

let currentDate = new Date();

function renderCalendar(date) {
    calendarDays.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('day');
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (meetings[dateString]) {
            cell.classList.add('highlight');
            cell.addEventListener('click', () => showMeetingPopup(meetings[dateString]));
        }

        cell.textContent = day;
        calendarDays.appendChild(cell);
    }
}

function showMeetingPopup(details) {
    meetingDetails.textContent = details;
    meetingPopup.style.display = 'flex';
}

closePopup.addEventListener('click', () => {
    meetingPopup.style.display = 'none';
});

prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Initialize calendar
renderCalendar(currentDate);
