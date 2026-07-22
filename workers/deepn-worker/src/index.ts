import { getEnv } from "@deepn/config";
import { logger } from "@deepn/logger";
import { createWorker } from "@deepn/queue";

const env = getEnv();

const workers = [
  createWorker("ai", env.REDIS_URL, async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "AI job received");
  }, env.QUEUE_PREFIX),
  createWorker("transcription", env.REDIS_URL, async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "Transcription job received");
  }, env.QUEUE_PREFIX),
  createWorker("timeline", env.REDIS_URL, async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "Timeline job received");
  }, env.QUEUE_PREFIX),
  createWorker("deletion", env.REDIS_URL, async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "Deletion job received");
  }, env.QUEUE_PREFIX),
  createWorker("export", env.REDIS_URL, async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "Export job received");
  }, env.QUEUE_PREFIX),
];

for (const worker of workers) {
  worker.on("failed", (job, error) => logger.error({ jobId: job?.id, error }, "Worker job failed"));
}

logger.info({ workerCount: workers.length }, "DeePn workers started");
