-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "hashed_key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scopes" TEXT[],
    "lastUsed" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requests_count" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashed_key_key" ON "ApiKey"("hashed_key");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
