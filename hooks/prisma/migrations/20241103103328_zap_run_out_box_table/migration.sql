-- CreateTable
CREATE TABLE "zapRunOutBox" (
    "id" TEXT NOT NULL,
    "zapRunId" TEXT NOT NULL,

    CONSTRAINT "zapRunOutBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zapRunOutBox_zapRunId_key" ON "zapRunOutBox"("zapRunId");

-- AddForeignKey
ALTER TABLE "zapRunOutBox" ADD CONSTRAINT "zapRunOutBox_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "zapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
