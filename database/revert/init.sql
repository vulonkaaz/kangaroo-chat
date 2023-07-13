-- Revert kangaroo:init from pg

BEGIN;

-- XXX Add DDLs here.
DROP TABLE "user", "group", "channel", "message", "event", "user_group",
	"group_channel", "user_channel", "user_message", "user_event",
	"customization", "invite_key";

COMMIT;
