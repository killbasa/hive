DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('none', 'new', 'live', 'upcoming', 'past');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"channel_id" text,
	"title" varchar(256),
	"thumbnail" varchar(256),
	"status" "status"
);
