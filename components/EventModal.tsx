// components/EventModal.tsx
import { Modal, Button, TextInput, NumberInput } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import moment from "moment";
import React from "react";

interface EventModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    eventData: any;
    setEventData: (data: any) => void;
    saveEvent: () => void;
    deleteEvent: () => void; // Функция для удаления события
}

export default function EventModal({
                                       modalOpen,
                                       setModalOpen,
                                       eventData,
                                       setEventData,
                                       saveEvent,
                                       deleteEvent,
                                   }: EventModalProps) {
    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        const newStartTime = moment(eventData.start)
            .set({
                hour: Number(time.split(":")[0]),
                minute: Number(time.split(":")[1]),
            })
            .toDate();
        const newEndTime = moment(newStartTime)
            .add(eventData.duration, "minutes")
            .toDate();
        setEventData({ ...eventData, start: newStartTime, end: newEndTime });
    };

    const handleDurationChange = (value: number | null) => {
        if (value !== null) {
            const newEndTime = moment(eventData.start)
                .add(value, "minutes")
                .toDate();
            setEventData({ ...eventData, duration: value, end: newEndTime });
        }
    };

    return (
        <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Редактировать событие">
            <TextInput
                label="Название события"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            />

            <DatePickerInput
                label="Дата события"
                value={eventData.start}
                onChange={(date) => setEventData({ ...eventData, start: date!, end: date! })}
            />

            <TimeInput
                label="Время события"
                value={moment(eventData.start).format("HH:mm")}
                onChange={handleStartTimeChange}
            />

            <NumberInput
                label="Длительность"
                value={eventData.duration}
                onChange={handleDurationChange}
                min={1}
            />

            <Button fullWidth onClick={saveEvent} style={{ marginTop: "20px" }}>
                Сохранить
            </Button>

            <Button
                fullWidth
                onClick={deleteEvent}
                style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
            >
                Удалить
            </Button>
        </Modal>
    );
}
