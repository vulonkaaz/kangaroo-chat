-- Verify kangaroo:init on pg

BEGIN;

-- XXX Add verifications here.
SELECT id FROM "user" WHERE false;
SELECT id FROM "group" WHERE false;
SELECT id FROM "channel" WHERE false;
SELECT id FROM "message" WHERE false;
SELECT id FROM "event" WHERE false;
SELECT id FROM "user_group" WHERE false;
SELECT id FROM "group_channel" WHERE false;
SELECT id FROM "user_channel" WHERE false;
SELECT id FROM "user_message" WHERE false;
SELECT id FROM "user_event" WHERE false;
SELECT id FROM "customization" WHERE false;
SELECT id FROM "invite_key" WHERE false;

ROLLBACK;
