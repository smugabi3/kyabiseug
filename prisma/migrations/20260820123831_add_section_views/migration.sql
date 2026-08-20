-- CreateTable
CREATE TABLE "SectionView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SectionView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SectionView_userId_idx" ON "SectionView"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionView_userId_section_key" ON "SectionView"("userId", "section");

-- AddForeignKey
ALTER TABLE "SectionView" ADD CONSTRAINT "SectionView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
