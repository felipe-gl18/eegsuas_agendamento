import {
  ClipboardList,
  Building2,
  MapPin,
  CalendarDays,
  FileText,
} from "lucide-react";

import { Controller, useFormContext } from "react-hook-form";
import type { PartnershipFormValues } from "../schemas/partnership.schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function RequestDetails() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PartnershipFormValues>();

  return (
    <Card className="mx-auto w-full max-w-4xl border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <ClipboardList className="size-5" />
          </div>

          <div>
            <CardTitle className="text-xl text-[#241344]">
              Dados da solicitação
            </CardTitle>
            <CardDescription>
              Informe os detalhes da atividade ou parceria solicitada.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Informações da parceria */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Informações da parceria</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requestType">
                Tipo de solicitação de parceria *
              </Label>

              <Controller
                name="requestType"
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="requestType"
                      className="w-full"
                      onBlur={field.onBlur}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="pesquisa">Pesquisa</SelectItem>
                      <SelectItem value="extensao">Extensão</SelectItem>
                      <SelectItem value="visita-tecnica">
                        Visita técnica
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.requestType && (
                <p className="text-sm text-destructive">
                  {errors.requestType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Nome da instituição *</Label>
              <Input
                id="institution"
                placeholder="Nome da instituição de ensino"
                {...register("institution")}
              />

              {errors.institution && (
                <p className="text-sm text-destructive">
                  {errors.institution.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Execução e participantes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Building2 className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Execução da atividade</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="locations">
                Locais previstos para execução *
              </Label>

              <Input
                id="locations"
                placeholder="Informe os equipamentos ou locais previstos"
                {...register("locations")}
              />

              {errors.locations && (
                <p className="text-sm text-destructive">
                  {errors.locations.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">
                Quantidade de participantes envolvidos *
              </Label>

              <Input
                id="participants"
                type="number"
                min="1"
                step="1"
                placeholder="Ex.: 10"
                {...register("participants")}
              />

              {errors.participants && (
                <p className="text-sm text-destructive">
                  {errors.participants.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Período */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <CalendarDays className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Período de realização</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início *</Label>

              <Input id="startDate" type="date" {...register("startDate")} />

              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término *</Label>

              <Input id="endDate" type="date" {...register("endDate")} />

              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Descrição */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <MapPin className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Descrição da atividade</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityDescription">
              Descreva a atividade proposta *
            </Label>

            <Textarea
              id="activityDescription"
              placeholder="Descreva os objetivos, as atividades previstas e como serão realizadas..."
              rows={4}
              className="resize-y"
              {...register("activityDescription")}
            />

            {errors.activityDescription && (
              <p className="text-sm text-destructive">
                {errors.activityDescription.message}
              </p>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
