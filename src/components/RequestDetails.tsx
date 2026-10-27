import {
  ClipboardList,
  Building2,
  MapPin,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react";

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
        {/* Identificação da solicitação */}
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

              <Select name="requestType" required>
                <SelectTrigger id="requestType" className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="estagio">Estágio</SelectItem>
                  <SelectItem value="pesquisa">Pesquisa</SelectItem>
                  <SelectItem value="extensao">Extensão</SelectItem>
                  <SelectItem value="visita-tecnica">Visita técnica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Nome da instituição *</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Nome da instituição de ensino"
                required
              />
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
                name="locations"
                placeholder="Informe os equipamentos ou locais previstos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">
                Quantidade de participantes envolvidos *
              </Label>
              <Input
                id="participants"
                name="participants"
                type="number"
                min="1"
                step="1"
                placeholder="Ex.: 10"
                required
              />
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
              <Input id="startDate" name="startDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de término *</Label>
              <Input id="endDate" name="endDate" type="date" required />
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
              name="activityDescription"
              placeholder="Descreva os objetivos, as atividades previstas e como serão realizadas..."
              rows={4}
              className="resize-y"
              required
            />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
