import { pgTable, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),  // Default value using UUID (will use the default in the DB)
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),  // Same here, using defaultRandom for UUID
  fullName: text('fullName').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  macAddress: text('macAddress').notNull(),
  entryDate: text('entryDate').notNull(),
  subscriptionDays: integer('subscriptionDays').notNull(),
  isPaid: boolean('isPaid').notNull().default(false),
  isArchived: boolean('isArchived').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
