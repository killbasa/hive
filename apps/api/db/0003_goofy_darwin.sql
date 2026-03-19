CREATE TABLE `apikeys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`expires` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apikeys_name_unique` ON `apikeys` (`name`);--> statement-breakpoint
CREATE INDEX `apikey_idx` ON `apikeys` (`id`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `api_key`;