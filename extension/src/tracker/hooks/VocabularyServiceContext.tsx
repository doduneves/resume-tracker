import { createContext, useContext } from "react";
import type { VocabularyService } from "../../application/services/vocabulary.service";

const VocabularyServiceContext = createContext<VocabularyService | null>(null);

export const VocabularyServiceProvider = VocabularyServiceContext.Provider;

export function useVocabularyService(): VocabularyService {
  const service = useContext(VocabularyServiceContext);
  if (!service) {
    throw new Error("VocabularyService is not provided");
  }
  return service;
}
