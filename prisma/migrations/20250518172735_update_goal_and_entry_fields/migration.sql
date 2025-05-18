/*
  Warnings:

  - You are about to drop the column `carbs` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `Entry` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "NutritionalGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL DEFAULT 'current_user_goals',
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "carbohydrates" INTEGER NOT NULL,
    "fats" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "calories" INTEGER NOT NULL DEFAULT 0,
    "protein" INTEGER NOT NULL DEFAULT 0,
    "fats" INTEGER NOT NULL DEFAULT 0,
    "carbohydrates" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Entry" ("calories", "createdAt", "id", "protein", "text") SELECT "calories", "createdAt", "id", "protein", "text" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "NutritionalGoal_identifier_key" ON "NutritionalGoal"("identifier");
