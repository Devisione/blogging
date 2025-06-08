import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Input as MantineInput } from "@mantine/core";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export const Input = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: InputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MantineInput.Wrapper error={error?.message} label={label}>
          <MantineInput
            {...field}
            error={Boolean(error?.message)}
            placeholder={placeholder}
          />
        </MantineInput.Wrapper>
      )}
    />
  );
};
