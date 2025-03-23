import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, EventPropGetter } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ru from "date-fns/locale/ru"; // Локализация для календаря
import { Button, ActionIcon } from "@mantine/core";
import EventModal from "../components/EventModal";
import { format, parse, startOfWeek, getDay } from "date-fns";

// Локализация для date-fns
const locales = {
    ru: ru,
};

// Локализатор для react-big-calendar
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Форматы отображения дат
const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }) => `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
    dayFormat: "d MMMM yyyy",
    agendaDateFormat: "d MMMM yyyy",
    agendaTimeFormat: "HH:mm",
    weekdayFormat: "iiii",
};

const messages = {
    allDay: 'Все дни',
    previous: 'Предыдущий',
    next: 'Следующий',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'Агенда',
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
};

export default function Home() {
    const [events, setEvents] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("events") || "[]").map((event: any) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
        }
        return [];
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [eventData, setEventData] = useState({
        title: "",
        start: new Date(),
        end: new Date(),
        repeat: "none",
        repeatInterval: 1,
        repeatUntil: null,
        duration: 30,
        id: null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("events", JSON.stringify(events.map(event => ({
                ...event,
                start: event.start.toISOString(),
                end: event.end.toISOString(),
            }))));
        }
    }, [events]);

    const openModal = (date = new Date(), eventToEdit = null) => {
        if (eventToEdit) {
            setEventData(eventToEdit);
        } else {
            setEventData({
                title: "",
                start: date,
                end: date,
                repeat: "none",
                repeatInterval: 1,
                repeatUntil: null,
                duration: 30,
                id: null,
            });
        }
        setModalOpen(true);
    };

    const saveEvent = () => {
        if (eventData.id) {
            setEvents(events.map((event) => (event.id === eventData.id ? eventData : event)));
        } else {
            setEvents([...events, { ...eventData, id: Date.now() }]);
        }
        setModalOpen(false);
    };

    const deleteEvent = (eventToDelete) => {
        setEvents(events.filter((event) => event.id !== eventToDelete.id));
    };

    const handleSelectSlot = (slotInfo: any) => {
        const start = new Date(slotInfo.start);
        const end = new Date(slotInfo.end);
        const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
        setEventData({
            ...eventData,
            start: start,
            end: end,
            duration: duration,
        });
        setModalOpen(true);
    };

    const handleSelectEvent = (event: any) => {
        openModal(event.start, event);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Календарь событий</h1>
            <Button onClick={() => openModal(new Date())} style={{ marginBottom: "20px" }}>
                Добавить событие
            </Button>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                messages={messages}
                selectable
                formats={formats}
                culture="ru"
            />

            <EventModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                eventData={eventData}
                setEventData={setEventData}
                saveEvent={saveEvent}
                deleteEvent={() => deleteEvent(eventData)} // Удаление через модальное окно
            />
        </div>
    );
}
