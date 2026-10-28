import "./App.css";

import { PartnershipInfo } from "./components/PartnershipInfo";
import { PartnershipCarousel } from "./components/PartnershipCarousel";
import { useState } from "react";

export type ActionType = "increase" | "decrease";

function App() {
  const [totalCoherence, setTotalCoherence] = useState<number>(75);

  const handleTotalCoherence = (action: ActionType, coherence: number) => {
    if (action == "decrease") {
      setTotalCoherence((prev) => prev - coherence);
    } else {
      setTotalCoherence((prev) => prev + coherence);
    }
  };

  return (
    <main className="space-y-6 py-6">
      <PartnershipInfo />
      <PartnershipCarousel
        totalCoherence={totalCoherence}
        handleTotalCoherence={handleTotalCoherence}
      />
    </main>
  );
}

export default App;
