-- Revert kangaroo:userinvitedby from pg

BEGIN;

-- XXX Add DDLs here.
ALTER TABLE "invite_key" ADD "user_id" int NOT NULL REFERENCES "user"("id");
ALTER TABLE "invite_key" DROP "valid";

ALTER TABLE "user" DROP site_admin;
ALTER TABLE "user" DROP invited_by;

COMMIT;
