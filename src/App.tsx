import "./App.css";

import { PartnershipInfo } from "./components/PartnershipInfo";
import { PartnershipCarousel } from "./components/PartnershipCarousel";
import { useState } from "react";
import { Toaster } from "./components/ui/sonner";

export type ActionType = "increase" | "decrease";

function App() {
  const [totalCoherence, setTotalCoherence] = useState<number>(0);

  const handleTotalCoherence = (action: ActionType, coherence: number) => {
    if (action == "decrease") {
      setTotalCoherence((prev) => prev - coherence);
    } else {
      setTotalCoherence((prev) => prev + coherence);
    }
  };

  return (
    <main className="space-y-6 py-6">
      {totalCoherence}
      <PartnershipInfo />
      <PartnershipCarousel
        totalCoherence={totalCoherence}
        handleTotalCoherence={handleTotalCoherence}
      />
      <Toaster richColors closeButton position="top-center" />
    </main>
  );
}

export default App;
