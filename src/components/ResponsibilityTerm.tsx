import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export function ResponsibilityTerm() {
  const [accepted, setAccepted] = useState(false);

  return (
    <Card className="mx-auto w-full max-w-4xl gap-0 border-border/70 py-0 shadow-sm">
      <CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <CardTitle className="text-xl text-[#241344]">
              Termo de responsabilidade
            </CardTitle>
            <CardDescription className="mt-1">
              Leia atentamente a declaração antes de prosseguir.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 sm:p-6 sm:pt-3">
        <div className="space-y-4 rounded-lg bg-muted/40 p-4 sm:p-5">
          <p className="text-sm leading-7 text-muted-foreground">
            Eu, requerente deste processo, declaro sob as penas da lei, que as
            informações prestadas no ato da requisição são de minha inteira
            responsabilidade. Declaro, ainda, estar ciente de que a falsidade
            das declarações prestadas pode implicar na sanção penal prevista no
            art. 299 do Código Penal, conforme transcrição abaixo:
          </p>

          <blockquote className="border-l-2 border-[#6c3eb8]/50 pl-4 text-sm leading-7 text-foreground/80">
            <span className="font-semibold text-[#241344]">
              Art. 299 do Código Penal:
            </span>{" "}
            Omitir, em documento público ou particular, declaração que dele
            devia constar, ou nele inserir ou fazer inserir declaração falsa ou
            diversa da que devia ser escrita, com o fim de prejudicar direito,
            criar obrigação ou alterar a verdade sobre fato juridicamente
            relevante: Pena - reclusão, de um a cinco anos, e multa, se o
            documento é público, e reclusão de um a três anos, e multa, se o
            documento é particular.
          </blockquote>
        </div>

        <Separator className="my-5" />

        <div className="flex items-start gap-3">
          <Checkbox
            id="responsibility-accepted"
            name="responsibilityAccepted"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
            required
            className="mt-0.5"
          />

          <Label
            htmlFor="responsibility-accepted"
            className="cursor-pointer text-sm font-medium leading-relaxed text-[#241344]"
          >
            Li e concordo com os termos de responsabilidade acima.
            <span className="ml-1 text-destructive">*</span>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
