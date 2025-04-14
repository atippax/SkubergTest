import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./data/db.sqlite",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/**/*.entity.ts"],
});
