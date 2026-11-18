import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useState } from "react";
import { useFormations } from "../../contexts/formations/useFormations";
import type { FormationFormData } from "../../schemas/formation.schema";
import { Pencil } from "lucide-react";
import TrainingTrackForm from "./TrainingTrackForm";

export default function UpdateTrainingTrack({
  formation,
}: {
  formation: FormationFormData & { id: string };
}) {
  const [open, setOpen] = useState(false);
  const { updateFormation, isSubmitting, error, clearError } = useFormations();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) clearError();
  }

  async function handleSubmit(data: FormationFormData) {
    try {
      await updateFormation(formation.id, data);
      setOpen(false);
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <>
      <Button
        type="button"
        aria-label="Editar formação"
        className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
        onClick={() => handleOpenChange(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#514949]">
              Editar formação
            </DialogTitle>
            <DialogDescription>
              Altere os dados abaixo para atualizar a formação.
            </DialogDescription>
          </DialogHeader>

          {open && (
            <TrainingTrackForm
              defaultValues={{
                name: formation.name,
                description: formation.description,
                workloadHours: formation.workloadHours,
              }}
              isSubmitting={isSubmitting}
              error={error}
              submitLabel="Salvar alterações"
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
