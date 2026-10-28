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

export function ServiceCoherence({
  handleTotalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
}) {
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
        <Select>
          <SelectTrigger id="serviceUnit" className="w-full">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="centro-pop">Centro POP</SelectItem>
            <SelectItem value="cras">CRAS</SelectItem>
            <SelectItem value="centro-dia">Centro Dia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
