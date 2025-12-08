import { hash } from "@node-rs/argon2";

export default async function genPasswordHash(password: string) {
  return await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}
