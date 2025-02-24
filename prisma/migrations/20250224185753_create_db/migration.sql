/*
  Warnings:

  - You are about to drop the column `imagem` on the `produto` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "imagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "idProduto" TEXT NOT NULL,
    CONSTRAINT "imagem_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL
);
INSERT INTO "new_produto" ("descricao", "id", "name", "preco", "quantidade") SELECT "descricao", "id", "name", "preco", "quantidade" FROM "produto";
DROP TABLE "produto";
ALTER TABLE "new_produto" RENAME TO "produto";
CREATE UNIQUE INDEX "produto_name_key" ON "produto"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
