import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// #region Channels

export const channels = sqliteTable(
	'channels',
	{
		id: text('id').primaryKey(),
		customUrl: text('custom_url').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		tags: text('tags').notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index('channel_idx').on(table.id), //
	],
);

export const channelsRelations = relations(channels, ({ many }) => ({
	videos: many(videos),
	playlists: many(playlists),
}));

// #endregion
// #region Videos

export const videos = sqliteTable(
	'videos',
	{
		id: text('id').primaryKey(),
		channelId: text('channel_id')
			.references(() => channels.id)
			.notNull(),
		playlistId: text('playlist_id') //
			.references(() => playlists.id),
		title: text('title').notNull().notNull(),
		description: text('description').notNull(),
		duration: integer('duration'),
		watchProgress: integer('watch_progress').notNull().default(0),
		watchCompleted: integer('watch_completed', { mode: 'boolean' }).notNull().default(false),
		fileSize: integer('file_size'),
		uploadDate: integer('upload_date'),
		type: text('type', { enum: ['unknown', 'video', 'short', 'stream'] }).notNull(),
		status: text('status', { enum: ['unknown', 'none', 'live', 'upcoming', 'past'] }).notNull(),
		downloadStatus: text('download_status', { enum: ['ignored', 'pending', 'done'] }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
		membersOnly: integer('members_only', { mode: 'boolean' }).notNull().default(false),
	},
	(table) => [
		index('video_idx').on(table.id), //
		index('video_channel_idx').on(table.channelId),
		index('video_playlist_idx').on(table.playlistId),
	],
);

export const videosRelations = relations(videos, ({ one }) => ({
	channel: one(channels, {
		fields: [videos.channelId],
		references: [channels.id],
	}),
	playlist: one(playlists, {
		fields: [videos.channelId],
		references: [playlists.id],
	}),
}));

// #endregion
// #region Playlists

export const playlists = sqliteTable(
	'playlists',
	{
		id: text('id').primaryKey(),
		channelId: text('channel_id')
			.references(() => channels.id)
			.notNull(),
		title: text('title').notNull(),
		description: text('description').notNull(),
	},
	(table) => [
		index('playlist_idx').on(table.id), //
		index('playlist_channel_idx').on(table.channelId),
	],
);

export const playlistsRelations = relations(channels, ({ many }) => ({
	videos: many(videos),
}));

// #endregion
// #region Settings

export const settings = sqliteTable(
	'settings',
	{
		id: integer('id').primaryKey(),
		cronChannelMetadata: text('cron_channel_metadata'),
		cronCheckSubscriptions: text('cron_check_subscriptions'),
		cronDownloadPending: text('cron_download_pending'),
		downloadLimit: integer('download_limit'),
	},
	(table) => [
		index('setting_idx').on(table.id), //
	],
);

// #endregion
// #region Users

export const users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey(),
		name: text('name').unique().notNull(),
		password: text('password').notNull(),
	},
	(table) => [
		index('user_idx').on(table.id), //
		index('user_name_idx').on(table.name),
	],
);

export const usersRelations = relations(users, ({ many }) => ({
	apikeys: many(apikeys),
}));

// #endregion
// #region Users

export const apikeys = sqliteTable(
	'apikeys',
	{
		id: text('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id)
			.notNull(),
		apikey: text('name').unique().notNull(),
		descriptipon: text('description'),
		expires: integer('expires', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [index('apikey_idx').on(table.id)],
);

export const apikeysRelations = relations(apikeys, ({ one }) => ({
	user: one(users, {
		fields: [apikeys.userId],
		references: [users.id],
	}),
}));

// #endregion
