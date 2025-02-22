import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; // .env se load karo

// ✅ Encrypt and store in localStorage
export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// ✅ Decrypt data from localStorage
export const decryptData = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};

// ✅ Save user securely in localStorage
export const saveUser = (user: any) => {
  const encryptedUser = encryptData(user);
  localStorage.setItem("user", encryptedUser);
};

// ✅ Get user securely from localStorage
export const getUser = () => {
  const encryptedUser = localStorage.getItem("user");
  return encryptedUser ? decryptData(encryptedUser) : null;
};

// ✅ Remove user from localStorage (Logout case)
export const removeUser = () => {
  localStorage.removeItem("user");
};
