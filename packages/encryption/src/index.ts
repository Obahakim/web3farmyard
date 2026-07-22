import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { AppError } from "@deepn/errors";
import type { EncryptedPayload } from "@deepn/types";

const algorithm = "aes-256-gcm" as const;
const keyVersion = 1;

export interface FieldEncryptor {
  encrypt(plaintext: string, aad?: string): EncryptedPayload;
  decrypt(payload: EncryptedPayload, aad?: string): string;
}

export function createFieldEncryptor(masterKeyBase64: string): FieldEncryptor {
  const key = Buffer.from(masterKeyBase64, "base64");
  if (key.byteLength !== 32) {
    throw new AppError("ENCRYPTION_ERROR", "Invalid field encryption master key length.");
  }
  return {
    encrypt(plaintext, aad) {
      const nonce = randomBytes(12);
      const cipher = createCipheriv(algorithm, key, nonce);
      if (aad) cipher.setAAD(Buffer.from(aad));
      const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
      const tag = cipher.getAuthTag();
      return {
        ciphertext: Buffer.concat([encrypted, tag]).toString("base64"),
        nonce: nonce.toString("base64"),
        keyVersion,
        algorithm,
      };
    },
    decrypt(payload, aad) {
      const nonce = Buffer.from(payload.nonce, "base64");
      const data = Buffer.from(payload.ciphertext, "base64");
      const tag = data.subarray(data.byteLength - 16);
      const encrypted = data.subarray(0, data.byteLength - 16);
      const decipher = createDecipheriv(algorithm, key, nonce);
      if (aad) decipher.setAAD(Buffer.from(aad));
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    },
  };
}

export interface LockedVaultKeyParams {
  saltBase64: string;
  memoryKiB: number;
  iterations: number;
  parallelism: number;
}

export function createLockedVaultSalt(): string {
  return randomBytes(16).toString("base64");
}

export function deriveLockedVaultKey(pinOrPassphrase: string, params: LockedVaultKeyParams): Buffer {
  // Node core does not expose Argon2id. This placeholder uses scrypt for local foundation code;
  // production clients should use audited Argon2id in WebCrypto/WASM with the stored params.
  return scryptSync(pinOrPassphrase, Buffer.from(params.saltBase64, "base64"), 32, { N: 2 ** 15, r: 8, p: 1 });
}
