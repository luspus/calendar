(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Calendar;

var _createCalendar = require('./createCalendar');

function CalendarTable(aDate, weekdays) {
    this.getLastDayMonth = function () {
        var end = new Date(aDate.getFullYear(), aDate.getMonth() + 1, 0);
        return end.getDate();
    };
    this.getStartWeekday = function () {
        var start = new Date(aDate.getFullYear(), aDate.getMonth(), 1);
        var wd = start.getDay();
        return wd === 0 ? 7 : wd;
    };
    this.getDays = function () {
        var days = [];
        for (var i = 1; i <= this.getLastDayMonth(); i++) {
            days.push(i);
        }return days;
    };
    function emptyTD(td) {
        td.className = 'cal-other-day';
        td.innerHTML = '';
    }
    var today = new Date();

    function fillTD(td, day) {
        td.className = 'cal-day';
        td.innerHTML = day;
        if (aDate.getFullYear() == today.getFullYear() && aDate.getMonth() == today.getMonth() && day == today.getDate()) {
            td.className = 'today';
        }
    }
    this.getTable = function () {
        var table = document.createElement('table');
        table.id = 'cal-table';
        table.className = 'table table-bordered text-center';
        var tr = document.createElement('tr');
        var i = void 0;
        for (i = 0; i < weekdays.length; i++) {
            var th = document.createElement('th');
            th.innerHTML = weekdays[i];
            tr.appendChild(th);
        }
        table.appendChild(tr);
        var firstWeekday = this.getStartWeekday();
        var days = this.getDays();
        var td = void 0;
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
        for (var row = 1; row <= 5; row++) {
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

function Calendar(date) {
    var locale = 'uk';
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
        var day = new Date();
        var weekday = day.getDay();
        var diff = day.getDate() - weekday + (weekday === 0 ? -6 : 1);
        day.setDate(diff);
        return day;
    }
    function getWeekdays() {

        var day = getFirstMonday();
        var days = [];

        function getLocalDay(num, day) {
            var wd = new Date(day);
            wd.setDate(day.getDate() + num);
            return wd.toLocaleDateString(locale, {
                weekday: 'short'
            });
        }
        for (var i = 0; i < 7; i++) {
            days.push(getLocalDay(i, day));
        }
        return days;
    }
    function createButton(html) {
        var btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-sm';
        btn.innerHTML = html;
        return btn;
    }
    var weekdays = getWeekdays();
    function getCalendar() {
        var container = document.createElement('div');
        container.id = 'cal-box';
        container.setAttribute('data-year', date.getFullYear());
        container.setAttribute('data-month', date.getMonth());
        container.setAttribute('data-month-name', getLocalMonth(date));

        var tableNav = document.createElement('table');
        tableNav.id = 'cal-table-nc';
        var trNav = document.createElement('tr');
        trNav.className = 'cal-nav';

        var tdTitle = document.createElement('td');
        var title = document.createElement('h4');
        title.id = 'cal-title';
        title.innerHTML = getLocalYearMonth(date);
        tdTitle.appendChild(title);

        var tdPrev = document.createElement('td');
        var btnPrev = createButton('<<');
        tdPrev.className = 'prev-btn';
        tdPrev.appendChild(btnPrev);

        var tdNext = document.createElement('td');
        var btnNext = createButton('>>');
        tdNext.className = 'next-btn';
        tdNext.appendChild(btnNext);

        trNav.appendChild(tdPrev);
        trNav.appendChild(tdTitle);
        trNav.appendChild(tdNext);
        tableNav.appendChild(trNav);
        container.appendChild(tableNav);

        var c_table = new CalendarTable(date, weekdays);
        container.appendChild(c_table.getTable());
        btnNext.addEventListener('click', getNextCalendar, false);
        btnPrev.addEventListener('click', getPrevCalendar, false);
        return container;
    }
    function switchCalendar(next) {
        var container = (0, _createCalendar.qs)('#cal-box');
        var year = Number(container.getAttribute('data-year'));
        var month = Number(container.getAttribute('data-month')) + (next === true ? 1 : -1);

        var nDate = new Date(year, month, 1);
        container.setAttribute('data-year', nDate.getFullYear());
        container.setAttribute('data-month', nDate.getMonth());
        container.setAttribute('data-month-name', getLocalMonth(nDate));
        var oC = (0, _createCalendar.qs)('#cal-table');
        var c_table = new CalendarTable(nDate, weekdays);
        container.replaceChild(c_table.getTable(), oC);
        var title = (0, _createCalendar.qs)('#cal-title');
        title.innerHTML = getLocalYearMonth(nDate);
        (0, _createCalendar.clickHandler)();
    }
    function getNextCalendar() {
        return switchCalendar(true);
    }
    function getPrevCalendar() {
        return switchCalendar(false);
    }
    return getCalendar();
};

},{"./createCalendar":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.qs = undefined;
exports.clickHandler = clickHandler;
exports.createCalendar = createCalendar;

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qs = exports.qs = document.querySelector.bind(document);
var qsa = document.querySelectorAll.bind(document);
var popup = qs('.dialog-window');

function showPopup(d, m) {
    popup.style.display = "block";
    qs('.dialog-window__date').innerHTML = d + ' ' + m;
};

function monthNameFormat(n) {
    var monthNames = ["Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"];
    var date = new Date(n);
    return monthNames[date.getMonth()];
};

function clickHandler() {
    var table = qs("#cal-table");
    table.addEventListener("click", function (e) {
        if (e.target && e.target.nodeName == "TD" && e.target.className == "cal-day") {
            var targetDay = e.target.innerHTML;
            var monthIndex = qs('#cal-box').getAttribute("data-month");
            var correctIndex = Number(monthIndex) + 1;
            var targetMonth = monthNameFormat(correctIndex.toString());
            showPopup(targetDay, targetMonth);
        }
    });
};

function closePopup() {
    qs('.dialog-window__date').innerHTML = '';
    popup.style.display = 'none';
};

qs('.dialog-window__close').onclick = closePopup;

function createCalendar(block, year, month) {
    var container = qs("#" + block);
    var calendar = (0, _calendar2.default)(new Date(year, month - 1, 1));
    container.innerHTML = '';
    container.appendChild(calendar);
    clickHandler();
};

exports.default = { createCalendar: createCalendar, clickHandler: clickHandler, qs: qs };

},{"./calendar":1}],3:[function(require,module,exports){
'use strict';

var _createCalendar = require('./createCalendar');

(0, _createCalendar.createCalendar)('cal', 2016, 3);

},{"./createCalendar":2}]},{},[3]);
