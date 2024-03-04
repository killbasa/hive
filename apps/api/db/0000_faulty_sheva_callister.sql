DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('none', 'new', 'live', 'upcoming', 'past');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"photo" text NOT NULL,
	"custom_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"status" "status" NOT NULL
);
