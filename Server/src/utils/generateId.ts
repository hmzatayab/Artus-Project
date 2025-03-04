import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const generateTransactionId = (): string => {
  return crypto.randomBytes(6).toString("hex"); // 12-character unique ID
};

export const generateInvoiceId = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit unique number
};

export const generateId = (length: number = 6): string => {
  const min = Math.pow(10, length - 1); // e.g., 10^5 for 6 digits (100000)
  const max = Math.pow(10, length) - 1; // e.g., 10^6 - 1 for 6 digits (999999)

  return crypto.randomInt(min, max).toString();
};



// UUID Function
export const generateUUID = (): string => {
  return uuidv4().replace(/-/g, ""); // Remove dashes for cleaner UUID
};
