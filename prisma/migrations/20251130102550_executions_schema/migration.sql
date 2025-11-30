-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Executions" (
    "id" TEXT NOT NULL,
    "inngestEventId" TEXT NOT NULL,
    "error" TEXT,
    "errorStack" TEXT,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "output" JSONB,
    "workflowId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Executions_inngestEventId_key" ON "Executions"("inngestEventId");

-- AddForeignKey
ALTER TABLE "Executions" ADD CONSTRAINT "Executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
