import { v4 as uuidv4 } from "uuid";

export const generateRandomId = (length: number): string => {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
  const uniqueId = `${timestamp}${randomNum}`; // Combine both

  return uniqueId.slice(0, length); // Return only required length
};

// UUID Function
export const generateUUID = (): string => {
  return uuidv4().replace(/-/g, ""); // Remove dashes for cleaner UUID
};
