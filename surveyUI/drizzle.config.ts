import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migration", // SQL 쿼리가 저장될 디렉터리
  schema: "./app/features/*/schema.ts",
  dialect: "postgresql", // 사용할 SQL 타입
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
