-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VIRTUAL', 'IN_PERSON', 'HYBRID');

-- CreateEnum
CREATE TYPE "CreatorRole" AS ENUM ('ADMIN', 'CREATOR', 'MODERATOR');

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "symbol" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "logo" TEXT,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "totalPoaps" INTEGER NOT NULL DEFAULT 0,
    "uniqueHolders" INTEGER NOT NULL DEFAULT 0,
    "lastEventDate" TIMESTAMP(3),
    "merkleTree" TEXT,
    "maxDepth" INTEGER,
    "maxBufferSize" INTEGER,
    "canopyDepth" INTEGER,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT 'VIRTUAL',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "location" TEXT,
    "maxSupply" INTEGER,
    "mintPrice" DOUBLE PRECISION,
    "mintAuthority" TEXT NOT NULL,
    "website" TEXT,
    "coverImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "mintAddress" TEXT,
    "attributes" JSONB,
    "isBurned" BOOLEAN NOT NULL DEFAULT false,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "isCompressed" BOOLEAN NOT NULL DEFAULT true,
    "collectionId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Poap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoapHolder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transferredAt" TIMESTAMP(3),
    "transferredTo" TEXT,
    "poapId" TEXT NOT NULL,

    CONSTRAINT "PoapHolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POAPEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "eventType" TEXT NOT NULL,
    "maxAttendees" INTEGER NOT NULL,
    "mintedCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "creator" TEXT NOT NULL,
    "merkleTree" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "POAPEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "mintedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorAccess" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" "CreatorRole" NOT NULL DEFAULT 'CREATOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canCreateEvents" BOOLEAN NOT NULL DEFAULT true,
    "canMintPoaps" BOOLEAN NOT NULL DEFAULT true,
    "canEditDetails" BOOLEAN NOT NULL DEFAULT false,
    "canVerify" BOOLEAN NOT NULL DEFAULT false,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CreatorAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collection_name_idx" ON "Collection"("name");

-- CreateIndex
CREATE INDEX "Collection_isOfficial_isActive_idx" ON "Collection"("isOfficial", "isActive");

-- CreateIndex
CREATE INDEX "Event_month_year_idx" ON "Event"("month", "year");

-- CreateIndex
CREATE INDEX "Event_startDate_endDate_idx" ON "Event"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Event_collectionId_idx" ON "Event"("collectionId");

-- CreateIndex
CREATE INDEX "Event_mintAuthority_idx" ON "Event"("mintAuthority");

-- CreateIndex
CREATE UNIQUE INDEX "Poap_assetId_key" ON "Poap"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Poap_mintAddress_key" ON "Poap"("mintAddress");

-- CreateIndex
CREATE INDEX "Poap_collectionId_idx" ON "Poap"("collectionId");

-- CreateIndex
CREATE INDEX "Poap_eventId_idx" ON "Poap"("eventId");

-- CreateIndex
CREATE INDEX "Poap_assetId_idx" ON "Poap"("assetId");

-- CreateIndex
CREATE INDEX "PoapHolder_walletAddress_idx" ON "PoapHolder"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "PoapHolder_poapId_walletAddress_key" ON "PoapHolder"("poapId", "walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "POAPEvent_merkleTree_key" ON "POAPEvent"("merkleTree");

-- CreateIndex
CREATE INDEX "POAPEvent_creator_idx" ON "POAPEvent"("creator");

-- CreateIndex
CREATE INDEX "POAPEvent_startDate_endDate_idx" ON "POAPEvent"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "EventAttendee_wallet_idx" ON "EventAttendee"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_eventId_wallet_key" ON "EventAttendee"("eventId", "wallet");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorAccess_collectionId_walletAddress_key" ON "CreatorAccess"("collectionId", "walletAddress");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poap" ADD CONSTRAINT "Poap_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poap" ADD CONSTRAINT "Poap_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoapHolder" ADD CONSTRAINT "PoapHolder_poapId_fkey" FOREIGN KEY ("poapId") REFERENCES "Poap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "POAPEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorAccess" ADD CONSTRAINT "CreatorAccess_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
