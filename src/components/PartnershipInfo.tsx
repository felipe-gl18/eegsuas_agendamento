import { Info, UsersRound, Clock, CalendarDays, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

const details = [
  {
    icon: UsersRound,
    title: "Público-alvo",
    content:
      "Instituições de ensino e estudantes interessados em desenvolver atividades nos serviços da SEDHAS.",
  },
  {
    icon: Clock,
    title: "Tempo médio",
    content: "07 dias úteis*",
    note: "*Prazo sujeito à análise da documentação e disponibilidade dos equipamentos.",
  },
  {
    icon: CalendarDays,
    title: "Horário de funcionamento",
    content: "Segunda a sexta, das 08h às 12h e das 13h às 17h.",
  },
  {
    icon: Phone,
    title: "Contato para informações",
    content: "(88) 3695-4128",
  },
];

export function PartnershipInfo() {
  return (
    <Card className="mx-auto w-full max-w-4xl gap-0 border-border/70 py-0 shadow-sm">
      <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <Info className="size-6" />
          </div>

          <div className="min-w-0 space-y-2">
            <CardTitle className="text-lg font-semibold leading-tight tracking-tight text-[#241344] sm:text-2xl">
              Solicitação de Parceria para Estágio, Pesquisa e Extensão
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed">
              Este procedimento formaliza parcerias entre instituições de ensino
              e a Secretaria dos Direitos Humanos e da Assistência Social
              (SEDHAS) para a realização de estágios, pesquisas, extensões e
              visitas técnicas nos equipamentos da secretaria.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3 sm:p-6 sm:pt-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3edfc] text-[#6c3eb8]">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold text-[#241344]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>

                  {item.note && (
                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
