import {
  ClipboardCheck,
  FileText,
  GraduationCap,
  Handshake,
  MapPin,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useState } from "react";
import type { ActionType } from "../App";
import { Checkbox } from "./ui/checkbox";

type Modality = "estagio" | "extensao" | "pesquisa" | "visita_tecnica";

const internshipCriteria = [
  {
    id: "courseCompatibility",
    label: "Compatibilidade entre o curso e a unidade",
  },
  {
    id: "supervisor",
    label: "Existência de supervisor responsável",
  },
  {
    id: "activityPlan",
    label: "Plano de atividades definido",
  },
  {
    id: "expectedCompetencies",
    label: "Competências previstas para o estudante",
  },
  {
    id: "workload",
    label: "Carga horária compatível com a unidade",
  },
  {
    id: "studentCapacity",
    label: "Número de estudantes compatível com a capacidade da unidade",
  },
];

const extensionCriteria = [
  {
    id: "communityParticipation",
    label: "Participação efetiva da comunidade",
  },
  {
    id: "teachingServiceIntegration",
    label: "Integração entre ensino e serviço",
  },
  {
    id: "socialImpact",
    label: "Potencial de impacto social",
  },
  {
    id: "participatoryMethodology",
    label: "Metodologia participativa",
  },
  {
    id: "educationalProduct",
    label: "Previsão de produto ou material educativo",
  },
  {
    id: "actionSustainability",
    label: "Sustentabilidade da ação após sua execução",
  },
];

const searchCriteria = [
  { id: "institutionalRelevance", label: "Relevância institucional" },
  { id: "resultsApplicability", label: "Aplicabilidade dos resultados" },
  { id: "ethicalApproval", label: "Aprovação ética (quando necessária)" },
  { id: "feedbackPlan", label: "Devolutiva prevista" },
  { id: "expectedProduct", label: "Produto esperado" },
  { id: "resultsSharing", label: "Compartilhamento dos resultados" },
];

const technicalVisitCriteria = [
  { id: "educationalObjectives", label: "Objetivos educacionais definidos" },
  { id: "adequateParticipants", label: "Número adequado de participantes" },
  {
    id: "unitRoutineCompatibility",
    label: "Compatibilidade com a rotina da unidade",
  },
  { id: "visitPlan", label: "Plano de visita" },
  { id: "facultySupervisor", label: "Responsável docente" },
  { id: "schedule", label: "Cronograma" },
];

export function ModalityCoherence({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
  const [modality, setModality] = useState<Modality | "">("");
  const [checkedCriteria, setCheckedCriteria] = useState<
    Record<string, boolean>
  >({});

  const criteria =
    modality === "estagio"
      ? internshipCriteria
      : modality === "extensao"
        ? extensionCriteria
        : modality === "pesquisa"
          ? searchCriteria
          : modality === "visita_tecnica"
            ? technicalVisitCriteria
            : [];

  const handleModality = (value: Modality) => {
    setModality(value);

    const checkedCriteriaAmount =
      Object.values(checkedCriteria).filter(Boolean).length;
    const amountToBeDecreased = checkedCriteriaAmount * 2.5;
    handleTotalCoherence("decrease", amountToBeDecreased);

    setCheckedCriteria({});
  };

  const toggleCriterion = (id: string, checked: boolean) => {
    if (!checked) {
      handleTotalCoherence("decrease", 2.5);
    } else {
      handleTotalCoherence("increase", 2.5);
    }
    setCheckedCriteria((previous) => ({
      ...previous,
      [id]: checked,
    }));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <ClipboardCheck className="size-4 text-[#6c3eb8]" />
        <h3 className="text-sm font-semibold">3. Modalidade da proposta</h3>
      </div>

      <RadioGroup
        value={modality}
        onValueChange={handleModality}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Label
          htmlFor="modality-internship"
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
            modality === "estagio"
              ? "border-[#6c3eb8] bg-[#f8f5fd]"
              : "border-border"
          }`}
        >
          <RadioGroupItem
            value="estagio"
            id="modality-internship"
            className="mt-1"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <GraduationCap className="size-4 text-[#6c3eb8]" />
              Estágio
            </div>
            <p className="text-sm font-normal text-muted-foreground">
              Avaliação da compatibilidade acadêmica e da capacidade de
              supervisão da unidade.
            </p>
          </div>
        </Label>

        <Label
          htmlFor="modality-extension"
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
            modality === "extensao"
              ? "border-[#6c3eb8] bg-[#f8f5fd]"
              : "border-border"
          }`}
        >
          <RadioGroupItem
            value="extensao"
            id="modality-extension"
            className="mt-1"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <Handshake className="size-4 text-[#6c3eb8]" />
              Extensão
            </div>
            <p className="text-sm font-normal text-muted-foreground">
              Avaliação da participação comunitária e do impacto social da
              proposta.
            </p>
          </div>
        </Label>

        {/* Pesquisa */}
        <Label
          htmlFor="modality-pesquisa"
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
            modality === "pesquisa"
              ? "border-[#6c3eb8] bg-[#f8f5fd]"
              : "border-border"
          }`}
        >
          <RadioGroupItem
            value="pesquisa"
            id="modality-pesquisa"
            className="mt-1"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <FileText className="size-4 text-[#6c3eb8]" />
              Pesquisa
            </div>
            <p className="text-sm font-normal text-muted-foreground">
              Avaliação da relevância institucional, da aplicabilidade dos
              resultados, da aprovação ética e da devolutiva para a instituição.
            </p>
          </div>
        </Label>

        {/* Visita técnica */}
        <Label
          htmlFor="modality-visita-tecnica"
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
            modality === "visita_tecnica"
              ? "border-[#6c3eb8] bg-[#f8f5fd]"
              : "border-border"
          }`}
        >
          <RadioGroupItem
            value="visita_tecnica"
            id="modality-visita-tecnica"
            className="mt-1"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4 text-[#6c3eb8]" />
              Visita técnica
            </div>
            <p className="text-sm font-normal text-muted-foreground">
              Avaliação dos objetivos educacionais, do planejamento da visita,
              da compatibilidade com a rotina da unidade e da supervisão
              docente.
            </p>
          </div>
        </Label>
      </RadioGroup>
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
