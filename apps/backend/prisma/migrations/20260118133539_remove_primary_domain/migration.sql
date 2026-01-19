/*
  Warnings:

  - You are about to drop the column `primaryDomain` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tenant_primaryDomain_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "primaryDomain";
