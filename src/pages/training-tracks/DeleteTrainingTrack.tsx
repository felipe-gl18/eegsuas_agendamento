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
import { useFormations } from "../../contexts/formations/useFormations";

interface DeleteTrainingTrackProps {
  id: string;
  /** Nome da formação, exibido na pergunta de confirmação. */
  name: string;
}

export default function DeleteTrainingTrack({
  id,
  name,
}: DeleteTrainingTrackProps) {
  const [open, setOpen] = useState(false);

  const { deleteFormation, isSubmitting, error, clearError } = useFormations();

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
      await deleteFormation(id);
      setOpen(false);
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        aria-label="Excluir formação"
        onClick={() => handleOpenChange(true)}
      >
        <Trash2Icon className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#514949]">
              Excluir formação?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Você está prestes a excluir a formação{" "}
              <span className="font-semibold text-foreground">{name}</span>.
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
