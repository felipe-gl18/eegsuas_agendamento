import { Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PublicPolicyCriteria } from "./PublicPolicyCriteria";
import { ServiceCoherence } from "./ServiceCoherence";
import { ModalityCoherence } from "./ModalityCoherence";
import { PermanentEducationCoherence } from "./PermanentEducationCoherence";
import { ManagementImpactCoherence } from "./ManagementImpact";
import type { ActionType } from "../App";

export function InstitutionalCoherence({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
  return (
    <Card className="mx-auto w-full max-w-4xl border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <Scale className="size-5" />
          </div>

          <div>
            <CardTitle className="text-xl text-[#241344]">
              Coerência institucional
            </CardTitle>
            <CardDescription>
              Avalie o alinhamento da proposta às políticas públicas, aos
              serviços socioassistenciais e aos critérios institucionais.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <PublicPolicyCriteria handleTotalCoherence={handleTotalCoherence} />
        <ServiceCoherence handleTotalCoherence={handleTotalCoherence} />
        <ModalityCoherence handleTotalCoherence={handleTotalCoherence} />
        <PermanentEducationCoherence
          handleTotalCoherence={handleTotalCoherence}
        />
        <ManagementImpactCoherence
          handleTotalCoherence={handleTotalCoherence}
        />
      </CardContent>
    </Card>
  );
}
