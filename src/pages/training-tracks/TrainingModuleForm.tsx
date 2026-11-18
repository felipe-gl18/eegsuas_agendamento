import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import {
  trainingModuleSchema,
  type TrainingModuleFormData,
} from "../../schemas/training-module.schema";

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

export interface TrainingModuleFormProps {
  defaultValues?: TrainingModuleFormData;
  isSubmitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onSubmit: (data: TrainingModuleFormData) => Promise<void>;
  onCancel: () => void;
}

export default function TrainingModuleForm({
  defaultValues,
  isSubmitting,
  error,
  submitLabel = "Salvar módulo",
  onSubmit,
  onCancel,
}: TrainingModuleFormProps) {
  const form = useForm<TrainingModuleFormData>({
    resolver: zodResolver(trainingModuleSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
    },
  });

  async function handleSubmit(data: TrainingModuleFormData) {
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
                placeholder="Ex.: Fundamentos da Assistência Social"
                maxLength={150}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                Descrição{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </FieldLabel>

              <Textarea
                {...field}
                id="module-description"
                placeholder="Descreva o conteúdo deste módulo..."
                className="min-h-28 resize-y"
                maxLength={1000}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {field.value.length}/1000
                </span>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
