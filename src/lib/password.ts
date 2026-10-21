import "server-only";
import bcrypt from "bcryptjs";
import { randomBytes, scrypt, scryptSync, timingSafeEqual, type BinaryLike } from "node:crypto";

// scrypt runs natively in Node (≈60 ms) — bcryptjs is pure JS and took seconds per login.
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 32;

const derive = (pw: BinaryLike, salt: Buffer, n: number) =>
  new Promise<Buffer>((resolve, reject) => scrypt(pw, salt, KEYLEN, { N: n, r: R, p: P, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k))));

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(pw, salt, N);
  return `scrypt$${N}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/** Verifies scrypt hashes and legacy bcrypt hashes. `needsRehash` is true for anything not on the current scheme. */
export async function verifyPassword(pw: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (stored.startsWith("scrypt$")) {
    const [, n, salt, key] = stored.split("$");
    const expected = Buffer.from(key, "base64");
    const actual = await derive(pw, Buffer.from(salt, "base64"), parseInt(n, 10));
    return { ok: expected.length === actual.length && timingSafeEqual(expected, actual), needsRehash: parseInt(n, 10) !== N };
  }
  const ok = await bcrypt.compare(pw, stored);
  return { ok, needsRehash: ok };
}

// Compared against when the account doesn't exist, so timing doesn't reveal which emails are registered.
export const DUMMY_HASH = (() => {
  const salt = randomBytes(16);
  return `scrypt$${N}$${salt.toString("base64")}$${scryptSync("not-a-real-password", salt, KEYLEN, { N, r: R, p: P }).toString("base64")}`;
})();
