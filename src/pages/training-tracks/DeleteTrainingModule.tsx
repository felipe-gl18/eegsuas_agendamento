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

interface DeleteTrainingModuleProps {
  formationId: string;
  module: {
    id: string;
    name: string;
  };
}

export default function DeleteTrainingModule({
  formationId,
  module,
}: DeleteTrainingModuleProps) {
  const [open, setOpen] = useState(false);

  const { deleteModule, isSubmitting, error, clearError } = useFormations();

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
      await deleteModule(formationId, module.id);
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
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label="Excluir módulo"
        title="Excluir módulo"
        onClick={() => handleOpenChange(true)}
      >
        <Trash2Icon className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#514949]">
              Excluir módulo?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Você está prestes a excluir o módulo{" "}
              <span className="font-semibold text-foreground">
                {module.name}
              </span>
              . Todas as sessões (datas e horários) deste módulo também serão
              excluídas. Esta ação não pode ser desfeita.
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
