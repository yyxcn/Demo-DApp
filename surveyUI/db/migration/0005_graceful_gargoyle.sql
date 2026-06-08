CREATE TABLE "live_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "live_survey_created_at_unique" UNIQUE("created_at")
);
