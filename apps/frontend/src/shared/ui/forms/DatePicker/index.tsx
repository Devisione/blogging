import { DatePickerInput } from '@mantine/dates';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function DatePicker<T extends FieldValues>({ control, name, label }: DatePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <DatePickerInput
          {...field}
          label={label}
          error={error?.message}
          valueFormat="DD.MM.YYYY"
        />
      )}
    />
  );
} 