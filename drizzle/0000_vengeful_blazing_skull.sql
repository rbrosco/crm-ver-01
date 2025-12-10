CREATE TABLE "Client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullName" text NOT NULL,
	"phone" text NOT NULL,
	"country" text NOT NULL,
	"macAddress" text NOT NULL,
	"entryDate" text NOT NULL,
	"subscriptionDays" integer NOT NULL,
	"isPaid" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_username_unique" UNIQUE("username")
);
