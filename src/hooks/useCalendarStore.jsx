import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../api";
import {
    onAddNewEvent,
    onDeleteEvent,
    onLoadingEvents,
    onSetActiveEvent,
    onUpdateEvent,
} from "../store/calendarSlice";
import { parseISO } from "date-fns";

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { user } = useSelector((state) => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (calendarEvent.id) {
                await api.put(`/events/${calendarEvent.id}`, calendarEvent);

                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            let { eventToSend } = calendarEvent;
            eventToSend = {
                username: user.username,
                title: calendarEvent.title,
                description: calendarEvent.description,
                begin: calendarEvent.begin.toISOString(),
                end: calendarEvent.end.toISOString(),
            };
            const { data } = await api.post("/events/", eventToSend);

            dispatch(
                onAddNewEvent({ ...calendarEvent, id: data.event.id, user })
            );
        } catch (error) {
            Swal.fire("Error", error.response.data?.msg, "error");
        }
    };

    const startDeletingEvent = async () => {
        try {
            await api.delete(`/events/${activeEvent.id}`);

            dispatch(onDeleteEvent());
        } catch (error) {
            Swal.fire("Error", error.response.data?.msg, "error");
        }
    };

    const startLoadingEvents = async () => {
        try {
            const { data } = await api.get("/events");

            const events = data.events.map((event) => {
                event.begin = parseISO(event.begin);
                event.end = parseISO(event.end);
                return event;
            });

            dispatch(onLoadingEvents(events));
        } catch (error) {
            console.log("Error: failed to load events");
            console.log(error);
        }
    };

    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startDeletingEvent,
        startLoadingEvents,
        startSavingEvent,
    };
};

export default useCalendarStore;
