import { useCallback, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@mantine/core";
import { format, getDay, parse, startOfWeek } from "date-fns";
// @ts-expect-error -- всё ок
import ru from "date-fns/locale/ru"; // Локализация для календаря

import { useUnit } from "effector-react/effector-react.mjs";
import {
  $preparedCalendarEvents,
  onCreateEvent,
  onDeleteEvent,
} from "@entities/Event/model/store";
import type { Event } from "@entities/Event/model/types";
import EventModal from "./ui/EventModal";

// Локализация для date-fns
const locales = {
  ru,
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
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
  dayFormat: "d MMMM yyyy",
  agendaDateFormat: "d MMMM yyyy",
  agendaTimeFormat: "HH:mm",
  weekdayFormat: "iiii",
};

const messages = {
  allDay: "Все дни",
  previous: "Предыдущий",
  next: "Следующий",
  today: "Сегодня",
  month: "Месяц",
  week: "Неделя",
  day: "День",
  agenda: "Агенда",
  date: "Дата",
  time: "Время",
  event: "Событие",
};

const CalendarPage = () => {
  const events = useUnit($preparedCalendarEvents);
  const onCreate = useUnit(onCreateEvent);
  const onDelete = useUnit(onDeleteEvent);
  const getDefaultEvent = useCallback(
    (): Omit<Event, "id"> & Partial<Pick<Event, "id">> => ({
      title: "",
      description: "",
      date: new Date(),
      duration: 30,

      parentId: void 0,
      recurrenceDays: void 0,
      recurrenceEnd: void 0,
      recurrenceStart: void 0,
      recurrenceType: "none",
    }),
    [],
  );

  console.log(events);

  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState(getDefaultEvent());

  const openModal = (
    date: Date = new Date(),
    eventToEdit: Event | null = null,
  ) => {
    if (eventToEdit) {
      setEventData({
        ...eventToEdit,
      });
    } else {
      setEventData({
        ...getDefaultEvent(),
        recurrenceStart: date,
        recurrenceEnd: date,
      });
    }
    setModalOpen(true);
  };

  const saveEvent = async () => {
    if (eventData.id) {
      // UPDATE
    } else {
      await onCreate({ ...eventData });
    }
    setModalOpen(false);
  };

  const deleteEvent = async (eventToDelete: Event) => {
    await onDelete({ id: eventToDelete.id });
    setModalOpen(false);
    setEventData(getDefaultEvent());
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end);
    const duration = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );
    setEventData({
      ...getDefaultEvent(),
      recurrenceStart: start,
      recurrenceEnd: end,
      duration,
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (targetEvent: Event) => {
    const findedEvent = targetEvent.parentId
      ? events?.find(({ id }) => id === targetEvent.parentId)
      : targetEvent;

    openModal(findedEvent?.recurrenceStart, findedEvent);
  };

  return (
    <div style={{ height: "calc(100dvh - 108px)" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Календарь событий
      </h1>
      <Button
        onClick={() => {
          openModal(new Date());
        }}
        style={{ marginBottom: "20px" }}
      >
        Добавить событие
      </Button>
      {/* @ts-expect-error -- всё ок */}
      <Calendar<Event>
        culture="ru"
        endAccessor="recurrenceEnd"
        events={events ? events : void 0}
        formats={formats}
        localizer={localizer}
        messages={messages}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        startAccessor="recurrenceStart"
        style={{ height: "calc(100% - 109px)" }}
      />

      <EventModal
        deleteEvent={() => {
          void deleteEvent(eventData as Event);
        }}
        eventData={eventData}
        modalOpen={modalOpen}
        saveEvent={saveEvent}
        setEventData={setEventData}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default CalendarPage;
