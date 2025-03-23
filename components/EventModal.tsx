import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Group,
} from "@mantine/core";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import {
  format,
  set,
  addMinutes,
  startOfDay,
  endOfDay,
  getDay,
  differenceInHours,
} from "date-fns";
import React, { useMemo } from "react";

interface EventModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  eventData: any;
  setEventData: (data: any) => void;
  saveEvent: () => void;
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

export default function EventModal({
  modalOpen,
  setModalOpen,
  eventData,
  setEventData,
  saveEvent,
  deleteEvent,
}: EventModalProps) {
  // Функция для получения дня недели (0 - воскресенье, 1 - понедельник и т.д.)
  const getDayOfWeek = (date: Date) => getDay(date);

  // Обработчик изменения времени начала события
  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const time = event.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    const newStartTime = set(eventData.start, { hours, minutes });
    const newEndTime = addMinutes(newStartTime, eventData.duration);
    setEventData({ ...eventData, start: newStartTime, end: newEndTime });
  };

  // Обработчик изменения длительности события
  const handleDurationChange = (value: number | null) => {
    if (value !== null) {
      const newEndTime = addMinutes(eventData.start, value);
      setEventData({ ...eventData, duration: value, end: newEndTime });
    }
  };

  // Обработчик изменения типа повторения
  const handleRepeatChange = (value: string) => {
    setEventData({
      ...eventData,
      repeat: value,
      repeatDays:
        value === "weekly"
          ? [DAYS[getDayOfWeek(eventData.start) - 1].value]
          : [],
    });
  };

  // Обработчик изменения дней недели для повторяющихся событий
  const handleRepeatDaysChange = (days: string[]) => {
    setEventData({ ...eventData, repeatDays: days });
  };

  // Обработчик изменения события на весь день (по длительности)
  const handleAllDayChange = (checked: boolean) => {
    if (checked) {
      const newStartTime = startOfDay(eventData.start);
      const newEndTime = endOfDay(newStartTime);
      setEventData({
        ...eventData,
        duration: 1440, // 1440 минут = 24 часа
        start: newStartTime,
        end: newEndTime,
      });
    } else {
      const newEndTime = addMinutes(eventData.start, 30);
      setEventData({
        ...eventData,
        duration: 30,
        end: newEndTime,
      });
    }
  };

  const isAllDay = eventData.duration === 1440;

  const isOneDay = useMemo(() => {
    return (
      format(eventData.start, "dd.MM.yyyy") ===
        format(eventData.end, "dd.MM.yyyy") ||
      differenceInHours(eventData.end, eventData.start) === 24
    );
  }, [eventData]);

  const isCreate = eventData.id === null;
  console.log(eventData);

  return (
    <Modal
      opened={modalOpen}
      onClose={() => setModalOpen(false)}
      title={!isCreate ? "Редактировать событие" : "Создать событие"}
    >
      <TextInput
        label="Название события"
        value={eventData.title}
        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
      />

      {/* Добавление поля для выбора даты начала события при создании нового события */}
      {eventData.id === null && (
        <DatePickerInput
          label="Дата события"
          value={eventData.start}
          onChange={(date) =>
            setEventData({ ...eventData, start: date!, end: date! })
          }
        />
      )}

      {isOneDay && (
        <Checkbox
          label="Событие на весь день"
          checked={isAllDay}
          onChange={(e) => handleAllDayChange(e.target.checked)}
          style={{ marginTop: 16, marginBottom: 8 }}
        />
      )}

      {!isAllDay && (
        <>
          <TimeInput
            label="Время события"
            value={format(eventData.start, "HH:mm")}
            onChange={handleStartTimeChange}
          />

          <NumberInput
            label="Длительность"
            value={eventData.duration}
            onChange={handleDurationChange}
            min={1}
          />
        </>
      )}

      {isOneDay && (
        <>
          <Select
            label="Повторение"
            value={eventData.repeat}
            onChange={handleRepeatChange}
            data={[
              { value: "none", label: "Без повторения" },
              { value: "daily", label: "Ежедневно" },
              { value: "weekly", label: "Еженедельно" },
              { value: "monthly", label: "Ежемесячно" },
            ]}
          />

          {eventData.repeat === "weekly" && (
            <Checkbox.Group
              label="Выберите дни для повторения"
              value={eventData.repeatDays}
              onChange={handleRepeatDaysChange}
            >
              <Group direction="column">
                {DAYS.map((day) => (
                  <Checkbox
                    key={day.value}
                    value={day.value}
                    label={day.label}
                    disabled={
                      isOneDay &&
                      DAYS[getDayOfWeek(eventData.start) - 1].value ===
                        day.value
                    }
                  />
                ))}
              </Group>
            </Checkbox.Group>
          )}
        </>
      )}

      <Button fullWidth onClick={saveEvent} style={{ marginTop: "20px" }}>
        {isCreate ? "Создать" : "Сохранить"}
      </Button>

      {!isCreate && (
        <Button
          fullWidth
          onClick={deleteEvent}
          style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
        >
          {eventData.repeat !== "none" ? "Удалить серию" : "Удалить"}
        </Button>
      )}
    </Modal>
  );
}
