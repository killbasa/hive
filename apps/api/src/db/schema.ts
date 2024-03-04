import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

/**
 * Channels
 */
export const channels = pgTable('channels', {
	id: text('id').primaryKey(),
	customUrl: text('custom_url').notNull(),
	name: text('name').notNull(),
	photo: text('photo').notNull()
});

export const channelsRelations = relations(channels, ({ many }) => ({
	videos: many(videos)
}));

/**
 * Videos
 */
export const statusEnum = pgEnum('status', ['none', 'new', 'live', 'upcoming', 'past']);

export const videos = pgTable('videos', {
	id: text('id').primaryKey(),
	channelId: text('channel_id').notNull(),
	title: text('title').notNull(),
	thumbnail: text('thumbnail').notNull(),
	status: statusEnum('status').notNull()
});

export const videosRelations = relations(videos, ({ one }) => ({
	channel: one(channels, {
		fields: [videos.channelId],
		references: [channels.id]
	})
}));
