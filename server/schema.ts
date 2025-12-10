import { pgTable, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('User', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const clients = pgTable('Client', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('fullName').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  macAddress: text('macAddress').notNull(),
  entryDate: text('entryDate').notNull(),
  subscriptionDays: integer('subscriptionDays').notNull(),
  isPaid: boolean('isPaid').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
