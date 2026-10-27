import "./App.css";
import { ApplicantForm } from "./components/ApplicantForm";
import { PartnershipInfo } from "./components/PartnershipInfo";
import { RequestDetails } from "./components/RequestDetails";
import { RequestDocuments } from "./components/RequestDocuments";
import { ResponsibilityTerm } from "./components/ResponsibilityTerm";

function App() {
  return (
    <section className="space-y-4 py-6">
      <PartnershipInfo />
      <ApplicantForm />
      <RequestDetails />
      <RequestDocuments />
      <ResponsibilityTerm />
    </section>
  );
}

export default App;
