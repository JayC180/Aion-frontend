import { useEffect } from "react";
import { useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { addHours } from "date-fns";

import CalendarModal from "./CalendarModal";
import useUiStore from "../hooks/useUiStore";
import useCalendarStore from "../hooks/useCalendarStore";
import useAuthStore from "../hooks/useAuthStore";

import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
    "en-US": enUS,
};

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export const CalendarPage = () => {
    const { startLogout, user } = useAuthStore();

    const { openDateModal } = useUiStore();
    const {
        events,
        setActiveEvent,
        startLoadingEvents,
        startDeletingEvent,
        hasEventSelected,
    } = useCalendarStore();

    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    const eventStyleGetter = (event) => {
        const isMyEvent =
            user.uid === event.user._id || user.uid === event.user.uid;

        const style = {
            backgroundColor: isMyEvent ? "#347CF7" : "#FF5050",
            borderRadius: "0px",
            opacity: 0.8,
            color: "white",
        };

        return {
            style,
        };
    };

    const CalendarEvent = ({ event }) => {
        const { title, user } = event;

        return (
            <>
                <strong>{title}</strong>
            </>
        );
    };

    const onDoubleClick = (event) => {
        openDateModal();
    };

    const onSelect = (event) => {
        setActiveEvent(event);
    };

    const onViewChanged = (event) => {
        localStorage.setItem("lastView", event);
        setLastView(event);
    };

    const handleClickNew = () => {
        setActiveEvent({
            title: "",
            description: "",
            begin: new Date(),
            end: addHours(new Date(), 2),
            user: {
                _id: "2234",
                username: "tester",
            },
        });
        openDateModal();
    };

    const handleDelete = () => {
        startDeletingEvent();
    };

    useEffect(() => {
        startLoadingEvents();
    }, []);

    return (
        <>
            <div className="navbar navbar-dark bg-dark mb-4 px-4">
                <span className="navbar-brand">
                    <i className="fas fa-calendar-alt"></i>
                    &nbsp;
                    {user.username}
                </span>

                <button
                    className="btn btn-outline-danger fab-logout"
                    onClick={startLogout}
                >
                    <i className="fas fa-sign-out-alt"></i>
                    &nbsp;
                    <span>Logout</span>
                </button>
            </div>

            <Calendar
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="begin"
                endAccessor="end"
                style={{ height: "calc( 100vh - 82px)" }}
                messages={{
                    allDay: "All Day",
                    previous: "<",
                    next: ">",
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day",
                    agenda: "Agenda",
                    date: "Date",
                    time: "Time",
                    event: "Event",
                    noEventsInRange: "No event for this range!",
                    showMore: (total) => `+ showMore (${total})`,
                }}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent,
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <CalendarModal />

            <button
                className="btn btn-primary calendar-fab"
                onClick={handleClickNew}
            >
                <i className="fas fa-plus"></i>
            </button>
            <button
                className="btn btn-danger calendar-fab-danger"
                onClick={handleDelete}
                style={{
                    display: hasEventSelected ? "" : "none",
                }}
            >
                <i className="fas fa-trash-alt"></i>
            </button>
        </>
    );
};

export default CalendarPage;
