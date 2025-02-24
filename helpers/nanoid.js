import { webcrypto as crypto } from 'node:crypto';
const POOL_SIZE_MULTIPLIER = 128;
let pool, poolOffset;

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}

export function random(bytes) {
  // `|=` convert `bytes` to number to prevent `valueOf` abusing and pool pollution
  fillPool((bytes |= 0));
  return pool.subarray(poolOffset - bytes, poolOffset);
}

export function customRandom(alphabet, defaultSize, getRandom) {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // and alphabet size
  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size = defaultSize) => {
    let id = '';
    while (true) {
      let bytes = getRandom(step);
      let i = step;
      while (i--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[i] & mask] || '';
        if (id.length >= size) return id;
      }
    }
  };
}

export function customAlphabet(alphabet, size = 21) {
  return customRandom(alphabet, size, random);
}

export const nanoid = customAlphabet(alphabet, 8);
