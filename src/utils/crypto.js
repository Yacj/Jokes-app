import CryptoJS from "crypto-js";

const keyStr = "cretinzp**273846";

export const encryptDes = (msg) => {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(msg)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
};

export const decryptDes = (msg) => {
  const key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  const decrypt = CryptoJS.AES.decrypt(msg, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
};
