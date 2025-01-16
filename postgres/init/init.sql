-- DB作成
CREATE DATABASE k_on_line;
-- 作成したDBに接続
\c k_on_line;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('GRADUATE', 'STUDENT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Part') THEN
        CREATE TYPE "Part" AS ENUM (
            'VOCAL',
            'BACKING_GUITAR',
            'LEAD_GUITAR',
            'BASS',
            'DRUMS',
            'KEYBOARD',
            'OTHER'
            );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountRole') THEN
        CREATE TYPE "AccountRole" AS ENUM ('TOPADMIN', 'ADMIN', 'USER');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BuyBookingStatus') THEN
        CREATE TYPE "BuyBookingStatus" AS ENUM ('UNPAID', 'PAID', 'CANCELED', 'EXPIRED');
    END IF;
END$$;

-- Create Users table
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT,
  "user_id" TEXT UNIQUE,
  "password" TEXT,
  "email" TEXT UNIQUE,
  "email_verified" TIMESTAMP,
  "image" TEXT,
  "role" "AccountRole" DEFAULT 'USER',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE "booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "booking_date" TEXT NOT NULL,
  "booking_time" INT NOT NULL,
  "regist_name" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "is_deleted" BOOLEAN DEFAULT FALSE,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE SET NULL
);

-- Create BanBooking table
CREATE TABLE "ex_booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "start_date" TEXT NOT NULL,
  "start_time" INT NOT NULL,
  "end_time" INT NOT NULL,
  "description" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "is_deleted" BOOLEAN DEFAULT FALSE
);

-- Create BuyBookings table
CREATE TABLE "buy_booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "booking_id" TEXT UNIQUE,
  "user_id" TEXT,
  "status" "BuyBookingStatus" DEFAULT 'UNPAID',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "expire_at" TIMESTAMP,
  "is_deleted" BOOLEAN DEFAULT FALSE,

  FOREIGN KEY ("booking_id") REFERENCES "booking" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE SET NULL
);

-- Create Profiles table
CREATE TABLE "profile" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT UNIQUE,
  "name" TEXT,
  "student_id" TEXT UNIQUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "expected" TEXT,
  "role" "Role",
  "part" "Part"[],
  "is_deleted" BOOLEAN DEFAULT FALSE,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Create Accounts table
CREATE TABLE "account" (
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_account_id" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INT,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY ("provider", "provider_account_id"),
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Create Sessions table
CREATE TABLE "session" (
  "session_token" TEXT UNIQUE NOT NULL,
  "user_id" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Create VerificationTokens table
CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Create PadLocks table
CREATE TABLE "pad_lock" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "is_deleted" BOOLEAN DEFAULT FALSE
);