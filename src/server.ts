import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import app from "./modules/app";
import { createConnection } from "typeorm";

const PORT = process.env.PORT || 4000;

(async () => {
  // connection code
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["*/**/*.entity.ts"],
    synchronize: true,
    logging: false,
  });

  app.listen(PORT, () => {
    console.log(`App started, linsten on port '${PORT}'`);
  });
})();
