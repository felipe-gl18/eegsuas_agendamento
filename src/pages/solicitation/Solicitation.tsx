import { useState } from "react";
import { PartnershipInfo } from "../../components/PartnershipInfo";
import { Toaster } from "../../components/ui/sonner";
import PartnershipCarousel from "../../components/PartnershipCarousel";

export type ActionType = "increase" | "decrease";

export default function Solicitation() {
  const [totalCoherence, setTotalCoherence] = useState<number>(0);

  const handleTotalCoherence = (action: ActionType, coherence: number) => {
    if (action == "decrease") {
      setTotalCoherence((prev) => prev - coherence);
    } else {
      setTotalCoherence((prev) => prev + coherence);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <PartnershipInfo />
      <PartnershipCarousel
        totalCoherence={totalCoherence}
        handleTotalCoherence={handleTotalCoherence}
      />
      <Toaster richColors closeButton position="top-center" />
    </main>
  );
}
