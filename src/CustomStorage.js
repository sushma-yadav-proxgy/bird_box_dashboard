import { EncryptStorage } from "encrypt-storage";

export const encryptStorage = new EncryptStorage(
  process.env.REACT_APP_SECRET || "default_secret",
  {
    prefix: "@instance1",
    storageType: "localStorage", // Explicitly specifying storage type
  }
);

// Function to set an item in encrypted storage
export function setItemInL(key, value) {
  encryptStorage.setItem(key, value);
}

// Function to get an item from encrypted storage
export function getItemFL(key) {
  return encryptStorage.getItem(key); // Added return statement
}
