import React, { useMemo } from "react";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import {
  addMinutes,
  differenceInHours,
  endOfDay,
  format,
  getDay,
  set,
  startOfDay,
} from "date-fns";
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
  eventData,
  setEventData,
  saveEvent,
  deleteEvent,
}: EventModalProps) => {
  // Функция для получения дня недели (0 - воскресенье, 1 - понедельник и т.д.)
  const getDayOfWeek = (date: Date) => getDay(date);

  // Обработчик изменения времени начала события
  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const time = event.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    if (eventData.recurrenceStart) {
      const newStartTime = set(eventData.recurrenceStart, { hours, minutes });
      const newEndTime = addMinutes(newStartTime, eventData.duration);
      setEventData({
        ...eventData,
        recurrenceStart: newStartTime,
        recurrenceEnd: newEndTime,
      });
    }
  };

  // Обработчик изменения длительности события
  const handleDurationChange = (value: number | string | null) => {
    if (value !== null && eventData.recurrenceStart) {
      const newEndTime = addMinutes(
        eventData.recurrenceStart,
        typeof value === "string" ? parseInt(value) : value,
      );
      setEventData({
        ...eventData,
        duration: parseInt(value.toString()),
        recurrenceEnd: newEndTime,
      });
    }
  };

  // Обработчик изменения типа повторения
  const handleRepeatChange = (value: string | null) => {
    if (eventData.recurrenceStart) {
      setEventData({
        ...eventData,
        recurrenceType: value ? value : "none",
        recurrenceDays:
          value === "weekly"
            ? [DAYS[getDayOfWeek(eventData.recurrenceStart) - 1].value]
            : [],
      });
    }
  };

  // Обработчик изменения дней недели для повторяющихся событий
  const handleRepeatDaysChange = (days: string[]) => {
    setEventData({ ...eventData, recurrenceDays: days });
  };

  // Обработчик изменения события на весь день (по длительности)
  const handleAllDayChange = (checked: boolean) => {
    if (!eventData.recurrenceStart) return;

    if (checked) {
      const newStartTime = startOfDay(eventData.recurrenceStart);
      const newEndTime = endOfDay(newStartTime);
      setEventData({
        ...eventData,
        duration: 1440, // 1440 минут = 24 часа
        recurrenceStart: newStartTime,
        recurrenceEnd: newEndTime,
      });
    } else {
      const newEndTime = addMinutes(eventData.recurrenceStart, 30);
      setEventData({
        ...eventData,
        duration: 30,
        recurrenceEnd: newEndTime,
      });
    }
  };

  const isAllDay = eventData.duration === 1440;

  const isOneDay = useMemo(() => {
    if (!eventData.recurrenceStart || !eventData.recurrenceEnd) return false;

    return (
      format(eventData.recurrenceStart, "dd.MM.yyyy") ===
        format(eventData.recurrenceEnd, "dd.MM.yyyy") ||
      differenceInHours(eventData.recurrenceEnd, eventData.recurrenceStart) ===
        24
    );
  }, [eventData]);

  const isCreate = eventData.id === "";
  console.log(eventData);

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
      {eventData.id === "" && (
        <DatePickerInput
          label="Дата события"
          onChange={(date) => {
            setEventData({
              ...eventData,
              recurrenceStart: date ? date : new Date(),
              recurrenceEnd: date ? date : new Date(),
            });
          }}
          value={eventData.recurrenceStart}
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
            value={
              eventData.recurrenceStart
                ? format(eventData.recurrenceStart, "HH:mm")
                : void 0
            }
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
          <Select
            data={[
              { value: "none", label: "Без повторения" },
              { value: "daily", label: "Ежедневно" },
              { value: "weekly", label: "Еженедельно" },
              { value: "monthly", label: "Ежемесячно" },
            ]}
            label="Повторение"
            onChange={handleRepeatChange}
            value={eventData.recurrenceType}
          />

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
                        ? DAYS[
                            getDayOfWeek(
                              eventData.recurrenceStart || new Date(),
                            ) - 1
                          ].value === day.value
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
