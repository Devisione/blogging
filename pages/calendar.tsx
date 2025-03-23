import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ru from "date-fns/locale/ru"; // Локализация для календаря
import { Button } from "@mantine/core";
import EventModal from "../components/EventModal";
import { format, parse, startOfWeek, getDay, setDay } from "date-fns";
import cloneDeep from "clone-deep";
import { addDays } from "date-fns";

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
  eventTimeRangeFormat: ({ start, end }) =>
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

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function CalendarPage() {
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("events") || "[]").map(
        (event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }),
      );
    }
    return [];
  });

  const getDefaultEvent = useCallback(
    () => ({
      title: "",
      start: new Date(),
      end: new Date(),
      repeat: "none",
      repeatDays: [], // Массив для повторяющихся дней
      repeatInterval: 1,
      parentId: null,
      duration: 30,
      id: null,
    }),
    [],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState(getDefaultEvent());

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "events",
        JSON.stringify(
          events.map((event) => ({
            ...event,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
          })),
        ),
      );
    }
  }, [events]);

  const openModal = (date = new Date(), eventToEdit = null) => {
    if (eventToEdit) {
      setEventData({
        ...eventToEdit,
      });
    } else {
      setEventData({
        ...getDefaultEvent(),
        start: date,
        end: date,
      });
    }
    setModalOpen(true);
  };

  const saveEvent = () => {
    if (eventData.id) {
      setEvents(
        events.map((event) => (event.id === eventData.id ? eventData : event)),
      );
    } else {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const deleteEvent = (eventToDelete) => {
    setEvents(events.filter((event) => event.id !== eventToDelete.id));
    setModalOpen(false);
    setEventData(getDefaultEvent());
  };

  const handleSelectSlot = (slotInfo: any) => {
    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end);
    const duration = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );
    setEventData({
      ...getDefaultEvent(),
      start: start,
      end: end,
      duration: duration,
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (targetEvent: any) => {
    const findedEvent = targetEvent.parentId
      ? events.find(({ id }) => id === targetEvent.parentId)
      : targetEvent;

    openModal(findedEvent.start, findedEvent);
  };

  const seeEvents = useMemo(
    () =>
      events.reduce((acc, item) => {
        if (item.repeat === "weekly") {
          const deeped = cloneDeep(item);

          acc = acc
            .concat(
              // Для каждого дня из repeatDays создаем 52 события
              item.repeatDays.flatMap((day) => {
                const dayOfWeek = DAYS.indexOf(day);

                // Расчет первого дня для текущего повторения
                let firstEventDate = startOfWeek(item.start);
                firstEventDate = setDay(firstEventDate, dayOfWeek); // Устанавливаем первый выбранный день

                // Если день недели уже прошел, начинаем с следующей недели
                const currentDay = getDay(new Date());
                if (currentDay > dayOfWeek) {
                  firstEventDate = addDays(firstEventDate, 7); // Начинаем с следующей недели
                }

                return new Array(52).fill(1).map((_, index) => {
                  return {
                    ...deeped,
                    id: null,
                    title: `${deeped.title} (Регулярная)`,
                    start: addDays(firstEventDate, index * 7),
                    end: addDays(firstEventDate, index * 7),
                    parentId: deeped.id,
                  };
                });
              }),
            )
            .concat([item]);
        } else if (item.repeat === "daily") {
          const deeped = cloneDeep(item);

          let firstEventDate = item.start;

          return [deeped].concat(
            new Array(365).fill(1).map((_, index) => {
              return {
                ...deeped,
                id: null,
                title: `${deeped.title} (Регулярная)`,
                start: addDays(firstEventDate, index + 1),
                end: addDays(firstEventDate, index + 1),
                parentId: deeped.id,
              };
            }),
          );
        } else if (item.repeat === "monthly") {
          const deeped = cloneDeep(item);

          let firstEventDate = item.start;

          return [deeped].concat(
            new Array(52).fill(1).map((_, index) => {
              return {
                ...deeped,
                id: null,
                title: `${deeped.title} (Регулярная)`,
                start: addDays(firstEventDate, (index + 1) * 28),
                end: addDays(firstEventDate, (index + 1) * 28),
                parentId: deeped.id,
              };
            }),
          );
        } else {
          acc = acc.concat([item]);
        }

        return acc;
      }, []),
    [events],
  );

  return (
    <div style={{ height: "calc(100dvh - 108px)" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Календарь событий
      </h1>
      <Button
        onClick={() => openModal(new Date())}
        style={{ marginBottom: "20px" }}
      >
        Добавить событие
      </Button>
      <Calendar
        localizer={localizer}
        events={seeEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100% - 109px)" }}
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
