-- AlterTable
ALTER TABLE "planos" ADD COLUMN     "ativo" BOOLEAN DEFAULT true,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "duracao" INTEGER;

-- AlterTable
ALTER TABLE "turmas" ADD COLUMN     "descricao" TEXT;
