import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useFormations } from "../../contexts/formations/useFormations";
import type { TrainingModuleFormData } from "../../schemas/training-module.schema";
import ModuleForm from "./TrainingModuleForm";

interface UpdateTrainingModuleProps {
  formationId: string;
  module: {
    id: string;
    name: string;
    description?: string | null;
    order: number;
  };
}

export default function UpdateTrainingModule({
  module,
}: UpdateTrainingModuleProps) {
  const [open, setOpen] = useState(false);

  const { updateModule, isSubmitting, error, clearError } = useFormations();

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (value) {
      clearError();
    }
  }

  async function handleSubmit(data: TrainingModuleFormData) {
    try {
      await updateModule(module.id, data);
      setOpen(false);
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Editar módulo"
        className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
        title="Editar módulo"
        onClick={() => handleOpenChange(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#514949]">
              Editar módulo
            </DialogTitle>

            <DialogDescription>
              Altere os dados abaixo para atualizar o módulo.
            </DialogDescription>
          </DialogHeader>

          {open && (
            <ModuleForm
              defaultValues={{
                name: module.name,
                description: module.description ?? "",
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
