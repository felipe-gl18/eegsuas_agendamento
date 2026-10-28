import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
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
import { partnershipSchema } from "../schemas/partnership.schema";

const MINIMUM_SCORE = 75;
const SEDHAS_EMAIL = "sedhas@sobral.ce.gov.br";

const steps = [
  {
    title: "Coerência institucional",
    description: "Alinhamento institucional e critérios de avaliação.",
    component: InstitutionalCoherence,
  },
  {
    title: "Documentação",
    description: "Documentos necessários para a solicitação.",
    component: RequestDocuments,
  },
  {
    title: "Dados do solicitante",
    description: "Identificação do responsável pela solicitação.",
    component: ApplicantForm,
  },
  {
    title: "Dados da solicitação",
    description: "Detalhes da atividade ou parceria.",
    component: RequestDetails,
  },
  {
    title: "Termo de Responsabilidade",
    description:
      "Necessário para confirma o seu conhecimento e entendimento sobre os termos",
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
  const [showLowCoherence, setShowLowCoherence] = useState(false);

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
    (data) => {
      console.log("Dados válidos:", data);
    },
    (errors) => {
      for (const [field, error] of Object.entries(errors)) {
        console.log("Campo:", field);
        console.log("Erro:", error?.message);
      }
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

  function handleNextStep() {
    // Validate coherence before leaving the first step.
    if (current === 0 && totalCoherence < MINIMUM_SCORE) {
      setShowLowCoherence(true);
      return;
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
        </div>
      </form>
    </FormProvider>
  );
}
