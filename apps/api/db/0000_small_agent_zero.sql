CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`custom_url` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`tags` text NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY NOT NULL,
	`video_id` text NOT NULL,
	`text` text NOT NULL,
	`author` text NOT NULL,
	`author_id` text NOT NULL,
	`timestamp` text NOT NULL,
	`is_uploader` integer NOT NULL,
	`is_favorited` integer NOT NULL,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`channel_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stream_comments` (
	`id` integer PRIMARY KEY NOT NULL,
	`video_id` text NOT NULL,
	`author` text NOT NULL,
	`text` text NOT NULL,
	`timestamp` integer NOT NULL,
	`is_mod` integer NOT NULL,
	`is_verified` integer NOT NULL,
	`is_uploader` integer NOT NULL,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`channel_id` text NOT NULL,
	`playlist_id` text,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`duration` text,
	`file_size` integer,
	`upload_date` text,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`download_status` text NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `channel_idx` ON `channels` (`id`);--> statement-breakpoint
CREATE INDEX `comment_idx` ON `comments` (`id`);--> statement-breakpoint
CREATE INDEX `comment_video_idx` ON `comments` (`video_id`);--> statement-breakpoint
CREATE INDEX `playlist_idx` ON `playlists` (`id`);--> statement-breakpoint
CREATE INDEX `playlist_channel_idx` ON `playlists` (`channel_id`);--> statement-breakpoint
CREATE INDEX `setting_idx` ON `settings` (`id`);--> statement-breakpoint
CREATE INDEX `streamcomment_idx` ON `stream_comments` (`id`);--> statement-breakpoint
CREATE INDEX `streamcomment_video_idx` ON `stream_comments` (`video_id`);--> statement-breakpoint
CREATE INDEX `video_idx` ON `videos` (`id`);--> statement-breakpoint
CREATE INDEX `video_channel_idx` ON `videos` (`channel_id`);--> statement-breakpoint
CREATE INDEX `video_playlist_idx` ON `videos` (`playlist_id`);