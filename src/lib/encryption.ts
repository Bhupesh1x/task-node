import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY as string);

export function encrypt(value: string) {
  return cryptr.encrypt(value);
}

export function decrypt(value: string) {
  return cryptr.decrypt(value);
}
