CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public."user" (
	"id" TEXT DEFAULT uuid_generate_v1(),
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT,
	"username" TEXT NOT NULL UNIQUE,
	"isAdmin" BOOLEAN DEFAULT false,
	"isVerified" BOOLEAN DEFAULT false,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX if not exists user_lower_case_email_idx ON public.user (lower(email));

CREATE TABLE IF NOT EXISTS public."blacklistedTokens" (
	"id" TEXT DEFAULT uuid_generate_v1(),
	"token" TEXT NOT NULL UNIQUE,
	CONSTRAINT bltokens_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX if not exists bltokens_lower_case_token_idx ON public."blacklistedTokens" (lower(token));