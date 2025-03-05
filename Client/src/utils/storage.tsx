import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; 

export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};

export const saveUser = (user: any) => {
  const encryptedUser = encryptData(user);
  localStorage.setItem("user", encryptedUser);
};

export const getUser = () => {
  const encryptedUser = localStorage.getItem("user");
  if (!encryptedUser) {
    return null;
  }
  const decryptedUser = decryptData(encryptedUser);
  if (!decryptedUser) {
    return null;
  }
  return decryptedUser; 
};


export const removeUser = () => {
  localStorage.removeItem("user");
};
