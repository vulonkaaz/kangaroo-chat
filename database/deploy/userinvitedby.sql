-- Deploy kangaroo:userinvitedby to pg

BEGIN;

-- XXX Add DDLs here.
ALTER TABLE "user" ADD invited_by int REFERENCES "invite_key"(id);
ALTER TABLE "user" ADD site_admin bool NOT NULL DEFAULT false;

ALTER TABLE "invite_key" ADD "valid" bool NOT NULL DEFAULT true;
ALTER TABLE "invite_key" DROP "user_id";

COMMIT;
