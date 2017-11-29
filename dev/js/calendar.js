import { clickHandler } from './createCalendar';
import { qs } from './createCalendar';


function CalendarTable (aDate, weekdays) { 
    this.getLastDayMonth = () => {
        const end = new Date(aDate.getFullYear(), aDate.getMonth() + 1, 0);
        return end.getDate();
    };
    this.getStartWeekday = () => {
        const start = new Date(aDate.getFullYear(), aDate.getMonth(), 1);
        const wd = start.getDay();
        return (wd === 0) ? 7 : wd;
    };
    this.getDays = function () {
        const days = [];
        for (let i = 1; i <= this.getLastDayMonth(); i++) days.push(i);
        return days;
    };
    function emptyTD(td) {
        td.className = 'cal-other-day';
        td.innerHTML = '';
    }
    const today = new Date();

    function fillTD(td, day) {
        td.className = 'cal-day';
        td.innerHTML = day;
        if (aDate.getFullYear() == today.getFullYear() && aDate.getMonth() == today.getMonth() && day == today.getDate()) {
            td.className = 'today';
        }
    }
    this.getTable = function () {
        const table = document.createElement('table');
        table.id = 'cal-table';
        table.className = 'table table-bordered text-center';
        let tr = document.createElement('tr');
        let i;
        for (i = 0; i < weekdays.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = weekdays[i];
            tr.appendChild(th);
        }
        table.appendChild(tr);
        const firstWeekday = this.getStartWeekday();
        const days = this.getDays();
        let td;
        tr = document.createElement('tr');
        for (i = 1; i <= 7; i++) {
            td = document.createElement('td');
            if (i < firstWeekday) {
                emptyTD(td);
            } else {
                fillTD(td, days.shift());
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
        for (let row = 1; row <= 5; row++) {
            tr = document.createElement('tr');
            for (i = 0; i < 7; i++) {
                td = document.createElement('td');
                if (days.length > 0) {
                    fillTD(td, days.shift());
                } else {
                    emptyTD(td);
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    };
};

export default function Calendar (date) {
    const locale = 'uk';
    function getLocalYearMonth(d) {
        return d.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long'
        });
    }
    function getLocalMonth(d) {
        return d.toLocaleDateString(locale, {
            month: 'long'
        });
    }
    function getFirstMonday() {
        const day = new Date();
        const weekday = day.getDay();
        const diff = day.getDate() - weekday + (weekday === 0 ? -6 : 1);
        day.setDate(diff);
        return day;
    }
    function getWeekdays() {

        const day = getFirstMonday();
        const days = [];

        function getLocalDay(num, day) {
            const wd = new Date(day);
            wd.setDate(day.getDate() + num);
            return wd.toLocaleDateString(locale, {
                weekday: 'short'
            });
        }
        for (let i = 0; i < 7; i++) {
            days.push(getLocalDay(i, day));
        }
        return days;
    }
    function createButton(html) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-sm';
        btn.innerHTML = html;
        return btn;
    }
    const weekdays = getWeekdays();
    function getCalendar() {
        const container = document.createElement('div');
        container.id = 'cal-box';
        container.setAttribute('data-year', date.getFullYear());
        container.setAttribute('data-month', date.getMonth());
        container.setAttribute('data-month-name', getLocalMonth(date));

        const tableNav = document.createElement('table');
        tableNav.id = 'cal-table-nc';
        const trNav = document.createElement('tr');
        trNav.className = 'cal-nav';

        const tdTitle = document.createElement('td');
        const title = document.createElement('h4');
        title.id = 'cal-title';
        title.innerHTML = getLocalYearMonth(date);
        tdTitle.appendChild(title);

        const tdPrev = document.createElement('td');
        const btnPrev = createButton('<<');
        tdPrev.className = 'prev-btn';
        tdPrev.appendChild(btnPrev);

        const tdNext = document.createElement('td');
        const btnNext = createButton('>>');
        tdNext.className = 'next-btn';
        tdNext.appendChild(btnNext);

        trNav.appendChild(tdPrev);
        trNav.appendChild(tdTitle);
        trNav.appendChild(tdNext);
        tableNav.appendChild(trNav);
        container.appendChild(tableNav);

        const c_table = new CalendarTable(date, weekdays);
        container.appendChild(c_table.getTable());
        btnNext.addEventListener('click', getNextCalendar, false);
        btnPrev.addEventListener('click', getPrevCalendar, false);
        return container;
    }
    function switchCalendar(next) {
        const container = qs('#cal-box');
        const year = Number(container.getAttribute('data-year'));
        const month = Number(container.getAttribute('data-month')) + (next === true ? 1 : -1);

        const nDate = new Date(year, month, 1);
        container.setAttribute('data-year', nDate.getFullYear());
        container.setAttribute('data-month', nDate.getMonth());
        container.setAttribute('data-month-name', getLocalMonth(nDate));
        const oC = qs('#cal-table');
        const c_table = new CalendarTable(nDate, weekdays);
        container.replaceChild(c_table.getTable(), oC);
        const title = qs('#cal-title');
        title.innerHTML = getLocalYearMonth(nDate);
        clickHandler();
    }
    function getNextCalendar() {
        return switchCalendar(true);
    }
    function getPrevCalendar() {
        return switchCalendar(false);
    }
    return getCalendar();
};
