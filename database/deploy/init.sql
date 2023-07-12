-- Deploy kangaroo:init to pg

BEGIN;

-- XXX Add DDLs here.
CREATE TABLE "user" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"pass" text NOT NULL,
	"name" text NOT NULL UNIQUE,
	"full_name" text NOT NULL,
	"picture" text,
	"phone" text,
	"title" text,
	"position"  text,
	"department" text,
	"status" text,
	"location" text,
	"website" text,
	"contact_email" text,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "group" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"logo" text,
	"private" bool NOT NULL DEFAULT false,
	"visible" bool NOT NULL DEFAULT true,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "channel" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" text NOT NULL,
	"type" smallint NOT NULL DEFAULT 0,
	"position" int,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "event" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" text NOT NULL,
	"desc" text,
	"begin" timestamptz NOT NULL,
	"end" timestamptz,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "message" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"sender_id" int NOT NULL REFERENCES "user"("id"),
	"content" text,
	"attachment" text,
	"event_id" int REFERENCES "event"("id"),
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "user_group" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"group_id" int NOT NULL REFERENCES "group"("id"),
	"role" smallint NOT NULL DEFAULT 0,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "group_channel" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"group_id" int NOT NULL REFERENCES "group"("id"),
	"channel_id" int NOT NULL REFERENCES "channel"("id"),
	"main" bool NOT NULL DEFAULT true,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "user_channel" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"channel_id" int NOT NULL REFERENCES "channel"("id"),
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "user_message" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"message_id" int NOT NULL REFERENCES "message"("id"),
	"notify" bool NOT NULL DEFAULT false,
	"read" bool NOT NULL DEFAULT false,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "user_event" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"event_id" int NOT NULL REFERENCES "event"("id"),
	"creator" bool NOT NULL DEFAULT false,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "customization" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"group_id" int REFERENCES "group"("id"),
	"channel_id" int NOT NULL REFERENCES "channel"("id"),
	"position" int NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "group_customization" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"group_id" int NOT NULL REFERENCES "group"("id"),
	"position" int NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

CREATE TABLE "invite_key" (
	"id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"issuer_id" int NOT NULL REFERENCES "user"("id"),
	"user_id" int NOT NULL REFERENCES "user"("id"),
	"key" text NOT NULL UNIQUE,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz
);

COMMIT;
