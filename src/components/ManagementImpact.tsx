import { ChartNoAxesCombined } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import type { ActionType } from "../App";

const criteria = [
  { id: "planning", label: "Planejamento" },
  {
    id: "socialAssistanceSurveillance",
    label: "Vigilância socioassistencial",
  },
  { id: "management", label: "Gestão" },
  { id: "monitoring", label: "Monitoramento" },
  { id: "evaluation", label: "Avaliação" },
  {
    id: "serviceQualification",
    label: "Qualificação do atendimento",
  },
  {
    id: "policyFormulation",
    label: "Formulação de políticas",
  },
  {
    id: "workerTraining",
    label: "Capacitação dos trabalhadores",
  },
];

export function ManagementImpactCoherence({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
  const [selectedManagement, setSelectedManagement] = useState<string[]>([]);
  const managementScore = calculateScore(selectedManagement.length);

  function calculateScore(selectedCount: number): number {
    return Math.min(selectedCount, 3) * 5;
  }

  function toggleSelection(
    id: string,
    checked: boolean,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    if (checked) {
      if (selectedManagement.length >= 3) return;
      if (selectedManagement.includes(id)) return;

      handleTotalCoherence("increase", 5);
      setter((previous) => [...previous, id]);
    } else {
      if (!selectedManagement.includes(id)) return;

      handleTotalCoherence("decrease", 5);
      setter((previous) => previous.filter((item) => item !== id));
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <ChartNoAxesCombined className="size-4 text-[#6c3eb8]" />
        <h3 className="text-sm font-semibold">Impacto para a gestão</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Selecione as áreas da gestão impactadas pela proposta.
      </p>

      <div className="space-y-3">
        {criteria.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <Checkbox
              id={`management-${item.id}`}
              checked={selectedManagement.includes(item.id)}
              onCheckedChange={(checked) =>
                toggleSelection(
                  item.id,
                  checked === true,
                  setSelectedManagement,
                )
              }
            />
            <Label
              htmlFor={`management-${item.id}`}
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
