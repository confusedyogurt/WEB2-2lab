-- CreateTable
CREATE TABLE "competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "competitors" TEXT NOT NULL,
    "scoringsystem" TEXT NOT NULL,

    CONSTRAINT "competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "competitionId" INTEGER,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "firstplayer" TEXT NOT NULL,
    "secondPlayer" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "roundId" INTEGER,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "round" ADD CONSTRAINT "competitionId" FOREIGN KEY ("competitionId") REFERENCES "competition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "roundId" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
