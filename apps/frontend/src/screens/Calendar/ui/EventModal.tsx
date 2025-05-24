import React, { useEffect, useMemo, useState } from "react";
import type { DatesRangeValue, DateValue } from "@mantine/dates";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { format, getDay, set, startOfDay } from "date-fns";
import { mergeWithParent } from "@shared/utils/object";
import type { Event } from "@entities/Event/model/types";

interface EventModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  eventData: Omit<Event, "id"> & Partial<Pick<Event, "id">>;
  setEventData: (data: Omit<Event, "id"> & Partial<Pick<Event, "id">>) => void;
  saveEvent: () => Promise<void>;
  deleteEvent: () => void;
}

const DAYS = [
  { value: "monday", label: "Понедельник" },
  { value: "tuesday", label: "Вторник" },
  { value: "wednesday", label: "Среда" },
  { value: "thursday", label: "Четверг" },
  { value: "friday", label: "Пятница" },
  { value: "saturday", label: "Суббота" },
  { value: "sunday", label: "Воскресенье" },
];

const EventModal = ({
  modalOpen,
  setModalOpen,
  eventData: event,
  setEventData,
  saveEvent,
  deleteEvent,
}: EventModalProps) => {
  const eventData = mergeWithParent(event, event.parent);

  const [range, setRange] = useState<[DateValue, DateValue]>([null, null]);

  useEffect(() => {
    setRange([
      eventData.recurrenceStart || null,
      eventData.recurrenceEnd || null,
    ]);
  }, [eventData.recurrenceStart, eventData.recurrenceEnd]);

  console.log(range);

  const updateRange = (value: DatesRangeValue) => {
    setRange(value);
    setEventData({
      ...eventData,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- всё ок
      recurrenceStart: value[0]!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- всё ок
      recurrenceEnd: value[1]!,
    });
  };

  // Функция для получения дня недели (0 - воскресенье, 1 - понедельник и т.д.)
  const getDayOfWeek = (date: Date) => getDay(date);

  // Обработчик изменения времени начала события
  const handleStartTimeChange = (
    innerEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const time = innerEvent.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    if (eventData.recurrenceStart) {
      const newStartTime = set(eventData.recurrenceStart, { hours, minutes });
      setEventData({
        ...eventData,
        date: newStartTime,
      });
    }
  };

  // Обработчик изменения длительности события
  const handleDurationChange = (value: number | string | null) => {
    if (value !== null && eventData.recurrenceStart) {
      setEventData({
        ...eventData,
        duration: typeof value === "string" ? parseInt(value) : value,
      });
    }
  };

  // Обработчик изменения дней недели для повторяющихся событий
  const handleRepeatDaysChange = (days: string[]) => {
    setEventData({ ...eventData, recurrenceDays: days });
  };

  // Обработчик изменения события на весь день (по длительности)
  const handleAllDayChange = (checked: boolean) => {
    if (checked) {
      const newStartTime = startOfDay(eventData.date);
      setEventData({
        ...eventData,
        date: newStartTime,
        duration: 1440, // 1440 минут = 24 часа
      });
    } else {
      const newStartTime = startOfDay(eventData.date);

      setEventData({
        ...eventData,
        date: newStartTime,
        duration: 30,
      });
    }
  };

  const isAllDay = eventData.duration === 1440;

  const isOneDay = useMemo(() => {
    const endDate = new Date(eventData.date);
    endDate.setMinutes(eventData.date.getMinutes() + eventData.duration);
    endDate.setSeconds(endDate.getSeconds() - 1);

    return eventData.date.getDay() === endDate.getDay();
  }, [eventData]);

  const isCreate = Boolean(!eventData.id);

  useEffect(() => {
    if (modalOpen) {
      if (
        eventData.recurrenceType === "weekly" &&
        !eventData.recurrenceDays?.some(
          (day) => day === DAYS[getDayOfWeek(eventData.date) - 1].value,
        )
      ) {
        setEventData({
          ...eventData,
          recurrenceDays: [DAYS[getDayOfWeek(eventData.date) - 1].value],
        });
      }
    }
    // eslint-disable-next-line -- так и задумано
  }, [modalOpen]);

  return (
    <Modal
      onClose={() => {
        setModalOpen(false);
      }}
      opened={modalOpen}
      title={!isCreate ? "Редактировать событие" : "Создать событие"}
    >
      <TextInput
        label="Название события"
        onChange={(e) => {
          setEventData({ ...eventData, title: e.target.value });
        }}
        value={eventData.title}
      />

      {/* Добавление поля для выбора даты начала события при создании нового события */}
      {!eventData.id && (
        <DatePickerInput
          label="Дата события"
          onChange={(date) => {
            setEventData({
              ...eventData,
              date: date ? date : new Date(),
            });
          }}
          value={eventData.date}
        />
      )}

      {isOneDay ? (
        <Checkbox
          checked={isAllDay}
          label="Событие на весь день"
          onChange={(e) => {
            handleAllDayChange(e.target.checked);
          }}
          style={{ marginTop: 16, marginBottom: 8 }}
        />
      ) : null}

      {!isAllDay && (
        <>
          <TimeInput
            label="Время события"
            onChange={handleStartTimeChange}
            value={format(eventData.date, "HH:mm")}
          />

          <NumberInput
            label="Длительность"
            min={1}
            onChange={handleDurationChange}
            value={eventData.duration}
          />
        </>
      )}

      {isOneDay ? (
        <>
          {eventData.recurrenceType !== "none" && (
            <DatePickerInput
              label="Период повторения"
              onChange={updateRange}
              type="range"
              value={range}
            />
          )}

          {eventData.recurrenceType === "weekly" && (
            <Checkbox.Group
              label="Выберите дни для повторения"
              onChange={handleRepeatDaysChange}
              value={eventData.recurrenceDays}
            >
              <Group>
                {DAYS.map((day) => (
                  <Checkbox
                    disabled={
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- что то тут лагает
                      isOneDay
                        ? DAYS[getDayOfWeek(eventData.date) - 1].value ===
                          day.value
                        : false
                    }
                    key={day.value}
                    label={day.label}
                    value={day.value}
                  />
                ))}
              </Group>
            </Checkbox.Group>
          )}
        </>
      ) : null}

      <Button
        fullWidth
        onClick={() => {
          void saveEvent();
        }}
        style={{ marginTop: "20px" }}
      >
        {isCreate ? "Создать" : "Сохранить"}
      </Button>

      {!isCreate && (
        <Button
          fullWidth
          onClick={deleteEvent}
          style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
        >
          {eventData.recurrenceType !== "none" ? "Удалить серию" : "Удалить"}
        </Button>
      )}
    </Modal>
  );
};

export default EventModal;
