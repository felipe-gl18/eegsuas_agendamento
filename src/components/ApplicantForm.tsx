import { FileText, UserRound, Phone } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

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
import { Checkbox } from "./ui/checkbox";

import type { PartnershipFormValues } from "../schemas/partnership.schema";
import { CpfCnpjField } from "./CpfcnpjField";

export function ApplicantForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PartnershipFormValues>();

  const phones = [
    {
      title: "Telefone principal",
      field: "phone1",
      whatsapp: "phone1Whatsapp",
    },
    { title: "Segundo telefone", field: "phone2", whatsapp: "phone2Whatsapp" },
    { title: "Terceiro telefone", field: "phone3", whatsapp: "phone3Whatsapp" },
  ] as const;

  return (
    <Card className="mx-auto w-full max-w-4xl border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <FileText className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-[#241344]">
              Dados do solicitante
            </CardTitle>
            <CardDescription>
              Preencha os dados para identificar o solicitante e registrar o
              atendimento.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <UserRound className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Identificação</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CpfCnpjField name="document" label="CPF/CNPJ *" />

            <div className="space-y-2">
              <Label htmlFor="name">Nome / Razão Social *</Label>
              <Input
                id="name"
                placeholder="Nome completo ou razão social"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área de interesse (m²)</Label>
              <Input
                id="area"
                type="number"
                min="0"
                step="any"
                placeholder="Ex.: 250"
                {...register("area", {
                  setValueAs: (value) => (value === "" ? "" : Number(value)),
                })}
              />
              {errors.area && (
                <p className="text-sm text-destructive">
                  {errors.area.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Phone className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Telefones para contato</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {phones.map((phone) => (
              <div key={phone.field} className="space-y-2">
                <Label htmlFor={phone.field}>
                  {phone.title}
                  {phone.field === "phone1" ? " *" : ""}
                </Label>

                <Input
                  id={phone.field}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register(phone.field)}
                />

                {errors[phone.field] && (
                  <p className="text-sm text-destructive">
                    {errors[phone.field]?.message}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Controller
                    name={phone.whatsapp}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={phone.whatsapp}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                  <Label
                    htmlFor={phone.whatsapp}
                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                  >
                    Este número tem WhatsApp
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Informações adicionais</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="protocol">Protocolo de atendimento anterior</Label>
            <Input
              id="protocol"
              placeholder="Informe o número do protocolo, se houver"
              {...register("protocol")}
            />
            {errors.protocol && (
              <p className="text-sm text-destructive">
                {errors.protocol.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Observação</Label>
            <Textarea
              id="observation"
              placeholder="Informações adicionais sobre a solicitação..."
              rows={3}
              className="resize-y"
              {...register("observation")}
            />
            {errors.observation && (
              <p className="text-sm text-destructive">
                {errors.observation.message}
              </p>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
