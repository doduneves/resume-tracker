import { ApplicationService } from "./application/services/application.service";
import { openDatabase } from "./storage/db";
import { ApplicationRepository } from "./storage/repositories/application.repository";

export async function createApplicationService(): Promise<ApplicationService> {
  const db = await openDatabase();
  return new ApplicationService(new ApplicationRepository(db));
}
