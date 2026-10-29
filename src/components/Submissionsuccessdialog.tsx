import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { CheckCircle2, Mail, SearchCheck } from "lucide-react";

interface SubmissionSuccessDialogProps {
  open: boolean;
  /** E-mail informado pelo solicitante, para onde o link de acompanhamento será enviado. */
  email?: string;
  onOpenChange?: (open: boolean) => void;
}

export function SubmissionSuccessDialog({
  open,
  email,
  onOpenChange,
}: SubmissionSuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-[520px]">
        <div className="flex justify-center bg-emerald-50 px-6 py-6 dark:bg-emerald-950/30">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle2 className="size-8 text-emerald-700 dark:text-emerald-400" />
          </div>
        </div>

        <div className="space-y-4 px-6 py-6">
          <AlertDialogHeader className="space-y-2 text-center sm:text-center">
            <AlertDialogTitle className="text-xl font-semibold">
              Solicitação enviada com sucesso!
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-relaxed">
              Agradecemos seu interesse em apresentar uma proposta à SEDHAS de
              Sobral. Recebemos a sua solicitação e ela já está em análise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="size-4 text-[#6c3eb8]" />
              Confira o seu e-mail
            </div>

            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Enviamos uma mensagem de confirmação para
            </p>

            {email ? (
              <p className="mt-1 break-all text-center text-sm font-semibold text-[#6c3eb8]">
                {email}
              </p>
            ) : (
              <p className="mt-1 text-sm font-semibold text-[#6c3eb8]">
                o e-mail informado na solicitação.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SearchCheck className="size-4 text-[#6c3eb8]" />
              Acompanhe a análise
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              No e-mail você encontra o link para acompanhar o andamento da
              análise da sua solicitação. Caso não encontre a mensagem,
              verifique também a caixa de spam ou lixo eletrônico.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2 border-t bg-muted/20 px-6 py-6 sm:flex-col">
          <Button
            className="w-full bg-[#6c3eb8] hover:bg-[#59319b]"
            onClick={() => onOpenChange?.(false)}
          >
            Entendi
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
