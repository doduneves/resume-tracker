import { ApplicationService } from "./application/services/application.service";
import { VocabularyService } from "./application/services/vocabulary.service";
import { openDatabase } from "./storage/db";
import { ApplicationRepository } from "./storage/repositories/application.repository";
import { SettingsRepository } from "./storage/repositories/settings.repository";

export async function createTrackerServices(): Promise<{
  applications: ApplicationService;
  vocabulary: VocabularyService;
}> {
  const db = await openDatabase();
  return {
    applications: new ApplicationService(new ApplicationRepository(db)),
    vocabulary: new VocabularyService(new SettingsRepository(db)),
  };
}
