/*
  Warnings:

  - Added the required column `metaData` to the `zapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zapRun" ADD COLUMN     "metaData" JSONB NOT NULL;
