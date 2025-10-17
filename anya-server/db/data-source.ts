import "reflect-metadata";
import { DataSource } from "typeorm";
import { Leaderboard } from "./models/Leaderboard";
import { User } from "./models/Users";

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "mysecretpassword",
    database: process.env.POSTGRES_DATABASE || "mydb",
    synchronize: true, // Set to false in production and use migrations
    logging: false,
    migrations: ["migration/**/*.ts"],
    entities: [User , Leaderboard],
    subscribers: ["src/subscriber/**/*.ts"],
});


(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();