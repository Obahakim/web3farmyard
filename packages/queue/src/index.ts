import { Queue, Worker, type JobsOptions, type Processor } from "bullmq";
import IORedis from "ioredis";
import type { QueueName } from "@deepn/types";

export interface AiJob { userId: string; entryId?: string; conversationId?: string; operation: "reflect" | "summarize" | "themes" | "safety" }
export interface TranscriptionJob { userId: string; audioDumpId: string }
export interface TimelineJob { userId: string; range: "week" | "month" | "all" }
export interface DeletionJob { userId: string; resourceType: string; resourceId: string }
export interface ExportJob { userId: string; requestedAt: string }
export interface ModerationJob { userId?: string; resourceType: "commons_post" | "commons_reply"; resourceId: string }

export type QueuePayloads = {
  ai: AiJob;
  transcription: TranscriptionJob;
  timeline: TimelineJob;
  deletion: DeletionJob;
  export: ExportJob;
  moderation: ModerationJob;
};

export function createRedisConnection(redisUrl: string) {
  return new IORedis(redisUrl, { maxRetriesPerRequest: null });
}

export function createQueue<Name extends QueueName>(name: Name, redisUrl: string, prefix = "deepn") {
  return new Queue<QueuePayloads[Name]>(`${prefix}:${name}`, { connection: createRedisConnection(redisUrl) });
}

export async function enqueue<Name extends QueueName>(queue: Queue<QueuePayloads[Name]>, name: string, data: QueuePayloads[Name], options?: JobsOptions) {
  return queue.add(name, data, { attempts: 3, backoff: { type: "exponential", delay: 5_000 }, removeOnComplete: 1000, removeOnFail: 5000, ...options });
}

export function createWorker<Name extends QueueName>(name: Name, redisUrl: string, processor: Processor<QueuePayloads[Name]>, prefix = "deepn") {
  return new Worker<QueuePayloads[Name]>(`${prefix}:${name}`, processor, { connection: createRedisConnection(redisUrl), concurrency: 5 });
}
