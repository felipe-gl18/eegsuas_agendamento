import { useEffect, useRef, useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";

import { Button } from "./ui/button";

import { ApplicantForm } from "./ApplicantForm";
import { RequestDetails } from "./RequestDetails";
import { RequestDocuments } from "./RequestDocuments";
import { InstitutionalCoherence } from "./InstitutionalCoherence";
import { LowCoherenceDialog } from "./LowCoherenceDialog";

import type { ActionType } from "../App";
import { ResponsibilityTerm } from "./ResponsibilityTerm";
import {
  partnershipSchema,
  type PartnershipFormValues,
} from "../schemas/partnership.schema";
import { applicantSchema } from "../schemas/applicant.schema";
import { requestDetailsSchema } from "../schemas/request-details.schema";
import { requestDocumentsSchema } from "../schemas/request-documents.schema";
import { SubmissionSuccessDialog } from "./Submissionsuccessdialog";

const MINIMUM_SCORE = 75;
const SEDHAS_EMAIL = "sedhas@sobral.ce.gov.br";

type FieldName = FieldPath<PartnershipFormValues>;

type StepComponentProps = {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
};

type Step = {
  title: string;
  description: string;
  component: ComponentType<StepComponentProps>;
  fields?: FieldName[]; // opcional: etapas sem campos para validar
};

const steps: Step[] = [
  {
    title: "Coerência institucional",
    description: "Alinhamento institucional e critérios de avaliação.",
    component: InstitutionalCoherence,
    // sem fields: não há o que validar
  },
  {
    title: "Dados do solicitante",
    description: "Identificação do responsável pela solicitação.",
    component: ApplicantForm,
    fields: Object.keys(applicantSchema.shape) as FieldName[],
  },
  {
    title: "Dados da solicitação",
    description: "Detalhes da atividade ou parceria.",
    component: RequestDetails,
    fields: Object.keys(requestDetailsSchema.shape) as FieldName[],
  },
  {
    title: "Documentação",
    description: "Documentos necessários para a solicitação.",
    component: RequestDocuments,
    fields: Object.keys(requestDocumentsSchema.shape) as FieldName[],
  },
  {
    title: "Termo de Responsabilidade",
    description:
      "Necessário para confirmar o seu conhecimento e entendimento sobre os termos",
    component: ResponsibilityTerm,
  },
];

export function PartnershipCarousel({
  handleTotalCoherence,
  totalCoherence,
}: {
  handleTotalCoherence: (action: ActionType, coherence: number) => void;
  totalCoherence: number;
}) {
  const form = useForm<
    z.input<typeof partnershipSchema>,
    unknown,
    z.output<typeof partnershipSchema>
  >({
    resolver: zodResolver(partnershipSchema),
  });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showLowCoherence, setShowLowCoherence] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>();
  const [showSuccess, setShowSuccess] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit(
    async (data) => {
      setSubmittedEmail(data.email);
      setShowSuccess(true);
    },
    (errors) => {
      const stepWithError = steps.findIndex((step) =>
        step.fields?.some((field) => field in errors),
      );

      if (stepWithError !== -1) api?.scrollTo(stepWithError);
    },
  );

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const updateHeight = () => {
      setContentHeight(element.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [current]);

  function handleApiChange(carouselApi: CarouselApi | undefined) {
    if (!carouselApi) return;

    setApi(carouselApi);
    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }

  async function handleNextStep() {
    // Validate coherence before leaving the first step.
    if (current === 0 && totalCoherence < MINIMUM_SCORE) {
      setShowLowCoherence(true);
      return;
    }

    // Validate the fields of the current step (steps without `fields` are skipped).
    const fields = steps[current].fields;

    if (fields) {
      setIsValidating(true);
      try {
        const isStepValid = await trigger(fields, { shouldFocus: true });
        if (!isStepValid) return; // stays on the step and shows the errors
      } finally {
        setIsValidating(false);
      }
    }

    api?.scrollNext();
  }
  const isFirstStep = current === 0;
  const isLastStep = current === steps.length - 1;
  const CurrentStep = steps[current].component;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="w-full space-y-6">
          {/* Step indicators */}
          <div className="mx-auto w-full max-w-4xl px-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Etapa {current + 1} de {steps.length}
                </p>
                <h2 className="text-lg font-semibold">
                  {steps[current].title}
                </h2>
              </div>

              <span className="text-sm text-muted-foreground">
                {Math.round(((current + 1) / steps.length) * 100)}%
              </span>
            </div>

            <div className="flex gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => {
                    // Prevent bypassing the coherence validation.
                    if (current === 0 && index > 0) {
                      if (totalCoherence < MINIMUM_SCORE) {
                        setShowLowCoherence(true);
                        return;
                      }
                    }

                    api?.scrollTo(index);
                  }}
                  aria-label={`Ir para etapa ${index + 1}: ${step.title}`}
                  aria-current={current === index ? "step" : undefined}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= current ? "bg-[#6c3eb8]" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {steps[current].description}
            </p>
          </div>

          {/* Carousel */}
          <Carousel
            setApi={handleApiChange}
            opts={{
              align: "start",
              loop: false,
              watchDrag: false,
            }}
            className="w-full"
          >
            <CarouselContent
              style={{
                height: contentHeight ? `${contentHeight}px` : "auto",
                transition: "height 200ms ease",
              }}
            >
              {steps.map((step, index) => {
                const StepComponent = step.component;

                return (
                  <CarouselItem key={step.title}>
                    <div
                      ref={current === index ? contentRef : null}
                      className="px-1"
                    >
                      <StepComponent
                        handleTotalCoherence={handleTotalCoherence}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Navigation */}
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => api?.scrollPrev()}
              disabled={isFirstStep}
            >
              <ChevronLeft className="mr-2 size-4" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button
                type="submit"
                className="bg-[#6c3eb8] text-white hover:bg-[#583096]"
              >
                <Check />
                Concluir
                <ChevronRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isValidating}
                onClick={handleNextStep}
                className="bg-[#6c3eb8] text-white hover:bg-[#583096]"
              >
                Próxima etapa
                <ChevronRight className="ml-2 size-4" />
              </Button>
            )}
          </div>

          {/* Low coherence dialog */}
          <LowCoherenceDialog
            open={showLowCoherence}
            onOpenChange={setShowLowCoherence}
            score={totalCoherence}
            contactEmail={SEDHAS_EMAIL}
          />

          {/* Success diolog */}
          <SubmissionSuccessDialog
            open={showSuccess}
            email={submittedEmail}
            onOpenChange={(open) => {
              setShowSuccess(open);
              if (!open) {
                form.reset(); // limpa o formulário
                api?.scrollTo(0); // volta para a primeira etapa
              }
            }}
          />
        </div>
      </form>
    </FormProvider>
  );
}
