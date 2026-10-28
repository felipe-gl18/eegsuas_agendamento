import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Mail, MessageCircle } from "lucide-react";

interface LowCoherenceDialogProps {
  open: boolean;
  score: number;
  onOpenChange?: (open: boolean) => void;
  contactEmail: string;
}

export function LowCoherenceDialog({
  open,
  score,
  onOpenChange,
  contactEmail,
}: LowCoherenceDialogProps) {
  function handleContact() {
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      "Esclarecimentos sobre proposta de projeto - SEDHAS Sobral",
    )}`;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden min-w-[580px] p-0 sm:max-w-[480px]">
        <div className="flex justify-center bg-amber-50 px-6 py-6 dark:bg-amber-950/30">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="size-8 text-amber-700 dark:text-amber-400" />
          </div>
        </div>

        <div className="space-y-4 px-6 py-6">
          <AlertDialogHeader className="space-y-2 text-center sm:text-center">
            <AlertDialogTitle className="text-xl font-semibold">
              Precisamos conversar sobre sua proposta
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-relaxed">
              Agradecemos seu interesse em apresentar uma proposta à SEDHAS de
              Sobral.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm leading-relaxed text-foreground">
              Neste momento, a pontuação de coerência da sua proposta é de{" "}
              <span className="font-semibold">{score} pontos</span>, abaixo do
              mínimo de 75 pontos necessário para avançar nesta etapa.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Com base nos critérios avaliados, a proposta ainda não demonstrou
              alinhamento suficiente com as políticas públicas, os serviços e as
              atividades promovidas pela Secretaria dos Direitos Humanos e da
              Assistência Social (SEDHAS) de Sobral.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="size-4 text-[#6c3eb8]" />
              Deseja discutir sua proposta?
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Caso deseje esclarecer dúvidas ou discutir a pertinência da
              proposta, entre em contato com a SEDHAS pelo e-mail institucional
              abaixo.
            </p>

            <p className="break-all text-center text-sm font-medium text-[#6c3eb8]">
              {contactEmail}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2 border-t bg-muted/20 px-6 py-6 sm:flex-col">
          <Button
            onClick={handleContact}
            className="w-full bg-[#6c3eb8] hover:bg-[#59319b]"
          >
            <Mail className="mr-2 size-4" />
            Entrar em contato por e-mail
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange?.(false)}
          >
            Entendi
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
