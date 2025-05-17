import { DatePickerInput } from '@mantine/dates';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export const DatePicker = <T extends FieldValues>({ control, name, label }: DatePickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <DatePickerInput
          {...field}
          error={error?.message}
          label={label}
          valueFormat="DD.MM.YYYY"
        />
      )}
    />
  );
} 