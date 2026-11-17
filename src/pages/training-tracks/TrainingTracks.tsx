import AddTrainingTrack from "./AddTrainingTrack";
import TrainingTracksList from "./TrainingTracksList";

export default function TrainingTracks() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#514949]">
            Formações
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as formações, suas cargas horárias e conteúdos
            programáticos.
          </p>
        </div>

        <AddTrainingTrack />
      </div>

      {/* Listagem */}
      <TrainingTracksList />
    </div>
  );
}
