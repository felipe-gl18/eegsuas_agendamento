import { BookOpen } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useState } from "react";
import type { ActionType } from "../App";

const criteria = [
  { id: "technicalReport", label: "Relatório técnico" },
  { id: "scientificArticle", label: "Artigo" },
  { id: "workshop", label: "Oficina" },
  { id: "manual", label: "Manual" },
  { id: "workflow", label: "Fluxo" },
  { id: "protocol", label: "Protocolo" },
  { id: "training", label: "Capacitação" },
  { id: "educationalMaterial", label: "Material educativo" },
  { id: "bestPracticesBank", label: "Banco de boas práticas" },
];

export function PermanentEducationCoherence({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);

  function toggleSelection(
    id: string,
    checked: boolean,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    if (checked) {
      if (selectedEducation.length >= 3) return;
      if (selectedEducation.includes(id)) return;

      handleTotalCoherence("increase", 5);
      setter((previous) => [...previous, id]);
    } else {
      if (!selectedEducation.includes(id)) return;

      handleTotalCoherence("decrease", 5);
      setter((previous) => previous.filter((item) => item !== id));
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <BookOpen className="size-4 text-[#6c3eb8]" />
        <h3 className="text-sm font-semibold">Educação permanente</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Selecione os produtos previstos na proposta.
      </p>

      <div className="space-y-3">
        {criteria.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <Checkbox
              id={`education-${item.id}`}
              checked={selectedEducation.includes(item.id)}
              onCheckedChange={(checked) =>
                toggleSelection(item.id, checked === true, setSelectedEducation)
              }
            />
            <Label
              htmlFor={`education-${item.id}`}
              className="cursor-pointer font-normal"
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </section>
  );
}
