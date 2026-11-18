import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import {
  formationSchema,
  type FormationFormData,
} from "../../schemas/formation.schema";

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

export interface FormationFormProps {
  defaultValues?: FormationFormData;
  isSubmitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onSubmit: (data: FormationFormData) => Promise<void>;
  onCancel: () => void;
}

export default function TrainingTrackForm({
  defaultValues,
  isSubmitting,
  error,
  submitLabel = "Cadastrar formação",
  onSubmit,
  onCancel,
}: FormationFormProps) {
  const form = useForm<FormationFormData>({
    resolver: zodResolver(formationSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      workloadHours: 1,
    },
  });

  async function handleSubmit(data: FormationFormData) {
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
              <FieldLabel htmlFor="formation-name">Nome da formação</FieldLabel>

              <Input
                {...field}
                id="formation-name"
                placeholder="Ex.: Capacitação em Gestão do SUAS"
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
              <FieldLabel htmlFor="formation-description">Descrição</FieldLabel>

              <Textarea
                {...field}
                id="formation-description"
                placeholder="Descreva os objetivos e conteúdos da formação..."
                className="min-h-32 resize-y"
                maxLength={2000}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
              />

              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {field.value.length}/2000
                </span>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Carga horária */}
        <Controller
          name="workloadHours"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="formation-workload">
                Carga horária (horas)
              </FieldLabel>

              <Input
                id="formation-workload"
                type="number"
                min={1}
                max={5000}
                step={1}
                placeholder="Ex.: 40"
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
