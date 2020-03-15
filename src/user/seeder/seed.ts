import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { Seeder } from "./user.seeder";
import { AppModule } from "src/app.module";

async function bootstrap() {
  NestFactory.createApplicationContext(AppModule)
    .then(appContext => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch(error => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
}
bootstrap();