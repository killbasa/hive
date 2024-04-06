import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Channels
 */

export const channels = sqliteTable(
	'channels',
	{
		id: text('id').primaryKey(),
		customUrl: text('custom_url').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		tags: text('tags').notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => {
		return {
			idx: index('channel_idx').on(table.id)
		};
	}
);

export const channelsRelations = relations(channels, ({ many }) => ({
	videos: many(videos),
	playlists: many(playlists)
}));

/**
 * Videos
 */
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
		watchProgress: integer('watch_progress').default(0),
		fileSize: integer('file_size'),
		uploadDate: text('upload_date'),
		type: text('type', { enum: ['video', 'short', 'stream'] }).notNull(),
		status: text('status', { enum: ['none', 'new', 'live', 'upcoming', 'past'] }).notNull(),
		downloadStatus: text('download_status', { enum: ['ignored', 'pending', 'done'] }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => {
		return {
			idx: index('video_idx').on(table.id),
			channelIdx: index('video_channel_idx').on(table.channelId),
			playlistIdx: index('video_playlist_idx').on(table.playlistId)
		};
	}
);

export const videosRelations = relations(videos, ({ one, many }) => ({
	channel: one(channels, {
		fields: [videos.channelId],
		references: [channels.id]
	}),
	playlist: one(playlists, {
		fields: [videos.channelId],
		references: [playlists.id]
	}),
	comments: many(comments),
	streamComments: many(streamComments)
}));

/**
 * Playlists
 */

export const playlists = sqliteTable(
	'playlists',
	{
		id: text('id').primaryKey(),
		channelId: text('channel_id')
			.references(() => channels.id)
			.notNull(),
		title: text('title').notNull(),
		description: text('description').notNull()
	},
	(table) => {
		return {
			idx: index('playlist_idx').on(table.id),
			channelIdx: index('playlist_channel_idx').on(table.channelId)
		};
	}
);

export const playlistsRelations = relations(channels, ({ many }) => ({
	videos: many(videos)
}));

/**
 * Comments
 */

export const comments = sqliteTable(
	'comments',
	{
		id: integer('id').primaryKey(),
		videoId: text('video_id')
			.references(() => videos.id)
			.notNull(),
		text: text('text').notNull(),
		author: text('author').notNull(),
		authorId: text('author_id').notNull(),
		timeText: text('timestamp').notNull(),
		isUploader: integer('is_uploader', { mode: 'boolean' }).notNull(),
		isFavorited: integer('is_favorited', { mode: 'boolean' }).notNull()
	},
	(table) => {
		return {
			idx: index('comment_idx').on(table.id),
			videoIdx: index('comment_video_idx').on(table.videoId)
		};
	}
);

export const commentsRelations = relations(comments, ({ one }) => ({
	video: one(videos, {
		fields: [comments.videoId],
		references: [videos.id]
	})
}));

export const streamComments = sqliteTable(
	'stream_comments',
	{
		id: integer('id').primaryKey(),
		videoId: text('video_id')
			.references(() => videos.id)
			.notNull(),
		author: text('author').notNull(),
		text: text('text').notNull(),
		timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
		isMod: integer('is_mod', { mode: 'boolean' }).notNull(),
		isVerified: integer('is_verified', { mode: 'boolean' }).notNull(),
		isUploader: integer('is_uploader', { mode: 'boolean' }).notNull()
	},
	(table) => {
		return {
			idx: index('streamcomment_idx').on(table.id),
			videoIdx: index('streamcomment_video_idx').on(table.videoId)
		};
	}
);

export const streamCommentsRelations = relations(streamComments, ({ one }) => ({
	video: one(videos, {
		fields: [streamComments.videoId],
		references: [videos.id]
	})
}));

/**
 * Settings
 */

export const settings = sqliteTable(
	'settings',
	{
		id: text('id').primaryKey()
	},
	(table) => {
		return {
			idx: index('setting_idx').on(table.id)
		};
	}
);

/**
 * Users
 */

export const users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey(),
		username: text('username').unique().notNull(),
		password: text('password').notNull()
	},
	(table) => {
		return {
			idx: index('user_idx').on(table.id),
			usernameIdx: index('user_username_idx').on(table.username)
		};
	}
);
