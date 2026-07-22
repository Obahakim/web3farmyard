import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "@deepn/errors";
import type { StorageProviderName } from "@deepn/types";

export interface PutObjectInput { key: string; body: Buffer | Uint8Array | string; contentType: string }
export interface StorageAdapter {
  readonly name: StorageProviderName;
  putObject(input: PutObjectInput): Promise<void>;
  getObject(key: string): Promise<Buffer>;
  deleteObject(key: string): Promise<void>;
  getSignedReadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

export class LocalStorageAdapter implements StorageAdapter {
  readonly name = "local" as const;
  constructor(private readonly root: string) {}
  private pathFor(key: string): string {
    const safe = normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
    return join(this.root, safe);
  }
  async putObject(input: PutObjectInput): Promise<void> {
    const path = this.pathFor(input.key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, input.body);
  }
  async getObject(key: string): Promise<Buffer> { return readFile(this.pathFor(key)); }
  async deleteObject(key: string): Promise<void> { await rm(this.pathFor(key), { force: true }); }
  async getSignedReadUrl(key: string): Promise<string> { return `local://${key}`; }
}

export class S3StorageAdapter implements StorageAdapter {
  readonly name = "s3" as const;
  private readonly client: S3Client;
  constructor(private readonly bucket: string, config: { region: string; endpoint?: string; accessKeyId?: string; secretAccessKey?: string; forcePathStyle?: boolean }) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      credentials: config.accessKeyId && config.secretAccessKey ? { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } : undefined,
    });
  }
  async putObject(input: PutObjectInput): Promise<void> { await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: input.key, Body: input.body, ContentType: input.contentType })); }
  async getObject(): Promise<Buffer> { throw new AppError("STORAGE_ERROR", "Direct S3 reads are disabled; use signed URLs or worker streams."); }
  async deleteObject(key: string): Promise<void> { await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key })); }
  async getSignedReadUrl(key: string, expiresInSeconds = 300): Promise<string> { return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn: expiresInSeconds }); }
}
