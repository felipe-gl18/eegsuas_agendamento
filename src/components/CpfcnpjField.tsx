import { InputMask, format, type Modify } from "@react-input/mask";
import { useController, useFormContext } from "react-hook-form";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CPF_MASK = "___.___.___-__";
const CNPJ_MASK = "__.___.___/____-__";
const replacement = { _: /\d/ };

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/**
 * Chooses the mask based on how many digits the value will have AFTER the edit:
 * up to 11 digits -> CPF, 12 or more -> CNPJ.
 */
const modify: Modify = ({ value, data, selectionStart, selectionEnd }) => {
  const nextValue =
    value.slice(0, selectionStart) + (data ?? "") + value.slice(selectionEnd);

  return {
    mask: onlyDigits(nextValue).length > 11 ? CNPJ_MASK : CPF_MASK,
  };
};

/**
 * Formats a raw value (e.g. digits coming from the backend) as CPF or CNPJ.
 * Use it for default values and `reset()`, since InputMask only masks while typing.
 */
export function formatCpfCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  return format(digits, {
    mask: digits.length > 11 ? CNPJ_MASK : CPF_MASK,
    replacement,
  });
}

type CpfCnpjFieldProps = {
  /** Field name in the form (the same one used in the Zod schema). */
  name: string;
  label?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function CpfCnpjField({
  name,
  label = "CPF/CNPJ *",
  id = name,
  placeholder = "000.000.000-00 ou 00.000.000/0000-00",
  disabled,
}: CpfCnpjFieldProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <InputMask
        component={Input}
        mask={CPF_MASK}
        replacement={replacement}
        modify={modify}
        id={id}
        name={field.name}
        ref={field.ref}
        value={typeof field.value === "string" ? field.value : ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!fieldState.error}
      />

      {fieldState.error && (
        <p className="text-sm text-destructive">{fieldState.error.message}</p>
      )}
    </div>
  );
}
