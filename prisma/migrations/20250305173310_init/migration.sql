-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "photo" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "fotoPrincipal" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "imagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "idProduto" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "imagem_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carrinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUsuario" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "carrinho_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carrinho_produto" (
    "idCarrinho" TEXT NOT NULL,
    "idProduto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("idCarrinho", "idProduto"),
    CONSTRAINT "carrinho_produto_idCarrinho_fkey" FOREIGN KEY ("idCarrinho") REFERENCES "carrinho" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "carrinho_produto_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUsuario" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pedido_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedido_produto" (
    "idPedido" TEXT NOT NULL,
    "idProduto" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("idPedido", "idProduto"),
    CONSTRAINT "pedido_produto_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pedido_produto_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "produto_name_key" ON "produto"("name");

-- CreateIndex
CREATE INDEX "produto_preco_idx" ON "produto"("preco");

-- CreateIndex
CREATE INDEX "produto_quantidade_idx" ON "produto"("quantidade");

-- CreateIndex
CREATE INDEX "imagem_idProduto_idx" ON "imagem"("idProduto");

-- CreateIndex
CREATE UNIQUE INDEX "carrinho_idUsuario_key" ON "carrinho"("idUsuario");

-- CreateIndex
CREATE INDEX "carrinho_idUsuario_idx" ON "carrinho"("idUsuario");

-- CreateIndex
CREATE INDEX "carrinho_produto_idCarrinho_idProduto_idx" ON "carrinho_produto"("idCarrinho", "idProduto");

-- CreateIndex
CREATE INDEX "pedido_id_idx" ON "pedido"("id");

-- CreateIndex
CREATE INDEX "pedido_idUsuario_idx" ON "pedido"("idUsuario");

-- CreateIndex
CREATE INDEX "pedido_created_at_idx" ON "pedido"("created_at");

-- CreateIndex
CREATE INDEX "pedido_produto_idPedido_idProduto_idx" ON "pedido_produto"("idPedido", "idProduto");
