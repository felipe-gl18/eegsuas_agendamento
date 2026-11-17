import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import {
  moduleSchema,
  type ModuleFormData,
} from "../../schemas/module.schema";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

interface ModuleFormProps {
  defaultValues?: ModuleFormData;
  isSubmitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onSubmit: (data: ModuleFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ModuleForm({
  defaultValues,
  isSubmitting,
  error,
  submitLabel = "Cadastrar módulo",
  onSubmit,
  onCancel,
}: ModuleFormProps) {
  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      order: 1,
    },
  });

  async function handleSubmit(data: ModuleFormData) {
    await onSubmit(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      noValidate
      className="space-y-5"
    >
      <FieldGroup>
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Nome */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="module-name">Nome do módulo</FieldLabel>

              <Input
                {...field}
                id="module-name"
                placeholder="Ex.: Introdução ao SUAS"
                maxLength={150}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Descrição */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="module-description">
                Descrição
              </FieldLabel>

              <Textarea
                {...field}
                value={field.value ?? ""}
                id="module-description"
                placeholder="Descreva os conteúdos abordados neste módulo..."
                className="min-h-32 resize-y"
                maxLength={2000}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {(field.value ?? "").length}/2000
                </span>
              </div>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Ordem */}
        <Controller
          name="order"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="module-order">
                Ordem do módulo
              </FieldLabel>

              <Input
                id="module-order"
                type="number"
                min={1}
                step={1}
                placeholder="Ex.: 1"
                value={field.value}
                onChange={(event) => {
                  const value = event.target.value;

                  field.onChange(value === "" ? 0 : Number(value));
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="animate-spin" />
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}