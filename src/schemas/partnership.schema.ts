import { z } from "zod";
import { applicantSchema } from "./applicant.schema";
import { requestDetailsSchema } from "./request-details.schema";
import { requestDocumentsSchema } from "./request-documents.schema";

export const partnershipSchema = applicantSchema
  .extend(requestDetailsSchema.shape)
  .extend(requestDocumentsSchema.shape);

export type PartnershipFormValues = z.infer<
  typeof partnershipSchema
>;