-- Add the unsubscribe token in three steps rather than a single NOT NULL column:
-- existing subscribers already have rows, so a bare `ADD COLUMN ... NOT NULL`
-- would fail on any database that isn't empty.
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "unsubscribeToken" TEXT;

UPDATE "NewsletterSubscriber"
SET "unsubscribeToken" = replace(gen_random_uuid()::text, '-', '')
WHERE "unsubscribeToken" IS NULL;

ALTER TABLE "NewsletterSubscriber" ALTER COLUMN "unsubscribeToken" SET NOT NULL;

CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key"
  ON "NewsletterSubscriber"("unsubscribeToken");

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "html" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentByName" TEXT NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Newsletter_sentAt_idx" ON "Newsletter"("sentAt");
