import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { DateTimePicker as DateTimePickerInput } from "@mantine/dates";

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export const DateTimePicker = <T extends FieldValues>({
  control,
  name,
  label,
}: DatePickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <DateTimePickerInput {...field} error={error?.message} label={label} />
      )}
    />
  );
};
