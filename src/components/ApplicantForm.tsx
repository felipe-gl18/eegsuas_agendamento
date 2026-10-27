import { useState } from "react";
import { FileText, UserRound, Phone } from "lucide-react";

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

export function ApplicantForm() {
  const [whatsapp, setWhatsapp] = useState([false, false, false]);

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
        {/* Identificação */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <UserRound className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Identificação</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="document">CPF/CNPJ *</Label>
              <Input
                id="document"
                name="document"
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome / Razão Social *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome completo ou razão social"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área de interesse (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                min="0"
                step="any"
                placeholder="Ex.: 250"
              />
            </div>
          </div>
        </section>

        {/* Telefones */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Phone className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Telefones para contato</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Telefone principal",
              "Segundo telefone",
              "Terceiro telefone",
            ].map((title, index) => (
              <div key={title} className="space-y-2">
                <Label htmlFor={`phone-${index}`}>
                  {title}
                  {index === 0 ? " *" : ""}
                </Label>

                <Input
                  id={`phone-${index}`}
                  name={`phone${index + 1}`}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required={index === 0}
                />

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id={`whatsapp-${index}`}
                    checked={whatsapp[index]}
                    onCheckedChange={(checked) =>
                      setWhatsapp((current) =>
                        current.map((value, i) =>
                          i === index ? checked === true : value,
                        ),
                      )
                    }
                    name={`phone${index + 1}Whatsapp`}
                  />
                  <Label
                    htmlFor={`whatsapp-${index}`}
                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                  >
                    Este número tem WhatsApp
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Atendimento */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="size-4 text-[#6c3eb8]" />
            <h3 className="text-sm font-semibold">Informações adicionais</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="protocol">Protocolo de atendimento anterior</Label>
            <Input
              id="protocol"
              name="protocol"
              placeholder="Informe o número do protocolo, se houver"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Observação</Label>
            <Textarea
              id="observation"
              name="observation"
              placeholder="Informações adicionais sobre a solicitação..."
              rows={3}
              className="resize-y"
            />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
