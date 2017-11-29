import Calendar from './calendar';

export const qs = document.querySelector.bind(document);
const qsa = document.querySelectorAll.bind(document);
const popup = qs('.dialog-window');

function showPopup(d, m) {
    popup.style.display = "block";
    qs('.dialog-window__date').innerHTML = `${d} ${m}`;
};

function monthNameFormat(n){
    const monthNames = [ "Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня" ];
    const date = new Date(n);
    return monthNames[date.getMonth()];
};

export function clickHandler() {
    var table = qs("#cal-table");
    table.addEventListener("click", function(e) {
        if (e.target && e.target.nodeName == "TD" && e.target.className == "cal-day" ) {
            const targetDay = e.target.innerHTML;
            const monthIndex = qs('#cal-box').getAttribute("data-month");
            const correctIndex = Number(monthIndex) + 1; 
            const targetMonth =  monthNameFormat(correctIndex.toString());
            showPopup(targetDay, targetMonth);
        }
    })
};

function closePopup() {
    qs('.dialog-window__date').innerHTML = '';
    popup.style.display = 'none';  
};

qs('.dialog-window__close').onclick = closePopup;

export function createCalendar(block, year, month) {
    const container = qs("#" + block);
    const calendar = Calendar(new Date(year, month -1, 1));
    container.innerHTML = '';
    container.appendChild(calendar);
    clickHandler();
};

export default { createCalendar, clickHandler, qs };