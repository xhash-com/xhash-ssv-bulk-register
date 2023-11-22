import crypto from "crypto";
import fs from "fs";
import path from "path";
import {cwd} from "process";

const publicKey = fs.readFileSync(path.join(cwd(), 'public.pem')).toString('ascii');
const privateKey = fs.readFileSync(path.join(cwd(), 'private.pem')).toString('ascii');

const reverseString = (str: string) => {
  const splitString = str.split("");
  const reverseArray = splitString.reverse();
  const joinArray = reverseArray.join("");

  return joinArray;
}

const Encrypt = (plaintext: string) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(reverseString(plaintext))).toString('base64');
}

const Decrypt = (ciphertext: string) => {
  preload(ciphertext);
  return reverseString(crypto.privateDecrypt(privateKey, Buffer.from(ciphertext.toString(), 'base64')).toString());
}

const preload = (ciphertext: string) => {
  try {
    return crypto.privateDecrypt(privateKey, Buffer.from(ciphertext.toString(), 'base64')).toString();
  } catch (e) {
    return '';
  }
}

export {
  Encrypt,
  Decrypt
}
