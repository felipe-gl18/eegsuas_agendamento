import { useState } from "react";
import { AlertCircleIcon, Loader2Icon, Trash2Icon } from "lucide-react";

import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { useSchedule } from "../../contexts/schedule/useSchedule";

interface DeleteTrainingSessionProps {
  id: string;
  /** Nome do módulo, exibido na pergunta de confirmação. */
  name: string;
  /** Horário já formatado, ex.: "qua, 19/11 · 08:00 às 08:30". */
  period?: string;
  /** Chamado depois que a exclusão der certo (ex.: fechar o modal de detalhes). */
  onDeleted?: () => void;
}

export default function DeleteTrainingSession({
  id,
  name,
  period,
  onDeleted,
}: DeleteTrainingSessionProps) {
  const [open, setOpen] = useState(false);

  const { deleteSession, isSubmitting, error, clearError } = useSchedule();

  function handleOpenChange(value: boolean) {
    // Não deixa fechar enquanto a exclusão está em andamento.
    if (isSubmitting) return;

    setOpen(value);

    if (value) {
      clearError();
    }
  }

  async function handleConfirm() {
    try {
      await deleteSession(id);
      setOpen(false);
      onDeleted?.();
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        aria-label="Excluir agendamento"
        onClick={(event) => {
          // Evita disparar o clique do bloco/slot que está por baixo.
          event.stopPropagation();
          handleOpenChange(true);
        }}
      >
        <Trash2Icon className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        {/* Eventos de portais sobem pela árvore do React, então o stopPropagation
            aqui impede que cliques no diálogo cheguem ao slot do calendário. */}
        <AlertDialogContent onClick={(event) => event.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#514949]">
              Excluir agendamento?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Você está prestes a excluir o agendamento do módulo{" "}
              <span className="font-semibold text-foreground">{name}</span>
              {period ? (
                <>
                  {" "}
                  (
                  <span className="font-semibold text-foreground">
                    {period}
                  </span>
                  )
                </>
              ) : null}
              . As presenças registradas nesta sessão também serão apagadas.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>

            {/* O preventDefault impede o diálogo de fechar sozinho: ele só fecha
                depois que a exclusão der certo. Se falhar, o erro aparece aqui. */}
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isSubmitting}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
