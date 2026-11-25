import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { useFormations } from "../../contexts/formations/useFormations";

import ModuleForm from "./TrainingModuleForm";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import type { TrainingModuleFormData } from "../../schemas/training-module.schema";

interface AddTrainingModuleProps {
  formationId: string;
  nextOrder?: number;
}

export default function AddTrainingModule({
  formationId,
}: AddTrainingModuleProps) {
  const [open, setOpen] = useState(false);

  const { createModule, isSubmitting, error, clearError } = useFormations();

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (value) {
      clearError();
    }
  }

  async function handleSubmit(data: TrainingModuleFormData) {
    try {
      await createModule(formationId, data);
      setOpen(false);
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
          <PlusIcon className="mr-2 size-4" />
          Novo módulo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#514949]">
            Novo módulo
          </DialogTitle>

          <DialogDescription>
            Preencha os dados abaixo para adicionar um novo módulo à formação.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ModuleForm
            defaultValues={{
              name: "",
              description: "",
            }}
            isSubmitting={isSubmitting}
            error={error}
            submitLabel="Cadastrar módulo"
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
