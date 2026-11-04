import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import type { ActionType } from "../App";
import type { PublicPolicy } from "./InstitutionalCoherence";

type Organization = {
  name: string;
  policy: PublicPolicy;
};

const organizacoesSEDHAS: Organization[] = [
  { name: "Sede da SEDHAS", policy: "assistencia-social" },
  { name: "Casa do Cidadão / Cadastro Único", policy: "assistencia-social" },
  { name: "CRAS Mimi Marinho", policy: "assistencia-social" },
  { name: "CRAS Dom José", policy: "assistencia-social" },
  { name: "CRAS Irmã Oswalda", policy: "assistencia-social" },
  { name: "CRAS Regina Justa Feijão", policy: "assistencia-social" },
  { name: "CRAS Aracatiaçu", policy: "assistencia-social" },
  { name: "CRAS Jaibaras", policy: "assistencia-social" },
  { name: "CREAS Manoel Vieira Linhares", policy: "assistencia-social" },
  { name: "Centro POP", policy: "assistencia-social" },
  { name: "Pousada Social", policy: "assistencia-social" },
  {
    name: "Centro Dia do Idoso Rosa Maria Rodrigues",
    policy: "assistencia-social",
  },
  { name: "Escritório Social de Sobral", policy: "assistencia-social" },
  {
    name: "Acolhimento Institucional para Crianças e Adolescentes",
    policy: "assistencia-social",
  },
  {
    name: "Acolhimento Institucional para Pessoas em Situação de Rua",
    policy: "assistencia-social",
  },
  { name: "Almoxarifado da SEDHAS", policy: "assistencia-social" },

  { name: "Casa Bom Samaritano", policy: "assistencia-social" },
  {
    name: "Comunidade Católica Shalom — Casa São Francisco",
    policy: "assistencia-social",
  },
  {
    name: "Obra Social Nossa Senhora da Glória — Fazenda da Esperança",
    policy: "assistencia-social",
  },
  { name: "APAE Sobral", policy: "assistencia-social" },
  { name: "SESC", policy: "assistencia-social" },
  {
    name: "Sociedade de Apoio à Família Sobralense (SAFS)",
    policy: "assistencia-social",
  },
  {
    name: "Instituto Trevo de Quatro Folhas / Casa Acolhedora",
    policy: "assistencia-social",
  },
  { name: "Instituto Teias da Juventude", policy: "assistencia-social" },
  { name: "Cáritas Diocesana de Sobral", policy: "assistencia-social" },
  { name: "Associação Mãos que Acolhem", policy: "assistencia-social" },
  {
    name: "Instituto Despertar da Cidadania",
    policy: "assistencia-social",
  },
  {
    name: "Sindicato dos Trabalhadores Rurais de Sobral",
    policy: "assistencia-social",
  },
  {
    name: "Santa Casa de Misericórdia de Sobral",
    policy: "assistencia-social",
  },
  {
    name: "Associação Comunitária J. Misquita dos Moradores de Vassouras",
    policy: "assistencia-social",
  },
  {
    name: "Igreja de Cristo Sinhá Sabóia",
    policy: "assistencia-social",
  },
];

type Props = {
  policy: PublicPolicy;
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
};

export function ServiceCoherence({ policy, handleTotalCoherence }: Props) {
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  // Guarda a pontuação aplicada para evitar duplicações.
  const previousScore = useRef(0);

  const organization = organizacoesSEDHAS.find(
    (item) => item.name === selectedOrganization,
  );

  const coherence = organization?.policy === policy ? 30 : 0;

  useEffect(() => {
    const difference = coherence - previousScore.current;

    if (difference > 0) {
      handleTotalCoherence("increase" as ActionType, difference);
    } else if (difference < 0) {
      handleTotalCoherence("decrease" as ActionType, Math.abs(difference));
    }

    previousScore.current = coherence;
  }, [coherence, handleTotalCoherence]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <Building2 className="size-4 text-[#6c3eb8]" />
        <h3 className="text-sm font-semibold">
          2. Serviço ou unidade envolvida
        </h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceUnit">Serviço/unidade *</Label>

        <Select
          value={selectedOrganization}
          onValueChange={(value) => value && setSelectedOrganization(value)}
        >
          <SelectTrigger id="serviceUnit" className="w-full">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>

          <SelectContent>
            {organizacoesSEDHAS.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
