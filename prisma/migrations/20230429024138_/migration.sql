-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "datas" TEXT[];

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "roleName" VARCHAR(10),
ALTER COLUMN "roleType" DROP DEFAULT;
