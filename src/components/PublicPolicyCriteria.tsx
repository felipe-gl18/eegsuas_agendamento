import { Scale } from "lucide-react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import type { ActionType } from "../App";

const criteria = [
  {
    id: "directRelatedProposal",
    label: "Relação direta com a política pública",
  },
  {
    id: "beneficiaryService",
    label: "Benefício para o serviço socioassistencial",
  },
  {
    id: "targetAudience",
    label: "Coerência com o público atendido",
  },
  {
    id: "normativeBasis",
    label: "Fundamentação normativa",
  },
];

export function PublicPolicyCriteria({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
  const [checkedCriteria, setCheckedCriteria] = useState<
    Record<string, boolean>
  >({});
  const [policy, setPolicy] = useState("");

  const handlePolicy = (policy: string | undefined | null) => {
    if (policy) {
      setPolicy(policy);
      handleTotalCoherence("increase", 5);
    }
  };

  function toggleCriterion(id: string, checked: boolean) {
    if (!checked) {
      handleTotalCoherence("decrease", 5);
    } else {
      handleTotalCoherence("increase", 5);
    }
    setCheckedCriteria((previous) => ({
      ...previous,
      [id]: checked,
    }));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <Scale className="size-4 text-[#6c3eb8]" />
        <h3 className="text-sm font-semibold">
          1. Alinhamento à política pública
        </h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publicPolicy">Política pública relacionada *</Label>
        <Select value={policy} onValueChange={handlePolicy}>
          <SelectTrigger id="publicPolicy" className="w-full">
            <SelectValue placeholder="Selecione a política pública" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="assistencia-social">
              Assistência Social
            </SelectItem>
            <SelectItem value="direitos-humanos">Direitos Humanos</SelectItem>
            <SelectItem value="prevencao-violencia">
              Prevenção à Violência
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="flex items-start gap-3 rounded-md border p-3"
          >
            <Checkbox
              id={criterion.id}
              checked={!!checkedCriteria[criterion.id]}
              onCheckedChange={(checked) =>
                toggleCriterion(criterion.id, checked === true)
              }
            />
            <Label
              htmlFor={criterion.id}
              className="cursor-pointer font-normal leading-relaxed"
            >
              {criterion.label}
            </Label>
          </div>
        ))}
      </div>
    </section>
  );
}
