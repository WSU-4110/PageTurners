document.addEventListener("DOMContentLoaded", () => {
    const calendarDays = document.getElementById("calendarDays");
    const monthYear = document.getElementById("monthYear");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");
    const meetingPopup = document.getElementById("meetingPopup");
    const closePopup = document.getElementById("closePopup");

    let currentDate = new Date();
    let meetings = JSON.parse(localStorage.getItem("meetings")) || {};

    
    function renderCalendar() {
        calendarDays.innerHTML = "";
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

        
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptySlot = document.createElement("div");
            emptySlot.classList.add("day", "empty");
            calendarDays.appendChild(emptySlot);
        }

        // Create slots for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const daySlot = document.createElement("div");
            daySlot.classList.add("day");
            
            const meetingKey = `${year}-${month}-${day}`;
            daySlot.innerHTML = `
                <span class="date-number">${day}</span>
                <div class="meeting-details">${meetings[meetingKey] || ""}</div>
            `;

            if (meetings[meetingKey]) {
                daySlot.classList.add("has-meeting");
            }

            daySlot.addEventListener("click", () => editMeeting(meetingKey));
            calendarDays.appendChild(daySlot);
        }
    }

    
    function editMeeting(dateKey) {
        const existingDetails = meetings[dateKey] || "";
        const newDetails = prompt("Enter meeting details:", existingDetails);

        if (newDetails !== null) {
            if (newDetails.trim() === "") {
                delete meetings[dateKey];
            } else {
                meetings[dateKey] = newDetails.trim();
            }

            localStorage.setItem("meetings", JSON.stringify(meetings));
            renderCalendar();
        }
    }

    prevMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    
    nextMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    
    renderCalendar();
});
