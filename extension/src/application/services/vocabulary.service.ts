import {
  JOB_TITLES_SETTING_ID,
  STACK_TAGS_SETTING_ID,
  type SettingsId,
  type SettingsRepository,
} from "../../storage/repositories/settings.repository";

export class VocabularyService {
  constructor(private readonly settings: SettingsRepository) {}

  listJobTitles(): Promise<string[]> {
    return this.settings.list(JOB_TITLES_SETTING_ID);
  }

  listStackTags(): Promise<string[]> {
    return this.settings.list(STACK_TAGS_SETTING_ID);
  }

  addJobTitle(value: string): Promise<string[]> {
    return this.addSuggestion(JOB_TITLES_SETTING_ID, value);
  }

  addStackTag(value: string): Promise<string[]> {
    return this.addSuggestion(STACK_TAGS_SETTING_ID, value);
  }

  private async addSuggestion(
    id: SettingsId,
    value: string,
  ): Promise<string[]> {
    const trimmed = value.trim();
    const existing = await this.settings.list(id);
    if (!trimmed) {
      return existing;
    }
    if (existing.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      return existing;
    }
    const values = [...existing, trimmed];
    await this.settings.save(id, values);
    return values;
  }
}
