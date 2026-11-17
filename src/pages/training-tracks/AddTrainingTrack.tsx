import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { useFormations } from "../../contexts/formations/useFormations";

import FormationForm from "./FormationForm";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import type { FormationFormData } from "../../schemas/formation.schema";

export default function AddTrainingTrack() {
  const [open, setOpen] = useState(false);

  const { createFormation, isSubmitting, error, clearError } = useFormations();

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (value) {
      clearError();
    }
  }

  async function handleSubmit(data: FormationFormData) {
    try {
      await createFormation(data);
      setOpen(false);
    } catch {
      // O contexto já disponibiliza a mensagem de erro.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
          <PlusIcon className="mr-2 size-4" />
          Nova formação
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#514949]">
            Nova formação
          </DialogTitle>

          <DialogDescription>
            Preencha os dados abaixo para cadastrar uma nova formação na
            plataforma.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <FormationForm
            isSubmitting={isSubmitting}
            error={error}
            submitLabel="Cadastrar formação"
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
